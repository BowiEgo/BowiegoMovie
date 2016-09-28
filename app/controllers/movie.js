var MovieDetail = require('../schemas/movie_detail');
var ReviewDetail = require('../schemas/review_detail');
var Photo = require('../schemas/photo');
var http = require('http');
var request = require('request');

//电影详情页
exports.movieDetail = function(req, res) {
    var doubanID = req.params.doubanID;
    MovieDetail.findOne({doubanID: doubanID}, function(err, movieDetail) {
        if(err) {
            console.log(err);
        }
        if(movieDetail) {
            var movie = movieDetail.data;
            var movieId = movieDetail._id;
            var reviewArr = movieDetail.data.reviews;
            Photo.find({movie: movieId}, function(err, photos) {
                var photoArr = [];
                photos.forEach(function(item) {
                    photoArr.push('http://o9kkuebr4.bkt.clouddn.com/bowMovie/' + item.url.split('/')[7]);
                });
                console.log(photoArr);
                ReviewDetail.find({movie: movieId}, function(err, reviewDetail) {
                    reviewArr.forEach(function(itemB, i, reviewArr) {
                        reviewDetail.forEach(function(itemA) {
                            if(itemB.reviewAuthor == itemA.data.authorName) {
                                reviewArr[i].reviewUrl = '/review/' + itemA.doubanID;
                                // console.log(reviewArr[i]);
                            }
                        })
                    });
                    res.render('pages/movie_detail', {
                        resource: 'movieDetail',
                        movie: movie,
                        doubanID: doubanID,
                        reviewArr: reviewArr,
                        photo: photoArr,
                    });
                });
            })
        } else {
            res.end();
        }
    });
};