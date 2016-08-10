var express = require('express');
var router = express.Router();
var bll = require('../bll/account_bll')
var bodyParser = require('body-parser')




router.use(function timeLog(req, res, next) {
  console.log('访问帐户模块 Time: ', Date.now());
  next();
});

router.use(bodyParser.json());

router.post('/login',function (req,res) {
    console.log("调用登录接口");
    bll.onLogin(req,res);
})

router.get('/logout',function (req,res) {
    console.log("调用登出接口");
    bll.onLogout(req,res);
})

router.post('/register',function (req,res) {
    console.log("调用注册接口");
    bll.onRegister(req,res);
})
module.exports = router;