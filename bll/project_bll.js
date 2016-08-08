var team_dao = require('../dao/team_dao');
var bodymaker = require('../util/respone-builder');
var account_dao = require('../dao/account_dao');
var project_dao = require('../dao/project_dao');
var team_dao = require('../dao/team_dao');


function createProject(req,res) {
    account_dao.getUserByReq(req)
    .then(u=>{
        var teamid = req.body.teamid;
        var pname = req.body.projectname;
        if(teamid==undefined||pname==undefined)
            throw new Error('post params not found');
        return [team_dao.getTeamByid(teamid),u];
        
    })
    .spread((t,u)=>{
        if(t==undefined)
            throw new Error('team not found');
        
        if(t.AdminId!=u.id)
            throw new Error('you are not the admin of the team');

         return project_dao.createProject(t,req.body.projectname);   
    })
    .then(()=>{
        res.send(bodymaker.makeJson(0,''));
    })
    .catch(err=>{
        res.send(bodymaker.makeJson(1,err.message));        
    })

}


module.exports = {createProject}