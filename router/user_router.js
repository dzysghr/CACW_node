var express = require('express');
var router = express.Router();
var checker = require('../util/session-check');
var user_bll = require('../bll/user_bll');
var bodyParser = require('body-parser')

// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
  console.log('访问用户模块 Time: ', Date.now());
  next();
});

//检查session 中间件
router.use(checker())

router.use(bodyParser.json());



//获取个人头像
// router.get('/avatar', function (req, res) {

// });

//搜索信息
router.get('/search', function (req, res) {
  user_bll.searchUser(req, res);
});

//修改头像
router.post('/upload', function (req, res) {
  user_bll.setUserAvator(req, res);
});

//修改个人信息
router.post('/', function (req, res) {
  console.log('修改个人信息');
  user_bll.setUserInfo(req, res);
});

//个人信息
router.get('/:username', function (req, res) {
  user_bll.getUserInfo(req, res);
});

module.exports = router;