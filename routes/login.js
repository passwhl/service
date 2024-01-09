let express = require('express');
let router = express.Router();
let base = require('./base');
const jwt = require("jsonwebtoken");
require('express-async-errors');

router.post('/login', async function(req, res, next) {
    if(!req.body.name || !req.body.pwd) return res.status(500).json('请输入用户名或密码!');
    let data = [req.body.name,req.body.pwd];
    let result = await base.execSql('SELECT uid,name,IsAdmin FROM tb_user WHERE name = ? AND pwd = ?',data);
    if(result.length==0) return res.status(500).json('用户名或密码错误!');
    console.log(JSON.stringify(result));
    let userInfo = JSON.parse(JSON.stringify(result[0]));
    let token = getToken(userInfo);
    let refreshToken = getRefreshToken(userInfo);
    res.header('AccessToken',token)
    res.header('RefreshToken',refreshToken)
    res.json("登录成功")
});

router.post('/refreshToken', function(req, res, next) {
    jwt.verify(req.headers.refreshtoken,process.env.JWT_PWD,async (err, decoded) => {
        if (err && err.name != 'TokenExpiredError') return res.status(401).json("请重新登录");
        let result = await base.execSql('SELECT uid,name,IsAdmin FROM tb_user WHERE uid = ?', [req.body.userInfo.uid]);
        if (result.length == 0) return res.status(401).json('请重新登录!');
        let userInfo = JSON.parse(JSON.stringify(result[0]));
        let token = getToken(userInfo);
        let refreshToken = getRefreshToken(userInfo);
        res.header('AccessToken', token)
        res.header('RefreshToken', refreshToken)
        res.json("刷新成功")
    })
});


// 生成token，expiresIn单位s
function getToken(userinfo,expiresIn = process.env.JWT_EXPIRES/24){
    return jwt.sign(userinfo,process.env.JWT_PWD,{expiresIn})
}

function getRefreshToken(userinfo,expiresIn = process.env.JWT_EXPIRES){
    return jwt.sign(userinfo,process.env.JWT_PWD,{expiresIn})
}


module.exports = router;
