var express = require('express');
var router = express.Router();
var team_bll = require('../bll/team_bll');
var checker = require('../util/session-check');
var bodyParser = require('body-parser')

//  log中间件
router.use(function timeLog(req, res, next) {
    console.log('访问团队模块 Time: ', Date.now());
    next();
});

//检查session 中间件
router.use(checker())

//json 解析 ,用于团队资料修改
router.use(bodyParser.json());

//创建团队
router.post('/create/:teamname', function (req, res) {
    team_bll.createTeam(req, res);
});

//团队申请
router.post('/apply', function (req, res) {
    team_bll.teamApply(req,res);
});



//解散团队
router.delete('/:teamid/dissolve', function (req, res) {
    team_bll.dissolveTeam(req,res);
});

//退出团队
router.get('/:teamid/out', function (req, res) {
    team_bll.leaveTeam(req,res);
});

//团队成员
router.get('/:id/members', function (req, res) {
    team_bll.getTeamMemer(req, res);
});


//获取团队列表
router.get('/list', function (req, res) {
    team_bll.getTeamList(req,res);
});


//搜索团队
router.get('/search', function (req, res) {
    team_bll.searchTeam(req, res);
});


//查看团队
router.get('/:id', function (req, res) {
    team_bll.getTeamInfo(req, res);
});

//修改团队头像
router.post('/:teamid/upload', function (req, res) {
    team_bll.setTeamAvatar(req, res);
});


//删除团队成员
router.delete('/:teamid', function (req, res) {
    team_bll.deleteMember(req,res);
});


//获取团队项目列表
router.get('/:teamid/projectlist', function (req, res) {
    team_bll.getTeamPoject(req,res);
});

//修改团队
router.post('/:id', function (req, res) {
    team_bll.setTeamInfo(req, res);
});

module.exports = router;