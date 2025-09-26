//Event Loop && Callbacks
console.log('One');
setTimeout(() => {
    console.log('Two');
}, 0);
console.log('Three');
setImmediate(() => {
    console.log('Four');
}, 0);
console.log('Five');

function first() {
    console.log('start first');
    second()
    console.log('end first');
}

function second() {
    console.log('start second');
    third()
    console.log('end second');
}

function third() {
    console.log('start third');
    console.log('end third');
}

//Promises
const promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Promise 1 resolved');
    }, 1000);
    console.log('After setTimeout');

});
const promiseByAnotherShap1 = Promise.resolve('HI');
// const promiseByAnotherShap2 = fetch("https://jsonplaceholder.typicode.com/users");
// new Promise( (resolve, reject) => {} );
// promise1.then((result) => {
//     console.log(result);
// }); 
//async await
const newShap = async () => {
    await setTimeout(() => {
        console.log('async 2');
    }, 1000);
    console.log('async 1');

};
newShap();

Promise.all([promiseByAnotherShap1, promise1]).then((vals) => console.log(vals));

console.log('outSide');