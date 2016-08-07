var MyModel = require('./define');
var Sequelize = MyModel.sequelize;


function getTaskById(id) {
    return MyModel.Task.findOne({ where: { id: id } });
}

function getAllTasks(user) {
    return user.getTask();
}

function getFinishedTask(user) {
    return user.getTask({
        where: {
            finish: 2
        }
    });
}

function getUnfinishTask(user) {
    return user.getTask({
        where: {
            finish: 1
        }
    });
}


function createTask(taskparams, user, projectid) {
    return MyModel.Task.create({
        title: taskparams.title,
        content: taskparams.content,
        startDate: taskparams.startDate,
        endDate: taskparams.endDate,
        location: taskparams.location,
        projectId: projectid,
        adminId: user.id
    }).then(t => {
        return t.addMember(user, { finish: 1 });
    })
}

//修改任务
function setTask(params) {
    return MyModel.Task.findOne({ where: { id: params.id } })
        .then(t => {
            t.title = params.title == undefined ? t.title : params.title;
            t.content = params.content == undefined ? t.content : params.content;
            t.startDate = params.startDate == undefined ? t.startDate : params.startDate;
            t.endDate = params.endDate == undefined ? t.endDate : params.endDate;
            t.location = params.location == undefined ? t.location : params.location;
            return t.save();
        })
}

//设置成员
function setTaskMember(task, memberids, user) {
    var have = false;
    var ids = [];
    for (var i = 0; i < memberids.length; i++) {
        if (memberids[i].id == user.id) {
            have = true;
        }
        ids[i] = memberids[i].id;
    }
    if (!have)
        return new Promise((resolve, reject) => { reject('taskMember have no yourself') });

    return task.setMembers([])
        .then(() => {
            return MyModel.User.findAll({
                where: {
                    id: {
                        $in: ids
                    }
                }
            })
        }).then(users=>{
           return task.setMember(users);
        })
}

//获取任务成员，调用task.getMember()
//删除任务，调用 task.destroy(),会自动删除成员


// MyModel.Task.findOne().then(t=>{
//  return t.destroy()
// }).then(()=>{
//     console.log('xxx');
// })

// function deleteTask(task) {
//     return task.setMember([]).then(()=>{
//         task.
//     })
// }

// MyModel.Task.findOne().then(t => {
//     return t.setMember([]);
// }).then(() => {
//     console.log('xxx');
// })


