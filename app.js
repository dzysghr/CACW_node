var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
var team = require("./router/team_router")
var user = require("./router/user_router")
var account = require("./router/account_router")
var project = require("./router/project_router")
var task = require('./router/task_router')
var message = require('./router/message_router')



app.use(function(err, req, res, next) {
   res.send("lalalala");
   next();
});

app.use(cookieParser());
app.use('/v1/images', express.static('image'));
app.use('/v1/user', user);
app.use('/v1/team', team);
app.use('/v1/project', project);
app.use('/v1/account', account);
app.use('/v1/task', task);
app.use('/v1/message',message);

app.all('/', function (req, res) {
    console.log("应用实例，主机名 ：%s  IP:%s", req.hostname, req.ip);
    res.send('hello world');

})


var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("服务启动，访问地址为 http://%s:%s", host, port);
})
