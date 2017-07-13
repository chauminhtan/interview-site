var path = require('path');
var auth = require('./middlewares/authorization');
// authenticate user at here
var authenticate = auth.authenticateToken;


module.exports = function (app, passport, auth) {
    var users = require(path.join(__dirname, 'users')),
        questions = require(path.join(__dirname, 'questions'));

    /* REST API */
    /**
     * Users apis
     */
    app.post('/api/users/login', passport.authenticate('local', {
        session: false //use token to authenticate api access
    }), users.login);
    app.post('/api/users', users.create);
    app.get('/api/users', users.getAll);
    app.get('/api/users/:id', users.getOne);
    app.get('/api/users/logout', users.logout);
    app.put('/api/users/:id', users.update);
    app.delete('/api/users/:id', users.delete);
    /**
     * Question apis
     */
    app.post('/api/questions', questions.create);
    /**
     * Test apis
     */
    app.get('/api/ping', (req, res) => {
        console.log('pong..');
        res.json({
            status: 1,
            message: 'pong'
        });
    });
}