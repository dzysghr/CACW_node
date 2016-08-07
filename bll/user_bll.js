var user_dao = require('../dao/user_dao');
var bodymaker = require('../util/respone-builder');
var Sequelize = require('sequelize');
var account_dao = require('../dao/account_dao');

function getUserInfo(req, res) {
    var id = req.params.id;
    user_dao.getUserbyId(id)
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
            return user_dao.setUserInfo(u,body);
        }).then(()=>{
            res.send(JSON.stringify(bodymaker.makeBody(0,'')));
        }).catch(err=>{
            res.send(bodymaker.makeErrorJson(1,err));
        })
}

module.exports = { getUserInfo, setUserInfo }