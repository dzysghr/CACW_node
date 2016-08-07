var express = require('express');
var router = express.Router();

// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
  console.log('访问任务模块 Time: ', Date.now());
  next();
});


//获取任务
router.get('/list', function(req, res) {

});


//获取任务详情
router.post('/create', function(req, res) {

});

//修改任务
router.post('/task/update', function(req, res) {

});

//删除任务
router.delete('/task/:id', function(req, res) {

});

//完成任务
router.get('/task/finish/:id', function(req, res) {

});

module.exports = router;