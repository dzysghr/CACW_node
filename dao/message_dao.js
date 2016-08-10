var MyModel = require('./define');
var Sequelize = MyModel.sequelize;


function getMessage(user) {
    return MyModel.Message.findAll({
        where: {
            recieverId: user.id
        },
        
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

module.exports={getMessage,sendMessage}

