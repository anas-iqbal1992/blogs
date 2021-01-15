(function ($) {
    "use strict";

    var input = $('.validate-input');

    $('.validate-form').on('submit',function(){
        var check = true;
        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                // showValidate(input[i]);
                check=false;
            }
        }
        return check;
    });
    function showValidate(input,msg) {
        $(input).siblings('.text-danger').html(msg);
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).removeClass('alert-validate');
    }
    $('.validate-input').keypress(function(){
        $(this).siblings('.text-danger').html('');
    });
    $('.select-change').change(function(){
        $(this).siblings('.text-danger').html('');
    });
    $('.validate-form').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });
    function validate (input) {
        if($(input).attr('name') == 'email') {
            if(validator.isEmpty($(input).val())){
                var msg = 'Email cannot be blank';
                showValidate(input,msg);
                return false;
            }
            if(!validator.isEmail($(input).val().trim())){
                var msg = 'Invalid Email';
                showValidate(input,msg);
                return false;
            }
        }
        else if($(input).attr('name') == 'phone')   {
            if(validator.isEmpty($(input).val())){
                var msg = 'Phone cannot be blank';
                showValidate(input,msg);
                return false;
            }
            if(!validator.isNumeric($(input).val().trim())){
                var msg = 'Invalid phone number';
                showValidate(input,msg);
                return false;
            }
        }else{
            if(validator.isEmpty($(input).val())){
                var msg = `${$(input).attr('name')} cannot be blank`;
                showValidate(input,msg);
                return false;
            }
        }
    }
})(jQuery);