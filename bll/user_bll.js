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
            var userbody = bodymaker.makeUserInfo(u, true);
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
                var extName = '.jpg';  //后缀名
                var hash = util.MD5(new Date().getMilliseconds() + '');

                var newPath = form.uploadDir + '/user_' + u.id+'_'+hash+ extName;
                fs.renameSync(files['img'].path, newPath);  //重命名
                //删除旧头像
                fs.unlinkSync(form.uploadDir + '/user' + t.id+'_'+t.avatarUrl+ extName)
                user_dao.setUserInfo(u,{avatarUrl:hash});
                res.send(bodymaker.makeBody(0, ''));
            })
        }).catch(err => {
            res.send(bodymaker.makeErrorJson(1, err));
        });
}

function searchUser(req, res) {
    if (req.query.query != undefined) {
        var p = {
            id: req.query.query,
            username: req.query.query,
            nickName: req.query.query
        }
    } else if (req.query.id != undefined) {
        var p = {
            id: req.query.id,
        }
    } else if (req.query.username != undefined) {
        var p = {
            username: req.query.username
        }
    }
    else if (req.query.nickName != undefined) {
        var p = {
            nickName: req.query.nickName
        }
    }
    else {
        res.send(bodymaker.makeJson(1, 'query params not found ,you should set url params like /search?id=xxx'))
        return
    }
    user_dao.queryUser(p)
        .then(us => {
            if (us == undefined)
                throw new Error('user not found');
            var ubody = bodymaker.makeUserInfoArray(us, false);
            var body = bodymaker.makeBodyOn(0, '', 'users', ubody);
            res.send(JSON.stringify(body));
        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })

}

module.exports = { getUserInfo, setUserInfo, setUserAvator, searchUser }