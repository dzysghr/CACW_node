var bodymaker = require('./respone-builder');
var account_dao = require('../dao/account_dao');

function checker(option) {
    return function check(req, res, next) {
        var s = req.cookies['sessionId'];
        if (s == undefined) {
            res.send(bodymaker.makeErrorJson(3, 'can not find sessionid in header'));
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
