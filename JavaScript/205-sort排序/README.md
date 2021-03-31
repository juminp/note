# sort排序

## sort 方法的基本使用
- arr.sort([compareFunction])
```
const months = ['March', 'Jan', 'Feb', 'Dec'];
months.sort();
console.log(months);
// ["Dec", "Feb", "Jan", "March"]
const array1 = [1, 30, 4, 21, 100000];
array1.sort();
console.log(array1);
// [1, 100000, 21, 30, 4]
```
```
const array1 = [1, 30, 4, 21, 100000];
array1.sort((a,b) => b - a);
console.log(array1);    // [100000, 30, 21, 4, 1]
const array1 = [1, 30, 4, 21, 100000];
array1.sort((a,b) => a - b);
console.log(array1);    // [1, 4, 21, 30, 100000]
```

## 底层 sort 源码分析
- 当 n<=10 时，采用插入排序；
- 当 n>10 时，采用三路快速排序；
- 1000>=n>10，采用中位数作为哨兵元素；
- n>1000，每隔 200~215 个元素挑出一个元素，放到一个新数组中，然后对它排序，找到中间位置的数，以此作为中位数。
```
function ArraySort(comparefn) {
  CHECK_OBJECT_COERCIBLE(this, "Array.prototype.sort");
  var array = TO_OBJECT(this);
  var length = TO_LENGTH(array.length);
  return InnerArraySort(array, length, comparefn);
}
function InnerArraySort(array, length, comparefn) {
  // 比较函数未传入
  if (!IS_CALLABLE(comparefn)) {
    comparefn = function (x, y) {
      if (x === y) return 0;
      if (%_IsSmi(x) && %_IsSmi(y)) {
        return %SmiLexicographicCompare(x, y);
      }
      x = TO_STRING(x);
      y = TO_STRING(y);
      if (x == y) return 0;
      else return x < y ? -1 : 1;
    };
  }
  function InsertionSort(a, from, to) {
    // 插入排序
    for (var i = from + 1; i < to; i++) {
      var element = a[i];
      for (var j = i - 1; j >= from; j--) {
        var tmp = a[j];
        var order = comparefn(tmp, element);
        if (order > 0) {
          a[j + 1] = tmp;
        } else {
          break;
        }
      }
      a[j + 1] = element;
    }
  }
  function GetThirdIndex(a, from, to) {
    // 元素个数大于1000时寻找哨兵元素
    var t_array = new InternalArray();
    var increment = 200 + ((to - from) & 15);
    var j = 0;
    from += 1;
    to -= 1;
    for (var i = from; i < to; i += increment) {
      t_array[j] = [i, a[i]];
      j++;
    }
    t_array.sort(function (a, b) {
      return comparefn(a[1], b[1]);
    });
    var third_index = t_array[t_array.length >> 1][0];
    return third_index;
  }
  function QuickSort(a, from, to) {
    // 快速排序实现
    //哨兵位置
    var third_index = 0;
    while (true) {
      if (to - from <= 10) {
        InsertionSort(a, from, to); // 数据量小，使用插入排序，速度较快
        return;
      }
      if (to - from > 1000) {
        third_index = GetThirdIndex(a, from, to);
      } else {
        // 小于1000 直接取中点
        third_index = from + ((to - from) >> 1);
      }
      // 下面开始快排
      var v0 = a[from];
      var v1 = a[to - 1];
      var v2 = a[third_index];
      var c01 = comparefn(v0, v1);
      if (c01 > 0) {
        var tmp = v0;
        v0 = v1;
        v1 = tmp;
      }
      var c02 = comparefn(v0, v2);
      if (c02 >= 0) {
        var tmp = v0;
        v0 = v2;
        v2 = v1;
        v1 = tmp;
      } else {
        var c12 = comparefn(v1, v2);
        if (c12 > 0) {
          var tmp = v1;
          v1 = v2;
          v2 = tmp;
        }
      }
      a[from] = v0;
      a[to - 1] = v2;
      var pivot = v1;
      var low_end = from + 1;
      var high_start = to - 1;
      a[third_index] = a[low_end];
      a[low_end] = pivot;
      partition: for (var i = low_end + 1; i < high_start; i++) {
        var element = a[i];
        var order = comparefn(element, pivot);
        if (order < 0) {
          a[i] = a[low_end];
          a[low_end] = element;
          low_end++;
        } else if (order > 0) {
          do {
            high_start--;
            if (high_start == i) break partition;
            var top_elem = a[high_start];
            order = comparefn(top_elem, pivot);
          } while (order > 0);
          a[i] = a[high_start];
          a[high_start] = element;
          if (order < 0) {
            element = a[i];
            a[i] = a[low_end];
            a[low_end] = element;
            low_end++;
          }
        }
      }
      // 快排的核心思路，递归调用快速排序方法
      if (to - high_start < low_end - from) {
        QuickSort(a, high_start, to);
        to = low_end;
      } else {
        QuickSort(a, from, low_end);
        from = high_start;
      }
    }
  }
}
```
