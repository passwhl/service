let express = require('express');
let router = express.Router();
let base = require('../base');

/* GET users listing. */
router.post('/add', async function(req, res, next) {
    if(!req.body.name) return res.status(500).json('请输入用户名!');
    if(!req.body.pwd) return res.status(500).json('请输入密码!');
    let users = await base.execSql('SELECT * FROM tb_user WHERE name = ?',[req.body.name]);
    if(users.length!=0) return res.status(500).json('用户名已存在!');
    let sql = 'INSERT INTO tb_user(name,pwd) VALUES (?,?)'
    let data = [req.body.name,req.body.pwd];
    let result = await base.execSql(sql,data);
    console.info('添加用户结果',result)
    res.json('添加用户成功!')
});

router.post('/delete', async function(req, res, next) {
    if(!req.body.uid) return res.status(500).json('缺少参数!');
    let user = await base.execSql('SELECT name,IsAdmin FROM tb_user WHERE uid = ?',[req.body.uid]);
    if(user.length!=0 && user[0].IsAdmin==1)return res.status(500).json('非法操作!');
    let sql = 'DELETE FROM tb_user WHERE uid = ?'
    let data = [req.body.uid];
    let result = await base.execSql(sql,data);
    console.info('删除用户结果',result)
    res.json('删除用户成功!')
});

router.post('/changePwd', async function(req, res, next) {
    if(!req.body.pwd) return res.status(500).json('请输入新密码!');
    let uid = req.body.uid || req.body.userInfo.uid;
    let data = [req.body.pwd, uid];
    let result = await base.execSql('UPDATE tb_user SET pwd = ? WHERE uid = ?',data);
    console.info('修改密码结果',result)
    res.json('修改密码成功!')
});

router.post('/list', async function(req, res, next) {
    let pageNum = req.body.pageNum || 1;
    let pageSize = req.body.pageSize || 1000;
    console.log(req.body.pageSize)
    let total = await base.execSql('SELECT COUNT(*) AS Total FROM tb_user');
    total = total[0].Total;
    let sql = 'SELECT uid,name,IsAdmin FROM tb_user ORDER BY uid desc LIMIT ? OFFSET ?;';
    let data = [ pageSize, (pageNum-1) * pageSize];
    let result = await base.execSql(sql,data);
    console.info(result)
    res.json({pageNum,pageSize,total,list:result})
});

module.exports = router;
