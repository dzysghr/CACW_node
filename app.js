var express = require('express');
//var cookieParser = require('cookie-parser');
var app = express();
var team = require("./team_router")
var user = require("./user_router")
var account = require("./account_router")
var project = require("./project_router")

//app.use(cookieParser());


app.get('/',function (req,res) {
    res.send('hello world');
    console.log("应用实例，主机名 ：%s  IP:%s",req.hostname,req.ip);
})


app.use('/user',user);
app.use('/team',team);
app.use('/project',project);
app.use('/account',account);


var server = app.listen(8081,function () {
    var host = server.address().address;
    var port = server.address().port;
console.log("服务启动，访问地址为 http://%s:%s",host,port);
})

