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


module.exports = {makeBody,makeErrorJson};