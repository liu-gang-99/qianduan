class Vue {
  constructor(options) {
    this.$options = options // 总配置项
    this._data = options.data // 定义的 data 数据
    this.initData()
  }

  // 给 data 中的属性添加 get set 并挂载到实例上
  initData() {
    const data = this._data
    const keys = Object.keys(data) // 获取 data 中所有的 属性名

    for (let i = 0; i < keys.length; i++) {
      Object.defineProperty(this, keys[i], {
        // this 指向第一个参数
        // 会将 this 指向第一个参数
        enumerable: true, // 是否可枚举(遍历)
        configurable: true, // 是否可改变描述符或删除
        get() {
          // console.log('读取了', keys[i], data[keys[i]])
          return data[keys[i]]
        },
        set(newValue) {
          // console.log(keys[i], '改变为', newValue)
          data[keys[i]] = newValue
        }
      })
    }
    observe(data)
    this.initWatch()
  }

  // 给 data 中的属性添加侦听器
  initWatch() {
    const watch = this.$options.watch
    if (watch) {
      // 判断有无侦听器
      let keys = Object.keys(watch)
      for (let key of keys) {
        new Watcher(this, key, watch[key])
      }
    }
  }

  $watch(key, cb) {
    new Watcher(this, key, cb)
  }
}

// -------------------- 实现数据劫持----------------------

// 给单个属性设置 get set
function defineReactive(obj, key, value) {
  observe(value) // 判断是否需要递归
  let dep = new Dep()
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      // console.log('读取了', key, value)
      dep.depend() // 向当前属性的 dep实例中存放 watch实例
      return value
    },
    set(newValue) {
      if (value === newValue) return
      // console.log(key, '改变为', newValue)
      dep.notify() // 执行回调
      value = newValue
    }
  })
}

// 判断是否需要递归
function observe(data) {
  let type = Object.prototype.toString.call(data).slice(8, -1)
  if (type !== 'Object' && type !== 'Array') return // 排除基本数据类型

  new Observer(data)
}

// 给引用数据类型循环调用 设置 get set
class Observer {
  constructor(data) {
    this.walk(data)
  }
  walk(data) {
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(data, keys[i], data[keys[i]])
    }
  }
}

// ------------------- 实现 watch  --------------------
/* 每个属性在设置响应式的时候都会创建一个自己的 dep实例 用来存储自己的 watch实例 */

// 框
class Dep {
  constructor() {
    this.subs = []
  }
  // 收集侦听器 只有在创建 watch实例的时候才能添加
  // Dep.target 指向 watch实例后 就添加 添加完成就清空 Dep.targe 所有读取数据就不会重复添加
  depend() {
    // 判断有无 watch
    if (Dep.target) {
      this.subs.push(Dep.target) // 存入侦听器实例
    }
  }
  // 执行回调
  notify() {
    this.subs.forEach((watcher) => {
      watcher.run() // 依次执行回调函数
    })
  }
}

let watcherId = 0 // 侦听器的id
this.watcherQueue = [] // 存放 待执行 侦听器的id

class Watcher {
  constructor(vm, exp, cb) {
    this.vm = vm
    this.exp = exp
    this.cb = cb
    this.id = watcherId++ // 创建 watch 实例的时候绑定 id
    this.get()
  }
  // 求值
  get() {
    Dep.target = this // this 指向 watch 实例
    this.vm[this.exp] // 用来触发 get  通过闭包拿到当前属性的 dep实例  调用 depend
    Dep.target = null
  }
  // 调用实例的回调函数
  run() {
    // watch 已经存在队列中 不再重复添加 防止数据多次变动时重复执行
    if (watcherQueue.indexOf(this.id) !== -1) return
    watcherQueue.push(this.id)
    let index = watcherQueue.length - 1
    Promise.resolve().then(() => {
      this.cb.call(this.vm)
      watcherQueue.splice(index, 1) // 回调执行完就从 watcherQueue 删除侦听器的id
    })
  }
}
