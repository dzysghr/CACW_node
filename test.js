
// var p3 = new Promise((resolve, reject) => {
//   setTimeout(resolve, 2000, "foo");
// }); 


// p3
// .then(()=>{
//   console.log(1);
//   throw new Error('xxx');
// }).then(()=>{
//   console.log(2);
// }).then((re)=>{
//   console.log(re);
// })
// .catch(err=>{
//   console.log(err);
// })
// ;


Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}


var a=[1,2,3,4,5,6];
var b = a.contains(1);

console.log(b);


