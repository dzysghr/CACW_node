var MyModel = require('./define');
var Sequelize = MyModel.sequelize;

function getUserbyId(userid) {
    return MyModel.User.findOne({
        where: {
            id: userid
        }
    })
}


/**
 * 修改用户信息
 * @param {any} user UserModel 
 * @returns promise
 */
function setUserInfo(user, params) {
    user.nickName = params.nickName == undefined ? user.nickName : params.nickName;
    user.summary = params.summary == undefined ? user.summary : params.summary;
    user.mobilePhone = params.mobilePhone == undefined ? user.mobilePhone : params.mobilePhone;
    user.sex = params.sex == undefined ? user.sex : user.sex;
    user.address = params.address == undefined ? user.address : params.address;
    user.shortNumber = params.shortNumber == undefined ? user.shortNumber : params.shortNumber;
    user.mobilePhone = params.mobilePhone == undefined ? user.mobilePhone : params.mobilePhone;
    return user.save();
}

// queryUser({
//     nickName:'la'
// }).then(us=>{
//     console.log(us);
// })

//查询用户
function queryUser(params) {
    var sql = 'select * from Users where 1=1 or ';
    var flag = false;
    if (params.id) {
        sql = sql + 'id = ' + params.id + ' or ';
        flag = true;
    }
    if (params.username) {
        sql = sql + "username='" + params.username + "' or "
        flag = true;
    }

    if (params.nickName) {
        sql = sql + "nickName like '%" + params.username + "%' or ";
        flag = true;
    }
    if (!flag)
        return new Promise((resolve, reject) => { resolve() });

    if (flag) {
        sql += '1=1';
    }
    return Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
}

//设置头像
function setAvatarUrl(userid, url) {
    return getUserbyId(userid).then(u => {
        u.avatarUrl = url;
        return u.save({
            fields: ['avatarUrl']
        })
    })
}

module.exports = { getUserbyId, setAvatarUrl, queryUser, setUserInfo }