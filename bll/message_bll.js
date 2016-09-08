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
        return;
    }
    if (req.body.type == undefined) {
        res.send(bodymaker.makeJson(1, 'lack param (type)'));
    }
    if (req.body.recieverId == undefined) {
        res.send(bodymaker.makeJson(1, 'lack param (recieverId)'));
        return;
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
                    if (req.body.type == 1)
                        return handleTeamApply(req, res, u, re);
                    if (req.body.type == 0)
                        return handleTeamInvite(req, res, u, re);
                    if(req.body.type==2)
                        return handleUserMsg(req,res,u,re);
                })
                .catch(err => {
                    res.send(bodymaker.makeJson(1, err.message));
                })
        })
}

function handleUserMsg(req,res,me,reciever)
{
    
}

function handleTeamInvite(req, res, me, reciever) {
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
            return t.hasMember(reciever.id);
        })
        .then(has => {
            if (has)
                throw new Error(reciever.nickName + ' have been a member in this team');
            return message_dao.sendMessage(me, reciever, req.body.content, req.body.type, req.body.teamid);
        })
        .then(m => {
            //创建成功，发送推送
            res.send(bodymaker.makeJson(0, ''));
            return account_dao.getDeviceIds([req.body.recieverId]);
        })
        .then(deviceids => {
            if (deviceids.length > 0) {
                var content = bodymaker.makePushContentJson('ms',me.id, '用户' + me.nickName + '邀请你加入团队 ' + team.teamName);
                client.pushToDevices(deviceids, '团队邀请', content);
            }
        })
}


function handleTeamApply(req, res, me, reciever) {
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
            return message_dao.sendMessage(me, reciever, req.body.content, req.body.type, req.body.teamid);
        })
        .then(m => {
            //创建成功，发送推送
            res.send(bodymaker.makeJson(0, ''));
            return account_dao.getDeviceIds([req.body.recieverId]);
        })
        .then(deviceids => {
            if (deviceids.length > 0) {
                var content = bodymaker.makePushContentJson('ms', me.id, '用户' + me.nickName + '申请加入团队 ' + team.teamName);
                client.pushToDevices(deviceids, '团队申请', content);
            }
        })
}


module.exports = { getMessage, sendMessage }