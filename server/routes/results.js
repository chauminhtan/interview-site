var path = require('path'),
	Result = require(path.join(__dirname, "..", "/models/result")),
	Question = require(path.join(__dirname, "..", "/models/question")),
	extend = require('extend'),
	response = require('../include/response'),
	sendErr = response.sendErr,
	sendSuccess = response.sendSuccess,
	config = require(path.join(__dirname, "..",'/config/config')),
	sendmail = require('../include/sendmail');

var replaceAll = (text, search, replacement) => {
	return text.split(search).join(replacement);
}

var isPickQuestion = (ques) => {
	return ques.typeQ.toLowerCase() === 'pick' || ques.typeQ.toLowerCase() === 'multiple';
}

var checkAnswer = (result, cb) => {
	var arrIds = result.test.questions.map(ques => ques.id);
	Question.where('deleted').ne('true').
		where('_id').in(arrIds).
		select('id title language category answer typeQ time pickAnswers dateModified').exec((err, questions) => {
		if (err) {
			cb(err, result);
		} else {
			result.point = 0;
			result.test.questions.map(ques => {
                for (let question of questions) {
					if (ques.id === question.id) {
						// extend(ques, question);
						ques.answer = question.answer;
						if (isPickQuestion(ques)) {
							ques.isCorrect = ques.made === ques.answer;
							if (ques.isCorrect) {
								result.point ++;
							}
							// console.log(ques);
							break;
						}
					}
                }
                return ques;
			})
			result.done = true;
			// console.log(result);
			cb(null, result);
		}
	});
}

module.exports = {
	create: (req, res) => {
		// console.log(req.body);
		var email = req.body.email,
			test = req.body.test,
			user = req.body.user;

		Result.where('test.id').equals(test.id)
			.where('user.id').equals(user.id)
			.where('deleted').ne('true')
			.select('id test user point time dateModified').exec((err, results) => {
			if (err) {
				sendErr(res, err);
			}
			
			if (results.length > 0) {
				sendSuccess(res, {
					"message": 'data existed.'
				});
			} else {
				var result = new Result();
				extend(result, req.body);
				result.save((err, result) => {
					if (err) {
						sendErr(res, err);
					} else {
						// todo: send email if it is first assignment
						var emailInfo = {
							to: email.to,
							subject: email.subject,
							html: replaceAll(email.content, '{{name}}', user.name)
						}
						var link = '<a href="' + config.url + 'testpage/' + req.body.test.id + '">here</a>';
						// fill link URL to email template
						emailInfo.html = replaceAll(emailInfo.html, '{{link}}', link);

						sendmail.send(emailInfo);
						sendSuccess(res, {
							data: result
						});
					}
				});
			}
		})
		
	}, //end create
	getAll: (req, res) => {
		Result.where('deleted').ne('true').select('id test user point time done isChecked dateModified').exec((err, results) => {
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: results
				});
			}
		});
	}, //end getAll
	getByTestId: (req, res) => {
		Result.where('test.id').equals(req.params.id).where('deleted').ne('true').select('id test user point time done isChecked dateModified').exec((err, results) => {
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: results
				});
			}
		});
	},
	getByUserAndTest: (req, res) => {
		// console.log(req.body);
		Result.where('user.id').equals(req.body.userId).where('test.id').equals(req.body.testId).where('deleted').ne('true').select('id test user point time done isChecked dateModified').exec((err, results) => {
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: results[0]
				});
			}
		});
	},
	getOne: (req, res) => {
		Result.where('_id').equals(req.params.id).select('id test user point time done isChecked dateModified').exec((err, results) => {
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: results[0]
				});
			}
		});
	},
	update: (req, res) => {
		Result.findById(req.params.id, (err, result) => {
			if (err) {
				sendErr(res, err);
			}

			extend(result, req.body);
			result.isChecked = true;
			// console.log(result);
			result.save((err) => {
				sendSuccess(res);
			});
		})
	},
	done: (req, res) => {
		Result.findById(req.params.id, (err, result) => {
			if (err) {
				sendErr(res, err);
			}

			extend(result, req.body);
			if (!result.done) {
				// console.log(result);
				checkAnswer(result, (err, result) => {
					result.save((err) => {
						sendSuccess(res);
					});
				})
			} else {
				sendErr(res, {
					message: 'it was done'
				});
			}
		})
	},
	delete: function(req, res) {
		/* careful with _id here */
		// remove out of db
		Result.findByIdAndRemove(req.params.id, function(err, data) {
			if (err) {
				// console.log(err);
				sendErr(res, err);
				return;
			}
			res.json({
				status: 1,
				message: 'deleled resultId: ' + req.params.id
			})
		});
	}
}