function makeBody(code, msg) {
    var resbody = {
        state_code: code,
        error_msg:msg
    }
    return resbody;
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


module.exports = {makeBody,makeErrorJson,makeUserInfo,makeBodyOn};