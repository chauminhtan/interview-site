//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.PORT = 3002;
var server = require('../server/server');

module.exports = server;