var ReviewDetail = require('../schemas/review_detail');
var Comment = require('../schemas/comment');

// review comment
exports.save = function(req, res) {
    
    var _comment = req.body.comment;
    var reviewId = _comment.review;

    var comment = new Comment(_comment);
    console.log(comment);
    comment.save(function(err, comment) {
        if(err) {
            console.log(err);
        }
        ReviewDetail.findOne({_id: reviewId}, function(err, reviewDetail) {
            var doubanID = reviewDetail.doubanID;
            res.redirect('/review/' + doubanID);
        });
    })
};