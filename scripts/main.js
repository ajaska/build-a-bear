$(document).ready(function() {
  // $('#test').dropdown();
  $('#add-class').click(function() {
    $('.add-course-confirm').modal('show');
  })
  $('#add-close').click(function() {
    $('.add-course-confirm').modal('hide');
  })
  $('#drop-class').click(function() {
    $('.drop-course-confirm').modal('show');
  })
  $('#drop-close').click(function() {
    $('.drop-course-confirm').modal('hide');
  })
});
