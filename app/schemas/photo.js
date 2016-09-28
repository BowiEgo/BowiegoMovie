var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var PhotoSchema = new mongoose.Schema({
    movie: {type: ObjectId, ref: 'MovieDetail', default: 'aaaaaaaaaaaa'},
    url: String,
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

var Photo = mongoose.model('Photo', PhotoSchema);

module.exports = Photo;