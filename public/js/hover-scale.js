$(function() {
    var hoverElement = $('.hover-element');
    for(var i = 0; i < hoverElement.length; i++) {
        hoverElement.eq(i).hover(function() {
            $(this).parent().parent().siblings().removeClass('active');
            $(this).parent().parent().addClass('active');
        },function() {
            return;
        });
    }
});