
// Seed Data - Items

let itemData = [
  {
    title: 'COWIN E7 Noise Cancelling Headphones',
    description: 'Active Noise Cancelling technology. Significant noise reduction for travel, work and anywhere in between. Advanced active noise reduction technology quells city traffic or a busy office, makes you focus on what you want to hear.',
    imageUrl: 'http://images-na.ssl-images-amazon.com/images/I/619jaB5tJZL._SL1001_.jpg',
    price: '69.99'
  },
  {
    title: 'TaoTronics Wireless Magnetic Earbuds',
    description: 'Perfect workout headphones that are snug and secure so the headphones stay put while running, biking or at the gym.',
    imageUrl: 'http://images-na.ssl-images-amazon.com/images/I/512zLnML2LL._SL1000_.jpg',
    price: '18.49'
  },
  {
    title: 'Sony WH1000XM2 Premium Headphones',
    description: 'Automatically detects your activity, whether youre travelling in an airport, walking on a crowded street, or sitting in a quiet area — then balances the noise cancelling levels accordingly.',
    imageUrl: 'http://images-na.ssl-images-amazon.com/images/I/8117Z6zWB8L._SL1500_.jpg',
    price: '129.85'
  },
  {
    title: 'Bose QuietComfort 25 Acoustic',
    description: 'QuietComfort 25 headphones are engineered to sound better, be more comfortable and easier to take with you. Put them on, and suddenly everything changes.',
    imageUrl: 'http://images-na.ssl-images-amazon.com/images/I/71kgntub7mL._SL1500_.jpg',
    price: '189.19'
  },
  {
    title: 'HIFI ELITE Super66 by Modern Portable',
    description: 'Simply amazing, hi-fidelity, crystal clear sound, and deep, rich, accurate bass. Distortion free audio, even at its highest volume level.',
    imageUrl: 'http://images-na.ssl-images-amazon.com/images/I/81OEdVr5KzL._SL1500_.jpg',
    price: '39.99'
  },
  {
    title: 'Panasonic In-Ear Headphone',
    description: 'Enjoy full listening comfort with soft, snug earbuds that conform instantly to your ears.',
    imageUrl: 'http://images-na.ssl-images-amazon.com/images/I/31-nuw-iqAL.jpg',
    price: '8.89'
  }
];


// TODO: refactor these so i'm not defining title: item:title
const createItem = (knex, item) => {
  return knex('items').insert(item);
  // {
  //   title: item.title,
  //     description: item.description,
  //       imageUrl: item.imageUrl,
  //         price: item.price
  // }
};

exports.seed = function (knex, Promise) {
  // delete rows first
  return knex('items').del()
    .then(() => {
      let itemPromises = [];
      itemData.forEach(item => {
        itemPromises.push(createItem(knex, item));
      });
      return Promise.all(itemPromises);
    })
    .catch(error => console.log('Error seeding ITEMS data:', error));
};