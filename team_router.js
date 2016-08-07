var express = require('express');
var router = express.Router();

// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
  console.log('访问团队模块 Time: ', Date.now());
  next();
});


//创建团队
router.post('/create/:teamname', function(req, res) {
      console.log('Time: ', Date.now());
});


//修改团队
router.post('/:id', function(req, res) {

});

//解散团队
router.delete('/:id', function(req, res) {

});

//退出团队
router.get('/out/:id', function(req, res) {

});

//团队成员
router.get('/members/:id', function(req, res) {

});

//查看团队
router.get('/:id', function(req, res) {

});

//查看团队
router.post('/avatar/:id', function(req, res) {

});

//查看团队
router.get('/list', function(req, res) {

});

//查看团队
router.get('/DeleteMember/:id', function(req, res) {

});

module.exports = router;