var path = require('path'),
	Question = require(path.join(__dirname, "..", "/models/question")),
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
		Question.where('deleted').ne('true').select('id description category answer time dateModified').exec((err, questions) => {
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
		Question.where('_id').equals(req.params.id).select('id description category answer time dateModified').exec((err, question) => {
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: question[0]
				});
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
		// Question.findById(req.params.id, function(err, question) {
		// 	if (err) {
		// 		// console.log(err);
		// 		sendErr(res, err);
		// 		return;
		// 	}

		// 	extend(question, {
		// 		deleted: 1
		// 	});
		// 	question.save(function(err) {
		// 		res.json({
		// 			status: 1,
		// 			message: 'deleled id: ' + req.params.id
		// 		})
		// 	});
		// });

		// remove out of db
		Question.findByIdAndRemove(req.params.id, function(err, data) {
			if (err) {
				// console.log(err);
				sendErr(res, err);
				return;
			}
			res.json({
				status: 1,
				message: 'deleled userId: ' + req.params.id
			})
		});
	}
}