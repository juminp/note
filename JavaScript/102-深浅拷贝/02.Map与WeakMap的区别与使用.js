/**
 * 我们常用的对象Object，是由key:value集合组成的，但key只能是字符串，有很大的使用限制。当我们需要其他类型的数据做key值时，就需要用到数据结构Map，它支持把各种类型的值，当做键。
 */
var map = new Map();
var nie = { name: "Annie" };
var kth = { name: "Keith" };
map.set(nie, kth);
map.set(kth, nie);
console.log(map.get(nie)); //{name:'Keith'}
console.log(map.get(kth)); //{name:'Annie'}

/**
 * 上面例子使用了Map的set和get方法来设置和获取成员信息，此外Map还有以下常用属性和操作方法
 */
map.size; //2,表示map中的成员数量
map.has(nie); //true,布尔值，判断成员是否存在
map.delete(nie); //true,布尔值，删除成员，删除成功返回true，失败返回false
map.clear(); //清除所有成员，没有返回值

/**
 * 除了使用set方法给Map添加成员，也可以通过接收参数的方式添加成员
 */
var map2 = new Map([
  [nie, kth],
  [kth, nie],
]);
console.log(map2.get(nie)); //{name:'Keith'}
console.log(map2.get(kth)); //{name:'Annie'}

// WeakMap与Map类似，但有几点区别：
/**
 * 1、WeakMap只接受对象作为key，如果设置其他类型的数据作为key，会报错。
 * 2、WeakMap的key所引用的对象都是弱引用，只要对象的其他引用被删除，垃圾回收机制就会释放该对象占用的内存，从而避免内存泄漏。
 * 3、由于WeakMap的成员随时可能被垃圾回收机制回收，成员的数量不稳定，所以没有size属性。
 * 4、没有clear()方法
 * 5、不能遍历
 */
// 内置API有差异
// 可以看出weakMap api少了clear， entries，forEach，keys，values,以及获取iterator对象的方法，另外weakMap还没有size属性，无法获取内部存了多少个映射。
// Map的API有：
Map.prototype.clear();
Map.prototype.delete();
Map.prototype.entries();
Map.prototype.forEach();
Map.prototype.get();
Map.prototype.has();
Map.prototype.keys();
Map.prototype.set();
Map.prototype.values();
Map.prototype[@@iterator]();

// WeakMap的API有：
WeakMap.prototype.delete();
WeakMap.prototype.get();
WeakMap.prototype.has();
WeakMap.prototype.set();

// 可以用来设置键的类型
// Map可以用JS的任意类型作为键。WeakMap的话只能是对象。
let weakMap = new WeakMap();
weakMap.set("14", "14"); // Uncaught TypeError: Invalid value used as weak map key
//at WeakMap.set (<anonymous>)

// GC(垃圾回收)。
// 当把a, b都设置成null之后，GC会回收weakMap中的b对象对应的键值对（这里的意思是键和值都回收），也就是{ y: 13}这个对象会被回收，'14'这个常量也会被清除。但是不会回收Map中a对象对应的键值对，也就是{x: 12}这个对象并不会回收。
let a = { x: 12 };
let b = { y: 13 };
let map = new Map();
let weakMap = new WeakMap();
map.set(a, "14");
weakMap.set(b, "15");
a = null;
b = null; // 设置为null提醒垃圾回收可以回收了。

// WeakMap中值被回收，是因为键被回收了
let a = { x: 12 };
let b = { y: 15 };
let weakMap = new WeakMap();
weakMap.set(a, b);
console.log(weakMap.get(a));
b = null; // 这样做不会影响weakMap的存储
console.log(weakMap.get(a));

// Map的使用，用在值需要频繁的删改的场景（map有优化），以及键只能是对象的场景比较优。如果只是简单的记录值而且键不会是对象的情况，用普通对象就OK了。
