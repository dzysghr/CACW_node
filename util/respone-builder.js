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


function makeUserInfoList(users,all)
{
    var list =[];
    for (var i = 0; i < users.length; i++) {
         list[i] = makeUserInfo(users[i],all);
    }
    return list;
}


/**
 *  
 *  构造用户信息对象 
 * @param {any} user Model对象
 * @param {any} all 是否包含用户所有信息，默认为true
 * @returns
 */
function makeUserInfo(user, all) {
    if(all==undefined)
        all= true;
    
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
    }else{
        var u = {
            id: user.id,
            username: user.username,
            nickName: user.nickName
        }
    }
    return u;
}


function makeTeamInfo(team) {
    var t = {
        id: team.id,
        teamName: team.teamName,
        summary: team.summary,
        notice: team.notice,
        AdminId: team.AdminId
    }
    return t;
}


module.exports = { makeTeamInfo, makeBody, makeErrorJson, makeUserInfo, makeBodyOn, makeJson,makeUserInfoList};