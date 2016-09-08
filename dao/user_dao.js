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
function queryUser(params,limit,offset,except) {

    limit = limit || 10;
    offset = offset || 0;
    limit = parseInt(limit);
    offset = parseInt(offset);

    var $or =[];
    if (params.id) {
        $or.push({id:params.id});
    }
    if (params.username) {
        $or.push({username:params.username});
    }
    if (params.nickName) {
         $or.push({nickName:{$like:'%'+params.nickName+'%'}});
    }
   var where ={
       $or:$or
   }
   if(except)
        where.id={$notIn:except};

   return  MyModel.User.findAll({
       where:where,
       limit:limit,
       offset:offset
   });

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