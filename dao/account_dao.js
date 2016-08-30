var Sequelize = require('sequelize');
var MyModel = require('./define');


/**
 * 判断用户密码是否正确,
 * @param {any} username 用户名
 * @param {any} psw 密码
 * @returns User or false
 */
function login(username,psw){
    
  return MyModel.User.findOne({
      where:{
          username :username,
          psw:psw
      }
  }).then((user)=>{ 
      if(user==null)
          return false;
      else
      { 
          return user;
      } 
  },(err)=>{
     console.log(err);
     return false;
  });
}

/**
 * 写入session,返回session
 * @param {any} user 用户
 * @param {any} session
 * @returns session 对象
 */
function saveSession(user,session,deviceid) {

   return MyModel.Session.findOrCreate(
       {
           where: {userId:user.id},
           defaults: 
           {
               userId:user.id,
               Session:session,
               deviceId:deviceid
           }
    }).spread(function(s, created)
    {
        if(!created)
        {
            s.Session = session;
            s.deviceId = deviceid
           return s.save();
        }
        return s;
    });
}


function getUserByReq(req) {
    var s = req.cookies['sessionId'];
    return getUser(s);
}

/**
 * 
 * 通过session获得user
 * @param {any} session
 * @returns User or false
 */
function getUser(session) {
    return MyModel.Session.findOne({
        where:{
            Session:session
        }
    }).then((s)=>
    {
        if(s)
            return s.getUser();
    });
}

//删除session
function logout(user) {
    return MyModel.Session.destroy({
        where:{
            userId:user.id
        }
    });
}

//注册
function register(username,psw) {
    return MyModel.User.create(
        {
            username:username,
            psw : psw,
        }
    );
}


/**
 * 
 *  通过用户id获取设备id
 * @param {Array} ids 用户id数组
 * @returns {Array} 设备id 数组
 */

function getDeviceIds(ids) {
   return  MyModel.Session.findAll({
        where:{
            userId:{
                $in: ids
            }
        },
         attributes:['deviceId']
    })
    .then(ss=>{
        var array = [];
        for (var i = 0; i < ss.length; i++) {
            array[i] =  ss[i].deviceId;
        }
        return array;
    })
}


module.exports = {register,login,logout,saveSession,getUser,getUserByReq,getDeviceIds}




//register('user','abcdefg').then(u=>{console.log(u)});

// getUser('232dsafsadfsdff').then((u)=>{
//     if(u)
//     {
//         console.log(u.username);
//     }
// })


// login('dzy','123456').then((user)=>{
//     if(user)
//     {
//         console.log('save');
//         saveSession(user,'232dsafsadfsdff');
//     }
// });
