$(document).ready(function () {
  // do initializing stuff here
});


const testme = (e) => {
  console.log('E:', e.target);
  
}


// Event Listeners

$('#btn-test').on('click', testme);