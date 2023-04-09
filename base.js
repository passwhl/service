let mysql =  require('mysql');
let jwt = require("jsonwebtoken");
let os = require("os");
let path = require('path');

class Base{


    // 生成token，expiresIn单位s
    getToken(userinfo,expiresIn = process.env.JWT_EXPIRES/2){
        return jwt.sign(userinfo,process.env.JWT_PWD,{expiresIn})
    }

    getRefreshToken(userinfo,expiresIn = process.env.JWT_EXPIRES){
        return jwt.sign(userinfo,process.env.JWT_PWD,{expiresIn})
    }


    // token校验拦截器
    intercept_token(req, res, next){
        let token_skip = ['/login','/refreshToken'];
        if(token_skip.indexOf(req.originalUrl)!=-1)return next();
        jwt.verify(req.headers.accesstoken,process.env.JWT_PWD,(err,decoded)=>{
            if(err && err.name=='TokenExpiredError')return res.status(402).json("登录过期");
            if(err)return res.status(401).json("请先登录");
            req.body['userInfo'] = decoded;
            next();
        })
    }

    // 允许跨域
    intercept_cross(req, res, next){
        res.header("Access-Control-Allow-Origin", "*")
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , AccessToken,RefreshToken');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        res.header('Access-Control-Expose-Headers', "*");
        if(req.method.toLowerCase() == 'options')return res.status(200).json();
        next()
    }

    // 日志文件定时处理
    async job_hand_log() {
        if (process.env.NODE_APP_INSTANCE !== '0') return;  // 集群模式防止重复执行
        console.log("定时清理日志");
        let pm2Config = require("./pm2.config");
        let fs = require("fs");
        let fsPromises = require("fs/promises");
        let exec= require('child_process').exec;
        let moment = require('moment');
        for (let app of pm2Config.apps) {
            let curTime = moment().format('YYYY-MM-DD-HH-mm-ss');
            let errSrc = pm2Config.apps[0]['error_file'] || path.join(os.homedir(),'.pm2','logs',app.name+"-error.log");
            let outSrc = pm2Config.apps[0]['out_file']   || path.join(os.homedir(),'.pm2','logs',app.name+"-out.log");
            let errTarget = path.join(path.parse(errSrc).dir, path.parse(errSrc).name+curTime+".log");
            await fsPromises.copyFile(errSrc, errTarget,fs.constants.COPYFILE_FICLONE).catch(err=>console.log("copy日志失败"+JSON.stringify(err)))
            let outTarget = path.join(path.parse(outSrc).dir, path.parse(outSrc).name+curTime+".log");
            await fsPromises.copyFile(outSrc, outTarget,fs.constants.COPYFILE_FICLONE).catch(err=>console.log("copy日志失败"+JSON.stringify(err)))
            exec('pm2 flush '+app.name, (error, stdout, stderr) => console.log("清理PM2日志"+(error?"失败":"成功")));
        }
    }


    // 获取sql连接
    getConnect(){
        if(!this.pool)this.pool = mysql.createPool(process.env.DB_URL);
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err,conn)=>{
                return err?reject(err):resolve(conn);
            })
        })
    }

    // 执行sql
    // sql : eg.SELECT * FROM users WHERE id = ?, name = ?,
    // err: [userId, name]
    execSql(sql,arr=[]){
        return this.getConnect().then(conn=>{
            return new Promise((resolve, reject) =>
                conn.query(sql,arr,(err,res)=>{
                    conn.release();
                    err?reject(err):resolve(res)
                })
            );
        })
    }

}

// 导出
module.exports = new Base();
