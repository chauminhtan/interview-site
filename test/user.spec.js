//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('./server-test');
var config = require('../server/config/config');
var should = chai.should();
var User = require('../server/models/user');


chai.use(chaiHttp);
// Our parent block
describe('Users', () => {
    var token = '', userId = '';
    
    before((done) => { // Before test we empty the database
        User.where('email').ne(config.admin.email).remove({}, (err) => { 
           done();         
        });     
    });
    
    /*
    * Test the /POST route
    */
    describe('/POST user', () => {
        it('CREATE an user', (done) => {
            chai.request(server)
                .post('/api/users')
                .send({
                    email: 'tan.chau@waverleysoftware.com',
                    name: 'Tan',
                    password: 'admin'
                })
                .end((err, res) => {
                    res.should.have.status(200);			
                    res.body.status.should.eql(1);
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property('id');
                    userId = res.body.data.id;
                    console.log('userId: ' + userId);
                    done();
                });
        });
        it('LOGIN', (done) => {
            chai.request(server)
                .post('/api/users/login')
                .send({
                    email: 'tan.chau@waverleysoftware.com',
                    password: 'admin'
                })
                .end((err, res) => {
                    res.should.have.status(200);			
                    res.body.status.should.eql(1);
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property('userId');
                    res.body.data.should.have.property('token');
                    token = res.body.data.token;
                    console.log('token: ' + token);
                    done();
                });
        });
        it('UPDATE an user', (done) => {
            chai.request(server)
                .put('/api/users/' + userId)
                .send({
                    email: 'tan.chau@waverleysoftware.com',
                    name: 'Tan Updated',
                    password: 'admin'
                })
                .end((err, res) => {
                    res.should.have.status(200);			
                    res.body.status.should.eql(1);
                    console.log('updated userId: ' + userId);
                    done();
                });
        });
    });
    /*
    * Test the /GET route
    */
    describe('/GET user', () => {
        it('GET all the users', (done) => {
            chai.request(server)
                .get('/api/users')
                .end((err, res) => {
                    res.should.have.status(200);			
                    res.body.status.should.eql(1);
                    res.body.data.should.be.a('array');
                    done();
                });
        });
        it('GET one user', (done) => {
            chai.request(server)
                .get('/api/users/' + userId)
                .end((err, res) => {
                    res.should.have.status(200);					
                    res.body.status.should.eql(1);
                    res.body.data.should.be.a('object');
                    res.body.data.id.should.eql(userId);
                    done();
                });
        });
        it('LOGOUT', (done) => {
            chai.request(server)
                .get('/api/users/logout')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

});