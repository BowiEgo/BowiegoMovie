var mongoose = require('mongoose');

var ScreenSchema = new mongoose.Schema({
    array: [{
        title: {type: String},
        poster: {type: String},
        rating: {type: Number},
        moreurl: {type: String},
        doubanID: {type: Number},
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

ScreenSchema.pre('update', function() {
    this.update({meta: {updateAt: Date.now()}});
});

var Screen = mongoose.model('ScreenMovie', ScreenSchema);

module.exports = Screen;