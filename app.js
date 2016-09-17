var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var serveStatic = require('serve-static');

var Screen = require('./schemas/screen');
var MovieDetail = require('./schemas/movie_detail');
var DoubanCrawler = require('./doubanCrawler');

var port = process.env.PORT || 3000;
var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.use(serveStatic(path.join(__dirname, 'public')));   //静态文件目录
app.listen(port);

console.log('bowMovie started on port' + port);

mongoose.connect('mongodb://localhost/bowMovie');
var db = mongoose.connection;
db.on('error', console.error.bind(console, '连接错误：'));
db.once('open', function(callback) {
    console.log(' 连接成功！');
})

var mapping = {
    home: '/css/index.css',
    movieDetail: '/css/movie_detail.css',
}

//首页
app.get('/', function(req, res) {

    DoubanCrawler.crawler('https://movie.douban.com/', 'screenMovie', function() {
        Screen.find({}, function(err, screenData) {
            var data = screenData;
            if(data[0] == undefined) {
                data = [{
                    array: [{
                        title: "数据库未更新，请刷新页面！"
                    }]
                }];
            }
            if(err) {
                console.log(err);
            }

            var screen = data[0].array;
            res.render('pages/index', {
                resource: mapping['home'],
                title: 'bowMovie 首页',
                screen: screen,
            });
        })
    });
})

//电影详情页
app.get('/movie/:doubanID', function(req, res) {
    var doubanID = req.params.doubanID;
    console.log(doubanID);

    var url = 'https://movie.douban.com/subject/' + doubanID + '/?from=showing';
    var posterUrl = 'https://movie.douban.com/subject/'+ doubanID + '/photos?type=R';

    DoubanCrawler.crawler(url, 'movieDetail', function() {

        // DoubanCrawler.crawler(posterUrl, 'poster', function() {

            MovieDetail.find({}, function(err, movieDetail) {
                var movie = movieDetail[0].data;
                console.log(movie);
                res.render('pages/movie_detail', {
                    resource: mapping['movieDetail'],
                    movie: movie,
                });
            });
        // });

    });

})














