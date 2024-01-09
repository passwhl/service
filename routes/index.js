let express = require('express');
let intercept = require("../common/intercept");
let router = express.Router();

// 路由配置
router.use(intercept.cross);      // 跨域配置
router.use('/', require('./login'));
router.use('/test', require('./test'));
router.use(intercept.token);      // token校验配置
router.use('/test1', require('./test'));
router.use('/user', require('./user'));
router.use('/wxid', require('./wxid'));

module.exports = router;
