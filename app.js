var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
var team = require("./team_router")
var user = require("./user_router")
var account = require("./account_router")
var project = require("./project_router")





app.use(cookieParser());

app.use('/user',user);
app.use('/team',team);
app.use('/project',project);
app.use('/account',account);


app.get('/:id',function (req,res) {
    console.log(req.params.id);
    console.log("应用实例，主机名 ：%s  IP:%s",req.hostname,req.ip);
    res.send('hello world');    
})

var server = app.listen(8081,function () {
    var host = server.address().address;
    var port = server.address().port;
console.log("服务启动，访问地址为 http://%s:%s",host,port);
})

