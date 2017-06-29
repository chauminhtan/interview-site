var _ = require('underscore');
var path = require('path');
var User = require(path.join(__dirname, "..", "/models/user"));
var Admin = {
	email: "chauminhtan@gmail.com",
	name: "admin"
};

// Load app configuration
module.exports = _.extend(
	require(__dirname + '/../config/env/all.js'),
	require(__dirname + '/../config/env/' + process.env.NODE_ENV + '.js') || {});

module.exports.populateDb = function() {
	/* create a default user */
	User.count({}, (err, count) => {
		if (count === 0) {
			var user = new User(Admin);
			console.log('adding admin automatically');
			user.setPassword("admin", (err, hash) => {
				user.save();
				console.log('added admin automatically');
			});
		}
	});
};

module.exports.admin = Admin;