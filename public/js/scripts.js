$(document).ready(function () {
  // do initializing stuff here
  getItems();
});



const getItems = () => {
  const dropDownList = $('#select-item-list');

  fetch('/api/v1/items')
    .then(result => result.json())
    .then(items => {
      dropDownList.children().remove();

      items.forEach(item => {
        dropDownList.append($('<option>', {
          value: item.title,
          text: item.title
        }));
      });
    });
}



const testme = (e) => {
  console.log('E:', e.target);
  
}


// Event Listeners

$('#btn-test').on('click', testme);