'use strict';
var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');   //node.js中的jQuery，用来获取dom
var _ = require('underscore');
var mongoose = require('mongoose');
var ScreenMovie = require('./schemas/screen');
var MovieDetail = require('./schemas/movie_detail');

Array.prototype.remove=function(dx)  
{  
    if(isNaN(dx)||dx>this.length){return false;}  
    for(var i=0,n=0;i<this.length;i++)  
    {  
        if(this[i]!=this[dx])  
        {  
            this[n++]=this[i]  
        }  
    }  
    this.length-=1  
}  
   
//在数组中获取指定值的元素索引  
Array.prototype.getIndexByValue= function(value)  
{  
    var index = -1;  
    for (var i = 0; i < this.length; i++)  
    {  
        if (this[i] == value)  
        {  
            index = i;  
            break;  
        }  
    }  
    return index;  
} 

//将数据存储到本地mongodb数据库中
function uploadData(data, db, callback) {    
    var _data;

    switch(db) {
        case 'screenMovie':
            ScreenMovie.find({}, function(err, screenMovie) {
                if(screenMovie[0] == undefined) {
                    _data = new ScreenMovie({
                        array: data, 
                    });
                    _data.save(function(err, screenMovie) {
                        console.log(screenMovie._id + '   saved at screenmovies in bowMovie');
                        return callback();
                        if(err) {
                            console.log(err);
                        }
                    })
                } else {
                    ScreenMovie.update({_id: screenMovie[0]._id},{array: data, meta: {updateAt: Date.now()}},function(err) {
                        console.log(screenMovie[0]._id + '  screenMovie updated');
                        return callback();
                        if(err) {
                            console.log(err);
                        }
                    });
                }
            });
        break;

        case 'movieDetail':
            MovieDetail.find({}, function(err, movieDetail) {
                if(movieDetail[0] == undefined) {
                    _data = new MovieDetail({
                        data: data,
                    });
                    _data.save(function(err, movieDetail) {
                        console.log(movieDetail._id + '   saved at moviedetails in bowMovie');
                        return callback();
                        if(err) {
                            console.log(err);
                        }
                    })
                } else {
                    MovieDetail.update({_id: movieDetail[0]._id},{data: data, meta: {updateAt: Date.now()}},function(err) {
                        console.log(movieDetail[0]._id + '  movieDetail updated');
                        return callback();
                        if(err) {
                            console.log(err);
                        }
                    });
                }
            })
        break;

        // case 'photo':

        // break;

        default:
    }
};

exports.crawler =  function(url, db, callback) {

    console.log(url);
    //创建https get请求
    https.get(url, function(res) {
        var html = '';

        //设置编码
        res.setEncoding('utf-8');

        //抓取页面内容
        res.on('data', function(data) {
            html += data;
        });

        res.on('end', function() {

            //使用cheerio加载抓取到的HTML代码，然后就能使用jQuery的方法了
            var $ = cheerio.load(html);

            switch(db) {
                //抓取正在热映影片信息
                case 'screenMovie':
                    var screeningArr = [];

                    var screeningMovie = {
                        title: '',
                        poster: '',
                        rating: '',
                        moreurl: '',
                    };

                    $('.ui-slide-item').each(function() {

                        var moreurl = $('.poster a', this).attr('href');

                        var screeningMovie = {
                            title: $('.title', this).find('a').text(),
                            poster: $('.poster', this).find('img').attr('src'),
                            rating: $('.subject-rate', this).text(),
                            moreurl: moreurl,
                            doubanID: parseInt(String(moreurl).split('/')[4]),
                        };
                        if(screeningMovie.title) {
                            console.log(screeningMovie.title);
                            screeningArr.push(screeningMovie);
                        }
                    });

                    uploadData(screeningArr, db, callback);
                break;
                //抓取电影详情页信息
                case 'movieDetail':
                    var movieArr = [];
                    var info = $('#info').children('span');
                    var ratingPer = $('.rating_per');

                    function getInfo(n) {
                        var arr = [];
                        info.eq(n).find('.attrs a').each(function() {
                            arr.push($(this).text());
                        })
                        return arr;
                    };

                    function getGenre() {
                        var arr = [];
                        $('span[property="v:genre"]').each(function() {
                            arr.push($(this).text());
                        })
                        return arr;
                    }

                    var infoText = $('#info').text();
                    var textArr = [];
                    var infoArr = [];
                    textArr = infoText.split('\n');
                    while(textArr.getIndexByValue('') !== -1) {
                        textArr.remove(textArr.getIndexByValue(''));
                    }
                    for(var i = 0; i < textArr.length; i++) {
                        infoArr.push(String(textArr[i]).replace('        ',''))
                    }

                    var ratingBetter = [];
                    $('.rating_betterthan a').each(function() {
                        ratingBetter.push($(this).text());
                    })

                    var titleCN = $('#comments-section .mod-hd h2 i').text().replace('的短评','');

                    var movieDetail = {
                        titleCN: titleCN,
                        titleEN: $('#content span').eq(0).text().replace(titleCN + ' ',''),
                        year: $('#content span').eq(1).text(),
                        poster: $('.nbgnbg img').attr('src'),
                        director: getInfo(0),
                        writer: getInfo(1),
                        casts: getInfo(2),
                        type: getGenre(),
                        website: $('#info a[rel="nofollow"]').eq(0).text(),
                        country: infoArr[5],
                        language: infoArr[6],
                        release: infoArr[7],
                        timeLength: infoArr[8],
                        alternateName: infoArr[9],
                        imdb: $('#info a[rel="nofollow"]').eq(1).text(),
                        rating: $('.ll.rating_num').text(),
                        votes: $('.rating_people span').text(),
                        ratingPer: {
                            five: ratingPer.eq(0).text(),
                            four: ratingPer.eq(1).text(),
                            three: ratingPer.eq(2).text(),
                            two: ratingPer.eq(3).text(),
                            one: ratingPer.eq(4).text(),
                        },
                        ratingBetter: ratingBetter,
                    };
                    uploadData(movieDetail, db, callback);
                break;

                case 'poster':
                    url = $('.poster-col4 .cover a').attr('href');
                    https.get(url, function(res) {
                        html = '';
                        res.setEncoding('utf-8');

                        res.on('data', function(data) {
                            html += data;
                        });

                        res.on('end', function() {
                            $ = cheerio.load(html);

                            var imgUrl = $('.photo-wp .mainphoto img').attr('src');

                            https.get(imgUrl, function(res) {
                                var imgData = '';

                                res.setEncoding('binary');

                                res.on('data', function(chunk) {
                                    imgData += chunk;
                                });

                                res.on('end', function() {
                                    fs.writeFile('./public/img/poster/main.jpg', imgData, 'binary', function(err) {
                                        if(err) {
                                            console.log(err);
                                            console.log('download poster fail');
                                        }
                                        else {
                                            console.log('download poster success');
                                        }
                                        return callback();
                                    });
                                });
                            });
                        });
                    });

                break;
            }

        });
    })
    .on('error', function() {
        console.log('获取电影数据出错！');
    });
}
// module.exports = doubanCrawler;



