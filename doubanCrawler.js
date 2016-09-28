var http = require('http');
var https = require('https');
var fs = require('fs');
var request = require('request');
var path = require('path');
var cheerio = require('cheerio');   //node.js中的jQuery，用来获取dom
var async = require('async');
var download = require('download');

var _ = require('underscore');
var mongoose = require('mongoose');
var ScreenMovie = require('./app/schemas/screen');
var MovieDetail = require('./app/schemas/movie_detail');
var ReviewIndex = require('./app/schemas/review_index');
var ReviewDetail = require('./app/schemas/review_detail');
var Comment = require('./app/schemas/comment');
var Photo = require('./app/schemas/photo');

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

//将数据存储到本地mongodb数据库中对应的collection
function uploadData(populateId, data, db, callback) {
    console.log(populateId);
    console.log(db);
    var _data;
    var doubanID = data.doubanID;
    console.log('uploadData doubanID: ' + doubanID);
    var subject;
    var finished = true;
    switch(db) {
        case 'screenMovie':
            subject = ScreenMovie;
            console.log(subject);
            setData(doubanID, subject, _data, data, callback);
        break;
        case 'movieDetail':
            subject = MovieDetail;
            setData(doubanID, subject, _data, data, callback);
        break;
        case 'reviewIndex':
            subject = ReviewIndex;
            setData(doubanID, subject, _data, data, callback);
        break;
        case 'photo':
            Photo.findOne({url: data}, function(err, result) {
                if(!result) {
                    _data = new Photo({
                        movie: populateId,
                        url: data,
                    })
                    _data.save(function(err, e) {
                        if(err) {
                            console.log(err);
                        }
                        console.log(db + e._id +' saved!!!!!!!!!!!!!');
                        return callback(finished);
                    })
                } else {
                    Photo.update({_id: result._id}, {url: data, movie: populateId, meta: {updateAt: Date.now()}},function(err) {
                            console.log(db + result._id + ' updated');
                            if(err) {
                                console.log(err);
                            }
                            return callback(finished);
                        }
                    );
                }
            });
        break;
        case 'reviewDetail':
            ReviewDetail.find({doubanID: doubanID}, function(err, result) {
                if(result[0] == undefined) {
                    _data = new ReviewDetail({
                        doubanID: doubanID,
                        movie: populateId,
                        data: data,
                    })
                    _data.save(function(err, e) {
                        if(err) {
                            console.log(err);
                        }
                        console.log(db + e._id +' saved!!!!!!!!!!!!!');
                        return callback(finished);
                    })
                } else {
                    ReviewDetail.update({doubanID: doubanID}, {data: data, movie: populateId, meta: {updateAt: Date.now()}},function(err) {
                            console.log(db + result[0]._id + ' updated');
                            if(err) {
                                console.log(err);
                            }
                            return callback(finished);
                        }
                    );
                }
            });
        break;
        default:
    }
    function setData(doubanID, subject, _data, data, callback) {
        if(doubanID !== undefined) {
            subject.find({doubanID: doubanID}, function(err, result) {
                if(result[0] == undefined) {
                    _data = new subject({
                        doubanID: doubanID,
                        data: data,
                    })
                    _data.save(function(err, result) {
                        console.log(db + result._id +' saved!!!!!!!!!!!!!');
                        return callback(finished);
                        if(err) {
                            console.log(err);
                        }
                    })
                } else {
                    subject.update({doubanID: doubanID}, {data: data, meta: {updateAt: Date.now()}},function(err) {
                            console.log(db + result[0]._id + ' updated');
                            if(err) {
                                console.log(err);
                            }
                            return callback(finished);
                        }
                    );
                }
            })
        } else {
            subject.find({}, function(err, result) {
                console.log(data);
                if(result[0] == undefined) {
                    _data = new subject({
                        data: data,
                    })
                    _data.save(function(err, result) {
                        console.log(db + result._id +' saved');
                        if(err) {
                            console.log(err);
                        }
                        return callback(finished);
                    })
                } else {
                    subject.update({_id: result[0]._id},{data: data, meta: {updateAt: Date.now()}},function(err) {
                            console.log(db + result[0]._id + ' updated');
                            if(err) {
                                console.log(err);
                            }
                            return callback(finished);
                        }
                    );
                }
            })
        }
    }
}

exports.crawler =  function(arg1, url, db, callback) {

    var URL = url;
    var path = url.replace('https://movie.douban.com','');
    var finished = true;
    //创建https get请求
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!![url]: ' + url);
    const accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
    const acceptLanguage = 'zh-CN,zh;q=0.8,ja;q=0.6,en;q=0.4';
    const cacheControl = 'max-age=0';
    const connection = 'keep-alive';
    var cookie = 'll="118162"; bid=7eqa68vy30A; ct=y; ps=y; ap=1; ue="295030485@qq.com"; push_noty_num=0; push_doumail_num=0; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1475064374%2C%22https%3A%2F%2Fwww.douban.com%2Fmisc%2Fsorry%3Foriginal-url%3Dhttps%253A%252F%252Fmovie.douban.com%252F%22%5D; _vwo_uuid_v2=79FABE9D85D238F8191972360AEAD12B|244c6b4d5884d9b5327fb33b5aa7e57b; __utmt=1; _pk_id.100001.4cf6=10fca3bc3dd51ec4.1473144377.53.1475067849.1475062497.; _pk_ses.100001.4cf6=*; __utma=223695111.36834007.1473144377.1475062497.1475064374.53; __utmb=223695111.0.10.1475064374; __utmc=223695111; __utmz=223695111.1475064374.53.24.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/misc/sorry; __utma=30149280.1470801849.1473144377.1475062496.1475064368.53; __utmb=30149280.6.10.1475064368; __utmc=30149280; __utmz=30149280.1475051337.51.9.utmcsr=movie.douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmv=30149280.4262';
    const host = 'movie.douban.com';
    const referer = 'https://www.douban.com/misc/sorry?original-url=https%3A%2F%2Fwww.douban.com%2Flogin%3Fsource%3Dmovie';
    const upgradeInsecureRequests = 1;
    const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2859.0 Safari/537.36';

    var options = {
        hostname: 'movie.douban.com',
        port: 443,
        path: path,
        method: 'GET',
        headers: {
            'Accept': accept,
            // 'Accept-Encoding': 'gzip, deflate, sdch, br',  这个东西不能有
            'Accept-Language': acceptLanguage,
            'Cache-Control': cacheControl,
            'Connection': connection,
            'Cookie': cookie,
            'Host': host,
            'Referer': referer,
            'Upgrade-Insecure-Requests': upgradeInsecureRequests,
            'User-Agent': userAgent,
        }
    }
    
    var req = https.request(options, function(res) {

        // console.log('Status: ' + res.statusCode);
        // console.log('headers: ' + JSON.stringify(res.headers));

        var html = '';
        //设置编码
        res.setEncoding('utf-8');

        //抓取页面内容
        res.on('data', function(data) {
            html += data;
            // console.log(html);
        });

        res.on('end', function() {

            //使用cheerio加载抓取到的HTML代码，然后就能使用jQuery的方法了
            var $ = cheerio.load(html);

            if($('center h1').text() == '403 Forbidden'){
                console.log(db + ' 403 Forbidden');
                return;
            }

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

                    if(screeningArr[0]) {
                        uploadData('', screeningArr, db, callback);
                    } else {
                        console.log('screenArr 为空！');
                        console.log(html);
                    }

                break;

                //抓取首页影评概要信息
                case 'reviewIndex':
                    var reviews = $('.review');
                    var reviewArr = [];

                    for(var i = 0; i < reviews.length; i++) {
                        var temp = reviews.eq(i);
                        var doubanID = temp.find('.review-bd h3 a').attr('href').split('/')[4];
                        var title = temp.find('.review-bd h3 a').text();
                        var url = temp.find('.review-bd h3 a').attr('href');
                        var author = temp.find('.review-meta a').eq(0).text();
                        var rating = temp.find('.review-meta span').attr('class');
                        var brief = temp.find('.review-content').text().replace('(全文)','');
                        var movieTitle = temp.find('.review-meta a').eq(1).text();
                        var movieUrl = temp.find('.review-hd a').attr('href');
                        var reviewIndex = {
                            doubanID: doubanID,
                            title: title,
                            url: url,
                            author: author,
                            rating: rating,
                            brief: brief,
                            movieTitle: movieTitle,
                            movieUrl: movieUrl,
                            movieDoubanID: movieUrl.split('/')[4],
                            moviePoster: '',
                            options: {
                                hostname: 'movie.douban.com',
                                port: 443,
                                path: movieUrl.replace('https://movie.douban.com',''),
                                method: 'GET',
                                headers: {
                                    'Accept': accept,
                                    'Accept-Language': acceptLanguage,
                                    'Cache-Control': cacheControl,
                                    'Connection': connection,
                                    'Cookie': cookie,
                                    'Host': host,
                                    'Referer': referer,
                                    'Upgrade-Insecure-Requests': upgradeInsecureRequests,
                                    'User-Agent': userAgent,
                                }
                            }
                        };
                        reviewArr.push(reviewIndex);
                    }

                    var reviewArrChange = []

                    //抓取首页每条影评海报
                    function reviewArrCrawler(reviewArr) {
                        reviewArr.forEach(function(item) {
                            var req = https.request(item.options, function(res) {
                                var html;
                                res.setEncoding('utf-8');
                                res.on('data', function(data) {
                                    html += data;
                                });

                                res.on('end', function() {
                                    var $ = cheerio.load(html);
                                    var poster = $('#mainpic a img').attr('src');
                                    if(poster != undefined) {
                                        item.moviePoster = poster;
                                        reviewArrChange.push(item);
                                        uploadData('', reviewArrChange, db, callback);
                                    } else {
                                        console.log("又403了大哥！！");
                                        return callback();
                                    }
                                })
                            });
                            req.end();
                            req.on('error', function(err) {
                                console.log(err);
                            })
                        });
                    }
                    reviewArrCrawler(reviewArr);
                break;

                //抓取电影详情页信息
                case 'movieDetail':
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
                    var similar =$('#recommendations .recommendations-bd dl');
                    var similarArr = [];
                    for(var i = 0; i < similar.length; i++) {
                        var doubanUrl = similar.eq(i).find('a').attr('href');
                        var poster = similar.eq(i).find('img').attr('src');
                        var title = similar.eq(i).find('img').attr('alt');
                        var doubanID = parseInt(String(doubanUrl).split('/')[4]);
                        var similarMovie = {
                            doubanUrl: doubanUrl,
                            poster: poster,
                            title: title,
                            doubanID: doubanID,
                        };
                        similarArr.push(similarMovie);
                    }

                    var reviewArr = [];
                    var reviews = $('#review_section .mod-bd .review');
                    for(var i = 0; i < reviews.length; i++) {
                        var review = {
                            reviewUrl : reviews.eq(i).find('.review-hd h3').children('a').eq(1).attr('href'),
                            reviewAvatar : reviews.eq(i).find('.review-hd-avatar img').attr('src'),
                            reviewTitle : reviews.eq(i).find('.review-hd h3').children('a').eq(1).text(),
                            reviewAuthor : reviews.eq(i).find('.review-hd-info a').text(),
                            reviewTime : reviews.eq(i).find('.review-hd-info').text().split('\n')[2].replace('                ',''),
                            reviewRating : reviews.eq(i).find('.review-hd-info span').attr('class'),
                            reviewBrief : reviews.eq(i).find('.review-bd .review-short span').eq(0).text(),
                        };
                        reviewArr.push(review);
                    }

                    var doubanID = parseInt(String(URL).split('/')[4]);
                    console.log(titleCN);
                    if(titleCN) {
                        var movieDetail = {
                            doubanID: doubanID,
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
                            synopsis: $('.related-info .indent span').text(),
                            similar: similarArr,
                            reviews: reviewArr,
                            allPhotoUrl: 'https://movie.douban.com/subject/'+ doubanID +'/all_photos',
                            photosUrl: [],
                        };

                        uploadData('', movieDetail, db, callback);
                    } else {
                        console.log('movieDetail 为空！');
                        // return callback();
                    }

                break;

                case 'reviewDetail':
                    var movieId = arg1;
                    var doubanID = URL.replace('https://movie.douban.com/review/','').replace('/','');
                    var title = $('#content h1').eq(1).find('span').text();
                    var authorAvatar = $('.author-avatar img').attr('src');
                    var authorName = $('.main-hd a').eq(0).find('span').text();
                    var movieTitle = $('.main-hd a').eq(1).text();
                    var rating = $('.main-hd span').eq(1).attr('class').split(' ')[0];
                    var time = $('.main-hd p').text();
                    var content = $('#link-report div').eq(0).text();
                    var comments = $('#comments .comment-item');
                    var commentArr = [];
                    comments.each(function() {
                        var commentAvatar = $(this).find('.avatar a img').attr('src');
                        var commentAuthor = $(this).find('.report-comment .header a').text();
                        var commentTime = $(this).find('.report-comment .header span').text();
                        var commentContent = $(this).find('.comment-text').text();
                        var comment = {
                            avatar: commentAvatar,
                            author: commentAuthor,
                            content: commentContent,
                            time: commentTime,
                        }
                        commentArr.push(comment);
                    });
                    var reviewDetail = {
                        doubanID: doubanID,
                        title: title,
                        authorAvatar: authorAvatar,
                        authorName: authorName,
                        movieTitle: movieTitle,
                        rating: rating,
                        time: time,
                        content: content,
                        comments: [],
                        commentsDouban: commentArr,
                    }

                    uploadData(movieId, reviewDetail, db ,callback);
                break;

                case 'photo':
                    var req = https.request(options, function(res) {
                        var html;
                        res.setEncoding('utf-8');
                        res.on('data', function(data) {
                            html += data;
                        });

                        res.on('end', function() {
                            var $ = cheerio.load(html);
                            var photo = $('.photo-show .photo-wp .mainphoto img').attr('src');
                            uploadData(arg1, photo, 'photo', callback);
                        });
                    });
                    req.end();
                    req.on('error', function(err) {
                        console.log(err);
                    });
                break;

                case 'photoDownload':
                    download(URL, './public/img/photo').then(() => {
                        console.log(URL+'  download!!!!!');
                        callback();
                    });
                break;
                
                default: return;
            }

        });
    });
    req.end();
    req.on('error', (e) => {
      console.error(e);
    });
}


