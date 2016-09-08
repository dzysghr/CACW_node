var MyModel = require('./define');
var Sequelize = MyModel.sequelize;


function getMessage(user) {
    return MyModel.Message.findAll({
        where: {
            recieverId: user.id
        }
    })
}

function sendMessage(me,to,content,type,teamid) {
    return MyModel.Message.create({
        senderId:me.id||me,
        recieverId:to.id||to,
        content:content,
        type:type,
        teamid:teamid
    })
}

function deleteMsgArray(msgs)
{
    var ids =[];
    for (var i = 0; i < msgs.length; i++) {
         ids[i]= msgs[i].id;
    }

    return MyModel.Message.destroy({
        where:{
            id:{
                $in:ids
            }
        }
    })
}

module.exports={deleteMsgArray,getMessage,sendMessage}

