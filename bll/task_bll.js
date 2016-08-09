var bodymaker = require('../util/respone-builder');
var account_dao = require('../dao/account_dao');
var project_dao = require('../dao/project_dao');
var team_dao = require('../dao/team_dao');
var task_dao = require('../dao/task_dao');


function createTask(req, res) {

    var body = req.body;


    if ((body.title && body.content
        && body.location && body.projectId
        && body.startDate && body.endDate
        && body.members) == undefined) {
        res.send(bodymaker.makeJson(1, 'params error'));
        return;
    }

    account_dao.getUserByReq(req)
        .then(u => {
            return project_dao.getProjectById(body.projectId)
                .then(p => {
                    if (p == undefined)
                        throw new Error('projectid not found');
                    return [p.getTeam(),p];
                })
                .spread((t, p) => {
           
                    //检查成员里是否有自己
                    var f = false;
                    for (var id in body.members) {
                        if (id == u.id) {
                            f = true;
                            break;
                        }
                    }
                    if (f)
                        return t.hasMember(body.members);//检查所有成员是不是都在这个团队

                    throw new Error('you are not in members');
                })
                .then(ismember => {
                    if (!ismember)
                        throw new Error('Some userid are not from the team of the project');  
                        return task_dao.createTask(req.body,u);
                    })
                .then(t=>{
                    if(t==undefined)
                        throw new Error('task create error');
                    return task_dao.setTaskMember(t,req.body.members);
                })
                .then(()=>{
                    res.send(bodymaker.makeJson(0,''));
                })
        })
        .catch(err=>{
            res.send(bodymaker.makeJson(1,err.message));
        })




}

module.exports = { createTask }