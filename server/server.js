/**
 * Module dependencies.
 */
var express = require('express');
var bodyParser = require('body-parser');
var routes = require(__dirname + '/routes/api');
var http = require('http');
var path = require('path');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config = require(__dirname + '/config/config'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

// Bootstrap db connection
mongoose.Promise = global.Promise;
var db = mongoose.connect(config.db);
// bootstrap passport config
var app = express();
// express settings
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if (app.get('env') === 'development') {
    // TODO
}
// production only
if (app.get('env') === 'production') {
    // TODO
}
//NOTE: createStrategy: Sets up passport-local LocalStrategy with correct options.
//When using usernameField option to specify alternative usernameField e.g. "email"
//passport-local still expects your frontend login form to contain an input with
//name "username" instead of email
//https://github.com/saintedlama/passport-local-mongoose
var User = require(__dirname + '/models/user');
passport.use(User.createStrategy());
config.populateDb();

/* add routes and start server */
require(__dirname + '/routes/api')(app, passport);
http.createServer(app).listen(app.get('port'), function() {
    console.log('Nodejs server listening on port ' + app.get('port'));
});

module.exports = app;