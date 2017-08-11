var path = require('path'),
	Position = require(path.join(__dirname, "..", "/models/position")),
	Language = require(path.join(__dirname, "..", "/models/language")),
	extend = require('extend'),
	response = require('../include/response'),
	sendErr = response.sendErr,
	sendSuccess = response.sendSuccess;

module.exports = {
	create: (req, res) => {
		var position = new Position();
		extend(position, req.body);
		position.save((err, result) => {
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
		Position.where('deleted').ne('true').select('id name language dateModified').exec((err, positions) => {
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: positions
				});
			}
		});
	}, //end getAll
	getOne: (req, res) => {
		Position.where('_id').equals(req.params.id).select('id name language dateModified').exec((err, position) => {
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: position
				});
			}
		});
	},
	update: (req, res) => {
		Position.findById(req.params.id, (err, position) => {
			if (err) {
				sendErr(res, err);
			}

			extend(position, req.body);
			position.save((err) => {
				sendSuccess(res);
			});
		})
	},
	delete: function(req, res) {
		/* careful with _id here */
		// remove out of db
		Position.findByIdAndRemove(req.params.id, function(err, data) {
			if (err) {
				// console.log(err);
				sendErr(res, err);
				return;
			}
			res.json({
				status: 1,
				message: 'deleled posId: ' + req.params.id
			})
		});
	}
}