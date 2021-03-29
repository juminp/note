# 闭包

## 作用域
- JavaScript 的作用域通俗来讲，就是指变量能够被访问到的范围
  - 全局作用域
  - 函数作用域
  - 块级作用域（let）
```
// globalName 这个变量无论在什么地方都是可以被访问到的，所以它就是全局变量。而在 getName 函数中作为局部变量的 name 变量是不具备这种能力的。
var globalName = 'global';
function getName() { 
  console.log(globalName) // global
  var name = 'inner'
  console.log(name) // inner
} 
getName();
console.log(name); // 
console.log(globalName); //global
function setName(){ 
  vName = 'setName';
}
setName();
console.log(vName); // setName
console.log(window.vName) // setName
```
```
// name 这个变量是在 getName 函数中进行定义的，所以 name 是一个局部的变量，它的作用域就是在 getName 这个函数里边，也称作函数作用域。
function getName () {
  var name = 'inner';
  console.log(name); //inner
}
getName();
console.log(name);
```
```
// 变量 a 是在 if 语句{...} 中由 let 关键词进行定义的变量，所以它的作用域是 if 语句括号中的那部分，而在外面进行访问 a 变量是会报错的，因为这里不是它的作用域。所以在 if 代码块的前后输出 a 这个变量的结果，控制台会显示 a 并没有定义。
console.log(a) //a is not defined
if(true){
  let a = '123'；
  console.log(a)； // 123
}
console.log(a) //a is not defined
```
## 闭包
- 闭包是指有权访问另外一个函数作用域中的变量的函数。
```
function fun1() {
	var a = 1;
	return function(){
		console.log(a);
	};
}
fun1();
var result = fun1();
result();  // 1
```
- 闭包产生的原因
  - 我们在前面介绍了作用域的概念，那么你还需要明白作用域链的基本概念。其实很简单，当访问一个变量时，代码解释器会首先在当前的作用域查找，如果没找到，就去父级作用域去查找，直到找到该变量或者不存在父级作用域中，这样的链路就是作用域链。
```
var a = 1;
function fun1() {
  var a = 2
  function fun2() {
    var a = 3;
    console.log(a);//3
  }
}
```
  - 闭包产生的本质就是：当前环境中存在指向父级作用域的引用。那么还是拿上的代码举例。
```
function fun1() {
  var a = 2
  function fun2() {
    console.log(a);  //2
  }
  return fun2;
}
var result = fun1();
result();
```
  - 那是不是只有返回函数才算是产生了闭包呢？其实也不是，回到闭包的本质，我们只需要让父级作用域的引用存在即可
```
var fun3;
function fun1() {
  var a = 2
  fun3 = function() {
    console.log(a);
  }
}
fun1();
fun3();
```

## 闭包的表现形式
- 返回一个函数。
- 在定时器、事件监听、Ajax 请求、Web Workers 或者任何异步中，只要使用了回调函数，实际上就是在使用闭包。
```
// 定时器
setTimeout(function handler(){
  console.log('1');
}，1000);
// 事件监听
$('#app').click(function(){
  console.log('Event Listener');
});
```
- 作为函数参数传递的形式
```
var a = 1;
function foo(){
  var a = 2;
  function baz(){
    console.log(a);
  }
  bar(baz);
}
function bar(fn){
  // 这就是闭包
  fn();
}
foo();  // 输出2，而不是1
```
- IIFE（立即执行函数），创建了闭包，保存了全局作用域（window）和当前函数的作用域，因此可以输出全局的变量
```
var a = 2;
(function IIFE(){
  console.log(a);  // 输出2
})();
```
## 练习
- 为什么都是 6？我想让你实现输出 1、2、3、4、5 的话怎么办呢？
  - setTimeout 为宏任务，由于 JS 中单线程 eventLoop 机制，在主线程同步任务执行完后才去执行宏任务，因此循环结束后 setTimeout 中的回调才依次执行。
  - 因为 setTimeout 函数也是一种闭包，往上找它的父级作用域链就是 window，变量 i 为 window 上的全局变量，开始执行 setTimeout 之前变量 i 已经就是 6 了，因此最后输出的连续就都是 6。
```
for(var i = 1; i <= 5; i ++){
  setTimeout(function() {
    console.log(i)
  }, 0)
}
```
- 那么我们再来看看如何按顺序依次输出 1、2、3、4、5 呢？
  - 使用 ES6 中的 let
```
for(let i = 1; i <= 5; i++){
  setTimeout(function() {
    console.log(i);
  },0)
}
```
  - 利用 IIFE
```
for(var i = 1;i <= 5;i++){
  (function(j){
    setTimeout(function timer(){
      console.log(j)
    }, 0)
  })(i)
}
```
  - 定时器传入第三个参数
```
for(var i=1;i<=5;i++){
  setTimeout(function(j) {
    console.log(j)
  }, 0, i)
}
```
