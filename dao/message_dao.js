var MyModel = require('./define');
var Sequelize = MyModel.sequelize;


function getMessage(user) {
    return MyModel.Message.findAll({
        where: {
            recieverId: user.id
        }
    })
}

function sendMessage(me,to,content,type) {
    return MyModel.Message.create({
        senderId:me.id,
        recieverId:to.id,
        content:content,
        type:type
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

