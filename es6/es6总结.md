### 1 数组常用方法

1. `forEach`：无返回值，遇到空数组不会执行
2. `map`：返回一个新数组，且无法中断循环
3. `find`：返回第一个满足条件的值后中断循环
4. `some`：检测数组中有无满足条件的值，有一个即可，可通过 `return true` 中断循环
5. `every`：检测数组中的值是否都满足条件，有一个不满足则立即中断循环，且空数组返回 `true`
6. `filter`：返回符合条件的值组成的新数组
7. `reduce`：若提供初始值则从`index 0`开始循环，若没提供则从`index 1`开始循环，`index 0`的值作为初始值



### 2 字符串全局替换

1. `replace` ：`str.replace(/reg/gi, '*')`
2. `replaceAll`：`str.replaceAll('x', '*')`



### 3 利用递归实现深拷贝

```js
function fn(obj) {
  if (obj instanceof Array) {
      return obj.map(fn)
  } else if (obj instanceof Object) {
      const newObj = {}
      for (let k in obj) {
          newObj[k] = fn(obj[k])
      }
      return newObj
  } else {
      return obj
  }
}
```



### 4 rest 参数

1. `function fn(...val) {}`：`val` 则是传进来的参数所组成的数组，可取代 `arguments` 对象



### 5 函数参数的默认值

1. `function fn(a = 0) {}`：形参a在函数内不能再使用 `let/const` 声明
2. `function fn({a = 0, b = 1}) {}`：形参可用使用解构赋值 `fn({a: 10})`



### 6 链判断运算符

1. `?.`：`callback && callback()` ==>  `callback?.()`   `a.b && a.b.c && a.b.c.d`  ==>  `a?.b?.c?.d`



### 7 null 判断运算符

1. `??`：与 `||` 类似 但只判断 `null/undefined` 不包括 空字符串, 0 和`false`



### 8 `Promise`

1. `Promise`是一个构造函数，接受一个函数作为参数，而函数的参数一个是 `resolve` 在异步操作成功时调用，另一个参数是 `reject` 在异步操作失败时调用
2. `then` 同样接受两个函数作为参数，第一个函数在返回 `resolve` 时调用，表示成功的回调，第二个函数在返回 `reject` 时调用，表示失败的回调，并分别接受 `resolve/reject` 传递回来的参数
3. `catch` 与 `then`的第二个参数类似，都是在返回 `reject`时，但不同的是 `catch` 还能捕获 `then` 里面的错误，所以建议使用 `catch` 取代 `then` 的第二个参数
3. `new Promise` 是同步任务，`Promise.[ then/catch/finally ]` 是异步任务中的微任务



### 9 `async/await`

1. `async` 可以定义一个异步函数，函数中 `retuen` 一个 x，不管 x 是什么类型，实际返回值总是 `Promise.resolve(x)`
1. `await` 如果等待的是 `Promise` 对象，则会阻塞后面的代码，等着 `Promise` 对象 `resolve` ，然后得到 `resolve` 的值，作为 `await` 表达式的结果
1. `await` 如果等待的不是 `Promise` 对象，`await` 表达式的结果就是等到的值
1. `await` 之前的代码是同步执行(包括 `await` 这行)，之后的代码是异步执行



### 10 `CommonJS`与`ES6`

1. `CommonJS` 模块输出的是一个值的拷贝，有缓存，`ES6` 模块输出的是值的引用
2. `CommonJS` 模块是运行时加载，只能加载整个模块，`ES6` 模块是编译时输出接口，可以单独加某一个或多个方法
3. `CommonJS` 是单个值导出，`ES6` Module可以导出多个
4. `CommonJS` 是动态语法可以写在判断里，`ES6` Module 静态语法只能写在顶层
5. `CommonJS` 的 this 是当前模块，`ES6` Module的 this 是 undefined