$(document).ready(function () {
  $('.file-upload').on('click', function(e) {
    e.preventDefault();
    $(`#image`).trigger('click');
  });
  $('.visuallyhidden').on('change',function(){
    var size = this.files[0].size;
    if (size > 2000000) {
      return false;
    }
    var fileName = this.files[0].name.split(".");
    var ext = fileName[fileName.length - 1];
    var imgExt = new Array("jpeg", "png", "jpg");
    if (imgExt.indexOf(ext) != -1) {
      readURL(this);
    }
  });
});
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $(`#pre_image`).attr("src", e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
}