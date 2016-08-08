
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

function c() {
    var a = 'true';
    {
    let b = 'agf';
    }
    console.log(a == 1);
}

c();
