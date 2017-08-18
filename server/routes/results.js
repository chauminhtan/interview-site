var path = require('path'),
	Result = require(path.join(__dirname, "..", "/models/result")),
	extend = require('extend'),
	response = require('../include/response'),
	sendErr = response.sendErr,
	sendSuccess = response.sendSuccess,
	config = require(path.join(__dirname, "..",'/config/config')),
	sendmail = require('../include/sendmail');

module.exports = {
	create: (req, res) => {
		// console.log(req.body);
		Result.where('test.id').equals(req.body.test.id)
			.where('user.id').equals(req.body.user.id)
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
						var email = {
							to: req.body.user.email + ', tan.chau@waverleysoftware.com',
							subject: 'Test Assignment from Interview System',
							html: '<h2>hi ' + req.body.user.name + ',</h2><br /><p>This is your <a href="' + config.url + 'testpage/' + req.body.test.id + '">test</a></p>'
						}
						sendmail.send(email);
						sendSuccess(res, {
							data: result
						});
					}
				});
			}
		})
		
	}, //end create
	getAll: (req, res) => {
		Result.where('deleted').ne('true').select('id test user point time done dateModified').exec((err, results) => {
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
		Result.where('test.id').equals(req.params.id).where('deleted').ne('true').select('id test user point time done dateModified').exec((err, results) => {
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
		Result.where('user.id').equals(req.body.userId).where('test.id').equals(req.body.testId).where('deleted').ne('true').select('id test user point time done dateModified').exec((err, results) => {
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
		Result.where('_id').equals(req.params.id).select('id test point time done dateModified').exec((err, results) => {
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
			// console.log(result);
			result.save((err) => {
				sendSuccess(res);
			});
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