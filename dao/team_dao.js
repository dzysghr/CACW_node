var MyModel = require('./define');
var Sequelize = MyModel.sequelize;


/**
 * 创建团队
 * @param {any} user Model.User
 * @param {any} teamname
 * @returns t
 */
function createTeam(user, teamname) {
    var team;
    return MyModel.Team.create(
        {
            teamName: teamname,
            AdminId: user.id
        }
    ).then(t => {
        team = t;
        return t.addMember(user);
    })
    .then(()=>{
        return team;
    });
}

//获取团队成员
function getTeamMembers(teamid, limit, offset) {

    return MyModel.TeamMember.findAll({
        where: {
            teamId: teamid
        }
    }).then(tm => {
        //拿到用户id
        var ids = new Array();
        for (var i = 0; i < tm.length; i++) {
            ids[i] = tm[i].userId;
        }
        var findarg = {
            where:
            {
                id: { $in: ids }
            }
        }
        if (limit > 0)
            findarg.limit = parseInt(limit);
        if (offset > 0)
            findarg.offset = parseInt(offset);

        return MyModel.User.findAll(findarg);
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
    team.avatarUrl = params.avatarUrl || team.avatarUrl;
    return team.save();
}

//获取团队列表
function getTeamList(user) {
    return user.getTeam();
}



//查询团队,查询参数：id 、teamName
function queryTeam(params, limit, offset, except) {

    limit = limit || 10;
    offset = offset || 0;
    limit = parseInt(limit);
    offset = parseInt(offset);

    var $or = [];
    if (params.id) {
        $or.push({ id: params.id });
    }
    if (params.teamName) {
        $or.push({ teamName: { $like: '%' + params.teamName + '%' } });
    }


    var where = {
        $or: $or
    }
    if (except&&except.length!=0)
        where.id = { $notIn: except };

    return MyModel.Team.findAll({
        where: where,
        limit: limit,
        offset: offset
    });
}

function getTeamProject(team, state) {

    var where = {
        teamId: team.id
    }

    if (state == 'file')
        where.file = 1;
    else if (state == 'unfile')
        where.file = 0;

    return MyModel.Project.findAll({
        where: where
    })
}


module.exports = {
    queryTeam,
    getTeamList,
    setTeamInfo,
    addTeamMember,
    removeTeamMember,
    getTeamByid,
    getTeamMembers,
    createTeam,
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


