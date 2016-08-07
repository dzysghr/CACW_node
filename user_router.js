var express = require('express');
var router = express.Router();
var checker = require('./util/session-check');
var user_bll = require('./bll/user_bll');


// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
  console.log('访问用户模块 Time: ', Date.now());
  next();
});

//检查session 中间件
router.use(checker())

//个人信息
router.get('/:id', function (req, res) {
    user_bll.getUserInfo(req,res);
});


//修改头像
router.post('/avatar/:id', function (req, res) {

});

//修改个人信息
router.post('/:id', function (req, res) {

});

module.exports = router;