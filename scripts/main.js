$(function(){
    $('.main').PageSlide();

    $('#media').click(function() {
        if ($(this).hasClass('rotate')) {
            $('#audio').get(0).pause();
            $(this).removeClass('rotate');
        } else {
            $('#audio').get(0).play();
            $(this).addClass('rotate');
        }
    });
});