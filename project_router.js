var express = require('express');
var router = express.Router();

// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
  console.log('访问项目模块 Time: ', Date.now());
  next();
});


//新建项目
router.post('/', function(req, res) {

});


//删除项目
router.delete('/:id', function(req, res) {

});

//获取项目列表
router.post('/list', function(req, res) {

});

//获取项目任务
router.post('/tasklist/:id', function(req, res) {

});

module.exports = router;