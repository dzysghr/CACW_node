var bodymaker = require('../util/respone-builder');
var account_dao = require('../dao/account_dao');
var message_dao = require('../dao/message_dao');
var team_dao = require('../dao/team_dao');
var user_dao = require('../dao/user_dao');
var client = require('../util/push')


function getMessage(req, res) {
    account_dao.getUserByReq(req)
        .then(u => {
            return message_dao.getMessage(u);
        })
        .then(msg => {
            var mbody = bodymaker.makeMsgArray(msg);
            var body = bodymaker.makeBodyOn(0, '', 'data', mbody);
            res.json(body);
            return message_dao.deleteMsgArray(msg);
        })
        .then(()=>{
            
        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}

function sendMessage(req, res) {
    if (req.body.content == undefined) {
        res.send(bodymaker.makeJson(1, 'lack param (content)'));
        return;
    }
    if (req.body.receiverId == undefined) {
        res.send(bodymaker.makeJson(1, 'lack param (receiverId)'));
        return;
    }
    account_dao.getUserByReq(req)
        .then(u => {
            if (u.id == req.body.receiverId)
                throw new Error('you can send msg to yourself');
            return user_dao
                .getUserbyId(req.body.receiverId)
                .then(re => {
                    if (!re)
                        throw new Error('receiver not found');
                    return message_dao.sendMessage(u,re,req.body.content,3);
                })
                .then(m=>{
                    res.json(bodymaker.makeBody(0,''));
                })
                .catch(err => {
                    res.send(bodymaker.makeJson(1, err.message));
                })
        })
}

function handleUserMsg(req,res,me,receiver)
{
    
}

//过期
function handleTeamInvite(req, res, me, receiver) {
    var team;
    if (req.body.teamid == undefined) {
        throw new Error('lack param (teamid)');
    }
    return team_dao.getTeamByid(req.body.teamid)
        .then(t => {
            if (!t)
                throw new Error('team not found');
            if (t.AdminId != me.id)
                throw new Error('you can not invite user');
            team = t;
            return t.hasMember(receiver.id);
        })
        .then(has => {
            if (has)
                throw new Error(receiver.nickName + ' have been a member in this team');
            return message_dao.sendMessage(me, receiver, req.body.content, req.body.type, req.body.teamid);
        })
        .then(m => {
            //创建成功，发送推送
            res.send(bodymaker.makeJson(0, ''));
            return account_dao.getDeviceIds([req.body.receiverId]);
        })
        .then(deviceids => {
            if (deviceids.length > 0) {
                var content = bodymaker.makePushContentJson('ms',me.id, '用户' + me.nickName + '邀请你加入团队 ' + team.teamName);
                client.pushToDevices(deviceids, '团队邀请', content);
            }
        })
}

//过期
function handleTeamApply(req, res, me, receiver) {
    var team;
    if (req.body.teamid == undefined) {
        throw new Error('lack param (teamid)');
    }
    return team_dao.getTeamByid(req.body.teamid)
        .then(t => {
            if (!t)
                throw new Error('team not found');
            team = t;
            return t.hasMember(me.id);
        })
        .then(has => {
            if (has)
                throw new Error('you have been a member in this team');
            return message_dao.sendMessage(me, receiver, req.body.content, req.body.type, req.body.teamid);
        })
        .then(m => {
            //创建成功，发送推送
            res.send(bodymaker.makeJson(0, ''));
            return account_dao.getDeviceIds([req.body.receiverId]);
        })
        .then(deviceids => {
            if (deviceids.length > 0) {
                var content = bodymaker.makePushContentJson('ms', me.id, '用户' + me.nickName + '申请加入团队 ' + team.teamName);
                client.pushToDevices(deviceids, '团队申请', content);
            }
        })
}


module.exports = { getMessage, sendMessage }