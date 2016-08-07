var express = require('express');
var router = express.Router();

// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
  console.log('访问用户模块 Time: ', Date.now());
  next();
});

var count = 1;



//个人信息
router.get('/:id', function(req, res) {
  console.log(count++);
});


//修改头像
router.post('/avatar/:id', function(req, res) {

});

//修改个人信息
router.post('/:id', function(req, res) {

});

module.exports = router;