var path = require('path'),
	Question = require(path.join(__dirname, "..", "/models/question")),
	Language = require(path.join(__dirname, "..", "/models/language")),
	extend = require('extend'),
	response = require('../include/response'),
	sendErr = response.sendErr,
	sendSuccess = response.sendSuccess;

module.exports = {
	create: (req, res) => {
		var question = new Question();
		extend(question, req.body);
		question.save((err, result) => {
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: result
				});
			}
		});
	}, //end create
	getAll: (req, res) => {
		Question.where('deleted').ne('true').select('id title language category answer typeQ time pickAnswers dateModified').exec((err, questions) => {
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: questions
				});
			}
		});
	}, //end getAll
	getByIds: (req, res) => {
		// console.log(req.body);
		var arrIds = req.body.arrIds;
		Question.where('deleted').ne('true').
			where('_id').in(arrIds).
			select('id title language category answer typeQ time pickAnswers dateModified').exec((err, questions) => {
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: questions
				});
			}
		});
	}, //end getAll
	getOne: (req, res) => {
		Question.where('_id').equals(req.params.id).select('id title language category answer typeQ time pickAnswers dateModified').exec((err, question) => {
			if (err) {
				sendErr(res, err);
			} else {
				Language.where('name').equals(question[0].language).select('id name categories').exec((err, languages) => {
					if (err) {
						sendErr(res, err);
					} else {
						sendSuccess(res, {
							data: {
								question: question[0],
								language: languages[0]
							}
						});
					}
				})
			}
		});
	},
	update: (req, res) => {
		Question.findById(req.params.id, (err, question) => {
			if (err) {
				sendErr(res, err);
			}

			extend(question, req.body);
			question.save((err) => {
				sendSuccess(res);
			});
		})
	},
	delete: function(req, res) {
		/* careful with _id here */
		// remove out of db
		Question.findByIdAndRemove(req.params.id, function(err, data) {
			if (err) {
				// console.log(err);
				sendErr(res, err);
				return;
			}
			res.json({
				status: 1,
				message: 'deleled quesId: ' + req.params.id
			})
		});
	}
}