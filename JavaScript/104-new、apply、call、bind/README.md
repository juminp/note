# new、apply、call、bind

| 方法/特征       | call           | apply          | bind           |
| :------------- | :------------- | :------------- | :------------- |
| 方法参数        | 多个            | 单个数组        | 多个            |
| 方法功能        | 函数调用改变this | 函数调用改变this | 函数调用改变this |
| 返回结果        | 直接执行        | 直接执行         | 返回待执行函数   |
| 底层实现        | 通过eval        | 通过eval        | 间接调用apply   |

## new
- new 关键词的主要作用就是执行一个构造函数、返回一个实例对象，在 new 的过程中，根据构造函数的情况，来确定是否可以接受参数的传递。
  - 创建一个新对象；
  - 将构造函数的作用域赋给新对象（this 指向新对象）；
  - 执行构造函数中的代码（为这个新对象添加属性）；
  - 返回新对象。
```
function Person(){
   this.name = 'Jack';
}
var p = new Person(); 
console.log(p.name)  // Jack
```
- 去掉 new
```
function Person(){
  this.name = 'Jack';
}
var p = Person();
console.log(p) // undefined
console.log(name) // Jack
console.log(p.name) // 'name' of undefined
```
- 当构造函数中有 return 一个对象的操作
- new 关键词执行之后总是会返回一个对象，要么是实例对象，要么是 return 语句指定的对象。
  - 当构造函数最后 return 出来的是一个和 this 无关的对象时，new 命令会直接返回这个新对象，而不是通过 new 执行步骤生成的 this 对象。
```
function Person(){
   this.name = 'Jack'; 
   return {age: 18}
}
var p = new Person(); 
console.log(p)  // {age: 18}
console.log(p.name) // undefined
console.log(p.age) // 18
```
  - 当构造函数中 return 的不是一个对象时，那么它还是会根据 new 关键词的执行逻辑，生成一个新的对象（绑定了最新 this），最后返回出来。
```
function Person(){
   this.name = 'Jack'; 
   return 'tom';
}
var p = new Person(); 
console.log(p)  // {name: 'Jack'}
console.log(p.name) // Jack
```
## apply、call、bind
- call、apply 和 bind 是挂在 Function 对象上的三个方法，调用这三个方法的必须是一个函数。
```
func.call(thisArg, param1, param2, ...)
func.apply(thisArg, [param1,param2,...])
func.bind(thisArg, param1, param2, ...)
```
- 这三个方法共有的、比较明显的作用就是，都可以改变函数 func 的 this 指向。call 和 apply 的区别在于，传参的写法不同：apply 的第 2 个参数为数组； call 则是从第 2 个至第 N 个都是给 func 的传参；而 bind 和这两个（call、apply）又不同，bind 虽然改变了 func 的 this 指向，但不是马上执行，而这两个（call、apply）是在改变了函数的 this 指向之后立马执行。
```
let a = {
  name: 'jack',
  getName: function(msg) {
    return msg + this.name;
  } 
}
let b = {
  name: 'lily'
}
console.log(a.getName('hello~'));  // hello~jack
console.log(a.getName.call(b, 'hi~'));  // hi~lily
console.log(a.getName.apply(b, ['hi~']))  // hi~lily
let name = a.getName.bind(b, 'hello~');
console.log(name());  // hello~lily
```
### 应用
- 判断数据类型
```
function getType(obj){
  let type  = typeof obj;
  if (type !== "object") {
    return type;
  }
  return Object.prototype.toString.call(obj).replace(/^$/, '$1');
}
```
- 类数组借用方法
```
var arrayLike = { 
  0: 'java',
  1: 'script',
  length: 2
} 
Array.prototype.push.call(arrayLike, 'jack', 'lily'); 
console.log(typeof arrayLike); // 'object'
console.log(arrayLike);
// {0: "java", 1: "script", 2: "jack", 3: "lily", length: 4}
```
- 获取数组的最大 / 最小值
```
let arr = [13, 6, 10, 11, 16];
const max = Math.max.apply(Math, arr); 
const min = Math.min.apply(Math, arr);
console.log(max);  // 16
console.log(min);  // 6
```
- 继承
```
function Parent3 () {
  this.name = 'parent3';
  this.play = [1, 2, 3];
}
Parent3.prototype.getName = function () {
  return this.name;
}
function Child3() {
  Parent3.call(this);
  this.type = 'child3';
}
Child3.prototype = new Parent3();
Child3.prototype.constructor = Child3;
var s3 = new Child3();
console.log(s3.getName());  // 'parent3'
```
## 如何自己实现这些方法
- new 的实现
  - 让实例可以访问到私有属性；
  - 让实例可以访问构造函数原型（constructor.prototype）所在原型链上的属性；
  - 构造函数返回的最后结果是引用数据类型。
```
function _new(ctor, ...args) {
  if(typeof ctor !== 'function') {
    throw 'ctor must be a function';
  }
  let obj = new Object();
  obj.__proto__ = Object.create(ctor.prototype);
  let res = ctor.apply(obj,  [...args]);
  let isObject = typeof res === 'object' && res !== null;
  let isFunction = typeof res === 'function';
  return isObject || isFunction ? res : obj;
};
```
- apply 和 call 的实现
  - 实现 call 和 apply 的关键就在 eval 这行代码。其中显示了用 context 这个临时变量来指定上下文，然后还是通过执行 eval 来执行 context.fn 这个函数，最后返回 result。
  - 要注意这两个方法和 bind 的区别就在于，这两个方法是直接返回执行结果，而 bind 方法是返回一个函数，因此这里直接用 eval 执行得到结果。
```
Function.prototype.call = function (context, ...args) {
  var context = context || window;
  context.fn = this;
  var result = eval('context.fn(...args)');
  delete context.fn
  return result;
}
Function.prototype.apply = function (context, args) {
  let context = context || window;
  context.fn = this;
  let result = eval('context.fn(...args)');
  delete context.fn
  return result;
}
```
- bind 的实现
  - 实现 bind 的核心在于返回的时候需要返回一个函数，故这里的 fbound 需要返回，但是在返回的过程中原型链对象上的属性不能丢失。因此这里需要用Object.create 方法，将 this.prototype 上面的属性挂到 fbound 的原型上面，最后再返回 fbound。这样调用 bind 方法接收到函数的对象，再通过执行接收的函数，即可得到想要的结果。
```
Function.prototype.bind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new Error("this must be a function");
  }
  var self = this;
  var fbound = function () {
      self.apply(this instanceof self ? this : context, args.concat(Array.prototype.slice.call(arguments)));
  }
  if(this.prototype) {
    fbound.prototype = Object.create(this.prototype);
  }
  return fbound;
}
```
