# 排序

## 时间复杂度&空间复杂度

![Big O graphs](./big-o-graph.png)
### 最常用的 大O标记法 列表以及它们与不同大小输入数据的性能比较。

| 大O标记法      | 计算10个元素                 | 计算100个元素                 | 计算1000个元素                  |
| -------------- | ---------------------------- | ----------------------------- | ------------------------------- |
| **O(1)**       | 1                            | 1                             | 1                               |
| **O(log N)**   | 3                            | 6                             | 9                               |
| **O(N)**       | 10                           | 100                           | 1000                            |
| **O(N log N)** | 30                           | 600                           | 9000                            |
| **O(N^2)**     | 100                          | 10000                         | 1000000                         |
| **O(2^N)**     | 1024                         | 1.26e+29                      | 1.07e+301                       |
| **O(N!)**      | 3628800                      | 9.3e+157                      | 4.02e+2567                      |

### 数据结构操作的复杂性

| 数据结构       |  连接  |  查找  |  插入  |  删除  | 备注 |
| -------------- | :----: | :----: | :----: | :----: | ---- |
| **数组**       |   1    |   n    |   n    |   n    |      |
| **栈**         |   n    |   n    |   1    |   1    |      |
| **队列**       |   n    |   n    |   1    |   1    |      |
| **链表**       |   n    |   n    |   1    |   1    |      |
| **哈希表**     |   -    |   n    |   n    |   n    | 在完全哈希函数情况下，复杂度是 O(1） |
| **二分查找树** |   n    |   n    |   n    |   n    | 在平衡树情况下，复杂度是 O(log(n)) |
| **B 树**       | log(n) | log(n) | log(n) | log(n) |      |
| **红黑树**     | log(n) | log(n) | log(n) | log(n) |      |
| **AVL 树**     | log(n) | log(n) | log(n) | log(n) |      |
| **布隆过滤器** |   -    |   1    |   1    | - | 存在一定概率的判断错误（误判成存在） |

### 数组排序算法的复杂性

| 名称                  | 最优      | 平均      | 最坏          | 内存      | 稳定      | 备注                  |
| --------------------- | :-------: | :-------: | :-----------: | :-------: | :-------: | --------------------- |
| **冒泡排序**          | n         | n^2       | n^2           | 1         | Yes       |                       |
| **插入排序**          | n         | n^2       | n^2           | 1         | Yes       |                       |
| **选择排序**          | n^2       | n^2       | n^2           | 1         | No        |                       |
| **堆排序**            | n log(n)  | n log(n)  | n log(n)      | 1         | No        |                       |
| **归并排序**          | n log(n)  | n log(n)  | n log(n)      | n         | Yes       |                       |
| **快速排序**          | n log(n)  | n log(n)  | n^2           | log(n)    | No        | 在 in-place 版本下，内存复杂度通常是 O(log(n)) |
| **希尔排序**          | n log(n)  | 取决于差距序列   | n (log(n))^2  | 1         | No        |  |
| **计数排序**          | n + r     | n + r     | n + r         | n + r     | Yes       | r - 数组里最大的数    |
| **基数排序**          | n * k     | n * k     | n * k         | n + k     | Yes       | k - 最长 key 的升序   |

## 排序的 JS 实现
- 比较类排序：通过比较来决定元素间的相对次序，其时间复杂度不能突破 O(nlogn)，因此也称为非线性时间比较类排序。
- 非比较类排序：不通过比较来决定元素间的相对次序，它可以突破基于比较排序的时间下界，以线性时间运行，因此也称为线性时间非比较类排序。

### 冒泡排序
- 冒泡排序是最基础的排序，一般在最开始学习数据结构的时候就会接触它。冒泡排序是一次比较两个元素，如果顺序是错误的就把它们交换过来。走访数列的工作会重复地进行，直到不需要再交换，也就是说该数列已经排序完成。
```
var a = [1, 3, 6, 3, 23, 76, 1, 34, 222, 6, 456, 221];
function bubbleSort(array) {
  const len = array.length
  if (len < 2) return array
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < i; j++) {
      if (array[j] > array[i]) {
        const temp = array[j]
        array[j] = array[i]
        array[i] = temp
      }
    }
  }
  return array
}
bubbleSort(a);  // [1, 1, 3, 3, 6, 6, 23, 34, 76, 221, 222, 456]
```

### 快速排序
- 快速排序的基本思想是通过一趟排序，将待排记录分隔成独立的两部分，其中一部分记录的关键字均比另一部分的关键字小，则可以分别对这两部分记录继续进行排序，以达到整个序列有序。
  - 最主要的思路是从数列中挑出一个元素，称为 “基准”（pivot）；然后重新排序数列，所有元素比基准值小的摆放在基准前面、比基准值大的摆在基准的后面；在这个区分搞定之后，该基准就处于数列的中间位置；然后把小于基准值元素的子数列（left）和大于基准值元素的子数列（right）递归地调用 quick 方法排序完成，这就是快排的思路。
```
var a = [1, 3, 6, 3, 23, 76, 1, 34, 222, 6, 456, 221];
function quickSort(array) {
  var quick = function(arr) {
    if (arr.length <= 1) return arr
    const len = arr.length
    const index = Math.floor(len >> 1)
    const pivot = arr.splice(index, 1)[0]
    const left = []
    const right = []
    for (let i = 0; i < len; i++) {
      if (arr[i] > pivot) {
        right.push(arr[i])
      } else if (arr[i] <= pivot) {
        left.push(arr[i])
      }
    }
    return quick(left).concat([pivot], quick(right))
  }
  const result = quick(array)
  return result
}
quickSort(a);//  [1, 1, 3, 3, 6, 6, 23, 34, 76, 221, 222, 456]
```

### 插入排序
- 插入排序算法描述的是一种简单直观的排序算法。它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入，从而达到排序的效果。
  - 插入排序的思路是基于数组本身进行调整的，首先循环遍历从 i 等于 1 开始，拿到当前的 current 的值，去和前面的值比较，如果前面的大于当前的值，就把前面的值和当前的那个值进行交换，通过这样不断循环达到了排序的目的。
```
var a = [1, 3, 6, 3, 23, 76, 1, 34, 222, 6, 456, 221];
function insertSort(array) {
  const len = array.length
  let current
  let prev
  for (let i = 1; i < len; i++) {
    current = array[i]
    prev = i - 1
    while (prev >= 0 && array[prev] > current) {
      array[prev + 1] = array[prev]
      prev--
    }
    array[prev + 1] = current
  }
  return array
}
insertSort(a); // [1, 1, 3, 3, 6, 6, 23, 34, 76, 221, 222, 456]
```

### 选择排序
- 选择排序是一种简单直观的排序算法。它的工作原理是，首先将最小的元素存放在序列的起始位置，再从剩余未排序元素中继续寻找最小元素，然后放到已排序的序列后面……以此类推，直到所有元素均排序完毕。
  - 通过选择排序的方法同样也可以实现数组的排序，从上面的代码中可以看出该排序是表现最稳定的排序算法之一，因为无论什么数据进去都是 O(n 平方) 的时间复杂度，所以用到它的时候，数据规模越小越好。
```
var a = [1, 3, 6, 3, 23, 76, 1, 34, 222, 6, 456, 221];
function selectSort(array) {
  const len = array.length
  let temp
  let minIndex
  for (let i = 0; i < len - 1; i++) {
    minIndex = i
    for (let j = i + 1; j < len; j++) {
      if (array[j] <= array[minIndex]) {
        minIndex = j
      }
    }
    temp = array[i]
    array[i] = array[minIndex]
    array[minIndex] = temp
  }
  return array
}
selectSort(a); // [1, 1, 3, 3, 6, 6, 23, 34, 76, 221, 222, 456]
```

### 堆排序
- 堆排序是指利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质，即子结点的键值或索引总是小于（或者大于）它的父节点。堆的底层实际上就是一棵完全二叉树，可以用数组实现。
  - 堆排序相比上面几种排序整体上会复杂一些，不太容易理解。不过你应该知道两点：一是堆排序最核心的点就在于排序前先建堆；二是由于堆其实就是完全二叉树，如果父节点的序号为 n，那么叶子节点的序号就分别是 2n 和 2n+1。
  - 堆排序最后有两个循环：第一个是处理父节点的顺序；第二个循环则是根据父节点和叶子节点的大小对比，进行堆的调整。通过这两轮循环的调整，最后堆排序完成。
```
var a = [1, 3, 6, 3, 23, 76, 1, 34, 222, 6, 456, 221];
function heap_sort(arr) {
  var len = arr.length
  var k = 0
  function swap(i, j) {
    var temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  function max_heapify(start, end) {
    var dad = start
    var son = dad * 2 + 1
    if (son >= end) return
    if (son + 1 < end && arr[son] < arr[son + 1]) {
      son++
    }
    if (arr[dad] <= arr[son]) {
      swap(dad, son)
      max_heapify(son, end)
    }
  }
  for (var i = Math.floor(len / 2) - 1; i >= 0; i--) {
    max_heapify(i, len)
  }
   
  for (var j = len - 1; j > k; j--) {
    swap(0, j)
    max_heapify(0, j)
  }
  
  return arr
}
heap_sort(a); // [1, 1, 3, 3, 6, 6, 23, 34, 76, 221, 222, 456]
```

### 归并排序
- 采用分治法的一个非常典型的应用。将已有序的子序列合并，得到完全有序的序列；先使每个子序列有序，再使子序列段间有序。若将两个有序表合并成一个有序表，称为二路归并。
  - 从 mergeSort 方法中看到，通过 mid 可以把该数组分成左右两个数组，分别对这两个进行递归调用排序方法，最后将两个数组按照顺序归并起来。
  - 归并排序是一种稳定的排序方法，和选择排序一样，归并排序的性能不受输入数据的影响，但表现比选择排序好得多，因为始终都是 O(nlogn) 的时间复杂度。而代价是需要额外的内存空间。
```
var a = [1, 3, 6, 3, 23, 76, 1, 34, 222, 6, 456, 221];
function mergeSort(array) {
  const merge = (right, left) => {
    const result = []
    let il = 0
    let ir = 0
    while (il < left.length && ir < right.length) {
      if (left[il] < right[ir]) {
        result.push(left[il++])
      } else {
        result.push(right[ir++])
      }
    }
    while (il < left.length) {
      result.push(left[il++])
    }
    while (ir < right.length) {
      result.push(right[ir++])
    }
    return result
  }
  const mergeSort = array => {
    if (array.length === 1) { return array }
    const mid = Math.floor(array.length / 2)
    const left = array.slice(0, mid)
    const right = array.slice(mid, array.length)
    return merge(mergeSort(left), mergeSort(right))
  }
  return mergeSort(array)
}
mergeSort(a); // [1, 1, 3, 3, 6, 6, 23, 34, 76, 221, 222, 456]
```
