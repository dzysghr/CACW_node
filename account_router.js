var express = require('express');
var router = express.Router();


router.use(function timeLog(req, res, next) {
  console.log('访问帐户模块 Time: ', Date.now());
  next();
});

router.get('/login',function (req,res) {
    console.log("调用登录接口");
})

router.get('/logout',function (req,res) {
    console.log("调用登出接口");
})
module.exports = router;