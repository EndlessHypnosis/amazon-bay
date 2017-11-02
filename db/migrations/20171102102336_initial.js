
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('items', table => {
      table.increments('id').primary();
      table.string('title');
      table.string('description');
      table.string('imageUrl');
      table.decimal('price', 8, 2);
      table.timestamps(true, true);
    }),

    knex.schema.createTable('orders', table => {
      table.increments('id').primary();
      table.decimal('totalPrice', 8, 2);
      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('orders'),
    knex.schema.dropTable('items')
  ]);
};

//Table:
// items

//Cols:
// title
// description
// imageUrl
// price

//Table:
// orders

//Cols:
// totalPrice
// orderDate (from timestamp)