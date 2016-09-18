//轮播图功能，在.slide元素的alt属性中接收轮播页面子元素的数量
$(function(){
    var slide = $('.slide');
    console.log(slide);
    // for(var i = 0; i < slide.length; i++) {
    //     console.log(i);
    //     console.log(slide.eq(i));

    // }
    
    for(var i = 0; i < slide.length; i++) {
        console.log("i= " + i);
        console.log(slide.eq(i));
        var slideBox = slide.eq(i).find('.slide-box');
        var slideContent = slide.eq(i).find('.slide-content');
        var slideItem = slide.eq(i).find('.slide-item');
        var slideDot = slide.eq(i).find('.slide-dot');
        var btnL = slide.eq(i).find('.btn-l');
        var btnR = slide.eq(i).find('.btn-r');
        var hoverBlock = slide.eq(i).find('.hover-block');
        var itemNum = parseInt(slide.attr('alt'));
        console.log(itemNum);
        console.log(slideBox);
        console.log(slideContent);
        console.log(slideItem);
        console.log(slideDot);
        console.log(btnL);
        console.log(btnR);
        console.log(hoverBlock);

        var len = slideItem.length;
        var wid = slideItem.width();
        var n = Math.ceil(len/itemNum);
        var marginLeft = parseInt(slideItem.css('marginLeft'));
        slideBox.css('width', (wid+marginLeft*2)*itemNum);
        slideBox.css('overflow', 'hidden');
        var widBox = slideBox.width();
        var emptyNum = n*itemNum - len;
        slideContent.css('width', (wid+marginLeft*2)*(len+itemNum+emptyNum));
        var step = 0;
        console.log(len);
        console.log(wid);
        console.log(n);
        (function() {
            for(var i = 0; i < emptyNum; i++) {
                var empty = $('<li class="slide-item"><div class="thumbnail"><a></a><div class="caption"><h3></h3></div></div></li>');
                slideContent.append(empty);
            }

            for(var i = 0; i < itemNum; i++) {
                var clone = slideItem.eq(i).clone();
                slideContent.append(clone);
            }

            for(var i = 0; i < n; i++) {
                var dot = $('<span></span>');
                if(i == 0) {
                    dot.addClass('active');
                }
                slideDot.append(dot);
            }
        })();


        var dotAll = slideDot.find('span');
        console.log(dotAll);
        if (dotAll) {
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
        }


        (function() {
            console.log(hoverBlock);
            console.log(slideContent);
            for(var i = 0; i < hoverBlock.length; i++) {
                console.log(i);

                hoverBlock.eq(i).hover(function() {
                    console.log(1111);
                    var idx = hoverBlock.index($(this));
                    console.log(slideContent);

                    if(!slideContent.is(':animated')) {
                        hoverBlock.each(function() {
                            $(this).removeClass('active');
                        })
                        $(this).addClass('active');
                        // step = $(this).index();
                        step = idx;
                        console.log(step);
                        slideContent.animate({left: -widBox*step}, 300);
                    }
                },
                function() {
                    return;
                });
            }   
        })();


        //轮播图右键
        btnR.click(function() {
            // if(!slideContent.is(':animated')) {
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
            // }
        });

        //轮播图左键
        btnL.click(function() {
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
    }
});






