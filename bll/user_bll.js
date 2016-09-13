var user_dao = require('../dao/user_dao');
var bodymaker = require('../util/respone-builder');
var account_dao = require('../dao/account_dao');
var formidable = require('formidable')
var util = require('../util/md5')
var fs = require('fs')
var team_dao = require('../dao/team_dao');

function getUserInfo(req, res) {
    var username = req.params.username;
    user_dao.getUserByUserName(username)
        .then(u => {
            if (u == undefined) {
                res.send(bodymaker.makeErrorJson(5, 'user not found'));
                return;
            }
            var userbody = bodymaker.makeUserInfo(u, true);
            var body = bodymaker.makeBodyOn(0, '', 'data', userbody);
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
            form.uploadDir = __dirname + "/../image";
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

                var newPath = form.uploadDir + '/user_' + u.id + '_' + hash + extName;
                fs.renameSync(files['img'].path, newPath);  //重命名
                console.log('new  ' + newPath);
                if (u.avatarUrl) {
                    //删除旧头像
                    var old = form.uploadDir + '/user_' + u.id + '_' + u.avatarUrl + extName;
                    console.log('old  ' + old);
                    if (fs.existsSync(old))
                        fs.unlinkSync(old)
                }
                user_dao.setUserInfo(u, { avatarUrl: hash });
                var body = bodymaker.makeBodyOn(0, '', 'data', hash);
                res.json(body);
            })
        }).catch(err => {
            res.send(bodymaker.makeErrorJson(1, err));
        });
}

//搜索用户
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
        res.json(bodymaker.makebody(1, 'query params not found ,you should set url params like /search?id=xxx'))
        return
    }
    return account_dao.getUserByReq(req)
        .then(u => {
            if (req.query.teamid != undefined)
                return searUserWithoutTeam(req, res, u,p);
            return user_dao.queryUser(p, req.query.limit, req.query.offset, [u.id])
                .then(us => {
                    var ubody = bodymaker.makeUserInfoArray(us, false);
                    var body = bodymaker.makeBodyOn(0, '', 'data', ubody);
                    res.json(body);
                })
        })
        .catch(err => {
            res.json(bodymaker.makeBody(1, err.message));
        })
}

function searUserWithoutTeam(req, res, u,p) {
    return team_dao.getTeamByid(req.query.teamid)
        .then(t => {
            if (!t)
                throw new Error('team not found');
            return t.getMember();
        })
        .then(mb => {
            var ids = [];
            mb.forEach(i=>{
                ids.push(i.id);
            });
            return user_dao.queryUser(p, req.query.limit, req.query.offset,ids);
        })
        .then(us => {
            var ubody = bodymaker.makeUserInfoArray(us, false);
            var body = bodymaker.makeBodyOn(0, '', 'data', ubody);
            res.json(body);
        });
}



module.exports = { getUserInfo, setUserInfo, setUserAvator, searchUser }