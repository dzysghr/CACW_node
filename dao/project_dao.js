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

function createPrivateProject(user,projectname) {
    return MyModel.Project.create({
        name: projectname,
        isPrivate:1,
        AdminId:user.id
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

    var list  = [];
    for (var i = 0; i < teams.length; i++) {
         list[i] =  teams[i].id;
    }

    return MyModel.Project.findAll({
        where: {
            teamId:{
                $in:list
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


//获取用户项目列表
function getProjectsByUser(user) {
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
        return MyModel.Project.findAll({
            where: {
                $or:
                [
                    {teamId: {$in:list}},
                    {AdminId : user.id}
                ]
            },
            include:[{
                model:MyModel.Team
            }]
        })
    })
}

function getProjectById(id) {
    return MyModel.Project.findOne({ 
        where: { id: id },
        include:[{
            model:MyModel.Team
        }]
    
});
}

function getProjectTask(pid,state)
{
}

module.exports ={
    createProject,
    createPrivateProject,
    getProjectByTeam,
    getTeamProjectCount,
    getProjectsByUser,
    getProjectById,
    getProjectByTeamArray,
    getProjectTask
}
