$(function() {
    var rating = $('.rating');
    rating.each(function() {
        var rank = Math.round($(this).find('p').text());
        var target = $(this).find('i');
        var n = Math.ceil(rank/2);
        starLight(target, n);
    })
    

    function starLight(target, n) {
        for(var i = 0; i < n; i++) {
            target.eq(i).addClass('light');
        }
    }
})