var MyModel = require('./define');
var Sequelize = MyModel.sequelize;

function getUserbyId(userid) {
    return MyModel.User.findOne({
            where:{
                id:userid
            }
    })
}

function setUserInfo(user) {
    return  getUserbyId(user.id).then(u=>{
        u.nickName = user.nickName==undefined? u.nickName:user.nickName;
        u.summary = user.summary==undefined?u.summary:user.summary;
        u.mobilePhone = user.mobilePhone==undefined?u.mobilePhone:user.mobilePhone;
        u.sex = user.sex==undefined?u.sex:user.sex;
        u.address = user.address==undefined?u.address:user.address;
        u.shortNumber = user.shortNumber==undefined?u.shortNumber:user.shortNumber;
        u.mobilePhone = user.mobilePhone==undefined?u.mobilePhone:user.mobilePhone;
        return u.save();
    })
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
    if(params.id)
    {
        sql = sql + 'id = '+params.id+' or ';
        flag = true;
    }
    if(params.username)
    {
        sql = sql + "username='"+params.username+"' or "
        flag = true;
    }

     if(params.nickName)
    {
        sql = sql + "nickName like '%"+params.username+"%' or ";
        flag = true;
    }
    if(!flag)
       return new Promise((resolve, reject) => {resolve()});

    if(flag)
    {
        sql +='1=1';
    }
     return  Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
}

//设置头像
function setAvatarUrl(userid,url) {
    return getUserbyId(userid).then(u=>{
            u.avatarUrl = url; 
            return u.save({
                fields:['avatarUrl']
            })
    })
}

module.exports = { getUserbyId,setAvatarUrl,queryUser,setUserInfo}