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
function saveSession(user,session) {
   return MyModel.Session.findOrCreate(
       {
           where: {userId:user.id},
           defaults: 
           {
               userId:user.id,
               Session:session
           }
    }).spread(function(s, created)
    {
        if(!created)
        {
            s.Session = session;
           return s.save({
                fields:['Session']
            });
        }
        return s;
    });
}
      
//通过session获得user,返回user promise
function getUser(session) {
    return MyModel.Session.findOne({
        where:{
            Session:session
        },
        include:[{
            model:MyModel.User
        }]
    }).then((s)=>
    {
        if(s)
            return s.getUser();
        else
            return false; 
    })
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
            email:username
        }
    );
}

module.exports = {register,login,logout,saveSession,getUser}




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
