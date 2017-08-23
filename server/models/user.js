var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    jwt = require('jwt-simple');

var UserSchema = new Schema({
    email: { type: String, require: true, lowercase: true, index: {unique: true} },
    name: { type: String, require: true },
	isAdmin: { type: Boolean, default: true },
    token: { type: Object },
    dateModified: { type: Date, default: Date.now },
    status: String,
    deleted: { type: Boolean, default: false }
}, {
    strict: true,
    safe: true
});

UserSchema.set('toJSON', {
	virtuals: true
});

UserSchema.options.toJSON.transform = (doc, ret, options) => {
  // remove the _id of every document before returning the result
  delete ret._id;
  delete ret.__v;
};

var TokenSchema = new Schema({
	value: {
		type: String
	},
	dateCreated: {
		type: Date,
		default: Date.now
	}
});
/* Validation and token encoding using jwt-simple */
var Token = mongoose.model('Token', TokenSchema);
/* secret */
var tokenSecret = 'nothing';

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

UserSchema.statics.encode = function(payload) {
	return jwt.encode(payload, tokenSecret);
};

UserSchema.statics.decode = function(payload) {
	try {
		return jwt.decode(payload, tokenSecret);
	} catch (e) {
		//catch Unexpected token
		return '';
	}
};

/* function creates token based on email */
UserSchema.statics.createToken = function(email, callback) {
	var self = this;
	this.findOne({
		email: email
	}, function(err, user) {
		if (err || !user) {
			console.log('err');
			//TODO
			return callback(err, null);
		}
		/* create a token and add to user and save */
		var token = self.encode({
			email: email
		});
		user.token = new Token({
			value: token
		});
		user.save(function(err, user) {
			if (err) {
				callback(err, null);
			} else {
				callback(false, user.token.value);
			}
		});
	});
};

UserSchema.statics.authenticateToken = function(email, tokenKey, callback) {
	var self = this;
	this.findOne({
		email: email
	}, function(err, user) {
		if (err || !user) {
			console.log('err');
			return callback(true, null);
			//TODO
		}
		if (user.token && tokenKey !== user.token.value) {
			callback(true, null);
		} else {
			//token is authenticated
			callback(false, {
				id: user._id,
				name: user.name,
				token: tokenKey,
				permission: user.isAdmin
			});
		}
	});
};


module.exports = mongoose.model('User', UserSchema);