var bodymaker = require('../util/respone-builder');
var account_dao = require('../dao/account_dao');
var message_dao = require('../dao/message_dao');
var user_dao = require('../dao/user_dao');
var client = require('../util/push')


function getMessage(req, res) {
    account_dao.getUserByReq(req)
        .then(u => {
            return message_dao.getMessage(u);
        })
        .then(msg => {
            var mbody = bodymaker.makeMsgArray(msg);
            var body = bodymaker.makeBodyOn(0, '', 'msg', mbody);
            res.send(JSON.stringify(body));
            return message_dao.deleteMsgArray(msg);
        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}

function sendMessage(req, res) {
    if (req.body.content == undefined) {
        res.send(bodymaker.makeJson(1, 'lack param (content)'));
    }
    if (req.body.type == undefined) {
        res.send(bodymaker.makeJson(1, 'lack param (type)'));
    }
    if (req.body.recieverId == undefined) {
        res.send(bodymaker.makeJson(1, 'lack param (recieverId)'));
    }
    if (req.body.title == undefined) {
        res.send(bodymaker.makeJson(1, 'lack param (title)'));
    }

    account_dao.getUserByReq(req)
        .then(u => {
            if (u.id == req.body.recieverId)
                throw new Error('you can send msg to yourself');
            return user_dao
                .getUserbyId(req.body.recieverId)
                .then(re => {
                    if (!re)
                        throw new Error('reciever not found');
                    return message_dao.sendMessage(u, re, req.body.content, req.body.type);
                })
                .then(() => {
                    res.send(bodymaker.makeJson(0, ''));
                    return account_dao.getDeviceIds([req.body.recieverId]);
                })
                .then(deviceids => {
                    if (deviceids.length > 0)
                    {
                        var content = bodymaker.makePushContentJson('ms',u.id,req.body.content);
                        client.pushToDevices(deviceids,req.body.title,content);
                    } 
                })
        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}

module.exports = { getMessage, sendMessage }