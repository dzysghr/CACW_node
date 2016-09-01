function BaseError(code,msg)
{
    var e  = new Error(msg);
    e.code = code;
    return e;
}

module.exports = BaseError