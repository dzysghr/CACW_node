var account_dao = require('../dao/account_dao');
var util = require('../util/md5');
var bodymaker = require('../util/respone_builder');
var Sequelize = require('sequelize');

function onLogin(req, res) {
    console.log('log from onLogin');
    console.log(req.body.username);
    console.log(req.body.psw);
    res.send('onLogin');
}

function onLogout(req, res) {

    res.send('onLogout');
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
        .catch(Sequelize.UniqueConstraintError,err => {
            res.send(JSON.stringify(bodymaker.makeBody(6,'用户名已经存在')));
        })
        .catch(err => {
            res.send(JSON.stringify(bodymaker.makeBody(1,err)));
        })
}

module.exports = { onLogin, onLogout, onRegister };