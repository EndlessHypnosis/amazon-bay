$(document).ready(function () {
  // do initializing stuff here
  getItems();
});




const addToLocal = (arrayToSave) => {
  let stringifiedArray = JSON.stringify(arrayToSave);
  localStorage.setItem('itemsArray', stringifiedArray);
}

const pullFromLocal = () => {
  let itemsArray = JSON.parse(localStorage.getItem('itemsArray')) || [];
  return itemsArray;
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



const testme = (e) => {
  console.log('E:', e.target);
  
}


// Event Listeners

$('#btn-test').on('click', testme);