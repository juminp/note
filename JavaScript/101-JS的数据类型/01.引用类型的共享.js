// 引用类型(Object)存储在堆内存，存储的是地址，多个引用指向同一个地址，这里会涉及一个“共享”的概念。
/**
 * 1.
 * 第一个 console 打出来 name 是 'lee'，这应该没什么疑问；但是在执行了 b.name='son' 之后，结果你会发现 a 和 b 的属性 name 都是 'son'，第二个和第三个打印结果是一样的，这里就体现了引用类型的“共享”的特性，即这两个值都存在同一块内存中共享，一个发生了改变，另外一个也随之跟着变化。
 */
let a = {
    name: 'lee',
    age: 20
};
let b = a;
console.log(a.name); // lee
b.name = 'son';
console.log(a.name); // son
console.log(b.name); // son

/**
 * 2.
 * 第一个 console 的结果是 30，b 最后打印结果是 {name: "Kath", age: 30}；第二个 console 的返回结果是 24，而 a 最后的打印结果是 {name: "Julia", age: 24}。
 */
let aa = {
    name: 'Julia',
    age: 20
}
function change(o) {
    o.age = 24;
    o = {
        name: 'Kath',
        age: 30
    }
    return o;
}
let bb = change(aa);
console.log(bb.age); // 30
console.log(aa.age); // 24