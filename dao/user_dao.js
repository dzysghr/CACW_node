var MyModel = require('./define');
var Sequelize = MyModel.sequelize;

function getUserbyId(userid) {
    return MyModel.User.findOne({
        where: {
            id: userid
        }
    })
}

function getUserByUserName(username) {
    return MyModel.User.findOne({
        where: {
            username: username
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
    user.sex = params.sex == undefined ? user.sex : params.sex;
    user.address = params.address == undefined ? user.address : params.address;
    user.shortNumber = params.shortNumber == undefined ? user.shortNumber : params.shortNumber;
    user.mobilePhone = params.mobilePhone == undefined ? user.mobilePhone : params.mobilePhone;
    user.avatarUrl = params.avatarUrl == undefined ? user.avatarUrl : params.avatarUrl;
    
    return user.save();
}

// queryUser({
//     nickName:'la'
// }).then(us=>{
//     console.log(us);
// })

//查询用户
function queryUser(params,limit,offset) {


    limit = limit||10;
    offset = offset||0;

    var sql = 'select * from Users where ';
    var flag = false;
    if (params.id) {
        sql = sql + 'id = \'' + params.id + '\' or ';
        flag = true;
    }
    if (params.username) {
        sql = sql + "username='" + params.username + "' or "
        flag = true;
    }

    if (params.nickName) {
        sql = sql + "nickName like '%" + params.nickName + "%' or ";
        flag = true;
    }
    if (!flag)
        return new Promise((resolve,reject)=>resolve());

    if (flag) {
        sql += '1=2 ';
    }
    sql  +='limit '+offset+','+limit; 


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

module.exports = { getUserbyId, setAvatarUrl, queryUser, setUserInfo,getUserByUserName}