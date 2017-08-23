var path = require('path');
var auth = require('./middlewares/authorization');
// authenticate user at here
var authenticate = auth.authenticateToken;
var checkPermission = auth.addRestrictTo;


module.exports = function (app, passport, auth) {
    var users = require(path.join(__dirname, 'users')),
        questions = require(path.join(__dirname, 'questions')),
        languages = require(path.join(__dirname, 'languages')),
        positions = require(path.join(__dirname, 'positions')),
        tests = require(path.join(__dirname, 'tests')),
        results = require(path.join(__dirname, 'results'));

    /* REST API */
    /**
     * Users apis
     */
    app.post('/api/users/login', passport.authenticate('local', {
        session: false //use token to authenticate api access
    }), users.login);
    app.post('/api/users', checkPermission, users.create);
    app.get('/api/users', checkPermission, users.getAll);
    app.get('/api/users/:id', checkPermission, users.getOne);
    app.get('/api/users/logout', authenticate, users.logout);
    app.put('/api/users/:id', checkPermission, users.update);
    app.delete('/api/users/:id', checkPermission, users.delete);
    /**
     * Question apis
     */
    app.get('/api/questions', checkPermission, questions.getAll);
    app.post('/api/questionsByIds', checkPermission, questions.getByIds);
    app.get('/api/questions/:id', checkPermission, questions.getOne);
    app.post('/api/questions', checkPermission, questions.create);
    app.put('/api/questions/:id', checkPermission, questions.update);
    app.delete('/api/questions/:id', checkPermission, questions.delete);
    /**
     * Test apis
     */
    app.get('/api/tests', checkPermission, tests.getAll);
    app.get('/api/tests/:id', checkPermission, tests.getOne);
    app.post('/api/tests', checkPermission, tests.create);
    app.put('/api/tests/:id', checkPermission, tests.update);
    app.delete('/api/tests/:id', checkPermission, tests.delete);
    app.post('/api/testsGenerate', checkPermission, tests.generate);
    /**
     * Language apis
     */
    app.get('/api/languages', checkPermission, languages.getAll);
    app.get('/api/languages/:id', checkPermission, languages.getOne);
    app.post('/api/languages', checkPermission, languages.create);
    app.put('/api/languages/:id', checkPermission, languages.update);
    app.delete('/api/languages/:id', checkPermission, languages.delete);
    /**
     * Position apis
     */
    app.get('/api/positions', checkPermission, positions.getAll);
    app.get('/api/positions/:id', checkPermission, positions.getOne);
    app.post('/api/positions', checkPermission, positions.create);
    app.put('/api/positions/:id', checkPermission, positions.update);
    app.delete('/api/positions/:id', checkPermission, positions.delete);
    /**
     * Assignment apis
     */
    app.post('/api/results', checkPermission, results.create);
    app.put('/api/results/:id', checkPermission, results.update);
    app.get('/api/resultsByTestId/:id', checkPermission, results.getByTestId);
    app.post('/api/resultsByUserAndTest/:id', authenticate, results.getByUserAndTest);
    app.get('/api/results/:id', checkPermission, results.getOne);
    app.get('/api/results', checkPermission, results.getAll);
    
    // ping api
    app.get('/api/ping', (req, res) => {
        console.log('pong..');
        res.json({
            status: 1,
            message: 'pong'
        });
    });
}