# 事件轮询EventLoop

## 浏览器的 Eventloop
- Eventloop 是 JavaScript 引擎异步编程背后需要特别关注的知识点。JS 在单线程上执行所有操作，虽然是单线程，但是能够高效地解决问题，并能给我们带来一种“多线程”的错觉，这其实是通过使用一些比较合理的数据结构来达到此效果的。

- 1.调用堆栈（call stack）负责跟踪所有要执行的代码。
  - 每当一个函数执行完成时，就会从堆栈中弹出（pop）该执行完成函数；如果有代码需要进去执行的话，就进行 push 操作，
- 2.事件队列（event queue）负责将新的 function 发送到队列中进行处理。
  - 它遵循 queue 的数据结构特性，先进先出，在该顺序下发送所有操作以进行执行。
- 3.每当调用事件队列（event queue）中的异步函数时，都会将其发送到浏览器 API。
  - 根据从调用堆栈收到的命令，API 开始自己的单线程操作。其中 setTimeout 方法就是一个比较典型的例子，在堆栈中处理 setTimeout 操作时，会将其发送到相应的 API，该 API 一直等到指定的时间将此操作送回进行处理。它将操作发送到哪里去呢？答案是事件队列（event queue）。这样，就有了一个循环系统，用于在 JavaScript 中运行异步操作。
- 4.JavaScript 语言本身是单线程的，而浏览器 API 充当单独的线程。
  - 事件循环（Eventloop）促进了这一过程，它会不断检查调用堆栈是否为空。如果为空，则从事件队列中添加新的函数进入调用栈（call stack）；如果不为空，则处理当前函数的调用。我们把整个过程串起来就是这样的一个循环执行流程，
![JS 引擎的Eventloop全局流程图](./Eventloop.png)
- 简单来说 Eventloop 通过内部两个队列来实现 Event Queue 放进来的异步任务。以 setTimeout 为代表的任务被称为宏任务，放到宏任务队列（macrotask queue）中；而以 Promise 为代表的任务被称为微任务，放到微任务队列（microtask queue）中。

### macrotasks(宏任务)与microtasks(微任务)
```
macrotasks(宏任务): 
script(整体代码),setTimeout,setInterval,setImmediate,I/O,UI rendering,event listner
microtasks(微任务): 
process.nextTick, Promises, Object.observe, MutationObserver
```
### 宏任务与微任务的执行的情况
- JavaScript 引擎首先从宏任务队列（macrotask queue）中取出第一个任务；
- 执行完毕后，再将微任务（microtask queue）中的所有任务取出，按照顺序分别全部执行（这里包括不仅指开始执行时队列里的微任务），如果在这一步过程中产生新的微任务，也需要执行；
- 然后再从宏任务队列中取下一个，执行完毕后，再次将 microtask queue 中的全部取出，循环往复，直到两个 queue 中的任务都取完。
- 总结起来就是：一次 Eventloop 循环会处理一个宏任务和所有这次循环中产生的微任务。

## Node.js 的 Eventloop
- 当 Node.js 开始启动时，会初始化一个 Eventloop，处理输入的代码脚本，这些脚本会进行 API 异步调用，process.nextTick() 方法会开始处理事件循环。下面就是 Node.js 官网提供的 Eventloop 事件循环参考流程。
![Node.js的Eventloop](./Node.js的Eventloop.png)
- Timers 阶段：这个阶段执行 setTimeout 和 setInterval。
- I/O callbacks 阶段：这个阶段主要执行系统级别的回调函数，比如 TCP 连接失败的回调。
- idle，prepare 阶段：只是 Node.js 内部闲置、准备，可以忽略。
- poll 阶段：poll 阶段是一个重要且复杂的阶段，几乎所有 I/O 相关的回调，都在这个阶段执行（除了setTimeout、setInterval、setImmediate 以及一些因为 exception 意外关闭产生的回调），这个阶段的主要流程如下图所示。
![poll](./poll.png)
- check 阶段：执行 setImmediate() 设定的 callbacks。
- close callbacks 阶段：执行关闭请求的回调函数，比如 socket.on('close', ...)。

### 除了把 Eventloop 的宏任务细分到不同阶段外。node 还引入了一个新的任务队列 Process.nextTick()。
- Process.nextTick() 会在上述各个阶段结束时，在进入下一个阶段之前立即执行（优先级甚至超过 microtask 队列）。

## 浏览器Eventloop 与 Node.js 的 Eventloop不同点
- Node.js 和浏览器端宏任务队列的另一个很重要的不同点是，浏览器端任务队列每轮事件循环仅出队一个回调函数接着去执行微任务队列；而 Node.js 端只要轮到执行某个宏任务队列，则会执行完队列中所有的当前任务，但是当前轮次新添加到队尾的任务则会等到下一轮次才会执行。

## EventLoop 对渲染的影响
- requestIdlecallback 和 requestAnimationFrame，这两个函数不在 Eventloop 的生命周期的哪一步触发，他们的回调也不会在微任务队列还是宏任务队列执行的时候。这两个方法其实也并不属于 JS 的原生方法，而是浏览器宿主环境提供的方法，因为它们牵扯到另一个问题：渲染。
- 浏览器作为一个复杂的应用是多线程工作的，除了运行 JS 的线程外，还有渲染线程、定时器触发线程、HTTP 请求线程，等等。JS 线程可以读取并且修改 DOM，而渲染线程也需要读取 DOM，这是一个典型的多线程竞争临界资源的问题。所以浏览器就把这两个线程设计成互斥的，即同时只能有一个线程在执行。
- 渲染原本就不应该出现在 Eventloop 相关的知识体系里，但是因为 Eventloop 显然是在讨论 JS 如何运行的问题，而渲染则是浏览器另外一个线程的工作。但是 requestAnimationFrame 的出现却把这两件事情给关联起来，
- 你可以看下 RAF 的解释：通过调用 requestAnimationFrame 我们可以在下次渲染之前执行回调函数。那下次渲染具体是哪个时间点呢？渲染和 Eventloop 有什么关系呢？我们在 HTML协议对 Eventloop 的规范 里找到了答案。简单来说，就是在每一次 Eventloop 的末尾，判断当前页面是否处于渲染时机，就是重新渲染。而这个所谓的渲染时机是这样定义的有屏幕的硬件限制，比如 60Hz 刷新率，简而言之就是 1 秒刷新了 60 次，16.6ms 刷新一次。这个时候浏览器的渲染间隔时间就没必要小于 16.6ms，因为就算渲染了屏幕上也看不到。当然浏览器也不能保证一定会每 16.6ms 会渲染一次，因为还会受到处理器的性能、JavaScript 执行效率等其他因素影响。
- requestAnimationFrame，这个 API 保证在下次浏览器渲染之前一定会被调用，实际上我们完全可以把它看成是一个高级版的 setInterval。它们都是在一段时间后执行回调，但是前者的间隔时间是由浏览器自己不断调整的，而后者只能由用户指定。这样的特性也决定了 requestAnimationFrame 更适合用来做针对每一帧来修改的动画效果。
- requestAnimationFrame 不是 Eventloop 里的宏任务，或者说它并不在 Eventloop 的生命周期里，只是浏览器又开放的一个在渲染之前发生的新的 hook。另外需要注意的是微任务的认知概念也需要更新，在执行 animation callback 时也有可能产生微任务（比如 promise 的 callback），会放到 animation queue 处理完后再执行。所以微任务并不是像之前说的那样在每一轮 Eventloop 后处理，而是在 JS 的函数调用栈清空后处理。
- requestIdlecallback 却是一个更好理解的概念。当宏任务队列中没有任务可以处理时，浏览器可能存在“空闲状态”。这段空闲时间可以被 requestIdlecallback 利用起来执行一些优先级不高、不必立即执行的任务；当然为了防止浏览器一直处于繁忙状态，导致 requestIdlecallback 可能永远无法执行回调，它还提供了一个额外的 timeout 参数，为这个任务设置一个截止时间。浏览器就可以根据这个截止时间规划这个任务的执行。

