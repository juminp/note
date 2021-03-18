/**
 * object.assign() 浅拷贝
 */
// 1. 示例代码
let target = {};
let source = { a: { b: 1 } };
Object.assign(target, source);
console.log(target); // { a: { b: 1 } };

// 2. 三个 target 里的 b 属性都变为 10 了
let target2 = {};
let source2 = { a: { b: 2 } };
Object.assign(target2, source2);
console.log(target2); // { a: { b: 10 } };
source2.a.b = 10;
console.log(source2); // { a: { b: 10 } };
console.log(target2); // { a: { b: 10 } };

// 3. 验证它可以拷贝 Symbol 类型的对象
let obj1 = { a: { b: 1 }, sym: Symbol(1) };
Object.defineProperty(obj1, "innumerable", {
  value: "不可枚举属性",
  enumerable: false,
});
let obj2 = {};
Object.assign(obj2, obj1);
obj1.a.b = 2;
console.log("obj1", obj1);
console.log("obj2", obj2);
/**
 * obj1 = {
 *   a: {b: 2},
 *   sym: Symbol(1),
 *   innumerable: '不可枚举属性',
 * }
 * obj2 = {
 *   a: {b: 2},
 *   sym: Symbol(1),
 * }
 */
