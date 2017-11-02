$(document).ready(function () {
  // do initializing stuff here
  getInventoryItems();
});




const addToLocal = (arrayToSave) => {
  let stringifiedArray = JSON.stringify(arrayToSave);
  localStorage.setItem('itemsArray', stringifiedArray);
}

const pullFromLocal = () => {
  let itemsArray = JSON.parse(localStorage.getItem('itemsArray')) || [];
  return itemsArray;
}




const itemFactory = (item) => {
  let newItem = document.createElement('div');
  newItem.className = 'item-wrapper';
  newItem.id = item.id;
  newItem.innerHTML = `
    <div class='item-details'>
      <p class='item-detail-title'>${item.title}</p>
      <img class='item-detail-img' src='${item.imageUrl}' alt='picture of headphones'>
      <p class='item-detail-desc'><span>Description:</span>${item.description}</p>
      <p class='item-detail-price'><span>Price: </span><i class='icon ion-social-usd'></i>${item.price}</p>
    </div>
    <div class='item-button'>
      <input class='btn-add-to-cart' type='button' value='Add to Cart' />
    </div>
  `;
  return newItem;
}


const getInventoryItems = () => {
  fetch('/api/v1/items')
    .then(result => result.json())
    .then(items => {
      // add to local storage
      // addToLocal(items);

      $('.inventory-wrapper').children().remove();

      // refactor to use fragments or the like
      items.forEach(item => {
        $('.inventory-wrapper').append(itemFactory(item))
      })


    })
    .catch(error => { console.log('Error getting items:', error) })
}


const getItems = () => {

  const dropDownList = $('#select-item-list');
  let itemsArray = pullFromLocal();
  if (itemsArray.length === 0) {
    //no items in local, so fetch

    fetch('/api/v1/items')
      .then(result => result.json())
      .then(items => {
        // add to local storage
        addToLocal(items);

        dropDownList.children().remove();
        items.forEach(item => {
          dropDownList.append($('<option>', {
            value: item.title,
            text: item.title
          }));
        });

      });
    } else {
    dropDownList.children().remove();
    itemsArray.forEach(item => {
      dropDownList.append($('<option>', {
        value: item.title,
        text: item.title
      }));
    });
    }

}


const openHistory = () => {
  document.getElementById('history-pane').style.width = '650px';
}

const closeHistory = () => {
  document.getElementById('history-pane').style.width = '0';
}

const openCart = () => {
  document.getElementById('cart-pane').style.width = '650px';
}

const closeCart = () => {
  document.getElementById('cart-pane').style.width = '0';
}


const testme = (e) => {
  console.log('E:', e.target);
  
}


// Event Listeners

$('#btn-test').click(testme);