var MyModel = require('./define');
var Sequelize = MyModel.sequelize;


//创建团队，这里一定要传入Model.User 类型的user
function createTeam(user, teamname) {
    return MyModel.Team.create(
        {
            teamName: teamname,
            adminId: user.id
        }
    ).then(t => {
        return MyModel.User.findOne().then(u => {
            t.addMember(u);
        })
    });
}

//获取团队成员
function getTeamMembers(teamid) {
    return getTeamByid(teamid).then(t => {
        return t.getMember();
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
function removeTeamMember(teamid, user) {
    return getTeamByid(teamid).then(t => {
        return t.removeMember(user);
    });
}

//增加团队成员
function addTeamMember(teamid, user) {
    return getTeamByid(teamid).then(t => {
        return t.addMember(user);
    });
}

//修改团队资料
function setTeamInfo(team){
    return  getTeamByid(team.id).then(t=>{
        t.summary = team.summary==undefined?t.summary:team.summary;
        t.teamName = team.teamName==undefined?t.teamName:team.teamName;
        t.avatarUrl = team.avatarUrl==undefined?t.avatarUrl:team.avatarUrl;
        t.notice = team.notice==undefined?t.notice:team.noticesummary;
        return t.save();
    })
}

//获取团队列表
function getTeamList(user) {
    return user.getTeam();
}



//查询团队,查询参数：id 、teamName
function queryTeam(params) {
    var sql = 'select * from teams where 1=1 or ';
    var flag = false;
    if(params.id)
    {
        sql = sql + 'id = '+params.id+' or ';
        flag = true;
    }
    if(params.teamName)
    {
        sql = sql + "teamName like '%"+params.username+"%' or ";
        flag = true;
    }
    if(!flag)
       return new Promise((resolve, reject) => {resolve()});
    if(flag)
    {
        sql +='1=1';
    }
    return  Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
}


module.exports = {queryTeam,getTeamList,setTeamInfo,addTeamMember,removeTeamMember,getTeamByid,getTeamMembers,createTeam}


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


