var MyModel = require('./define');
var Sequelize = MyModel.sequelize;


function getTaskById(id) {
    return MyModel.Task.findOne(
        {
            where: { id: id },
            include: [{
                model: MyModel.Project
            }]
        });
}

function getTaskwithProject(tid) {
    return MyModel.Task.findOne(
        {
            where: { id: tid },
            include: [{
                model: MyModel.Project
            }]

        });
}

function getAllTasks(user) {
    return user.getTask(
        {
            include: [{
                model: MyModel.Project
            }]
        }
    );
}

function getFinishedTask(user) {
    return user.getTask(
        {
            where:{
                finish:1
            },
            include: [{
                model: MyModel.Project
            }]
        }
    );
    // return getAllTasks(user)
    //     .then(ts => {
    //         if (ts.length == 0)
    //             return;
    //         var tlist = [];
    //         for (var i = 0; i < ts.length; i++) {
    //             if (ts[i].finish == 1)
    //                 tlist[i] = ts[i];
    //         }
    //         return tlist;
    //     })
}


function getUnfinishTask(user) {
    return user.getTask(
        {
            where:{
                finish:0
            },
            include: [{
                model: MyModel.Project
            }]
        }
    );
}



function createTask(taskparams, user) {
    return MyModel.Task.create({
        title: taskparams.title,
        content: taskparams.content,
        startDate: taskparams.startDate,
        endDate: taskparams.endDate,
        location: taskparams.location,
        projectId: taskparams.projectId,
        AdminId: user.id,
        finish: 0
    })
    .then(t=>{
        return getTaskById(t.id);
    });
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


function getTaskMembers(task) {
    return task.getMember();
}


function setTaskFinish(task, user) {
    return MyModel.Task.update({ finish: 1}, 
        {
            where: {
                id: task.id
            }
        })
}

module.exports = {
    getTaskById, getAllTasks, getFinishedTask,
    getUnfinishTask, createTask,
    setTask, getTaskwithProject,
    getTaskMembers, setTaskFinish
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


