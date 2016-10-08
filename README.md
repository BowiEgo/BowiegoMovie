# BowiegoMovie
a movie website powered by NodeJS &amp; Express 4.X &amp; mongoDB


##基于NodeJs+MongoDB+jQuery搭建的电影评论网站

###简介
本项目基于NodeJS和MongoDB搭建后端，前端模版使用Jade渲染，Bootstrap搭建页面，jQuery负责交互部分。数据来源使用NodeJS编写爬虫，爬取豆瓣电影网的数据存储到本地Mongo数据库。部分图片上传至个人的七牛云存储。

####1. 项目后端搭建:

使用NodeJs的express框架完成电影网站后端搭建;
使用mongodb完成数据存储,通过mongoose模块完成对mongodb数据的构建;
使用jade模板引擎完成页面创建渲染;
使用Moment.js格式化时间;

####2. 项目前端搭建:

使用jQuery和Bootsrap完成网站前端JS脚本和样式处理;
使用Sass完成电影和音乐首页样式的编写;
自己编写轮播图插件实现首页以及电影详情页轮播图效果;
前后端的数据请求交互通过Ajax完成;

####3. 本地开发环境搭建:

使用gulp集成jshint对JS语法检查，Sass文件编译、压缩等功能，使用mocha完成用户注册存储等步骤的简单单元测试，以及服务器的自动重启等功能。

####4. 网站整体功能:

网站正常访问无需管理原权限，添加评论需要注册账户，默认为普通账户（权限<10）访问后台用户列表页（localhost:3000/admin/userlist）并进行删除操作需要登录管理员账户(账号:admin 密码:1234)，管理员账户在列表页不可删除。

基于豆瓣电影数据的展示页面（包含当前热映，热门影片，电影详情，电影影评，影评下方评论，电影排行榜）;
具有用户注册登录及管理;
电影详情页面添加评论;

[动态效果演示1](http://o9kkuebr4.bkt.clouddn.com/bowMovie/GIF1.gif)
[动态效果演示2](http://o9kkuebr4.bkt.clouddn.com/bowMovie/GIF2.gif)
[动态效果演示3](http://o9kkuebr4.bkt.clouddn.com/bowMovie/GIF3.gif)
[动态效果演示4](http://o9kkuebr4.bkt.clouddn.com/bowMovie/GIF4.gif)

![截图](http://o9kkuebr4.bkt.clouddn.com/bowMovie/screenshotFireShot%20Capture%2011%20-%20bowMovie%20%E9%A6%96%E9%A1%B5%20-%20http___localhost_3000_.png?imageView/2/w/600/q/40)
![截图](http://o9kkuebr4.bkt.clouddn.com/bowMovie/screenshotFireShot%20Capture%20021%20-%20bowMovie%20%E9%A6%96%E9%A1%B5%20-%20http___localhost_3000_.jpg?imageView/2/w/600/q/40)
![截图](http://o9kkuebr4.bkt.clouddn.com/bowMovie/screenshotFireShot%20Capture%2012%20-%20%20-%20http___localhost_3000_movie_22939161.png?imageView/2/w/600/q/40)
![截图](http://o9kkuebr4.bkt.clouddn.com/bowMovie/screenshotFireShot%20Capture%20017%20-%20%20-%20http___localhost_3000_chart.jpg?imageView/2/w/600/q/40)
![截图](http://o9kkuebr4.bkt.clouddn.com/bowMovie/screenshotFireShot%20Capture%20023%20-%20%20-%20http___localhost_3000_review_8100856.jpg?imageView/2/w/600/q/40)
![截图](http://o9kkuebr4.bkt.clouddn.com/bowMovie/screenshotFireShot%20Capture%20025%20-%20%20-%20http___localhost_3000_review_8100856.jpg?imageView/2/w/600/q/40)


