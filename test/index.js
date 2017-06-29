//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('./server-test');
var should = chai.should();

chai.use(chaiHttp);

describe('test: ping', function () {
    it('should return a signal', function (done) {
        chai.request(server)
            .get('/api/ping')
            .end((err, res) => {	
                res.should.have.status(200);			
                res.body.status.should.eql(1);
                res.body.message.should.eql('pong');
                done();
            });
    });
});