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

// 配置自定义中间件
let base = require('./base');
app.use(base.intercept_cross);      // 跨域配置
app.use(base.intercept_token);      // token校验配置

// 路由配置
app.use('/', require('./routes/login'));
app.use('/user', require('./routes/user'));
app.use('/wxid', require('./routes/wxid'));

// 定时任务
let schedule = require('node-schedule');
//每分钟的第30秒定时执行一次:
schedule.scheduleJob('0 0 0 ? * *',base.job_hand_log);


// 导出app
module.exports = app;
