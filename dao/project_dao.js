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

//获取团队项目列表
function getProjectByTeam(team) {
    return MyModel.Project.findAll({
        where: {
            teamId: team.id
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
function getProjectByUser(user) {
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
                teamId: {
                    $in: list
                }
            }
        })
    })
}

function getProjectById(id) {
    return MyModel.Project.findOne({ where: { id: id } });
}


getProjectById(1).then(p => {
    return p.destroy();
})



//todo
function delProject(id) {
    return MyModel.Project.findOne({ where: { id: id } }).then(p)
}
