var bodymaker = require('../util/respone-builder');
var account_dao = require('../dao/account_dao');
var project_dao = require('../dao/project_dao');
var team_dao = require('../dao/team_dao');
var task_dao = require('../dao/task_dao');
var client = require('../util/push')

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
                    return [p.getTeam(), p];
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
                    if (f)//有自己
                        return t.hasMember(body.members);//检查所有成员是不是都在这个团队

                    throw new Error('you are not in members');
                })
                .then(ismember => {
                    if (!ismember)
                        throw new Error('Some userid are not from the team of the project');
                    return task_dao.createTask(req.body, u);
                })
                .then(t => {
                    if (t == undefined)
                        throw new Error('task create error');
                    return t.setMember(req.body.members, { finish: 1 });
                })
                .then(() => {
                    res.send(bodymaker.makeJson(0, ''));
                    //return account_dao.getDeviceIds(req.body.members);
                })
                // .then(deviceids => {
                //     if (deviceids.length > 0)
                //         client.pushToDevices(deviceids,"新任务", req.body.content);
                // })

        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}


function setTaskInfo(req, res) {

    account_dao.getUserByReq(req)
        .then(u => {
            return [task_dao.getTaskById(req.params.taskid), u];
        })
        .spread((t, u) => {
            if (!t)
                throw new Error('task not found');

            if (t.AdminId != u.id)
                throw new Error('you are not admin');


            var body = req.body;
            t.title = body.title || t.title;
            t.content = body.content || t.content;
            t.location = body.location || t.location;
            t.startDate = body.startDate || t.startDate;
            t.endDate = body.endDate || t.endDate;
            return t.save();
        })
        .then(() => {
            res.send(bodymaker.makeJson(0, ''));
        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}

function addTaskMember(req, res) {
    account_dao.getUserByReq(req)
        .then(u => {
            return task_dao.getTaskwithProject(req.params.taskid)
                .then((task) => {
                    if (!task)
                        throw new Error('task not found');

                    if (task.AdminId != u.id)
                        throw new Error('you are not admin');

                    return task.project.getTeam()
                        .then(t => {
                            if (t == undefined)
                                throw new Error(' team not found');
                            return t.hasMember(req.body);
                        })
                        .then((has) => {
                            if (!has)
                                throw new Error('some userid are not from the task\'s team');
                            return task.addMember(req.body, { finish: 1 });
                        })
                        .then(() => {
                            res.send(bodymaker.makeJson(0, ''));
                        })
                })
        }).catch(err => {
            res.send(1, err.message);
        })

}

function removeTaskMember(req, res) {
    account_dao.getUserByReq(req)
        .then(
        u => {
            return task_dao.getTaskwithProject(req.params.taskid)
                .then((task) => {
                    if (!task)
                        throw new Error('task not found');

                    if (task.AdminId != u.id)
                        throw new Error('you are not admin');

                    for (var i = 0; i < req.body.length; i++) {
                        if (u.id == req.body[i]) {
                            throw new Error('you can not remove yourself');
                        }
                    }
                    return task.removeMember(req.body);
                })
                .then(() => {
                    res.send(bodymaker.makeJson(0, ''));
                })
        })
        .catch(err => {

        })


}


function getTaskList(req, res) {

    return account_dao.getUserByReq(req)
        .then(u => {

            if (req.query.state == 'finished')
                return task_dao.getFinishedTask(u);
            if (req.query.state == 'unfinish')
                return task_dao.getUnfinishTask(u);

            return task_dao.getAllTasks(u);
        })
        .then(tasks => {

            var tbody = bodymaker.makeTaskInfoArray(tasks)
            var body = bodymaker.makeBodyOn(0, '', 'tasks', tbody);
            res.send(JSON.stringify(body));
        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}

function getTask(req, res) {
    task_dao.getTaskById(req.params.taskid)
        .then(t => {
            if (!t)
                throw new Error('task not found');
            var taskbody = bodymaker.makeTaskInfo(t);
            var body = bodymaker.makeBodyOn(0, '', 'task', taskbody);
            res.send(JSON.stringify(body));
        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}


function getTaskMembers(req, res) {
    task_dao.getTaskById(req.params.taskid)
        .then(t => {
            if (!t)
                throw new Error('task not fount');
            return task_dao.getTaskMembers(t);
        })
        .then(users => {
            var userbody = bodymaker.makeTaskMembers(users);
            var body = bodymaker.makeBodyOn(0, '', 'members', userbody);
            res.send(JSON.stringify(body));
        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}

function finishTask(req, res) {
    account_dao.getUserByReq(req)
        .then(u => {
            return task_dao.getTaskById(req.params.taskid)
                .then(t => {
                    if (!t)
                        throw new Error('task not fount');
                    return task_dao.setTaskFinish(t, u);
                })
                .then((c, r) => {
                    res.send(bodymaker.makeJson(0, ''));
                })
        })
        .catch(err => {
            res.send(bodymaker.makeJson(1, err.message));
        })
}

function deleteTask(req, res) {

    account_dao.getUserByReq(req)
        .then(u => {
            return task_dao.getTaskById(req.params.taskid)
                .then(t => {
                    if (!t)
                        throw new Error('task not fount');
                    if (u.id != t.AdminId)
                        throw new Error('you are not admin');

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


module.exports = { deleteTask, finishTask, getTaskMembers, createTask, setTaskInfo, addTaskMember, removeTaskMember, getTaskList, getTask }