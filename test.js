

var util = require('./util/md5');


// var p3 = new Promise((resolve, reject) => {
//   setTimeout(resolve, 2000, "foo");
// }); 


// new Promise(function (res, ref) {
//         res();
//     })
// .then(()=>{
//   console.log(1);
// }).then(()=>{
//   console.log(2);
//   return Promise.reject('abc');
// }).then((re)=>{
//   console.log(re);
// })
// .catch(err=>{
//   //console.log(err);
// })
// ;

var hash =  util.MD5(new Date().getMilliseconds()+'');
console.log(hash);

var  d = new Date();
console.log(d.getHours());


// Array.prototype.contains = function(obj) {
//     var i = this.length;
//     while (i--) {
//         if (this[i] == obj) {
//             return true;
//         }
//     }
//     return false;
// }


// var a =  {id:2};
// var b = a;
// a.id = 4;
// console.log(b)
