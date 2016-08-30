var express = require('express');
var router = express.Router();
var checker = require('../util/session-check');
var bodyParser = require('body-parser')
var project_bll = require('../bll/project_bll')


// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
  console.log('访问项目模块 Time: ', Date.now());
  next();
});

//检查session 中间件
router.use(checker())

router.use(bodyParser.json());

//新建项目
router.post('/create', function (req, res) {
  project_bll.createProject(req, res);
});


//获取项目列表
router.get('/list', function (req, res) {
  project_bll.getProjectList(req, res);
});

//删除项目
router.delete('/:id', function (req, res) {
  project_bll.deleteProject(req, res);
});

//获取项目详情
router.get('/:id', function (req, res) {
  project_bll.getProjectInfo(req, res);
});



//获取项目任务
router.get('/:id/tasklist', function (req, res) {
   project_bll.getProjectTask(req,res);
});


module.exports = router;