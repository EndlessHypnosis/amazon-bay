//setup express
const express = require('express');
const app = express();
app.set('port', process.env.PORT || 3000);

//body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//serve static files
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

//knex
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.locals.title = 'Amazon Bay';

app.get('/api/v1/items', (request, response) => {
  database('items').select()
    .then((items) => {
      response.status(200).json(items);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});


app.post('/api/v1/orders', (request, response) => {
  const { orderTotal } = request.body;

  if (!orderTotal || !(orderTotal > 0.0)) {
    return response
      .status(422)
      .json({
        status: 422,
        error: 'Order not saved. Invalid order total'
      });
  }

  database('orders').insert({
    totalPrice: orderTotal
  }, '*')
  .then(orders => {
    response.status(201).json(Object.assign({ status: 201 }, orders[0]));
  })
  .catch(error => {
    response.status(500).json(Object.assign({ status: 500 }, { error }));
  });
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;