var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
var team = require("./router/team_router")
var user = require("./router/user_router")
var account = require("./router/account_router")
var project = require("./router/project_router")
var formidable = require('formidable')
var util = require('util')
var fs = require('fs')

app.use(cookieParser());
app.use('/images',express.static('image'));
app.use('/user', user);
app.use('/team', team);
app.use('/project', project);
app.use('/account', account);


app.all('/', function (req, res) {
    console.log(req.headers);
    console.log("应用实例，主机名 ：%s  IP:%s", req.hostname, req.ip);
    res.send('hello world');

})

//todo delete
app.post('/upload', function (req, res) {

    var contentype = req.headers['content-type'] + '';
    if (contentype == undefined || contentype.indexOf('multipart/form-data') != 0) {
        res.send('error conten  type');
        return;
    }

    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + "/image";
    form.encoding = 'utf-8';		//设置编辑
    form.keepExtensions = true;	 //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
    form.parse(req, function (err, fields, files) {
        if (err) {
            res.send(bodymaker.makeErrorJson(7, err));
            return;
        }
        if (files.length == 0 || files['img'] == undefined) {
            res.send(bodymaker.makeErrorJson(7, 'file not found,"img" key is respected'));
            return;
        }
        var newPath = form.uploadDir + '/abc_avatar';
        fs.renameSync(files['img'].path, newPath);  //重命名
        res.send(files['img']);
    })
})


var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("服务启动，访问地址为 http://%s:%s", host, port);
})
