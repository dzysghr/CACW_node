var team_dao = require('../dao/team_dao');
var bodymaker = require('../util/respone-builder');
var account_dao = require('../dao/account_dao');
var user_dao = require('../dao/user_dao');
var message_dao = require('../dao/message_dao');
var formidable = require('formidable')
var fs = require('fs');
var MyModel = require('../dao/define');
var client = require('../util/push');
var util = require('../util/md5');

function createTeam(req, res) {
    var teamname = req.params.teamname;
    var hash = util.MD5(new Date().getMilliseconds() + '');
    account_dao.getUserByReq(req)
        .then(u => {
            return team_dao.createTeam(u, teamname);
        })
        .then(t => {
            return team_dao.setTeamInfo(t, { avatarUrl: hash })
        })
        .then((t) => {
            //检查是否带有图片
            var contentype = req.headers['content-type'] + '';
            if (contentype == undefined || contentype.indexOf('multipart/form-data') != 0) {
                res.send(JSON.stringify(bodymaker.makeBody(0, 'no image')));
                return;
            }
            var form = new formidable.IncomingForm();
            form.uploadDir = __dirname + "/../image";
            form.encoding = 'utf-8';		//设置编辑
            form.keepExtensions = true;	 //保留后缀
            form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
            form.parse(req, function (err, fields, files) {
                console.log(fields);
                if (err) {
                    res.send(JSON.stringify(bodymaker.makeBody(0, 'fail to upload image :' + err)));
                    return;
                }
                if (files.length == 0 || files['img'] == undefined) {
                    res.send(JSON.stringify(bodymaker.makeBody(0, 'file not found,"img" key is expected')));
                    return;
                }
                var extName = '.jpg';  //后缀名
                var newPath = form.uploadDir + '/team_' + t.id + '_' + hash + extName;
                fs.renameSync(files['img'].path, newPath);  //重命名
                res.send(JSON.stringify(bodymaker.makeBody(0, '')));
            })
        }).catch(err => {
            res.send(JSON.stringify(bodymaker.makeBody(1, 'fail to create team :' + err)));
        })
}



function getTeamMemer(req, res) {
    var tid = req.params.id;
    var s = req.cookies['sessionId'];
    account_dao.getUser(s)
        .then(u => {
            team_dao.getTeamByid(tid)
                .then(t => {
                    if (t == undefined) {
                        throw new Error('team not found');
                    }
                    return [t.hasMember(u), t.id];
                })
                .spread((r, tid) => {
                    if (r) //如果是成员
                        return team_dao.getTeamMembers(tid, req.query.limit, req.query.offset);
                    else {
                        throw new Error('you are not member in this team');
                    }
                })
                .then(us => {
                    var all = false;
                    if (req.query.allcolumn == undefined)
                        all = false;
                    else if (req.query.allcolumn == 'true')
                        all = true;
                    var userlist = bodymaker.makeUserInfoArray(us, all);
                    var body = bodymaker.makeBodyOn(0, '', 'data', userlist);
                    res.send(JSON.stringify(body));
                })
                .catch(err => {
                    res.send(bodymaker.makeJson(1, err.message));
                })
        })
}


function setTeamInfo(req, res) {
    var id = req.params.id;
    var session = req.cookies['sessionId'];
    account_dao.getUser(session)
        .then(u => {
            return team_dao.getTeamByid(id)
                .then(t => {
                    if (t == undefined) {
                        res.send(bodymaker.makeJson(5, 'team not found'));
                        return;
                    }
                    if (t.AdminId != u.id) {
                        res.send(bodymaker.makeJson(4, 'you are not admin'));
                        return;
                    }
                    var body = req.body;
                    return team_dao.setTeamInfo(t, body)
                        .then(() => {
                            res.send(bodymaker.makeJson(0, ''));
                        }).catch(err => {
                            res.send(bodymaker.makeJson(1, err));
                        })
                })

        })
}

//不检查权限
function getTeamInfo(req, res) {
    var id = req.params.id;
    var team;
    var teambody;
    team_dao.getTeamByid(id)
        .then(t => {
            if (!t) {
                throw new Error('team not found')
            }
            team = t;
            teambody = bodymaker.makeTeamInfo(t, true);
            return t.countProjects();
        })
        .then(c => {
            teambody.projectCount = c;
            return team.countMember()
        })
        .then(ms => {
            teambody.memberCount = ms;
            var body = bodymaker.makeBodyOn(0, '', 'data', teambody);
            res.send(JSON.stringify(body));
        })
        .catch(err => {
            res.send(JSON.stringify(bodymaker.makeJson(1, err)));
        })
}


function getTeamList(req, res) {
    var id = req.params.id;
    var session = req.cookies['sessionId'];
    account_dao.getUser(session)
        .then(u => {
            return team_dao.getTeamList(u);
        })
        .then(tlist => {
            var all = req.query.allcolumn;
            if (all == 'true')
                all = true;
            else all = false;

            var teambody = bodymaker.makeTeamInfoArray(tlist, all);
            var body = bodymaker.makeBodyOn(0, '', 'data', teambody);
            res.send(JSON.stringify(body));
        }).catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}


/**
 * 
 *  删除团队成员
 * @param {any} req
 * @param {any} res
 * @param {any} memberid
 * @param {any} isOut 当为true时表示自己退出团队，false时表示踢掉别人
 */
function deleteMemberFromTeam(req, res, memberid, isOut) {
    var session = req.cookies['sessionId'];
    var teamid = req.params.teamid;
    var reciever = memberid; ////删除后通知被删除的人
    var team;
    account_dao.getUser(session)
        .then(u => {

            if (!isOut && u.id == memberid)//如果是删除成员且要删除的人是自己
                throw new Error('you can not delete yourself');


            return team_dao.getTeamByid(teamid)
                .then(t => {
                    if (t == undefined)
                        throw new Error('team not found');
                    team = t;

                    if (!isOut && t.AdminId != u.id)//如果是要删除成员但自己不是管理员
                        throw new Error('you are not admin in this team');

                    if (isOut && t.AdminId == u.id)  //如果是要退出团队但自己是管理员
                        throw new Error('you are admin in this team');

                    if (isOut)//如果是退出，则删除的人是自己
                    {
                        memberid = u.id;
                        reciever = t.AdminId;//删除后通知团队管理员
                    }

                    return [t.getProjects(), t.removeMember(memberid)]//删除这个人的成员身份,再删除这个人的一些痕迹
                })
                //获取团队的所有项目
                .spread((ps) => {

                    if (ps == undefined || ps.length == 0)
                        return;

                    var pid = [];
                    for (var i = 0; i < ps.length; i++) {
                        pid[i] = ps[i].id;
                    }
                    //删除 属于这个团队，且由这个人创建的所有任务
                    return MyModel.Task.destroy({
                        where: {
                            projectId: {
                                $in: pid
                            },
                            AdminId: memberid
                        }
                    })
                })
                .then(() => {
                    res.send(bodymaker.makeJson(0, ''));

                    return account_dao.getDeviceIds([reciever]);
                })
                .then(ids => {
                    if (ids.length > 0) {
                        var content;
                        if (reciever == memberid)
                            content = bodymaker.makePushContentJson('nm', '', '你已经被移出团队 ' + team.teamName);
                        else
                            content = bodymaker.makePushContentJson('nm', '', '团队成员 ' + u.nickName + '已经退出团队 ' + team.teamName);
                        client.pushToDevices(ids, '团队消息', content);

                        console.log('推送成员删除消息 ' + content);
                    }
                })
                .then(() => { }, err => {
                    console.log('推送成员删除消息失败 ' + err.message);
                })
        }).catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}


function addMember(req,res)
{
    account_dao.getUserByReq(req)
    .then(u=>{
        return team_dao.getTeamByid(req.params.teamid)
        .then(t=>{
            if(!t)
                throw new Error('team not found');
            // 当表示接受团队的邀请时，t.AdminId!=u.id
            // if(t.AdminId!=u.id)
            //      throw new Error('you are not team admin');

            return t.addMember(req.query.memberid);
        })
        .then(()=>{
            res.json(bodymaker.makeBody(0,''));
        })
    })
    .catch(err=>{
        res.json(bodymaker.makeBody(1,err.message));
    })
}


function deleteMember(req, res) {

    if (req.query.memberid == undefined) {
        res.send(bodymaker.makeJson(7, 'query params "memberid" is expected'));
    }
    deleteMemberFromTeam(req, res, req.query.memberid, false);
}


function leaveTeam(req, res) {
    deleteMemberFromTeam(req, res, {}, true)
}

function dissolveTeam(req, res) {
    var session = req.cookies['sessionId'];
    account_dao.getUser(session)
        .then(u => {
            return team_dao.getTeamByid(req.params.teamid)
                .then(t => {
                    if (t == undefined)
                        throw new Error('team not found');
                    if (t.AdminId != u.id)
                        throw new Error('you are not the admin of the team');
                    return t.destroy();
                })
                .then(() => {
                    res.send(bodymaker.makeJson(0, ''));
                })
        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}

function setTeamAvatar(req, res) {
    var session = req.cookies['sessionId'];

    account_dao.getUser(session)
        .then(u => {
            return team_dao.getTeamByid(req.params.teamid)
                .then(t => {
                    if (t == undefined)
                        throw new Error('team not found');
                    if (t.AdminId != u.id)
                        throw new Error('you are not the admin of the team');

                    //检查是否带有图片
                    var contentype = req.headers['content-type'] + '';
                    if (contentype == undefined || contentype.indexOf('multipart/form-data') != 0) {
                        res.send(JSON.stringify(bodymaker.makeBody(1, 'no image or error content-type')));
                        return;
                    }
                    var form = new formidable.IncomingForm();
                    form.uploadDir = +__dirname + "/../image";
                    form.encoding = 'utf-8';		//设置编辑
                    form.keepExtensions = true;	 //保留后缀
                    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
                    form.parse(req, function (err, fields, files) {
                        if (err) {
                            res.send(JSON.stringify(bodymaker.makeBody(0, 'fail to upload image :' + err)));
                            return;
                        }
                        if (files.length == 0 || files['img'] == undefined) {
                            res.send(JSON.stringify(bodymaker.makeBody(0, 'file not found,"img" key is expected')));
                            return;
                        }
                        var hash = util.MD5(new Date().getMilliseconds() + '');
                        var extName = '.jpg';  //后缀名
                        var newPath = form.uploadDir + '/team_' + t.id + '_' + hash + extName;
                        fs.renameSync(files['img'].path, newPath);  //重命名
                        //删除旧头像

                        if (t.avatarUrl) {
                            var old = form.uploadDir + '/team_' + t.id + '_' + t.avatarUrl + extName;
                            if (fs.existsSync(old))
                                fs.unlinkSync(old);
                        }

                        team_dao.setTeamInfo(t, { avatarUrl: hash })
                        res.send(JSON.stringify(bodymaker.makeBody(0, '')));
                    })
                })
        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}


function searchTeam(req, res) {
    if (req.query.query != undefined) {
        var p = {
            id: req.query.query,
            teamName: req.query.query
        }
    } else if (req.query.id != undefined) {
        var p = {
            id: req.query.id,
        }
    } else if (req.query.teamName != undefined) {
        var p = {
            teamName: req.query.teamName
        }
    } else {
        res.send(bodymaker.makeJson(1, 'query params not found ,you should set url params like /search?teamName=xxx'))
        return
    }
    account_dao.getUserByReq(req)
        .then(u => {
            return team_dao.getTeamList(u);
        })
        .then(ts => {
            var ids = [];
            ts.forEach(e => {
                ids.push(e.id);
            });
            return team_dao.queryTeam(p, req.query.limit, req.query.offset, ids);
        })
        .then(ts => {
            if (ts == undefined)
                throw new Error('team not found');
            var tbody = bodymaker.makeTeamInfoArray(ts, true);
            var body = bodymaker.makeBodyOn(0, '', 'data', tbody);
            res.json(body);
        })
        .catch(err => {
            res.json(bodymaker.makeBody(1, err.message));
        })
}

function getTeamPoject(req, res) {
    var team;
    account_dao.getUserByReq(req)
        .then(u => {
            return team_dao.getTeamByid(req.params.teamid)
                .then(t => {
                    if (!t)
                        throw new Error('team not found');
                    team = t;
                    return t.hasMember(u.id);
                })
                .then(has => {
                    if (!has)
                        throw new Error('you are not the member of team');
                    var state = req.query.state || 'all';
                    if (state != 'all' && state != 'file' && state != 'unfile')
                        throw new Error('error params state')

                    return team_dao.getTeamProject(team, state);
                })
                .then(projects => {
                    var pbody = bodymaker.makeProjectArray(projects);
                    var body = bodymaker.makeBodyOn(0, '', 'data', pbody);
                    res.send(JSON.stringify(body));
                })
        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}

//团队申请
function teamApply(req, res) {
    if (req.query.tid == undefined) {
        res.json(bodymaker.makeBody(7, 'tid not found in query'));
        return;
    }
    var team;
    account_dao.getUserByReq(req)
        .then(me => {
            return team_dao.getTeamByid(req.query.tid)
                .then(t => {
                    if (!t)
                        throw new Error('team not found');
                    team = t;
                    return t.hasMember(me.id);
                })
                .then(has => {
                    if (has)
                        throw new Error('you have been a member in this team');
                    var content = '申请加入团队 '+team.teamName+' ,附加消息：'+req.query.content;
                    return message_dao.sendMessage(me, team.AdminId,content, 1, req.query.tid);
                })
                .then(m => {
                    //创建成功，发送推送
                    res.send(bodymaker.makeJson(0, ''));
                    return account_dao.getDeviceIds([team.AdminId]);
                })
                .then(deviceids => {
                    if (deviceids.length > 0) {
                        var content = bodymaker.makePushContentJson('ms', me.id, '用户' + me.nickName + '申请加入团队 ' + team.teamName);
                        client.pushToDevices(deviceids, '团队申请', content);
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.json(bodymaker.makeBody(1, err.message));
                })

        })
}

function teamInvite(req, res) {
    if (req.query.uid == undefined) {
        res.json(bodymaker.makeBody(7, 'query params <uid> not found'));
        return;
    }
    var to;
    var team;
    account_dao.getUserByReq(req)
        .then(me => {
            return user_dao.getUserbyId(req.query.uid)
                .then(re => {
                    if (!re)
                        throw new Error('user not found');
                    to = re;
                    return team_dao.getTeamByid(req.params.teamid);
                })
                .then(t => {
                    if (!t)
                        throw new Error('team not found');
                    team = t;
                    return t.hasMember(to.id);
                })
                .then(has => {
                    if (has)
                        throw new Error('the user have been in this team');
                    return message_dao.sendMessage(me, to, '邀请你加入团队：' + team.teamName, 0, team.id);
                }).then(m => {
                    //创建成功，发送推送
                    res.json(bodymaker.makeBody(0, ''));
                    return account_dao.getDeviceIds([req.body.recieverId]);
                })
                .then(deviceids => {
                    if (deviceids.length > 0) {
                        var content = bodymaker.makePushContentJson('ms', me.id, '用户' + me.nickName + '邀请你加入团队 ' + team.teamName);
                        client.pushToDevices(deviceids, '团队邀请', content);
                    }
                })
        })
        .catch(err => {
            res.json(bodymaker.makeBody(1, err.message));
        })

}

module.exports = {
    createTeam,
    setTeamInfo, getTeamInfo,
    getTeamMemer, getTeamList,
    deleteMember, leaveTeam,
    dissolveTeam, setTeamAvatar,
    searchTeam, getTeamPoject,
    teamApply, teamInvite,
    addMember
}