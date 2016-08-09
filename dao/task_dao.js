var MyModel = require('./define');
var Sequelize = MyModel.sequelize;


function getTaskById(id) {
    return MyModel.Task.findOne({ where: { id: id } });
}

function getTaskwithProject(id) {
    return MyModel.Task.findOne(
        {
            where: { id: id },
            include:[{
                model:MyModel.Project
            }]

        });
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



function createTask(taskparams, user) {
    return MyModel.Task.create({
        title: taskparams.title,
        content: taskparams.content,
        startDate: taskparams.startDate,
        endDate: taskparams.endDate,
        location: taskparams.location,
        projectId: taskparams.projectId,
        AdminId: user.id
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





module.exports = {
    getTaskById, getAllTasks,
    getUnfinishTask, createTask,
    setTask,getTaskwithProject
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


