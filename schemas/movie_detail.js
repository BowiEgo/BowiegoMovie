var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
    data: {
        titleCN: {type: String},
        titleEN: {type: String},
        year: {type: String},
        poster: {type: String},
        director: {type: String},
        writer: {type: String},
        casts: {type: String},
        type: {type: String},
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

MovieSchema.pre('update', function() {
    this.update({meta: {updateAt: Date.now()}});
});

var MovieDetail = mongoose.model('MovieDetail', MovieSchema);

module.exports = MovieDetail;