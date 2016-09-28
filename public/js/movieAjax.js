
$(function() {
    $.ajax({
        url: 'https://api.douban.com/v2/movie/subject/26284595',
        cache: true,
        type: 'get',
        dataType: 'jsonp',
        crossDomain: true,
        jsonp: 'callback',
        success: function(data) {
            console.log(data.photos);
        }
    })
});