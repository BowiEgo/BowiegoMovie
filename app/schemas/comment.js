var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var CommentSchema = new mongoose.Schema({
    review: {type: ObjectId, ref: 'ReviewDetail'},
    from: {type: ObjectId, ref: 'User'},
    to: {type: ObjectId, ref: 'User'},
    avatar: String,
    author: String,
    content: String,
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

// CommentSchema.pre('update', function() {
//     this.update({meta: {updateAt: Date.now()}});
// });

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;