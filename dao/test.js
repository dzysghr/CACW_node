var Sequelize = require('sequelize');
var sequelize = require('./dbconfig');



var p1 = Promise.resolve(3);
var p2 = 1337;
var p3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 2000, "foo");
}); 

Promise.all([p1, p2, p3]).then(values => { 
  console.log(values); // [3, 1337, "foo"] 
});


// var Book = sequelize.define('book', {
//   id: {
//     type: Sequelize.INTEGER, autoIncrement: true,primaryKey: true
//   },
//   name:{
//     type: Sequelize.STRING
//   }});

// var Author = sequelize.define('author', {
//   id: {
//     type: Sequelize.INTEGER, autoIncrement: true,primaryKey: true
//   },
//   name:{
//     type: Sequelize.STRING
//   }});

// Author.belongsToMany(Book,{through:'atb'});

// sequelize.sync();

// Author.findOne().then(a=>{
//     return a.setBooks();
// }).then(b=>
// {
//   //console.log(b);
// })






// timeout(100).then((value) => {
//   console.log(value);
 
// })
// .then(()=>{
//   console.log(1);
//   throw new Error('xxx');
// },(err)=>{
//   console.log(err);
// }).then(()=>{
//   console.log(2);
// },(err)=>{
//   console.log(err);
//   return 3;
// }).then((re)=>{
//   console.log(re);
// },(err)=>{
//   console.log(err);
// });
