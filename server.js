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

app.get('/', (request, response) => {
  response.send('It\'s a secret to everyone.');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;