var mongoose = require('mongoose');
// var crypto = require('crypto');
// var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    avatar: {
        type: String,
        default: 'http://dummyimage.com/125x125',
    },
    // 0: normal user
    // 1: verified user
    // 2: advanced user
    // 
    // >=10: admin
    // >=50: super admin
    role: {
        type: Number,
        default: 0,
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

UserSchema.pre('save', function(next) {
    var user = this;
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }
    else {
        this.meta.updateAt = Date.now();
    }
    next();

    // bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    //     if(err) {return next(err)};
    //     bcrypt.hash(user.password, salt, function(err, hash) {
    //         if(err) {return next(err);}
    //         user.password = hash;
    //         next();
    //     });
    // });
})

var User = mongoose.model('User', UserSchema);

module.exports = User;