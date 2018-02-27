//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// let mongoose = require("mongoose");
// let Book = require('../app/models/book');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);
/*
* Test the /GET route
*/
describe('/GET products', () => {
    it('it should GET all the products', (done) => {
      chai.request(app)
          .get('/products')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('products');
              Object.keys(res.body.products).length.should.be.eql(2);
            done();
          });
    });
    it('it should GET the details of a specific product', (done) => {
      chai.request(app)
          .get('/products/123123')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('title');
              res.body.should.have.property('description');
            done();
          });
    });
    it('it should return 404 not found for unknown product', (done) => {
      chai.request(app)
          .get('/products/145')
          .end((err, res) => {
              res.should.have.status(404);
              // res.body.should.be.a('text');
            done();
          });
    });
});
/*
* Test the /POST route
*/
describe('/POST product', () => {
    it('it should respond with the new product ID', (done) => {
      chai.request(app)
      let product = {
          title: "The Lord of the Rings",
          description: "J.R.R. Tolkien",
          price: 1954,
      }
      chai.request(app)
          .post('/products')
          .send(product)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('id');
            done();
          });
    });
    it('it should respond with 422 unprocessable entity for badly formed POST', (done) => {
      chai.request(app)
      let product = {
          titlez: "The Lord of the Rings",
          description: "J.R.R. Tolkien",
          price: 1954,
      }
      chai.request(app)
          .post('/products')
          .send(product)
          .end((err, res) => {
              res.should.have.status(422);
              res.body.should.have.property('errors');
              res.body.errors.should.have.property('title');
            done();
          });
    });
    it('it should respond with 422 unprocessable entity for alphabetical price', (done) => {
      chai.request(app)
      let product = {
          titlez: "The Lord of the Rings",
          description: "J.R.R. Tolkien",
          price: 'abcd',
      }
      chai.request(app)
          .post('/products')
          .send(product)
          .end((err, res) => {
              res.should.have.status(422);
              res.body.errors.should.have.property('price');
              console.log(res.body);
            done();
          });
    });
});
/*
* Test the /PUT route
*/
describe('/PUT products', () => {
    let product = {
        title: "The Lord of the Rings",
        description: "J.R.R. Tolkien",
        price: 1954,
    }
    it('it should update the product', (done) => {
      chai.request(app)
          .put('/products/123123')
          .send(product)
          .end((err, res) => {
              res.should.have.status(200);
              expect(res.body).to.eql(product);
            done();
          });
      chai.request(app)
      .get('/products/123123')
      .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.eql(product);
        done();
      });
    });
    it('it should return 404 not found for unknown product', (done) => {
      chai.request(app)
          .put('/products/145')
          .send(product)
          .end((err, res) => {
              res.should.have.status(404);
            done();
          });
    });
});
/*
* Test the /DELETE route
*/
describe('/DELETE product', () => {
    it('it should DELETE the product', (done) => {
      chai.request(app)
          .delete('/products/123123')
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
      chai.request(app)
          .get('/products/123123')
          .end((err, res) => {
              res.should.have.status(404);
            done();
          });
    });
    it('it should return 404 not found for unknown product', (done) => {
      chai.request(app)
          .delete('/products/145')
          .end((err, res) => {
              res.should.have.status(404);
            done();
          });
    });
});
