var path = require('path'),
	User = require(path.join(__dirname, "..", "/models/user")),
	extend = require('extend'),
	response = require('../include/response'),
	sendErr = response.sendErr,
	sendSuccess = response.sendSuccess;

module.exports = {
	login: (req, res) => {
		if (req.user) {
			// use email as payload in token
			User.createToken(req.user.email, (err, token) => {
				if (err) {
					res.json({
						message: 'Unable to generate token',
						status: 0
					});
				} else {
					/* success response */
					sendSuccess(res, {
						data: {
							token: token,
							userInfo: {
								name: req.user.name,
								email: req.user.email,
								isAdmin: req.user.isAdmin,
								userId: req.user.id
							}
						}
					});
				}
			});
		} else {
			console.log("error authenticating");
			res.json({
				status: 0,
				message: 'Authentication Error'
			});
		}
	},
	logout: (req, res) => {
		req.logout();
		sendSuccess(res);
	},
	create: (req, res) => {
		/* verify user doesn't already exist */
		var user = new User();
		extend(user, req.body);
		User.register(user, req.body.password, (err, result) => {
			// console.log("adding user: " + JSON.stringify(user) + " Error: " + err);
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
		// return all users for admin
		// console.log(req.user)
		User.where('deleted').ne('true').select('id email name dateModified isAdmin').exec((err, users) => {
			// res.json(users);
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: users
				});
			}
		});
	}, //end getAll
	getOne: (req, res) => {
		// console.log(req.params.id);
		User.where('_id').equals(req.params.id).select('id email name dateModified isAdmin').exec((err, user) => {
			// res.json(user);
			// console.log(user);
			if (err) {
				sendErr(res, err);
			} else {
				sendSuccess(res, {
					data: user[0]
				});
			}
		});
	},
	update: (req, res) => {
		User.findById(req.params.id, (err, user) => {
			if (err) {
				sendErr(res, err);
			}

			extend(user, req.body);

			if (req.body.password) {
				/* update password */
				user.setPassword(req.body.password, (err, result) => {
					user.save((err) => {
						sendSuccess(res, null);
					})
				})
			} else {
				user.save((err) => {
					sendSuccess(res);
				})
			}
		})
	},
	delete: function(req, res) {
		/* careful with _id here */
		User.findById(req.params.id, function(err, user) {
			if (err) {
				// console.log(err);
				sendErr(res, err);
				return;
			}

			extend(user, {
				deleted: 1
			});
			user.save(function(err) {
				res.json({
					status: 1,
					message: 'deleled userId: ' + req.params.id
				})
			});
		});
	}
}