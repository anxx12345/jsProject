// ( function (){
//   let x = new Map();
//   x.set('x',1);
//   x.set('y',2);
//   x.set('z',3)
//   let y = [4,5,6];
//   x.set('xx',2333)
    // x.forEach(async function (key,index) {
    //     await console.log(key)
    // })
//     // x.forEach(async function (key,index,z) {
//         // await console.log(key,index)
//         // console.log (y.length)
//     // })

//     console.log(1)    
//     console.log(getLength(x))
//     console.log(2)
// })()

// function getLength(obj) {
//     var count = 0;
//     obj.forEach(element => {
//        count++ 
//     });
//     return count;
// }
var sys = require('util')
var exec = require('child_process').exec;
// function puts(error, stdout, stderr) { sys.puts(stdout) }
// exec("ping -c 3 localhost", puts);

async function test(host){
    return new Promise((resolve, reject) => {
        exec(`ping -c 3 ${host}`, (error, stdout, stderr) => {
            console.log(stdout)
        });

   }) 
}
test('10.11.66.22')



