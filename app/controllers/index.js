var Screen = require('../schemas/screen');
var ReviewIndex = require('../schemas/review_index');

// index page
exports.index = function(req, res) {

    Screen.find({}, function(err, screenData) {
        var data = screenData;
        if(data[0] == undefined) {
            data = [{
                array: [{
                    title: "数据库未更新，请更新！"
                }]
            }];
        }
        if(err) {
            console.log(err);
        }
        var screen = data[0].data;

        ReviewIndex.find({}, function(err, result) {
            var reviewIndex = result[0].data;
            res.render('pages/index', {
                resource: 'index',
                title: 'bowMovie 首页',
                screen: screen,
                reviewIndex: reviewIndex,
            });
            res.end();
        });
    });
};