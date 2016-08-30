var MyModel = require('./define');
var Sequelize = MyModel.sequelize;


//创建项目，返回空
function createProject(team, projectname) {
    return MyModel.Project.create({
        name: projectname
    }).then(p => {
        return p.setTeam(team);
    })
}

function createPrivateProject(user, projectname) {
    return MyModel.Project.create({
        name: projectname,
        isPrivate: 1,
        AdminId: user.id
    });
}


//获取团队项目列表
function getProjectByTeam(team) {
    return MyModel.Project.findAll({
        where: {
            teamId: team.id
        }
    })
}

//获取团队项目列表
function getProjectByTeamArray(teams) {

    var list = [];
    for (var i = 0; i < teams.length; i++) {
        list[i] = teams[i].id;
    }

    return MyModel.Project.findAll({
        where: {
            teamId: {
                $in: list
            }
        }
    })
}



//获取团队项目数量
function getTeamProjectCount(team) {
    return MyModel.Project.count({
        where: {
            teamId: team.id
        }
    })
}


function getPrivateProject(user, state) {

    var where = {
        AdminId:user.id
    };
    if (state == 'file')
        where.file = 1;
    else if (state == undefined || state == 'unfile')
        where.file = 0;

    return MyModel.Project.findAll({
        where: where
    })
}



/**
 * 获取用户项目列表,包括私人和团队
 * @param {any} user 用户
 * @param {any} state file unfile all
 * @returns
 */
function getAllProjects(user,state,type) {
    //找出所有的团队
    return user.getTeam().then(teams => {
        //取团队id
        var list = [];
        for (var i = 0; i < teams.length; i++) {
            list.push(teams[i].id);
        }
        return list;
    }).then(list => {
        //找出项目所属团队在id列表中
        var where = {
            $or:
            [
                { teamId: { $in: list } },
                { AdminId: user.id }
            ]
        };
        if (state == 'file')
            where.file = 1;
        else if (state == undefined || state == 'unfile')
            where.file = 0;
        if(type=='team')
            where.isPrivate=0;

        return MyModel.Project.findAll({
            where: where,
            include: [{
                model: MyModel.Team
            }]
        })
    })
}

function getProjectById(id) {
    return MyModel.Project.findOne({
        where: { id: id },
        include: [{
            model: MyModel.Team
        }]

    });
}

function getProjectTask(project, state) {
       var where = {
        ProjectId:project.id
    }
    if(state=='finished')
      where.finish = 1;
    else if(state=='unfinish')
      where.finish = 0;
    return MyModel.Task.findAll({
        where:where,
        include:[
            {
                model: MyModel.Project
            }
        ]
    });
}

function fileProject(project)
{
     return project.update({
         file:1
     })
     .then(()=>{
            MyModel.Task.update({finish:1},{
                where:{
                    projectId:project.id
                }
            })
     })
}

module.exports = {
    createProject,
    createPrivateProject,
    getProjectByTeam,
    getTeamProjectCount,
    getAllProjects,
    getProjectById,
    getProjectByTeamArray,
    getProjectTask,
    getPrivateProject,
    fileProject
}
