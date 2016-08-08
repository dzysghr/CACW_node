function makeBody(code, msg) {
    var resbody = {
        state_code: code,
        error_msg:msg
    }
    return resbody;
}

function makeJson(code, msg) {
    var resbody = {
        state_code: code,
        error_msg:msg
    }
    return JSON.stringify (resbody);
}

function makeErrorJson(code, msg) {
    var resbody = {
        state_code: code,
        error_msg:msg
    }
    return JSON.stringify (resbody);
}


function makeBodyOn(code,msg,childname,body)
{
    var resbody = {
        state_code: code,
        error_msg:msg,
        [childname]:body
    }
    return resbody;
}

function makeUserInfo(user) {
    var u={
        id:user.id,
        username:user.username,
        mobilePhone:user.mobilePhone,
        sex:user.sex,
        summary:user.summary,
        nickName:user.nickName,
        avatarUrl:user.avatarUrl,
        address:user.address,
        shortNumber:user.shortNumber,
        email:user.email
    }
    return u;
}


function makeTeamInfo(team) {
    var t={
        id:team.id,
        teamName:team.teamName,
        summary:team.summary,
        notice:team.notice,
        AdminId:team.AdminId
    }
    return t;
}


module.exports = {makeTeamInfo,makeBody,makeErrorJson,makeUserInfo,makeBodyOn,makeJson};