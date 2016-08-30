var bodymaker = require('./respone-builder');
var account_dao = require('../dao/account_dao');
var MyModel = require('../dao/define');


function checker(option) {
    return function check(req, res, next) {
        //console.log(req.headers);
        var s = req.cookies['sessionId'];
        if (s == undefined) {
            res.send(bodymaker.makeJson(3, 'can not find sessionId in header'));
            return;
        }
       return  MyModel.Session.findOne({
            where: {
                Session: s
            },
            attributes:['Session']
        }).then(s => {
            if (s == undefined) {
                res.send(bodymaker.makeJson(3, 'session expired,you have aleady logout'));
                return;
            } else
                next();
        }).catch(err => {
            res.send(bodymaker.makeJson(3, err));
        })
    }
};
module.exports = checker;
