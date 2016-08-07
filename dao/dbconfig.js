var Sequelize = require('sequelize');
var sequelize = new Sequelize('cacw', 'root', '123456', 
{
  host: 'localhost',
  dialect: 'mysql',
  pool: 
  {
    max: 5,
    min: 0,
    idle: 10000
  }
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