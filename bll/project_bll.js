var team_dao = require('../dao/team_dao');
var bodymaker = require('../util/respone-builder');
var account_dao = require('../dao/account_dao');
var project_dao = require('../dao/project_dao');
var team_dao = require('../dao/team_dao');


function createProject(req, res) {
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

                    if (t.AdminId != u.id)
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
            return project_dao.getProjectsByUser(u);
        })
        .then(projects=>{
            
            var pbody = bodymaker.makeProjectArray(projects);
            var body = bodymaker.makeBodyOn(0,'','projects',pbody);

            res.send(JSON.stringify(body));

        })
        .catch(err=>{
            res.send(bodymaker.makeJson(1,err.message));
        })
}

function getProjectInfo(req,res)
{
    var id = req.params.id;
    project_dao.getProjectById(id)
    .then(p=>{
        if(p==undefined)
            throw new Error('project not found');

        var pbody = bodymaker.makeProject(p);
        var body = bodymaker.makeBodyOn(0,'','project',pbody);
        res.send(JSON.stringify(body));
    })
    .catch(err=>{
        res.send(bodymaker.makeJson(1,err.message));
    })
}

function getProjectTask(req,res) {
    
    var pj;
    account_dao.getUserByReq(req)
    .then(u=>{

         return project_dao.getProjectById(req.id)
        .then(p=>{
            if(!p)
                throw new Error('project not found');
            pj  = p;
            return p.getTeam()
        })
        .then(t=>{
            return t.hasMember(u.id)
        })
        .then(has=>{
            if(has)
            {
                
            }

        })

    });


   

}
module.exports = { createProject,
     deleteProject ,
     getProjectList,
     getProjectInfo,
     getProjectTask
    }