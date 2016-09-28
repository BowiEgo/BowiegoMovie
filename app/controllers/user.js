var User = require('../schemas/user');

// signup
exports.signup = function(req, res) {
    var _user = req.body.user;

    User.findOne({name: _user.name}, function(err, user) {
        if(err) {
            console.log(err);
        }

        if(user) {
            res.redirect('/')
        }
        else {
            var user = new User(_user);

            user.save(function(err, user) {
                if(err) {
                    console.log(err);
                }
                console.log(user);
                res.redirect('/admin/userlist');
            });
        }
    });
};

// signin
exports.signin = function(req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({name: name}, function(err, user) {
        if(err) {
            console.log(err);
        }

        if(!user) {
            res.redirect('/');
        }

        if(user.password == password) {
            console.log('password is matched');
            req.session.user = user;
            res.redirect('/');
        }
        else {
            console.log('password is not matched');
        }
    });
};

// 注册页面
exports.showSignup = function(req, res) {
    res.render('pages/signup', {
        title: '注册页面',
    })
};

//登录页面
exports.showSignin = function(req, res) {
    res.render('pages/signin', {
        title: '登录页面',
    })
};


// logout
exports.logout = function(req, res) {
    delete req.session.user;
    res.redirect('/');
};

// userlist page
exports.userlist =  function(req, res) {
    User.find({}, function(err, users) {
        if(err) {
            console.log(err)
        }

        res.render('pages/userlist', {
            title: '用户列表页',
            users: users,
        })
    })
};

//midware for user
exports.signinRequired = function(req, res, next) {
    var user = req.session.user;

    if(!user) {
        return res.redirect('/signin')
    }

    next();

}

exports.adminRequired = function(req, res, next) {
    var user = req.session.user;

    if(user.role < 10) {
        return res.redirect('/signin');
    }

    next();

}




