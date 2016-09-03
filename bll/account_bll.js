var account_dao = require('../dao/account_dao');
var util = require('../util/md5');
var bodymaker = require('../util/respone-builder');
var Sequelize = require('sequelize');
function onLogin(req, res) {

    var username = req.body.username;
    var psw = req.body.psw;
    var deviceId = req.body.deviceId;
    if (username == undefined || psw == undefined||deviceId==undefined) {
        res.send(bodymaker.makeJson(7, 'please check your params ,and set (Content-Type:application/json) in your header'));
        return;
    }
    var user;
    account_dao.login(username, psw)
        .then(u => {
            if (!u) {
                throw new Error('wrong username or password');
            }
            user = u;
            var s = util.MD5(u.username + new Date().getMilliseconds()+'');
            return account_dao.saveSession(u, s,deviceId);
        }).then(s => {
            res.cookie('sessionId', s.Session);
            var body = bodymaker.makeBodyOn(0,'','data',bodymaker.makeUserInfo(user,true));
            res.send(JSON.stringify(body));
        }).catch(err => {
            var body = bodymaker.makeBody(1, err.message);
            res.send(JSON.stringify(body));
        })
}


function onLogout(req, res) {
    var s = req.cookies['sessionId'];
    if (s == undefined) {
        var body = bodymaker.makeBody(3, 'can not found sessionid');
        res.send(JSON.stringify(body));
        return;
    }
    account_dao.getUser(s)
        .then(u => {
            if (u) {
                return account_dao.logout(u);
            }
        }).then(() => {
            var body = bodymaker.makeBody(0, 'succeed');
            res.send(JSON.stringify(body));
        }).catch(err => {
            res.send(bodymaker.makeErrorJson(1, err));
        })
}

function onRegister(req, res) {
    var username = req.body.username;
    var psw = req.body.psw;
    if (username == undefined || psw == undefined) {
        var body = bodymaker.makeBody(7, 'can not parse username or password,please check (Content-Type:application/json) in your header');
        res.send(JSON.stringify(body));
        return;
    }
    account_dao.register(username, psw)
        .then(u => {
            res.send(JSON.stringify(bodymaker.makeBody(0, '')));
        })
        .catch(Sequelize.UniqueConstraintError, err => {
            res.send(JSON.stringify(bodymaker.makeBody(6, 'username have existed')));
        })
        .catch(err => {
            res.send(JSON.stringify(bodymaker.makeBody(1, err)));
        })
}

module.exports = { onLogin, onLogout, onRegister };