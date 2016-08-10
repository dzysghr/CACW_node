var express = require('express');
var router = express.Router();
var checker = require('../util/session-check');
var bodyParser = require('body-parser')
var task_bll = require('../bll/task_bll')


// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
  console.log('访问任务模块 Time: ', Date.now());
  next();
});

//检查session 中间件
router.use(checker())

//解析json post
router.use(bodyParser.json());


//获取任务列表
router.get('/list', function (req, res) {
  task_bll.getTaskList(req, res);
});


//创建任务
router.post('/create', function (req, res) {
  task_bll.createTask(req, res);
});

//修改任务
router.post('/:taskid', function (req, res) {
  task_bll.setTaskInfo(req, res);
});

//增加任务成员
router.get('/:taskid/members', function (req, res) {
  task_bll.getTaskMembers(req, res);
});


//增加任务成员
router.post('/:taskid/members', function (req, res) {
  task_bll.addTaskMember(req, res);
});

//删除任务成员
router.delete('/:taskid/members', function (req, res) {
  task_bll.removeTaskMember(req, res);
});


//删除任务
router.delete('/:taskid', function (req, res) {

});

//获取任务
router.get('/:taskid', function (req, res) {
    task_bll.getTask(req,res);
});


//完成任务
router.get('/:taskid/finish', function (req, res) {
  task_bll.finishTask(req,res);
});


module.exports = router;