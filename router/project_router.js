var express = require('express');
var router = express.Router();
var checker = require('../util/session-check');
var bodyParser = require('body-parser')
var project_bll = require('../bll/project_bll')


// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
  console.log('访问项目模块 Time: ', Date.now());
  next();
});

//检查session 中间件
router.use(checker())

router.use(bodyParser.urlencoded({ extended: true }));

//新建项目
router.post('/create', function (req, res) {
  project_bll.createProject(req, res);
});


//删除项目
router.delete('/:id', function (req, res) {

});

//获取项目列表
router.post('/list', function (req, res) {

});

//获取项目任务
router.post('/tasklist/:id', function (req, res) {

});

module.exports = router;