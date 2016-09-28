var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ReviewDetailSchema = new mongoose.Schema({
    doubanID : {type: String},
    movie: {type: ObjectId, ref: 'MovieDetail', default: 'aaaaaaaaaaaa'},
    data: {
        title: {type: String},
        authorAvatar: {type: String},
        authorName: {type: String},
        movieTitle: {type: String},
        rating: {type: String},
        time: {type: String},
        content: {type: String},
        comments: {type: Array},
        commentsDouban: {type: Array},
    },
    meta: {         //更改数据的时间记录
        createAt: {      
            type: Date,
            default: Date.now(),
        },
        updateAt: {
            type: Date,
            default: Date.now(),
        },
    },
});

var ReviewDetail = mongoose.model('ReviewDetail', ReviewDetailSchema);

module.exports = ReviewDetail;