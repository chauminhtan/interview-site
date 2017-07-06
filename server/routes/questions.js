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
		Question.where('deleted').ne('true').select('id description time').exec((err, questions) => {
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
		Question.where('_id').equals(req.params.id).select('id description time').exec((err, question) => {
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
	}
}