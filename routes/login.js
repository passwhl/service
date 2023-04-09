let express = require('express');
let router = express.Router();
let base = require('../base');
const jwt = require("jsonwebtoken");
require('express-async-errors');

router.post('/login', async function(req, res, next) {
    if(!req.body.name || !req.body.pwd) return res.status(500).json('请输入用户名或密码!');
    let data = [req.body.name,req.body.pwd];
    let result = await base.execSql('SELECT name,IsAdmin FROM tb_user WHERE name = ? AND pwd = ?',data);
    if(result.length==0) return res.status(500).json('用户名或密码错误!');
    console.log(JSON.stringify(result));
    let userInfo = JSON.parse(JSON.stringify(result[0]));
    let token = base.getToken(userInfo);
    let refreshToken = base.getRefreshToken(userInfo);
    res.header('AccessToken',token)
    res.header('RefreshToken',refreshToken)
    res.json("登录成功")
});

router.post('/refreshToken', function(req, res, next) {
    jwt.verify(req.headers.refreshtoken,process.env.JWT_PWD,(err,decoded)=>{
        if(err && err.name!='TokenExpiredError')return res.status(401).json("请重新登录");
        let token = base.getToken(req.body.userInfo);
        let refreshToken = base.getRefreshToken(req.body.userInfo);
        res.header('AccessToken',token)
        res.header('RefreshToken',refreshToken)
        res.json("刷新成功")
    })
});


module.exports = router;
