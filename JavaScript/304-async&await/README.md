# async/await
- async/await 被称为 JS 中异步终极解决方案，它既能够像 co+Generator 一样用同步的方式来书写异步代码，又得到底层的语法支持，无须借助任何第三方库。
```
// readFilePromise 依旧返回 Promise 对象
const readFilePromise = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if(err) {
        reject(err);
      }else {
        resolve(data);
      }
    })
  }).then(res => res);
}
// 这里把 Generator的 * 换成 async，把 yield 换成 await
const gen = async function() {
  const data1 = await readFilePromise('1.txt')
  console.log(data1.toString())
  const data2 = await readFilePromise('2.txt')
  console.log(data2.toString)
}
```
-  async 函数对 Generator 函数的改进，主要体现在以下三点
  - 内置执行器：Generator 函数的执行必须靠执行器，因为不能一次性执行完成，所以之后才有了开源的 co 函数库。但是，async 函数和正常的函数一样执行，也不用 co 函数库，也不用使用 next 方法，而 async 函数自带执行器，会自动执行。
  - 适用性更好：co 函数库有条件约束，yield 命令后面只能是 Thunk 函数或 Promise 对象，但是 async 函数的 await 关键词后面，可以不受约束。
  - 可读性更好：async 和 await，比起使用 * 号和 yield，语义更清晰明了。


- 从执行的结果可以看出，async 函数 func 最后返回的结果直接是 Promise 对象，比较方便让开发者继续往后处理。而之前 Generator 并不会自动执行，需要通过 next 方法控制，最后返回的也并不是 Promise 对象，而是需要通过 co 函数库来实现最后返回 Promise 对象。
```
async function func() {
  return 100;
}
console.log(func());
// Promise {<fulfilled>: 100}
```
