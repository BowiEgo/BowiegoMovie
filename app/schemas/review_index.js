var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ReviewIndexSchema = new mongoose.Schema({
    data: [{
        doubanID: {type: String},
        title: {type: String},
        url: {type: String},
        author: {type: String},
        rating: {type: String},
        brief: {type: String},
        movieDoubanID: {type: String},
        movieUrl: {type: String},
        movieTitle: {type: String},
        moviePoster: {type: String},
    }],
    meta: {         //更改数据的时间记录
        createAt: {      
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    },
});

// ReviewIndexSchema.pre('update', function() {
//     this.update({meta: {updateAt: Date.now()}});
// });

var ReviewIndex = mongoose.model('ReviewIndex', ReviewIndexSchema);

module.exports = ReviewIndex;