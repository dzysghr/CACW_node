var team_dao = require('../dao/team_dao');
var bodymaker = require('../util/respone-builder');
var account_dao = require('../dao/account_dao');
var formidable = require('formidable')
var fs = require('fs')


function createTeam(req, res) {
    var teamname = req.params.teamname;
    var s = req.cookies['sessionId'];

    account_dao.getUser(s).then(u => {
        return team_dao.createTeam(u, teamname)
    })
        .then((t) => {

            var contentype = req.headers['content-type'] + '';
            if (contentype == undefined || contentype.indexOf('multipart/form-data') != 0) {
                res.send(JSON.stringify(bodymaker.makeBody(0, 'no image')));
                return;
            }
            var form = new formidable.IncomingForm();
            form.uploadDir = +__dirname + "/../image";
            form.encoding = 'utf-8';		//设置编辑
            form.keepExtensions = true;	 //保留后缀
            form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
            form.parse(req, function (err, fields, files) 
            {
                if (err) {
                    res.send(JSON.stringify(bodymaker.makeBody(0, 'fail to upload image :' + err)));
                    return;
                }
                if (files.length == 0 || files['img'] == undefined) {
                    res.send(JSON.stringify(bodymaker.makeBody(0, 'file not found,"img" key is respected')));
                    return;
                }
                var extName = '';  //后缀名
                switch (files['img'].type) {
                    case 'image/pjpeg':
                        extName = '.jpg';
                        break;
                    case 'image/jpeg':
                        extName = '.jpg';
                        break;
                    case 'image/png':
                        extName = '.png';
                        break;
                    case 'image/x-png':
                        extName = '.png';
                        break;
                }

                var newPath = form.uploadDir + '/team_' + t.id + extName;
                fs.renameSync(files['img'].path, newPath);  //重命名
                res.send(JSON.stringify(bodymaker.makeBody(0, '')));
            })
        }).catch(err=>{
            res.send(JSON.stringify(bodymaker.makeBody(1, 'fail to create team :' + err)));
        })
}
module.exports = { createTeam }