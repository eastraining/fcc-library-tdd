/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */
  const FIRST_BOOK = { title: 'Ultralearning' };
  const FAKE_BOOK_ID = 'asdofby1324';
  let FIRST_BOOK_ID;

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      // #1
      test('Test POST /api/books with title', function(done) {
        chai
        .request(server)
        .post('/api/books')
        .send({ title: 'Ultralearning' })
        .end(function(err, res) {
          assert.equal(res.status, 200); // need assert to pass tests
          expect(res).to.have.a.property('type').that.equals('application/json');
          expect(res).to.have.a.property('body').that.is.an('object');
          expect(res.body).to.have.a.property('title').that.equals(FIRST_BOOK.title);
          expect(res.body).to.have.a.property('_id').that.is.a('string');
          FIRST_BOOK_ID = res.body._id;
          done();
        });
      });
      // #2
      test('Test POST /api/books with no title given', function(done) {
        chai
        .request(server)
        .post('/api/books')
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200); // need assert to pass tests
          expect(res).to.have.a.property('type').that.equals('text/html');
          expect(res).to.have.a.property('text').that.equals('missing required field title');
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      // #3
      test('Test GET /api/books',  function(done){
        chai
        .request(server)
        .get('/api/books')
        .end(function(err, res) {
          assert.equal(res.status, 200); // need assert to pass tests
          expect(res).to.have.a.property('type').that.equals('application/json');
          expect(res).to.have.a.property('body').that.is.an('array').that.has.lengthOf(1);
          res.body.forEach(book => {
            expect(book).to.be.an('object');
            expect(book).to.have.a.property('title').that.is.a('string');
            expect(book).to.have.a.property('_id').that.is.a('string');
            expect(book).to.have.a.property('commentcount').that.is.a('number');
          });
          done();
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      // #4
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
        .request(server)
        .get(`/api/books/${FAKE_BOOK_ID}`)
        .end(function(err, res) {
          assert.equal(res.status, 200); // need assert to pass tests
          expect(res).to.have.a.property('type').that.equals('text/html');
          expect(res).to.have.a.property('text').that.equals('no book exists');
          done();
        });
      });
      // #5
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
        .request(server)
        .get(`/api/books/${FIRST_BOOK_ID}`)
        .end(function(err, res) {
          assert.equal(res.status, 200); // need assert to pass tests
          expect(res).to.have.a.property('type').that.equals('application/json');
          expect(res).to.have.a.property('body').that.is.an('object');
          expect(res.body).to.have.a.property('title').that.equals(FIRST_BOOK.title);
          expect(res.body).to.have.a.property('_id').that.equals(FIRST_BOOK_ID);
          expect(res.body).to.have.a.property('comments').that.has.lengthOf(0);
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      // #6
      test('Test POST /api/books/[id] with comment', function(done){
        chai
        .request(server)
        .post(`/api/books/${FIRST_BOOK_ID}`)
        .send({ comment: 'really interesting book about speeding up learning' })
        .end(function(err, res) {
          assert.equal(res.status, 200); // need assert to pass tests
          expect(res).to.have.a.property('type').that.equals('application/json');
          expect(res).to.have.a.property('body').that.is.an('object');
          expect(res.body).to.have.a.property('title').that.equals(FIRST_BOOK.title);
          expect(res.body).to.have.a.property('_id').that.equals(FIRST_BOOK_ID);
          expect(res.body).to.have.a.property('comments').that.has.lengthOf(1);
          done();
        });
      });
      // #7
      test('Test POST /api/books/[id] without comment field', function(done){
        chai
        .request(server)
        .post(`/api/books/${FIRST_BOOK_ID}`)
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200); // need assert to pass tests
          expect(res).to.have.a.property('type').that.equals('text/html');
          expect(res).to.have.a.property('text').that.equals('missing required field comment');
          done();
        });
      });
      // #8
      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
        .request(server)
        .post(`/api/books/${FAKE_BOOK_ID}`)
        .send({ comment: 'this is not a drill' })
        .end(function(err, res) {
          assert.equal(res.status, 200); // need assert to pass tests
          expect(res).to.have.a.property('type').that.equals('text/html');
          expect(res).to.have.a.property('text').that.equals('no book exists');
          done();
        });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {
      // #9
      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
        .request(server)
        .delete(`/api/books/${FIRST_BOOK_ID}`)
        .end(function(err, res) {
          assert.equal(res.status, 200); // need assert to pass tests
          expect(res).to.have.a.property('type').that.equals('text/html');
          expect(res).to.have.a.property('text').that.equals('delete successful');
          done();
        });
      });
      // #10
      test('Test DELETE /api/books/[id] with id not in db', function(done){
        chai
        .request(server)
        .delete(`/api/books/${FAKE_BOOK_ID}`)
        .end(function(err, res) {
          assert.equal(res.status, 200); // need assert to pass tests
          expect(res).to.have.a.property('type').that.equals('text/html');
          expect(res).to.have.a.property('text').that.equals('no book exists');
          done();
        });
      });

    });

  });

});
