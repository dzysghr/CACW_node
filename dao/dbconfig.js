var Sequelize = require('sequelize');


var log = true;

var sequelize = new Sequelize('cacw', 'root', '123', 
{
  host: '127.0.0.1',
  dialect: 'mysql',
  pool: 
  {
    max: 5,
    min: 0,
    idle: 10000
  },
  logging:log?console.log:function empty(e){}
});

sequelize
  .authenticate()
  .then(function(err) {
    console.log('数据库连接成功！.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

module.exports = sequelize;