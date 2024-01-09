// 定时任务
let schedule = require('node-schedule');
const path = require("path");
const os = require("os");
const fs = require("fs");
const fsPromises = require("fs/promises");
const exec= require('child_process').exec;
const moment = require('moment');

//每分钟的第30秒定时执行一次:
schedule.scheduleJob('0 0 0 ? * *',job_hand_log);




// 日志文件定时处理
async function job_hand_log() {
    if (process.env.NODE_APP_INSTANCE !== '0') return;  // 集群模式防止重复执行
    console.log("定时清理日志");
    let pm2Config = require("../config");
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