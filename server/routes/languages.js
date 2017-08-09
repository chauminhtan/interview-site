var path = require('path'),
	Language = require(path.join(__dirname, "..", "/models/language")),
	extend = require('extend'),
	response = require('../include/response'),
	sendErr = response.sendErr,
	sendSuccess = response.sendSuccess;

module.exports = {
	create: (req, res) => {
		var language = new Language();
		extend(language, req.body);
		language.save((err, result) => {
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
		Language.where('deleted').ne('true').select('id name categories dateModified').exec((err, results) => {
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: results
				});
			}
		});
	}, //end getAll
	getOne: (req, res) => {
		Language.where('_id').equals(req.params.id).select('id name categories dateModified').exec((err, results) => {
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
		Language.findById(req.params.id, (err, result) => {
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
		Language.findByIdAndRemove(req.params.id, function(err, data) {
			if (err) {
				// console.log(err);
				sendErr(res, err);
				return;
			}
			res.json({
				status: 1,
				message: 'deleled langId: ' + req.params.id
			})
		});
	}
}