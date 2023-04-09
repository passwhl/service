// pm2官方配置文档
// https://pm2.keymetrics.io/docs/usage/application-declaration/
module.exports = {
  apps : [
      {
        "name": "dtm-service",                           // 项目名
        "cwd": "./",                                 // 目录
        "script": "./bin/www",                       // 执行命令
        "error_file": "./logs/err.log",              // 错误日志文件
        "out_file": "./logs/out.log",                // 正常日志文件
        "merge_logs": true,                          // 设置追加日志而不是新建日志
        "log_date_format": "YYYY-MM-DD HH:mm:ss",    // 指定日志文件的时间格式
        "watch": true,                               // 是否监听文件变动然后重启
        "ignore_watch": ["node_modules","logs"],     // 不用监听的文件
        "autorestart": false,                        // 默认为true, 发生异常的情况下自动重启
        // "exec_mode": "cluster",                      // 应用启动模式，支持fork和cluster模式
        // "instances": -1,                             // 应用启动实例个数，仅在cluster模式有效 默认为fork；或者 -1 max
        "env": {
          "NODE_ENV": "production",                  // 环境参数，当前指定为生产环境 process.env.NODE_ENV
          "PORT": 8080,
          "DB_URL":"mysql://localhost:3306/dtm?user=root&password=root&multipleStatements=true&allowMultiQueries=true&useUnicode=true&characterEncoding=utf-8",
          "JWT_PWD":"Linshi123456",
          "JWT_EXPIRES": 60 * 60 * 24
        },
        "env_dev": {
          "NODE_ENV": "development",                 // 环境参数，当前指定为生产环境 process.env.NODE_ENV
          "PORT": 8080,
          "DB_URL":"mysql://localhost:3306/dtm?user=root&password=root&multipleStatements=true&allowMultiQueries=true&useUnicode=true&characterEncoding=utf-8",
          "JWT_PWD":"Linshi123456",
          "JWT_EXPIRES": 60 * 60 * 24
        }
      },
      // {
      //   "name": "service1",                            // 项目名
      //   "cwd": "./",                                   // 目录
      //   "script": "./bin/www",                      // 执行命令
      //   // "args": "start",                            // 传递给脚本的参数
      //   // "interpreter": "",                          // 指定的脚本解释器
      //   // "interpreter_args": "",                     // 传递给解释器的参数
      //   // "max_memory_restart": 8,                    // 最大内存限制数，超出自动重启
      //   // "min_uptime": "60s",                        // 应用运行少于时间被认为是异常启动
      //   // "max_restarts": 30,                         // 最大异常重启次数，即小于min_uptime运行时间重启次数；
      //   // "autorestart": true,                        // 默认为true, 发生异常的情况下自动重启
      //   // "cron_restart": "",                         // crontab时间格式重启应用，目前只支持cluster模式;
      //   // "restart_delay": 60000,                      // 异常重启情况下，延时重启时间
      // }
   ]
}
