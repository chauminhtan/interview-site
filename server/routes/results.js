var path = require('path'),
	Result = require(path.join(__dirname, "..", "/models/result")),
	extend = require('extend'),
	response = require('../include/response'),
	sendErr = response.sendErr,
	sendSuccess = response.sendSuccess;

module.exports = {
	create: (req, res) => {
		var result = new Result();
		extend(result, req.body);
		result.save((err, result) => {
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
		Result.where('deleted').ne('true').select('id test point time dateModified').exec((err, results) => {
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: results
				});
			}
		});
	}, //end getAll
	getByTest: (req, res) => {
		Result.where('test.id').equals(req.params.id).where('deleted').ne('true').select('id test point time dateModified').exec((err, results) => {
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: results
				});
			}
		});
	},
	getOne: (req, res) => {
		Result.where('_id').equals(req.params.id).select('id test point time dateModified').exec((err, results) => {
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