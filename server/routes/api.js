var path = require('path');
var auth = require('./middlewares/authorization');
// authenticate user at here
var authenticate = auth.authenticateToken;


module.exports = function (app, passport, auth) {
    var users = require(path.join(__dirname, 'users')),
        questions = require(path.join(__dirname, 'questions')),
        tests = require(path.join(__dirname, 'tests'));

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
    app.get('/api/questions', questions.getAll);
    app.get('/api/questions/:id', questions.getOne);
    app.post('/api/questions', questions.create);
    app.put('/api/questions/:id', questions.update);
    app.delete('/api/questions/:id', questions.delete);
    /**
     * Test apis
     */
    app.get('/api/tests', tests.getAll);
    app.get('/api/tests/:id', tests.getOne);
    app.post('/api/tests', tests.create);
    app.put('/api/tests/:id', tests.update);
    app.delete('/api/tests/:id', tests.delete);
    app.post('/api/testsGenerate', tests.generate);
    app.get('/api/position', tests.getAllPosition);
    app.get('/api/position/:id', tests.getPosition);
    // ping api
    app.get('/api/ping', (req, res) => {
        console.log('pong..');
        res.json({
            status: 1,
            message: 'pong'
        });
    });
}