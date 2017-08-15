var path = require('path'),
	Test = require(path.join(__dirname, "..", "/models/test")),
	Position = require(path.join(__dirname, "..", "/models/position")),
	Question = require(path.join(__dirname, "..", "/models/question")),
	extend = require('extend'),
	response = require('../include/response'),
	sendErr = response.sendErr,
	sendSuccess = response.sendSuccess;

var collectQuestionsByLanguages = (languages, callback) => {
	var facet = {};
	languages.forEach(language => {

		language.categories.forEach(category => {
			facet[language.name + '-' + category.title] = [
				{
					$match: {
						'language': language.name,
						'category': category.title,
						'deleted': false
					}
				},
				{ $sample: { size: category.quantity } }
			]
		})
	});
	// console.log(facet);
	// callback(null, facet);return;
	Question.aggregate().facet(facet).exec((err, results) => {
		if (err) {
			callback(err, results)
		} else {
			// callback(null, results[0])
			var values = Object.keys(results[0]).map(key => results[0][key]);
			var questions = [];
			if (values.length > 0) {
				values.forEach(val => {
					questions = questions.concat(val)
				})
			}
			// console.log(questions);
			callback(null, questions)
		}
	})
}

module.exports = {
	create: (req, res) => {
		var test = new Test();
		extend(test, req.body);
		test.save((err, result) => {
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: result
				});
			}
		});
	}, //end create
	generate: (req, res) => {
		var test = new Test();
		extend(test, req.body);
		Position.where('_id').equals(test.position.id).select('id name languages dateModified').exec((err, data) => {
			if (err) {
				sendErr(res, err);
			} else {
				var languages = data[0].languages;
				// pick questions follow requirement of the position
				collectQuestionsByLanguages(languages, (err, questions) => {
					if (err) {
						sendErr(res, err);
					} else {
						test.time = 0;
						questions = questions.map((row,index) => {
							test.time += row.time;
							// row = row.toObject();
							row.id = row._id;
							delete row._id;
							return row;
						});
						// console.log(questions);
						// then save the test with questions got from 
						test.questions = questions;
						test.save((err, result) => {
							if (err) {
								sendErr(res, err);
							} else {
								sendSuccess(res, {
									data: result,
									questions: questions
								});
							}
						});
					}

				})
			}
		});
	},
	getAll: (req, res) => {
		Test.where('deleted').ne('true').select('id title questions position time dateModified').exec((err, tests) => {
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: tests
				});
			}
		});
	}, //end getAll
	getOne: (req, res) => {
		Test.where('_id').equals(req.params.id).select('id title questions position time dateModified').exec((err, test) => {
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: test[0]
				});
			}
		});
	},
	update: (req, res) => {
		Test.findById(req.params.id, (err, test) => {
			if (err) {
				sendErr(res, err);
			}

			extend(test, req.body);
			test.save((err) => {
				sendSuccess(res);
			});
		})
	},
	delete: function(req, res) {
		// remove out of db
		Test.findByIdAndRemove(req.params.id, function(err, data) {
			if (err) {
				// console.log(err);
				sendErr(res, err);
				return;
			}
			res.json({
				status: 1,
				message: 'deleled testId: ' + req.params.id
			})
		});
	},
	getPosition: (req, res) => {
		Position.where('_id').equals(req.params.id).select('id name languages dateModified').exec((err, data) => {
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: data[0]
				});
			}
		});
	},
	getAllPosition: (req, res) => {
		Position.where('deleted').ne('true').select('id name languages dateModified').exec((err, data) => {
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: data
				});
			}
		});
	}, //end getAll
}