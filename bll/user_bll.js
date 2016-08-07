var user_dao = require('../dao/user_dao');
var bodymaker = require('../util/respone-builder');
var Sequelize = require('sequelize');


function getUserInfo(req, res) {
    var id = req.params.id;
    user_dao.getUserbyId(id)
        .then(u => {
            if(u==undefined)
            {
                res.send(bodymaker.makeErrorJson(5,'user not found'));
                return;
            }
            var userbody = bodymaker.makeUserInfo(u);
            var body = bodymaker.makeBodyOn(0, '', 'user', userbody);
            res.send(JSON.stringify(body));
        }).catch(err => {
            res.send(bodymaker.makeErrorJson(1, err));
        })
}

module.exports = { getUserInfo }