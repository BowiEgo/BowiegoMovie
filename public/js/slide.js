$(function(){

    var slideItem = $('.slide-item');
    var slideBox = $('.slide-box');
    var slideContent = $('.slide-content');
    var slideDot = $('.slide-dot');
    
    var len = slideItem.length;
    var wid = slideItem.width();
    var n = Math.ceil(len/5);
    var marginLeft = parseInt(slideItem.css('marginLeft'));
    slideBox.css('width', (wid+marginLeft*2)*5);
    var widBox = slideBox.width();
    var emptyNum = n*5 - len;
    slideContent.css('width', (wid+marginLeft*2)*(len+5+emptyNum));

    for(var i = 0; i < emptyNum; i++) {
        var empty = $('<li class="slide-item"><div class="thumbnail"><a></a><div class="caption"><h3></h3></div></div></li>');
        slideContent.append(empty);
    }

    for(var i = 0; i < 5; i++) {
        var clone = slideItem.eq(i).clone();
        slideContent.append(clone);
    }

    var step = 0;

    for(var i = 0; i < n; i++) {
        var dot = $('<span></span>');
        if(i == 0) {
            dot.addClass('active');
        }
        slideDot.append(dot);
    }

    var dotAll = $('.slide-dot span');

    function dotToggle(step) {
        console.log(step);
        var dot = dotAll.eq(step);
        console.log(dot);
        if(!dot.hasClass('active')) {
            dotAll.removeClass('active');
            dot.addClass('active');
        }
    }

    dotAll.click(function() {
        if(!slideContent.is(':animated')) {
            step = dotAll.index($(this));
            dotToggle(step);
            slideContent.animate({left: -widBox*step}, 500);
        }
    })

    //轮播图右键
    $('.screen .btn-r').click(function() {
        if(!slideContent.is(':animated')) {
            step ++;
            console.log(step);
            if(step == n+1) {
                slideContent.css({left: 0});
                step = 1;
            }

            if(step == n) {
                dotToggle(0);
            }
            else {
                dotToggle(step);
            }
            slideContent.animate({left: -widBox*step}, 500);
        }
    });

    //轮播图左键
    $('.screen .btn-l').click(function() {
        if(!slideContent.is(':animated')) {
            step --;
            console.log(step);
            if(step == -1) {
                slideContent.css({left: -widBox*n});
                step = n-1;
            }

            if(step == -1) {
                dotToggle(n-1);
            }
            else {
                dotToggle(step);
            }
            slideContent.animate({left: -widBox*step}, 500);
        }
    });



})