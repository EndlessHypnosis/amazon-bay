$(document).ready(function () {
  // do initializing stuff here
  getInventoryItems();
});




const addToLocal = (arrayToSave, key) => {
  let stringifiedArray = JSON.stringify(arrayToSave);
  localStorage.setItem(key, stringifiedArray);
}

const getFromLocal = (key) => {
  let itemsArray = JSON.parse(localStorage.getItem(key)) || [];
  return itemsArray;
}



const addItemToCart = (cartBtn) => {
  closeCart();
  console.log('what is cart button', cartBtn);

  let itemId = $(cartBtn).data('itemid')
  console.log('item id', itemId);


  let fullInventory = getFromLocal('abinventory');

  let itemToAdd = fullInventory.find(item => {
    return item.id === itemId;
  })

  if (itemToAdd) {
    console.log('found one', itemToAdd);
    
    // add item to local storage for cart
    let currentCart = getFromLocal('abcart');
    
    // make sure item isn't in cart yet
    let isItemFound = currentCart.find(item => {
      return item.id === itemToAdd.id;
    })

    if (!isItemFound) {
      currentCart.push(itemToAdd);
      addToLocal(currentCart, 'abcart');
      console.log('added item to local', itemToAdd.id);
      // alert(`Added ${itemToAdd.title} to your cart!`);

      //disable button
      // $(cartBtn).prop('disabled', true);
      
    } else {
      console.log('Error: Cannot add Duplicate Item:', itemToAdd.id);
      alert(`Cannot add Duplicate Item: ${itemToAdd.title}`)
    }
    
  }
  
}

const calcCartTotal = () => {
  let currentCart = getFromLocal('abcart');
  let totalPrice = 0.0;

  if (currentCart.length > 0) {
    totalPrice = currentCart.reduce((acum, item) => {
      acum += parseFloat(item.price);
      return acum;
    }, 0.0);
  }
  $('.cart-price-val').text(totalPrice.toFixed(2))
}

const cartCheckout = () => {

  let currentCart = getFromLocal('abcart');

  if (currentCart.length === 0) {
    alert('Cannot checkout without any items!');
    return;
  }

  fetch('/api/v1/orders', {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ orderTotal: $('.cart-price-val').text() })
  })
    .then(data => data.json())
    .then(response => {
      if (response.status == 201) {

        console.log('Order Created:', response);
        alert(`Thanks for the order totaling: ${response.totalPrice} !!!`)
        addToLocal([], 'abcart');
        closeCart();
      }
      if (response.status == 422) {
        alert(response.error);
      }
    })
    .catch(error => console.log('Error Creating Order', error));


}

const itemFactory = (item) => {
  let newItem = document.createElement('div');
  newItem.className = 'item-wrapper';
  newItem.id = `item-${item.id}`;
  newItem.innerHTML = `
    <div class='item-details'>
      <p class='item-detail-title'>${item.title}</p>
      <img class='item-detail-img' src='${item.imageUrl}' alt='picture of headphones'>
      <p class='item-detail-desc'><span>Description:</span>${item.description}</p>
      <p class='item-detail-price'><span>Price: </span><i class='icon ion-social-usd'></i>${item.price}</p>
    </div>
    <div class='item-button'>
      <input  class='btn-add-to-cart'
              data-itemid=${item.id}
              type='button'
              value='Add to Cart' />
    </div>
  `;

  let cartBtn = newItem.querySelector('.btn-add-to-cart');
  $(cartBtn).on('click', function () {
    addItemToCart(cartBtn);
  });

  return newItem;
}

//refactor these 2 factories
const cartFactory = (item) => {
  let cartItem = document.createElement('div');
  cartItem.className = 'cart-item';
  cartItem.id = `cart-item-${item.id}`;
  cartItem.innerHTML = `
    <p class='cart-item-title'>${item.title}</p>
      <p class='cart-item-price'>
        <span>Price:</span>
      <i class='icon ion-social-usd'></i>
      ${item.price}
    </p>
  `;
  return cartItem;
}
//refactor these 2 factories
const orderFactory = (order) => {
  let orderItem = document.createElement('div');
  let preFormattedDate = new Date(order.created_at)

  let orderDate = (preFormattedDate.getMonth() + 1)
                  + '/' + preFormattedDate.getDate()
                  + '/' + preFormattedDate.getFullYear()
                  + ' at ' + preFormattedDate.getHours()
                  + ':' + preFormattedDate.getMinutes();

  orderItem.className = 'cart-item';
  orderItem.id = `order-item-${order.id}`;
  orderItem.innerHTML = `
    <p class='cart-item-title'>
      <span>Total:</span>
      <i class='icon ion-social-usd'></i>
      ${order.totalPrice}
    </p>
    <p class='order-item-date'>
      <span>Ordered On:</span>
      ${orderDate}
    </p>
  `;
  return orderItem;
}


const getInventoryItems = () => {
  fetch('/api/v1/items')
    .then(result => result.json())
    .then(items => {
      // add to local storage
      addToLocal(items, 'abinventory');

      $('.inventory-wrapper').children().remove();

      // refactor to use fragments or the like
      items.forEach(item => {
        $('.inventory-wrapper').append(itemFactory(item))
      })

    })
    .catch(error => { console.log('Error getting items:', error) })
}


// const getItems = () => {

//   const dropDownList = $('#select-item-list');
//   let itemsArray = pullFromLocal();
//   if (itemsArray.length === 0) {
//     //no items in local, so fetch

//     fetch('/api/v1/items')
//       .then(result => result.json())
//       .then(items => {
//         // add to local storage
//         addToLocal(items);

//         dropDownList.children().remove();
//         items.forEach(item => {
//           dropDownList.append($('<option>', {
//             value: item.title,
//             text: item.title
//           }));
//         });

//       });
//     } else {
//     dropDownList.children().remove();
//     itemsArray.forEach(item => {
//       dropDownList.append($('<option>', {
//         value: item.title,
//         text: item.title
//       }));
//     });
//     }

// }


const openHistory = () => {
  closeCart();
  fetch('/api/v1/orders')
    .then(result => result.json())
    .then(orders => {
      console.log('ORDERS FOUND:', orders);
      
      $('.history-orders-wrapper').children().remove();
      orders.forEach(order => {
        $('.history-orders-wrapper').append(orderFactory(order))
      })
    })
    .catch(error => { console.log('Error getting orders:', error) })


  document.getElementById('history-pane').style.width = '600px';
}

const closeHistory = () => {
  document.getElementById('history-pane').style.width = '0';
}

const clearCart = () => {
  addToLocal([], 'abcart');
  openCart();
}

const openCart = () => {
  closeHistory();
  let currentCart = getFromLocal('abcart');

  $('.cart-items-wrapper').children().remove();

  if (currentCart.length > 0) {
    currentCart.forEach(item => {
      $('.cart-items-wrapper').append(cartFactory(item))
    })

  } else {
    let blankCart = $(`<div class='no-cart-items'>No Items in Cart</div>`);
    $('.cart-items-wrapper').append(blankCart)
  }

  //refresh cart total
  calcCartTotal();

  document.getElementById('cart-pane').style.width = '600px';
}

const closeCart = () => {
  document.getElementById('cart-pane').style.width = '0';
}

// Event Listeners

// $('#btn-test').click(testme);