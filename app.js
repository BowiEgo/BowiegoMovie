var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var serveStatic = require('serve-static');
var logger = require('morgan');

var port = process.env.PORT || 3000;
var app = express();

app.locals.moment = require('moment');
app.locals.cssMap = {
    index: '/css/index.css',
    movieDetail: '/css/movie_detail.css',
    reviewDetail: '/css/review_detail.css',
};
app.set('views', './app/views');
app.set('view engine', 'jade');
app.use(bodyParser.json({limit: '1mb'}));     //4.0以上express拿去了bodyParser，所以要配置一下,不然req.body将不是一个object
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cookieSession({
    secret: 'bowMovie',
    resave: false,
    saveUninitialized: true
}));
app.use(serveStatic(path.join(__dirname, 'public')));   //静态文件目录

if('development' === app.get('env')) {
    app.set('showStackError', true);
    app.use(logger(':method :url :status'))
    app.locals.pretty = true;    //将源码显现变为可读性强的非压缩方式
    mongoose.set('debug', true);
}

require('./config/routes')(app);  //引入路由

app.listen(port);
console.log('bowMovie started on port' + port);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/bowMovie');
var db = mongoose.connection;
db.on('error', console.error.bind(console, '连接错误：'));
db.once('open', function(callback) {
    console.log(' 连接成功！');
})









