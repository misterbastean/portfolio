// When a card is clicked
$('.card-link').click(function(e) {
  // Update content in the description div
  var data = '';
  console.log(e.target.innerText);
  switch (e.target.innerText) {
    case 'Teachers':
      data = "The teachers link was clicked.";
      break;
    case 'Leaders':
      data = "The leaders link was clicked";
      break;
    case 'Boot Camp':
      data = "The boot camp link was clicked";
      break;
  }
  $('#description > p').text(data);

  // Highlight the selected card and fade out the other two
  $('.card-img-top').animate({
    opacity: 0.3
  }, 20)
  $(this).find('img').animate({
    opacity: 1
  }, 1);

  // Scroll to description div
  $('html, body').animate({
    scrollTop: $('#description').offset().top
  }, 500);
});
