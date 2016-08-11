var JPush = require("JPush-sdk");
var client = JPush.buildClient('e1ddf6b7d3bb9c6ba2545a55', 'f8dd58cf4736e59d58a28432');



function pushToDevices(ids,title,content) {
    client.push()
    .setPlatform('android')
    .setAudience(JPush.registration_id(ids))
    .setMessage(content,title)
    .send(function(err, res) {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Sendno: ' + res.sendno);
            console.log('Msg_id: ' + res.msg_id);
        }
    });

}

module.exports={pushToDevices}