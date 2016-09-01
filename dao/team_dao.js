var MyModel = require('./define');
var Sequelize = MyModel.sequelize;


/**
 * 创建团队
 * @param {any} user Model.User
 * @param {any} teamname
 * @returns t
 */
function createTeam(user, teamname) {
    return MyModel.Team.create(
        {
            teamName: teamname,
            AdminId: user.id
        }
    ).then(t => {
        return t.addMember(user);
    });
}

//获取团队成员
function getTeamMembers(teamid, limit, offset) {
    limit = limit&&limit>0? limit:100;
    offset = offset&&offset>0? offset: 0;

    return MyModel.TeamMember.findAll({
        where: {
            teamId: teamid
        }
    }).then(tm => {
        var ids =new Array();
        for (var i = 0; i < tm.length; i++) {
            ids[i] = tm[i].userId;
        }    
        return MyModel.User.findAll(
            {
                where:
                {
                    id: {$in: ids}
                },
                limit:limit,
                offset:offset
            })
    })
}

//获取团队
function getTeamByid(teamid) {
    return MyModel.Team.findOne({
        where: {
            id: teamid
        }
    });
}
//删除团队成员
function removeTeamMember(team, user) {
    return getTeamByid(teamid).then(t => {
        return t.removeMember(user);
    });
}

//增加团队成员
function addTeamMember(teamid, user) {
    return getTeamByid(teamid)
        .then(t => {
            return t.addMember(user);
        });
}

//修改团队资料
function setTeamInfo(team, params) {

    team.summary = params.summary || team.summary;
    team.teamName = params.teamName || team.teamName;
    team.notice = params.notice || team.notice;
    return team.save();
}

//获取团队列表
function getTeamList(user) {
    return user.getTeam();
}



//查询团队,查询参数：id 、teamName
function queryTeam(params) {
    var sql = 'select * from teams where ';
    var flag = false;
    if (params.id) {
        sql = sql + 'id = \''+ params.id +'\' or ';
        flag = true;
    }
    if (params.teamName) {
        sql = sql + "teamName like '%" + params.teamName + "%' or ";
        flag = true;
    }
    if (!flag)
        return new Promise((resolve, reject) => { resolve() });
    if (flag) {
        sql += '1=2';
    }
    return Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
}

function getTeamProject(team,state) {

    var where = {
        teamId:team.id
    }

    if(state=='file')
        where.file =1;
    else if(state=='unfile')
        where.file = 0;

    return MyModel.Project.findAll({where:where})
}


module.exports = { 
    queryTeam, 
    getTeamList, 
    setTeamInfo, 
    addTeamMember,
    removeTeamMember, 
    getTeamByid,
    getTeamMembers,
    createTeam ,
    getTeamProject
}


//获取成员数量
// function getTeamMemberCount(team)
// {
//     return team.countMember();
// }

// getTeamByid(1).then(t=>{
//    return getTeamMemberCount(t)
// }).then(count=>{
//     console.log(count);
// })

// getTeamByid(7).then(t=>{
//   return  t.getProjects();
// }).then(p=>{
//     console.log(p);
// })

// MyModel.User.findOne().then(u=>{
//     return getTeamList(u);
// }).then((t)=>{
//     console.log(t);
// })


// queryTeam({teamName:'la'}).then(t=>{
//     console.log(t);
// })

// getTeamByid(7).then(t=>{
//     return t.getAdmin();
// }).then(u=>{
//     add
// })

//.spread()

// getTeamMembers(7).then(users=>{
//     console.log(users);
// })

//module.exports = {createTeam}


