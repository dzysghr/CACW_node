var user_dao = require('../dao/user_dao');
var bodymaker = require('../util/respone-builder');
var account_dao = require('../dao/account_dao');
var formidable = require('formidable')
var util = require('util')
var fs = require('fs')

function getUserInfo(req, res) {
    var username = req.params.username;
    user_dao.getUserByUserName(username)
        .then(u => {
            if (u == undefined) {
                res.send(bodymaker.makeErrorJson(5, 'user not found'));
                return;
            }
            var userbody = bodymaker.makeUserInfo(u);
            var body = bodymaker.makeBodyOn(0, '', 'user', userbody);
            res.send(JSON.stringify(body));
        }).catch(err => {
            res.send(bodymaker.makeErrorJson(1, err));
        })
}

function setUserInfo(req, res) {
    var s = req.cookies['sessionId'];
    account_dao.getUser(s)
        .then(u => {
            var body = req.body;
            return user_dao.setUserInfo(u, body);
        }).then(() => {
            res.send(JSON.stringify(bodymaker.makeBody(0, '')));
        }).catch(err => {
            res.send(bodymaker.makeErrorJson(1, err));
        })
}



/**
 * 上传用户头像 
 * @param {any} req
 * @param {any} res
 */
function setUserAvator(req, res) {
    var contentype = req.headers['content-type'] + '';
    if (contentype == undefined || contentype.indexOf('multipart/form-data') != 0) {
        res.send(bodymaker.makeErrorJson(7, 'error content-type,you should upload by multipart/form-data'));
        return;
    }
    account_dao.getUser(req.cookies['sessionId'])
        .then(u => {
            
            var form = new formidable.IncomingForm();
            form.uploadDir = +__dirname + "/../image";
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
                var extName = '';  //后缀名
                switch (files['img'].type) {
                    case 'image/pjpeg':
                        extName = '.jpg';
                        break;
                    case 'image/jpeg':
                        extName = '.jpg';
                        break;
                    case 'image/png':
                        extName = '.png';
                        break;
                    case 'image/x-png':
                        extName = '.png';
                        break;
                }

                var newPath = form.uploadDir + '/user_' + u.username+extName;
                fs.renameSync(files['img'].path, newPath);  //重命名
                res.send(bodymaker.makeBody(0, ''));
            })
        }).catch(err => {
            res.send(bodymaker.makeErrorJson(1, err));
        });
}

module.exports = { getUserInfo, setUserInfo, setUserAvator }