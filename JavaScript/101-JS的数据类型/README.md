# JS 的数据类型

## 8 种数据类型

### 概念

> 前 7 种类型为基础类型，最后 1 种（Object）为引用类型

> Object 为引用数据类型 Object 又分为图上这几种常见的类型：Array - 数组对象、RegExp - 正则对象、Date - 日期对象、Math - 数学函数、Function - 函数对象

- undefind
- Null
- Boolean
- String
- Number
- Symbol
- BigInt
- Object

  - Array
  - RegExp
  - Date
  - Math
  - Function

### 存储

> 因为各种 JavaScript 的数据类型最后都会在初始化之后放在不同的内存中，因此上面的数据类型大致可以分成两类来进行存储：

1. 基础类型存储在栈内存，被引用或拷贝时，会创建一个完全相等的变量；
2. 引用类型存储在堆内存，存储的是地址，多个引用指向同一个地址，这里会涉及一个“共享”的概念。

### code 实践

1. 引用类型的“共享” [查看](./01.引用类型的共享.js)
2. 数据类型检测 [查看](./02.数据类型检测.js)
3. 数据类型转换 [查看](./03.数据类型转换.js)
