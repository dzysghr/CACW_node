function makeBody(code, msg) {
    var resbody = {
        state_code: code,
        error_msg: msg
    }
    return resbody;
}

function makeJson(code, msg) {
    var resbody = {
        state_code: code,
        error_msg: msg
    }
    return JSON.stringify(resbody);
}

function makeErrorJson(code, msg) {
    var resbody = {
        state_code: code,
        error_msg: msg
    }
    return JSON.stringify(resbody);
}


function makeBodyOn(code, msg, childname, body) {
    var resbody = {
        state_code: code,
        error_msg: msg,
        [childname]: body
    }
    return resbody;
}


function makeUserInfoArray(users, all) {
    var list = [];
    for (var i = 0; i < users.length; i++) {
        list[i] = makeUserInfo(users[i], all);
    }
    return list;
}


/**
 *  
 *  构造用户信息对象 
 * @param {any} user Model对象
 * @param {any} all 是否包含用户所有信息，默认为false
 * @returns
 */
function makeUserInfo(user, all) {
    if (all == undefined)
        all = false;

    if (all) {
        var u = {
            id: user.id,
            username: user.username,
            mobilePhone: user.mobilePhone,
            sex: user.sex,
            summary: user.summary,
            nickName: user.nickName,
            avatarUrl: user.avatarUrl,
            address: user.address,
            shortNumber: user.shortNumber,
            email: user.email
        }
    } else {
        var u = {
            id: user.id,
            username: user.username,
            nickName: user.nickName
        }
    }
    return u;
}

function makeTeamInfoArray(teams, all) {
    var list = [];
    for (var i = 0; i < teams.length; i++) {
        list[i] = makeTeamInfo(teams[i], all);
    }
    return list;
}


function makeTeamInfo(team, all) {

    if (all == undefined)
        all = false;
    if (all) {
        var t = {
            id: team.id,
            teamName: team.teamName,
            summary: team.summary,
            notice: team.notice,
            AdminId: team.AdminId
        }
    } else {
        var t = {
            id: team.id,
            teamName: team.teamName
        }
    }
    return t;
}

function makeProject(proj) {

    var p={
        id:proj.pid,
        name:proj.pname,
        team:{
            id:proj.team.id,
            name:proj.team.teamName
        }
    }
    return p
}

function makeProjectArray(projects) {

    var list= [];

    for (var i = 0; i < projects.length; i++) {
           list[i] = makeProject(projects[i]);
    }
    return list;
}

function makeTaskInfo(task) {
    var t={
        id:task.id,
        title:task.title,
        content:task.content,
        location:task.location,
        startDate:task.startDate,
        endDate:task.endDate,
        AdminId:task.AdminId,
        project:{
            id:task.project.id,
            name:task.project.name
        }
    }
    return t;
}

function makeTaskInfoArray(tasks) {
    if(!tasks||tasks.length==0)
        return [];

    var array = [];
    for (var i = 0; i < tasks.length; i++) {
            array[i] = makeTaskInfo(tasks[i]);
    }
    return array;
}

function makeTaskMembers(users) {
    if(!users||users.length==0)
        return [];
        var array = []
    for (var i = 0; i < users.length; i++) {
         array[i] =makeTaskMember(users[i]);
    }
    return array;
}

function makeTaskMember(user) {
    var u={
        id:user.id,
        username:user.username,
        nickName:user.nickName,
        finish:user.taskmember.finish
    }
    return u;
}



module.exports = {
    makeTeamInfo,
    makeBody,
    makeErrorJson,
    makeUserInfo,
    makeBodyOn,
    makeJson,
    makeUserInfoArray,
    makeTeamInfoArray,
    makeProject,
    makeProjectArray,
    makeTaskInfo,
    makeTaskInfoArray,
    makeTaskMember,
    makeTaskMembers
};