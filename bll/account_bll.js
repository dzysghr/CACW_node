var account_dao = require('../dao/account_dao');
var util = require('../util/md5');
var bodymaker = require('../util/respone-builder');
var Sequelize = require('sequelize');

function onLogin(req, res) {
    console.log('log from onLogin');

    var username = req.body.username;
    var psw = req.body.psw;
    if (username == undefined || psw == undefined) {
        var body = bodymaker.makeBody(7, 'can not parse username or password,please check (Content-Type:application/x-www-form-urlencoded) in your header');
        res.send(JSON.stringify(body));
        return;
    }
    account_dao.login(username, psw).then(u => {
        if (u == false) {
            var body = bodymaker.makeBody(1, 'wrong username or password');
            res.send(JSON.stringify(body));
            return;
        }
        var s = util.MD5(u.username + new Date().getMilliseconds());
        return account_dao.saveSession(u, s);
    }).then(s => {
        res.cookie('sessionId', s.Session);
        var body = bodymaker.makeBody(0, '');
        res.send(JSON.stringify(body));
    }).catch(err => {
        var body = bodymaker.makeBody(1, err);
        res.send(JSON.stringify(body));
    })
}



function onLogout(req, res) {
    var s =  req.cookies['sessionId'];
    if(s==undefined)
    {
        var body = bodymaker.makeBody(3,'can not found sessionid');
        res.send(JSON.stringify(body));
        return ;
    }
    account_dao.getUser(s)
    .then(u=>{
        if(u)
        {
            return account_dao.logout(u);
        }
    }).then(()=>{
        var body = bodymaker.makeBody(0,'succeed');
        res.send(JSON.stringify(body));
    }).catch(err=>{
        res.send(bodymaker.makeErrorJson(1,err));
    })
}

function onRegister(req, res) {
    var username = req.body.username;
    var psw = req.body.psw;
    if (username == undefined || psw == undefined) {
        var body = bodymaker.makeBody(7, 'can not parse username or password,please check (Content-Type:application/x-www-form-urlencoded) in your header');
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