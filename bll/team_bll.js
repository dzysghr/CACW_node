var team_dao = require('../dao/team_dao');
var bodymaker = require('../util/respone-builder');
var account_dao = require('../dao/account_dao');
var formidable = require('formidable')
var fs = require('fs');


function createTeam(req, res) {
    var teamname = req.params.teamname;
    var s = req.cookies['sessionId'];

    account_dao.getUser(s).then(u => {
        return team_dao.createTeam(u, teamname)
    })
        .then((t) => {
            //检查是否带有图片
            var contentype = req.headers['content-type'] + '';
            if (contentype == undefined || contentype.indexOf('multipart/form-data') != 0) {
                res.send(JSON.stringify(bodymaker.makeBody(0, 'no image')));
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
                var extName = '';  //后缀名
                switch (files['img'].type) {
                    case 'image/pjpeg':
                        extName = '.jpg';
                        break;
                    case 'image/jpeg':
                        extName = '.jpg';
                        break;
                    case 'image/png':
                        extName = '.png';
                        break;
                    case 'image/x-png':
                        extName = '.png';
                        break;
                }

                var newPath = form.uploadDir + '/team_' + t.id + extName;
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
                    if (us == undefined) {
                        throw new Error('no result from getTeamMembers,please check you limit or offset params');
                    }
                    var all = false;
                    if (req.query.allcolumn == undefined)
                        all = false;
                    else if (req.query.allcolumn == 'true')
                        all = true;
                    var userlist = bodymaker.makeUserInfoArray(us, all);
                    var body = bodymaker.makeBodyOn(0, '', 'member', userlist);
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
    account_dao.getUser(session).then(u => {
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


function getTeamInfo(req, res) {
    var id = req.params.id;
    team_dao.getTeamByid(id).then(t => {
        if (t == undefined) {
            res.send(bodymaker.makeJson(5, 'team not found'));
            return;
        }
        var teambody = bodymaker.makeTeamInfo(t);
        var body = bodymaker.makeBodyOn(0, '', 'team', teambody);
        res.send(JSON.stringify(body));
        //检查是否需要返回成员
        // var count = req.query.withMember;
        // if (count == undefined || count <= 0) {
        //     var body = bodymaker.makeBodyOn(0, '', 'team', teambody);
        //     res.send(JSON.stringify(body));
        //     return;
        // }
        // return body;
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
            var body = bodymaker.makeBodyOn(0, '', 'teams', teambody);
            res.send(JSON.stringify(body));
        }).catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}


function deleteMember(req, res) {
    if (req.query.memberid == undefined) {
        res.send(bodymaker.makeJson(7, 'query params "memberid" is expected'));
    }
    var session = req.cookies['sessionId'];
    var teamid = req.params.teamid;
    account_dao.getUser(session)
        .then(u => {
            if (u.id == req.query.memberid)//如果要删除的人是自己
                throw new Error('you can not delete yourself');

            return team_dao.getTeamByid(teamid)
                .then(t => {
                    if (t == undefined)
                        throw new Error('team not found');
                    if (t.AdminId != u.id)
                        throw new Error('you are not admin in this team');

                    return t.removeMember(req.query.memberid)
                })
                .then(() => {
                    res.send(bodymaker.makeJson(0, ''));
                })
        }).catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}


function leaveTeam(req, res) {
    var session = req.cookies['sessionId'];
    account_dao.getUser(session)
        .then(u => {
            return team_dao.getTeamByid(req.params.teamid)
                .then(t => {
                    if (t == undefined)
                        throw new Error('team not found');
                    if (t.AdminId == u.id)
                        throw new Error('you can not leave the team you created');

                    return [t.hasMember(u), t];
                })
                .spread((have, t) => {
                    if (!have)
                        throw new Error('you are not member of the team');
                    return t.removeMember(u.id);
                })
                .then(() => {
                    res.send(bodymaker.makeJson(0, ''));
                })
        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
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
                        var extName = '';  //后缀名
                        switch (files['img'].type) {
                            case 'image/pjpeg':
                                extName = '.jpg';
                                break;
                            case 'image/jpeg':
                                extName = '.jpg';
                                break;
                            case 'image/png':
                                extName = '.png';
                                break;
                            case 'image/x-png':
                                extName = '.png';
                                break;
                        }

                        var newPath = form.uploadDir + '/team_' + t.id + extName;
                        fs.renameSync(files['img'].path, newPath);  //重命名
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

    team_dao.queryTeam(p)
        .then(ts => {
            if (ts == undefined)
                throw new Error('team not found');
            var tbody = bodymaker.makeTeamInfoArray(ts, true);
            var body = bodymaker.makeBodyOn(0, '', 'teams', tbody);
            res.send(JSON.stringify(body));
        })
        .catch(err => {
            res.send(bodymaker.makeJson(1,err.message));
        })
}

module.exports = {
    createTeam,
    setTeamInfo, getTeamInfo,
    getTeamMemer, getTeamList,
    deleteMember, leaveTeam,
    dissolveTeam, setTeamAvatar,
    searchTeam
}