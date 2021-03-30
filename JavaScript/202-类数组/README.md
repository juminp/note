# 类数组

| 方法/特征   | 数组     | 类数组    |
| :-------- |:-------- |:-------- |
| 自带方法    | 多个方法  | 无       |
| length属性 | 有       | 有       |
| callee属性 | 无       | 有       |

## 主要的类数组
- 函数里面的参数对象 arguments；
- 用 getElementsByTagName/ClassName/Name 获得的 HTMLCollection；
- 用 querySelector 获得的 NodeList。

### arguments
```
function foo(name, age, sex) {
    console.log(arguments); // Arguments(3) ["jack", "18", "male", callee: ƒ, Symbol(Symbol.iterator): ƒ]
    console.log(typeof arguments); // object
    console.log(Object.prototype.toString.call(arguments)); // [object Arguments]
}
foo('jack', '18', 'male');
```
- arguments.callee 输出的就是函数自身
```
function foo(name, age, sex) {
    console.log(arguments.callee); // 本身
}
foo('jack', '18', 'male');
```

### HTMLCollection
- HTMLCollection 简单来说是 HTML DOM 对象的一个接口，这个接口包含了获取到的 DOM 元素集合，返回的类型是类数组对象，如果用 typeof 来判断的话，它返回的是 'object'。它是及时更新的，当文档中的 DOM 变化时，它也会随之变化。
```
var elem1, elem2;
// document.forms 是一个 HTMLCollection
elem1 = document.forms[0];
elem2 = document.forms.item(0);
console.log(elem1); // <form>...</form>
console.log(elem2); // <form>...</form>
console.log(typeof elem1); // object
console.log(Object.prototype.toString.call(elem1)); // [object HTMLFormElemsnt]
```

### NodeList
- NodeList 对象是节点的集合，通常是由 querySlector 返回的。NodeList 不是一个数组，也是一种类数组。虽然 NodeList 不是一个数组，但是可以使用 for...of 来迭代。
```
var list = document.querySelectorAll('input[type=checkbox]');
for (var checkbox of list) {
  checkbox.checked = true;
}
console.log(list);
console.log(typeof list); // object
console.log(Object.prototype.toString.call(list)); // [object NodeList]
```

## 类数组应用场景
### 遍历参数操作
```
function add() {
    var sum =0,
        len = arguments.length;
    for(var i = 0; i < len; i++){
        sum += arguments[i];
    }
    return sum;
}
add()                           // 0
add(1)                          // 1
add(1，2)                       // 3
add(1,2,3,4);                   // 10
```
### 定义链接字符串函数
```
function myConcat(separa) {
  var args = Array.prototype.slice.call(arguments, 1);
  return args.join(separa);
}
myConcat(", ", "red", "orange", "blue");
// "red, orange, blue"
myConcat("; ", "elephant", "lion", "snake");
// "elephant; lion; snake"
myConcat(". ", "one", "two", "three", "four", "five");
// "one. two. three. four. five"
```
### 传递参数使用
```
// 使用 apply 将 foo 的参数传递给 bar
function foo() {
    bar.apply(this, arguments);
}
function bar(a, b, c) {
   console.log(a, b, c);
}
foo(1, 2, 3)   //1 2 3
```

## 类数组转换成数组

### 类数组借用数组方法转数组
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
```
function sum(a, b) {
  let args = Array.prototype.slice.call(arguments);
 // let args = [].slice.call(arguments); // 这样写也是一样效果
  console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);  // 3
function sum(a, b) {
  let args = Array.prototype.concat.apply([], arguments);
  console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);  // 3
```

### ES6 的方法转数组
```
function sum(a, b) {
  let args = Array.from(arguments);
  console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);    // 3
function sum(a, b) {
  let args = [...arguments];
  console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);    // 3
function sum(...args) {
  console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);    // 3
```

