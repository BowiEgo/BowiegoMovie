var http = require('http');
var https = require('https');
var fs = require('fs');
var request = require('request');
var path = require('path');
var cheerio = require('cheerio');   //node.js中的jQuery，用来获取dom

var _ = require('underscore');
var mongoose = require('mongoose');

var DoubanCrawler = require('./doubanCrawler');
var Screen = require('./app/schemas/screen');
var MovieDetail = require('./app/schemas/movie_detail');
var ReviewIndex = require('./app/schemas/review_index');
var ReviewDetail = require('./app/schemas/review_detail');
var Photo = require('./app/schemas/photo');

mongoose.connect('mongodb://localhost/bowMovie');
var db = mongoose.connection;
db.on('error', console.error.bind(console, '连接错误：'));
db.once('open', function(callback) {
    console.log(' 连接成功！');
})

// DoubanCrawler.crawler('', 'https://movie.douban.com/', 'screenMovie', function(finished) {
//     if(finished) {
        // Screen.findOne({}, function(err, screenData) {
        //     if(err) {
        //         console.log(err);
        //     }
        //     var screen = screenData.data;

        //     screen.forEach(function(item, i) {
        //         DoubanCrawler.crawler('', 'https://movie.douban.com/subject/' + item.doubanID + '/?from=showing', 'movieDetail', function(finished) {
        //             if(finished) {
                        
        //             }
        //         });
        //     })
            
        // });
//     }
// });

// DoubanCrawler.crawler('', 'https://movie.douban.com/', 'reviewIndex', function(finished) {
    // if(finished) {
        // ReviewIndex.findOne({}, function(err, result) {
        //     if(err) {
        //         console.log(err);
        //     }
        //     if(result.data) {
        //         var reviewIndex = result.data;

        //         reviewIndex.forEach(function(item) {
        //             DoubanCrawler.crawler('', item.movieUrl, 'movieDetail', function(finished) {
        //             });
        //         });
                // setTimeout(function(){

                //     reviewIndex.forEach(function(item) {
                //         MovieDetail.findOne({doubanID: item.movieDoubanID}, function(err, movieDetail) {
                //             if(err) {
                //                 console.log(err);
                //             }
                //             DoubanCrawler.crawler(movieDetail._id, item.url, 'reviewDetail', function(finished) {
                //                 console.log(movieDetail._id);
                //             });
                //         });
                //     });
                // }, 5000);
            // }

        // });
    // }
// });

// MovieDetail.find({}, function(err, movieDetail) {
//     if(err) {
//         console.log(err);
//     }
//     var movie = movieDetail;
//     movie.forEach(function(item) {
//         item.data.reviews.forEach(function(review) {
//             DoubanCrawler.crawler(item._id, review.reviewUrl, 'reviewDetail', function(finished) {

//             })
//         })
//     });
// });

MovieDetail.find({}, function(err, movieDetail) {
    if(err) {
        console.log(err);
    }
    var movie = movieDetail;
    movie.forEach(function(item) {
        item.data.photosUrl.forEach(function(photoUrl, i ,array) {
            DoubanCrawler.crawler(item._id, photoUrl.photo, 'photo', function(finished) {

            })
        })
    });
});
// 

// Photo.find({}, function(err, result) {
//     if(err) {
//         console.log(err);
//     }
//     var photo = result;
//     photo.forEach(function(item) {
//         DoubanCrawler.crawler('', item.url, 'photoDownload', function(finished) {

//         })
//     });
// });


        