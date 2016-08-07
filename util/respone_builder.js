function makeBody(code, msg) {
    var resbody = {
        state_code: code,
        error_msg:msg
    }
    return resbody;
}

module.exports = {makeBody};