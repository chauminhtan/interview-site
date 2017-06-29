var path = require('path');
var User = require(path.join(__dirname, "../..", "/models/user"));
/*
 * @method authenticates token
 */
exports.authenticateToken = function(req, res, next) {
	var token = req.headers.token;
	var decodedToken = User.decode(token);
	if (token) {
		var decoded = decodedToken;
		if (decoded && decoded.email) {
			User.authenticateToken(decoded.email, token, function(err, userWithToken) {
				if (err) {
					return res.json({
						status: 0,
						message: 'token does not matched'
					});
				}
				req.user = userWithToken;
				next();
			});
		}else{
			return res.json({
				status: 0,
				message: 'invalid token!'
			});
		}
	} else{
		return res.json({
			status: 0,
			message: 'Unable to authorized token'
		});	
	}
	//next();
};