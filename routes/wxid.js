let express = require('express');
let router = express.Router();
let base = require('../base');

router.post('/add', async function(req, res, next) {
    let user = req.body.userInfo.name;
    if(!req.body.list || req.body.list.length==0) return res.status(500).json('缺少参数!');
    let dataList =  req.body.list.filter(item=>item.wxid);
    let sql = '';
    dataList.forEach(item=> sql += ` INSERT IGNORE INTO tb_wxid(wxId,user) VALUES('${item.wxid}','${user}');\r\n`)
    let result = await base.execSql(sql);
    console.info(result);
    if(result instanceof Array){
        result.forEach((item,index)=> dataList[index]['IsExist'] = item.affectedRows==0)
    }else{
        dataList[0]['IsExist'] = result.affectedRows==0;
    }
    res.json(dataList)
});

router.post('/delete', async function(req, res, next) {
    if(!req.body.id) return res.status(500).json('缺少参数!');
    let sql = 'DELETE FROM tb_wxid WHERE id = ?'
    let data = [req.body.id];
    let result = await base.execSql(sql,data);
    console.info('删除结果',result)
    res.json('删除成功!')
});

router.post('/list', async function(req, res, next) {
    let key = req.body.key || '';
    let pageNum = req.body.pageNum || 1;
    let pageSize = req.body.pageSize || 1000;
    let startTime = req.body.startTime || '';
    let endTime = req.body.endTime || '';
    let totalSql = 'SELECT COUNT(*) AS Total FROM tb_wxid WHERE 1=1';
    if(key) totalSql += ' '+`AND ( wxId LIKE '%${key}%' OR user LIKE '%${key}%' )`
    if(startTime && endTime) totalSql+=' '+`AND ( dateTime between ${startTime} AND ${endTime} )`
    console.log(totalSql+';');
    let total = (await base.execSql(totalSql+';'))[0].Total;
    let sql = 'SELECT * FROM tb_wxid WHERE 1=1';
    if(key) sql += ' '+`AND ( wxId LIKE '%${key}%' OR user LIKE '%${key}%' )`
    if(startTime && endTime) sql+=' '+`AND ( dateTime between ${startTime} AND ${endTime} )`
    sql += ' '+'LIMIT ? OFFSET ?;'
    let data = [ pageSize, (pageNum-1) * pageSize];
    console.log(sql);
    let result = await base.execSql(sql,data);
    res.json({pageNum,pageSize,total,list:result})
});

module.exports = router;
