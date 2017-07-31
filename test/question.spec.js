//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('./server-test');
var config = require('../server/config/config');
var should = chai.should();
var Question = require('../server/models/question');


chai.use(chaiHttp);
// Our parent block
describe('Questions', () => {
    var token = '', itemId = '';
    
    before((done) => { // Before test we empty the database
        Question.remove({}, (err) => { 
           done();         
        });     
    });
    
    /*
    * Test the /POST route
    */
    describe('/POST', () => {
        it('CREATE an item', (done) => {
            chai.request(server)
                .post('/api/questions')
                .send({
                    description: 'question description',
                    category: 'Dev',
                    answer: '1'
                })
                .end((err, res) => {
                    res.should.have.status(200);			
                    res.body.status.should.eql(1);
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property('id');
                    itemId = res.body.data.id;
                    console.log('itemId: ' + itemId);
                    done();
                });
        });
    });
    /*
    * Test the /GET route
    */
    describe('/GET', () => {
        it('GET All', (done) => {
            chai.request(server)
                .get('/api/questions')
                .end((err, res) => {
                    res.should.have.status(200);			
                    res.body.status.should.eql(1);
                    res.body.data.should.be.a('array');
                    done();
                });
        });
        it('GET ONE', (done) => {
            chai.request(server)
                .get('/api/questions/' + itemId)
                .end((err, res) => {
                    res.should.have.status(200);					
                    res.body.status.should.eql(1);
                    res.body.data.should.be.a('object');
                    res.body.data.id.should.eql(itemId);
                    done();
                });
        });
    });
});