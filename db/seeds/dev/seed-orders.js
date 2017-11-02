
// Seed Data - Items

// for extra branch with relationship
// 1 = 1+2
// 2 = 1+2+3
// 3 = 5+6
// 4 = 6

let orderData = [
  {
    totalPrice: '88.48'
  },
  {
    totalPrice: '218.33'
  },
  {
    totalPrice: '48.88'
  },
  {
    totalPrice: '8.89'
  }
];


// TODO: refactor these so i'm not defining title: item:title
const createOrder = (knex, order) => {
  return knex('orders').insert(order);
  // {
  //   title: item.title,
  //     description: item.description,
  //       imageUrl: item.imageUrl,
  //         price: item.price
  // }
};

exports.seed = function (knex, Promise) {
  // delete rows first
  return knex('orders').del()
    .then(() => {
      let orderPromises = [];
      orderData.forEach(order => {
        orderPromises.push(createOrder(knex, order));
      });
      return Promise.all(orderPromises);
    })
    .catch(error => console.log('Error seeding ORDERS data:', error));
};