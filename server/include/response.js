var extend = require('extend');

function getError(err) {
	if (err) {
		if (typeof err === 'string')
			return err;

		if (typeof err !== 'object')
			return 'system error';

		var errors = err.errors; //see mongoose API

		if (errors) {
			var _key = undefined;
			for (var key in errors) {
				if (errors.hasOwnProperty(key) && typeof (key) !== 'function') {
					_key = key;
					break; //use only first key
				}
			}
			return _key == undefined ? 'unknown' : errors[_key].message;
		} else {
			return err.message;
		}
	}
	return String(err);
}

module.exports = {
	sendErr: (res, err) => {
		try {
			res.contentType('application/json');
			var ret = {
				"status": 0,
				"message": getError(err) //tmp	
			};
			var sRet = JSON.stringify(ret);
			console.log(ret);
			res.end(sRet);
		} catch (e) {
			console.log("Error response error: " + e);
		}
	},
	sendSuccess: (res, obj) => {
		try {
			res.contentType('application/json');
			var ret = {
				"status": 1,
				"message": "success"
			};
			var finalObj = extend(true, ret, obj);
			res.end(JSON.stringify(finalObj));
		} catch (e) {
			console.log("Success response error: " + e);
		}
	}
};