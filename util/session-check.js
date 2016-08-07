var bodymaker = require('./respone-builder');
var account_dao = require('../dao/account_dao');

function checker(option) {
    return function check(req, res, next) {
        console.log('check session');
        var s = req.cookies['sessionId'];
        if (s == undefined) {
            var body = bodymaker.makeBody(3, 'can not find sessionid in header');
            res.send(JSON.stringify(body));
            return;
        }
        account_dao.getUser(s)
            .then(u => {
                if (u)
                    next();
                else
                    res.send(bodymaker.makeErrorJson(3, 'you have aleady logout'));
            }).catch(err => {
                res.send(bodymaker.makeErrorJson(3, err));
            })
    }
};
module.exports = checker;
