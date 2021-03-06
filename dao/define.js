
var Sequelize = require('sequelize');
var sequelize = require('./dbconfig');


//user定义
var User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER, autoIncrement: true,primaryKey: true
  },
  username: {
    type: Sequelize.STRING,allowNull: false,unique: true
  },
  psw: {
    type: Sequelize.STRING
  },
  mobilePhone: {
    type: Sequelize.STRING
  },
  sex: {
    type: Sequelize.INTEGER
  },
  summary: {
    type: Sequelize.STRING
  },
  nickName: {
    type: Sequelize.STRING,defaultValue: '蚂蚁'
  },
  avatarUrl: {
    type: Sequelize.STRING
  },
  address: {
    type: Sequelize.STRING
  },
  shortNumber: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  }
},{charset:'utf8'});

//任务定义
var Task = sequelize.define('task', {
  id: {
    type: Sequelize.INTEGER, autoIncrement: true,primaryKey: true
  },
  title: {
    type: Sequelize.STRING
  },
  content: {
    type: Sequelize.STRING
  },
  startDate: {
    type: Sequelize.STRING
  },
  endDate: {
    type: Sequelize.STRING
  },
  location: {
    type: Sequelize.STRING
  },
  projectId:{
    type:Sequelize.INTEGER,
    references:{
      model:'projects',
      key:'id'
    },
    onDelete:'CASCADE'
  },
  finish: {
    type: Sequelize.INTEGER //0 为未完成  1 为完成
  }
},{charset:'utf8'});

//项目定义
var Project = sequelize.define('project', {
  id: {
    type: Sequelize.INTEGER, autoIncrement: true,primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  teamId:{
    type:Sequelize.INTEGER,
    references:{
      model:'teams',
      key:'id'
    },
    onDelete:'CASCADE'
  },
  //是否归档，0为否，其他为是
  file:{
    type:Sequelize.INTEGER,defaultValue:0
  },
  //是否为私人项目，0为否，1为是
  isPrivate:{
     type:Sequelize.INTEGER,defaultValue:0
  }
},{charset:'utf8'});


//消息定义
var Message = sequelize.define('message', {
  id: {
    type: Sequelize.INTEGER, autoIncrement: true,primaryKey: true
  },
  title: {
    type: Sequelize.STRING
  },
  content: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.INTEGER //1 团队邀请用户 2 用户申请加入 3 私信
  },
  receiverId:{
     type: Sequelize.INTEGER
  },
  //用于团队申请或团队邀请，消息为私信时为空
  teamid: {
    type: Sequelize.INTEGER
  }
  // ,
  // hasRead:{
  //   type: Sequelize.INTEGER
  // }
},{charset:'utf8'});

//团队定义
var Team = sequelize.define('team', {
  id: {
    type: Sequelize.INTEGER, autoIncrement: true,primaryKey: true
  },
  teamName: {
    type: Sequelize.STRING,allowNull:false
  },
  summary: {
    type: Sequelize.STRING
  },
  avatarUrl: {
    type: Sequelize.STRING
  },
  notice:{
    type:Sequelize.STRING
  }
},{charset:'utf8'});


//Cookie定义
var Session = sequelize.define('session', {
  Session: {
    type: Sequelize.STRING
  },
  deviceId: {
    type: Sequelize.STRING
  }
},{charset:'utf8'});

var TaskMember = sequelize.define('taskmember', {
},{charset:'utf8'});

var TeamMember = sequelize.define('teammember',{
  tag: {
    type: Sequelize.INTEGER //无用，只是为了防止空表无法被创建
  }
},{charset:'utf8'});


//定义关系
Task.belongsTo(Project);
Project.belongsTo(Team); 

Team.hasMany(Project);//t.getProjects();

Task.belongsToMany(User,{through:TaskMember,as:'Member'});
User.belongsToMany(Task,{through:TaskMember,as :'Task'});



Team.belongsToMany(User,{through:TeamMember,as:'Member'});
User.belongsToMany(Team,{through:TeamMember,as:'Team'}); //user.getTeam()


//User.hasMany(Message);
User.hasMany(Message)
Message.belongsTo(User);//这个不行


Task.belongsTo(User,{as:'Admin'});
Team.belongsTo(User,{as:'Admin'});
Project.belongsTo(User,{as:'Admin'});
Session.belongsTo(User);

sequelize.sync();
//sequelize.sync({force:true});


// function getMessage(user) {
//     return Message.findAll({
       
//         include: [{
//              model: User
//         }]
//     })
// }
// getMessage({});


module.exports = {Task,Team,User,Project,Session,Message,TaskMember,TeamMember,sequelize};

// force: true will drop the table if it already exists
// User.sync({force: true}).then(function () {
//   // Table created
//   return User.create({
//     firstName: 'John',
//     lastName: 'Hancock'
//   });
// });