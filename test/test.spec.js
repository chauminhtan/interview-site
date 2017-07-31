//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('./server-test');
var config = require('../server/config/config');
var should = chai.should();
var Test = require('../server/models/test');


chai.use(chaiHttp);
// Our parent block
describe('Tests', () => {
    var token = '', itemId = '';
    
    before((done) => { // Before test we empty the database
        Test.remove({}, (err) => { 
           done();         
        });     
    });
    
    /*
    * Test the /POST route
    */
    describe('/POST', () => {
        it('CREATE an item', (done) => {
            const listQuestions = [
                        {id: 1, title: 'question 1'},
                        {id: 2, title: 'question 2'},
                        {id: 3, title: 'question 3'},
                        {id: 4, title: 'question 4'},
                        {id: 5, title: 'question 5'}
                    ]
            chai.request(server)
                .post('/api/tests')
                .send({
                    title: 'Test title',
                    category: 'Dev',
                    questions: listQuestions,
                    time: 3600
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
                .get('/api/tests')
                .end((err, res) => {
                    res.should.have.status(200);			
                    res.body.status.should.eql(1);
                    res.body.data.should.be.a('array');
                    done();
                });
        });
        it('GET ONE', (done) => {
            chai.request(server)
                .get('/api/tests/' + itemId)
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