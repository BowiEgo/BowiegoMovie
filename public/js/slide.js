

function hover(hoverBlock, slideContent, widBox, step) {
    for(var i = 0; i < hoverBlock.length; i++) {
        hoverBlock.eq(i).hover(function() {
            console.log($(this));
            var idx = hoverBlock.index($(this));

            if(!slideContent.is(':animated')) {
                hoverBlock.each(function() {
                    $(this).removeClass('active');
                })
                $(this).addClass('active');
                step = idx;
                slideContent.animate({left: -widBox*step}, 300);
            }
        },
        function() {
            return;
        });
    }   
}

function addDot(emptyNum, itemNum, slideItem, n, slideContent, slideDot) {
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
}


//轮播图功能，在.slide元素的alt属性中接收轮播页面子元素的数量

$(function(){
    var slide = $('.slide');
    
    for(var i = 0; i < slide.length; i++) {
        var slideBox = slide.eq(i).find('.slide-box');
        var slideContent = slide.eq(i).find('.slide-content');
        slideContent.css('position', 'relative');
        if(!slideContent.hasClass('clearfix')) {
            slideContent.addClass('clearfix');
        }
        var slideItem = slide.eq(i).find('.slide-item');
        var slideDot = slide.eq(i).find('.slide-dot');
        var btnL = slide.eq(i).find('.btn-l');
        var btnR = slide.eq(i).find('.btn-r');
        var hoverBlock = slide.eq(i).find('.hover-block');
        var itemNum = parseInt(slide.attr('alt'));

        var len = slideItem.length;
        var wid = slideItem.width();
        var n = Math.ceil(len/itemNum);
        var marginLeft = parseInt(slideItem.css('marginLeft'));
        slideBox.css('width', (wid+marginLeft*2)*itemNum);
        slideBox.css('overflow', 'hidden');
        slideItem.css('float', 'left');
        var widBox = slideBox.width();
        var emptyNum = n*itemNum - len;
        slideContent.css('width', (wid+marginLeft*2)*(len+itemNum+emptyNum));
        var step = 0;

        if(slideDot) {
            addDot(emptyNum, itemNum, slideItem, n, slideContent, slideDot);
        }

        var dotAll = slideDot.find('span');
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

        if(hoverBlock) {
            hover(hoverBlock, slideContent, widBox, step);
        }

        if(btnR) {
            //轮播图右键
            btnR.click(function() {
                if(!slideContent.is(':animated')) {
                    step ++;
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
        }

        if(btnL) {
            //轮播图左键
            btnL.click(function() {
                if(!slideContent.is(':animated')) {
                    step --;
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
    }
});






