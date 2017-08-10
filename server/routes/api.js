var path = require('path');
var auth = require('./middlewares/authorization');
// authenticate user at here
var authenticate = auth.authenticateToken;


module.exports = function (app, passport, auth) {
    var users = require(path.join(__dirname, 'users')),
        questions = require(path.join(__dirname, 'questions')),
        languages = require(path.join(__dirname, 'languages')),
        tests = require(path.join(__dirname, 'tests')),
        results = require(path.join(__dirname, 'results')),
        sendmail = require(path.join(__dirname, 'sendmail'));

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
    /**
     * Language apis
     */
    app.get('/api/languages', languages.getAll);
    app.get('/api/languages/:id', languages.getOne);
    app.post('/api/languages', languages.create);
    app.put('/api/languages/:id', languages.update);
    app.delete('/api/languages/:id', languages.delete);
    /**
     * Position apis
     */
    app.get('/api/position', tests.getAllPosition);
    app.get('/api/position/:id', tests.getPosition);
    /**
     * Assignment apis
     */
    app.post('/api/result', results.create);
    app.get('/api/result/:id', results.getByTest);
    /**
     * Sendmail apis
     */
    app.get('/api/sendmail', sendmail.test);
    // ping api
    app.get('/api/ping', (req, res) => {
        console.log('pong..');
        res.json({
            status: 1,
            message: 'pong'
        });
    });
}