var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var MovieSchema = new mongoose.Schema({
    doubanID : {type: String},
    data: {
        titleCN: {type: String},
        titleEN: {type: String},
        year: {type: String},
        poster: {type: String},
        director: {type: Array},
        writer: {type: Array},
        casts: {type: Array},
        type: {type: Array},
        website: {type: String},
        country: {type: String},
        language: {type: String},
        release: {type: String},
        timeLength: {type: String},
        alternateName: {type: String},
        imdb: {type: String},
        rating: {type: String},
        votes: {type: String},
        ratingPer: {
            five: {type: String},
            four: {type: String},
            three: {type: String},
            two: {type: String},
            one: {type: String},
        },
        ratingBetter: {type: Array},
        synopsis: {type: String},
        similar: {type: Array},
        reviews: {type: Array},
        allPhotoUrl: {type: String},
        photosUrl: {type: Array},
    },
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

// MovieSchema.pre('update', function() {
//     this.update({meta: {updateAt: Date.now()}});
// });

var MovieDetail = mongoose.model('MovieDetail', MovieSchema);

module.exports = MovieDetail;