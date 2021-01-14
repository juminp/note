// 类型转换
console.log('123' == 123); // true
console.log('' == null); // false
console.log('' == 0); // true
console.log([] == 0); // true
console.log([] == ''); // true
console.log([] == ![]); // true
console.log(null == undefined); // true
console.log(Number(null)); // 0
console.log(Number('')); // 0
console.log(parseInt('')); // NaN
console.log({}+10); // 10
let obj = {
    [Symbol.toPrimitive]() {
        return 200;
    },
    valueOf() {
        return 300;
    },
    toString() {
        return 'Hello';
    }
}
console.log(obj + 200); // 400
/**
 * 1.强制类型转换
 * Number()、parseInt()、parseFloat()、toString()、String()、Boolean()
 */

/**
 * Number() 方法的强制转换规则
 * 
 * 如果是布尔值，true 和 false 分别被转换为 1 和 0；
 * 如果是数字，返回自身；
 * 如果是 null，返回 0；
 * 如果是 undefined，返回 NaN；
 * 如果是字符串，遵循以下规则：如果字符串中只包含数字（或者是 0X / 0x 开头的十六进制数字字符串，允许包含正负号），则将其转换为十进制；如果字符串中包含有效的浮点格式，将其转换为浮点数值；如果是空字符串，将其转换为 0；如果不是以上格式的字符串，均返回 NaN；
 * 如果是 Symbol，抛出错误；
 * 如果是对象，并且部署了 [Symbol.toPrimitive] ，那么调用此方法，否则调用对象的 valueOf() 方法，然后依据前面的规则转换返回的值；如果转换的结果是 NaN ，则调用对象的 toString() 方法，再次依照前面的顺序转换返回对应的值
 */
Number(true);        // 1
Number(false);       // 0
Number('0111');      //111
Number(null);        //0
Number(undefined);   //NaN
Number('');          //0
Number([]);          //0
Number('1a');        //NaN
Number(-0X11);       //-17
Number('0X11')       //17

/**
 * Boolean() 方法的强制转换规则
 * 
 * 这个方法的规则是：除了 undefined、 null、 false、 ''、 0（包括 +0，-0）、 NaN 转换出来是 false，其他都是 true。
 */
Boolean(0)          //false
Boolean(null)       //false
Boolean(undefined)  //false
Boolean(NaN)        //false
Boolean(1)          //true
Boolean(13)         //true
Boolean('12')       //true

/**
 * parseInt() 方法的强制转换规则
 * 
 * 数字：截断小数，返回小数点前的数值。没有小数点不转换还是为自身。
 * null：转为NaN。
 * undefined：转为NaN。
 * 字符串：会忽略前面的0和空格直到找到第一个数字然后一直找到非数字字符为止。
 * 字符串为数字：转为对应的数值。
 * 字符串中有一个小数点：截断小数，返回小数点前的数值转为数值形。
 * 字符串中有0x：转为十六进制对应的十进制数值。
 * 字符串为空：转为NaN。
 * 字符串为非空非数字非0x：转为NaN。
 * 字符串中有科学计数法e：不支持科学计数法，返回e之前的数值片段。
 */
parseInt(1)          // 1
parseInt(true)       // NaN
parseInt(null)       // NaN
parseInt(undefined)  // NaN
parseInt('')         // NaN
parseInt('   01 ')   // 1
parseInt('   0 1 ')  // 0
parseInt('   1 0 ')  // 1
parseInt('1.111')    // 1
parseInt('6.23E+12') // 6

/**
 * parseFloat() 方法的强制转换规则
 * 
 * 数字：不转换还是为自身。
 * null：转为NaN。
 * undefined：转为NaN。
 * 字符串：会忽略前面的0和空格直到找到第一个数字然后一直找到非数字字符为止。
 * 字符串为数字：转为对应的数值。
 * 字符串中有一个小数点：转为对应的浮点数值。如果有第二个小数点则截取第二个小数点之前的数值片段。
 * 字符串中有0x：转为0。
 * 字符串为空：转为NaN。
 * 字符串为非空非数字非0x：转为NaN。
 * 字符串中有科学计数法e：字符e(后面加number) 转为科学计数法计算后到结果。
 */
parseFloat(1)          // 1
parseFloat(true)       // NaN
parseFloat(null)       // NaN
parseFloat(undefined)  // NaN
parseFloat('')         // NaN
parseFloat('   01 ')   // 1
parseFloat('   0 1 ')  // 0
parseFloat('   1 0 ')  // 1
parseFloat('1.111')    // 1.111
parseFloat('6.23E+12') // 6230000000000

/**
 * toString() 方法的强制转换规则
 * 每个对象都有一个 toString() 方法，当对象被表示为文本值时或者当以期望字符串的方式引用对象时，该方法被自动调用;这里先记住，valueOf() 和 toString() 在特定的场合下会自行调用.
 * 
 * null 转换为 'null'
 * undefined 转换为 undefined
 * Boolean 如果布尔值是true,则返回”true”,否则返回”false”
 * Date 返回日期的文本表示
 * Error 返回一个包含相关错误信息的字符串
 * Function 返回如下格式的字符串,”function functionname() { [native code] }”
 * Number 返回数值的自负产表示,参数表示转化成几进制,toString(2)返回二进制的字符串
 * String 返回String对象的值
 * Object(默认) 返回”[object ObjectName]”，其中 ObjectName 是对象类型的名称。
 */
true.toString()             // 'true'
null.toString()             // 'null'
undefined.toString()        // 'undefined'
let toStringNum = 10
toStringNum.toString()      // '10'
toStringNum.toString(2)     // '1010' 二进制
[1,2,3].toString()          // '1,2,3
let toStringObj = { a: 1 }
toStringObj.toString()      // "[object Object]"

/**
 * String() 方法的强制转换规则
 * 
 * null 转换为 'null'
 * undefined 转换为 undefined
 * true 转换为 'true'，false 转换为 'false'
 * 数字转换遵循通用规则，极大极小的数字使用指数形式
 * 对象这里要先转换为原始值，调用ToPrimitive转换，type就指定为string了，继续回到ToPrimitive进行转换（看ToPrimitive）
 */
String(null)       // 'null'
String(undefined)  // 'undefined'
String(true)       // 'true'
String(1111)       // '1111'
String({a: 1})     // "[object Object]"

/**
 * 2.隐式类型转换
 * 凡是通过逻辑运算符 (&&、 ||、 !)、运算符 (+、-、*、/)、关系操作符 (>、 <、 <= 、>=)、相等运算符 (==) 或者 if/while 条件的操作，如果遇到两个数据类型不一样的情况，都会出现隐式类型转换。这里你需要重点关注一下，因为比较隐蔽，特别容易让人忽视。
 */

/**
 * '==' 的隐式类型转换规则
 * 
 * 如果类型相同，无须进行类型转换；
 * 如果其中一个操作值是 null 或者 undefined，那么另一个操作符必须为 null 或者 undefined，才会返回 true，否则都返回 false；
 * 如果其中一个是 Symbol 类型，那么返回 false；
 * 两个操作值如果都为 string 和 number 类型，那么就会将字符串转换为 number；
 * 如果一个操作值是 boolean，那么转换成 number；
 * 如果一个操作值为 object 且另一方为 string、number 或者 symbol，就会把 object 转为原始类型再进行判断（调用 object 的 valueOf/toString 方法进行转换）。
 */
null == undefined       // true  规则2
null == 0               // false 规则2
'' == null              // false 规则2
'' == 0                 // true  规则4 字符串转隐式转换成Number之后再对比
'123' == 123            // true  规则4 字符串转隐式转换成Number之后再对比
0 == false              // true  e规则 布尔型隐式转换成Number之后再对比
1 == true               // true  e规则 布尔型隐式转换成Number之后再对比
var a = {
    value: 0,
    valueOf: function() {
        this.value++;
        return this.value;
    }
};
// 注意这里a又可以等于1、2、3
console.log(a == 1 && a == 2 && a ==3);  //true f规则 Object隐式转换
// 注：但是执行过3遍之后，再重新执行a==3或之前的数字就是false，因为value已经加上去了，这里需要注意一下

/**
 * '+' 的隐式类型转换规则
 * 如果其中有一个是字符串，另外一个是 undefined、null 或布尔型，则调用 toString() 方法进行字符串拼接；如果是纯对象、数组、正则等，则默认调用对象的转换方法会存在优先级（下一讲会专门介绍），然后再进行拼接。
 * 如果其中有一个是数字，另外一个是 undefined、null、布尔型或数字，则会将其转换成数字进行加法运算，对象的情况还是参考上一条规则。
 * 如果其中一个是字符串、一个是数字，则按照字符串规则进行拼接。
 */
1 + 2        // 3  常规情况
'1' + '2'    // '12' 常规情况
// 下面看一下特殊情况
'1' + undefined   // "1undefined" 规则1，undefined转换字符串
'1' + null        // "1null" 规则1，null转换字符串
'1' + true        // "1true" 规则1，true转换字符串
'1' + 1n          // '11' 比较特殊字符串和BigInt相加，BigInt转换为字符串
1 + undefined     // NaN  规则2，undefined转换数字相加NaN
1 + null          // 1    规则2，null转换为0
1 + true          // 2    规则2，true转换为1，二者相加为2
1 + 1n            // 错误  不能把BigInt和Number类型直接混合相加
'1' + 3           // '13' 规则3，字符串拼接


/**
 * Object 的转换规则 对象转换的规则，会先调用内置的 [ToPrimitive] 函数，其规则逻辑如下：
 * 
 * 如果部署了 Symbol.toPrimitive 方法，优先调用再返回；
 * 调用 valueOf()，如果转换为基础类型，则返回；
 * 调用 toString()，如果转换为基础类型，则返回；
 * 如果都没有返回基础类型，会报错。
 */
var obj = {
    value: 1,
    valueOf() {
        return 2;
    },
    toString() {
        return '3'
    },
    [Symbol.toPrimitive]() {
        return 4
    }
}
console.log(obj + 1); // 输出5
// 因为有Symbol.toPrimitive，就优先执行这个；如果Symbol.toPrimitive这段代码删掉，则执行valueOf打印结果为3；如果valueOf也去掉，则调用toString返回'31'(字符串拼接)
// 再看两个特殊的case：
10 + {}
// "10[object Object]"，注意：{}会默认调用valueOf是{}，不是基础类型继续转换，调用toString，返回结果"[object Object]"，于是和10进行'+'运算，按照字符串拼接规则来，参考'+'的规则C
[1,2,undefined,4,5] + 10
// "1,2,,4,510"，注意[1,2,undefined,4,5]会默认先调用valueOf结果还是这个数组，不是基础数据类型继续转换，也还是调用toString，返回"1,2,,4,5"，然后再和10进行运算，还是按照字符串拼接规则，参考'+'的第3条规则