let express = require('express');
let path = require('path');

// 创建express app
let app = express();

// 配置中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('cookie-parser')());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('morgan',{skip:(req,res)=>res.status=304})('dev'));

// 主路由
app.use('/', require('./routes/index'));

// 定时任务
require('./common/schedule')

// 导出app
module.exports = app;
