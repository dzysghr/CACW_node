var express = require('express');
var router = express.Router();
var message_bll = require('../bll/message_bll')
var bodyParser = require('body-parser')
var checker = require('../util/session-check');



router.use(function timeLog(req, res, next) {
  console.log('访问消息模块 Time: ', Date.now());
  next();
});


//检查session 中间件
router.use(checker());

router.use(bodyParser.json());



router.post('/',function(req,res){
    message_bll.sendMessage(req,res);
})



router.get('/',function(req,res){
    message_bll.getMessage(req,res);
})

module.exports = router;