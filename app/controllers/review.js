var ReviewDetail = require('../schemas/review_detail');
var MovieDetail = require('../schemas/movie_detail');
var Comment = require('../schemas/comment');

// reviewDetail
exports.reviewDetail = function(req, res) {
    var doubanID = req.params.doubanID;
    ReviewDetail.findOne({doubanID: doubanID}, function(err, reviewDetail) {
        if(err) {
            console.log(err);
        }
        if(reviewDetail) {
            var review = reviewDetail;
            var reviewId = review._id;
            console.log(review.movie);
            MovieDetail.findOne({_id: review.movie}, function(err, movieDetail) {
                var movieUrl = '/movie/' + movieDetail.doubanID;
                console.log('movieUrl: ' + movieUrl);
                Comment
                    .find({review: reviewId})
                    .populate('from')
                    .exec(function(err, comments) {
                        var commentsDouban = review.data.commentsDouban;
                        res.render('pages/review_detail', {
                            resource: 'reviewDetail',
                            review: review,
                            doubanID: review.doubanID,
                            commentsDouban: commentsDouban,
                            comments: comments,
                            movieUrl: movieUrl,
                        });
                });
            })
        } else {
            res.end();
        }
    });
};