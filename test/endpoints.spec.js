const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

const environment = 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Static Content Routes', () => {
  // happy path test
  it('should return the correct static content', done => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        response.res.text.should.include('<h1>Amazon Bay</h1>');
        done();
      });
  });

  // sad path test
  it('should return a 404 for a route that does not exist', done => {
    chai.request(server)
      .get('/foobar')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
  });
});

// Endpoint tests
describe('API Routes', () => {

  beforeEach(done => {
    database.seed.run()
      .then(() => {
        done();
      });
  });

  describe('GET /api/v1/items', () => {
    it('should return all inventory items', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(6);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('title');
          response.body[0].should.have.property('description');
          response.body[0].should.have.property('imageUrl');
          response.body[0].should.have.property('price');
          done();
        });
    });

    it('should return a specific inventory item', done => {

      const mockInventoryItem = {
        title: 'Sony WH1000XM2 Premium Headphones',
        description: 'Automatically detects your activity, whether youre travelling in an airport, walking on a crowded street, or sitting in a quiet area — then balances the noise cancelling levels accordingly.',
        imageUrl: 'http://images-na.ssl-images-amazon.com/images/I/8117Z6zWB8L._SL1500_.jpg',
        price: '129.85'
      }

      chai.request(server)
        .get('/api/v1/items')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(6);
          response.body.filter(item => {
            return item.title === mockInventoryItem.title;
          }).length.should.equal(1);
          done();
        });
    });
  });


  describe('GET /api/v1/orders', () => {
    it('should return all orders', done => {
      chai.request(server)
        .get('/api/v1/orders')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(4);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('totalPrice');
          done();
        });
    });

    it('should return a specific order', done => {
      const mockOrderItem = {
        totalPrice: '218.33'
      }

      chai.request(server)
        .get('/api/v1/orders')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.filter(order => {
            return order.totalPrice === mockOrderItem.totalPrice;
          }).length.should.equal(1);
          done();
        });
    });
  });

  describe('POST /api/v1/orders', () => {

    it('should create a new order successfully', done => {
      // check record count before posting
      chai.request(server)
        .get('/api/v1/orders')
        .end((error, response) => {
          response.body.should.have.length(4);
          // post new order
          chai.request(server)
            .post('/api/v1/orders')
            .send({
              'orderTotal': '328.95'
            })
            .end((error, response) => {
              response.should.have.status(201);
              response.should.be.json;
              response.body.should.be.a('object');
              response.body.should.have.property('id');
              response.body.should.have.property('totalPrice');
              response.body.totalPrice.should.equal('328.95');

              // check record count again
              chai.request(server)
                .get('/api/v1/orders')
                .end((error, response) => {
                  response.body.should.have.length(5);
                  done();
                });
            });
        });
    });

    it('should error if the post is missing the total price', done => {
      chai.request(server)
        .post('/api/v1/orders')
        .send({
          'nothing': 'nothing'
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have.property('error');
          done();
        });
    });

  });

});
