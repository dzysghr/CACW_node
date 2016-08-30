var team_dao = require('../dao/team_dao');
var bodymaker = require('../util/respone-builder');
var account_dao = require('../dao/account_dao');
var project_dao = require('../dao/project_dao');
var team_dao = require('../dao/team_dao');



function createProject(req, res) {
    if (req.body.teamid == undefined)
        createPriveteProject(req, res);
    else
        createTeamProject(req, res);
}

function createPriveteProject(req, res) {
    account_dao.getUserByReq(req)
        .then(u => {
            if (req.body.projectname == undefined)
                throw new Error('post params projectname not found');
            return project_dao.createPrivateProject(u, req.body.projectname);
        })
        .then(() => {
            res.send(bodymaker.makeJson(0, ''));
        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}

function createTeamProject(req, res) {
    account_dao.getUserByReq(req)
        .then(u => {
            var teamid = req.body.teamid;
            var pname = req.body.projectname;
            if (teamid == undefined || pname == undefined)
                throw new Error('post params not found');
            return [team_dao.getTeamByid(teamid), u];
        })
        .spread((t, u) => {
            if (t == undefined)
                throw new Error('team not found');

            if (t.AdminId != u.id)
                throw new Error('you are not the admin of the team');

            return project_dao.createProject(t, req.body.projectname);
        })
        .then(() => {
            res.send(bodymaker.makeJson(0, ''));
        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })

}

function deleteProject(req, res) {
    account_dao.getUserByReq(req)
        .then(u => {
            return project_dao.getProjectById(req.params.id)
                .then(p => {
                    if (p == undefined)
                        throw new Error('project not found');
                    return [p.getTeam(), p];
                })
                .spread((t, p) => {
                    
                    if(p.isPrivate)
                    {
                        if(p.AdminId==u.id)
                            return p.destroy();
                        else
                            throw new Error('you are not admin of the project');
                    }
                    if (t==undefined||t.AdminId != u.id)
                        throw new Error('you are not admin of the team');
                    return p.destroy();
                })
                .then(() => {
                    res.send(bodymaker.makeJson(0, ''));
                })
        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}

function getProjectList(req, res) {
    account_dao.getUserByReq(req)
        .then(u => {
            var state;
            var type;
            type = req.query.type || 'all';
            if (type != 'private' && type !='all'&&type!='team')
                throw new Error('error params :'+type);

            state = req.query.state || 'unfile';

            if (state != 'all' && state != 'unfile' && state != 'file')
                throw new Error('error state ' + type);

            if (type == 'private')
                return project_dao.getPrivateProject(u, state);
            else
                return project_dao.getAllProjects(u, state,type);
        })
        .then(projects => {
            var pbody = bodymaker.makeProjectArray(projects);
            var body = bodymaker.makeBodyOn(0, '', 'projects', pbody);

            res.send(JSON.stringify(body));

        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}

function getProjectInfo(req, res) {
    var id = req.params.id;
    project_dao.getProjectById(id)
        .then(p => {
            if (p == undefined)
                throw new Error('project not found');


            var pbody = bodymaker.makeProject(p);
            var body = bodymaker.makeBodyOn(0, '', 'project', pbody);
            res.send(JSON.stringify(body));
        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}

function getProjectTask(req, res) {
    var pj;
    account_dao.getUserByReq(req)
        .then(u => {
            return project_dao.getProjectById(req.id)
                .then(p => {
                    if (!p)
                        throw new Error('project not found');

                    if (p.isPrivate)
                        return getPrivateProjectTask(u, p, req.params.state);

                    return getTeamProjectTask(u, p, req.params.state);
                })
                .then(ts => {
                     var tbody = bodymaker.makeTaskInfoArray(ts);
                      res.send(JSON.stringify(bodymaker.makeBodyOn(0,'','tasks',tbody)));
                })
        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        });
}


//获取私人项目的任务，验证用户是否来自团队
function getTeamProjectTask(user, project, state) 
{
    return new Promise(function (res, ref) {
        res();
    })
        .then(() => {
            return project.getTeam();
        })
        .then(t => {
            return t.hasMember(u.id)
        })
        .then(has => {
            if (has) {
                state = state || 'all';
                if (state != 'all' && state != 'finished' && state != 'finished')
                    return Promise.reject('error state');
                return project_dao.getProjectTask(project, state);
            }else
                return new Error('you are not member in project');
        })
}

//获取私人项目的任务，不用验证权限
function getPrivateProjectTask(user, project, state) {
    return new Promise(function (res, ref) {
        res();
    })
        .then(() => {
            state = state || 'all';
            if (state != 'all' && state != 'finished' && state != 'finished')
                return new Error('error state');
            return project_dao.getProjectTask(project, state);
        })
}

module.exports = {
    createProject,
    deleteProject,
    getProjectList,
    getProjectInfo,
    getProjectTask
}