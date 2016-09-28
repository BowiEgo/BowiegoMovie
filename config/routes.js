var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Review = require('../app/controllers/review');
var Comment = require('../app/controllers/comment');

var _ = require('underscore');

module.exports = function(app) {

    // pre handle user 
    app.use(function(req, res, next) {
        console.log(app.locals.user);
        app.locals.user = req.session.user;

        next();
    });

    //Index
    app.get('/', Index.index);

    //Movie
    app.get('/movie/:doubanID', Movie.movieDetail);

    //Review
    app.get('/review/:doubanID', Review.reviewDetail);

    // User
    // 注册和登录页面
    app.get('/signup', User.showSignup);
    app.get('/signin', User.showSignin);
        // signup
    app.post('/user/signup', User.signup);
        // signin
    app.post('/user/signin', User.signin);
        // logout
    app.get('/logout', User.logout);
        // userlist page
    app.get('/admin/userlist', User.signinRequired, User.adminRequired, User.userlist);

    //Comment
    app.post('/user/comment', User.signinRequired, Comment.save);
};

