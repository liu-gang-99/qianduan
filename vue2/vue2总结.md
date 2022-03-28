### 1 计算属性

1. 完整写法

   ```vue
   computed: {
     num: {
   	set(v) {
   	// 不能直接改变属性的值，而是改变其依赖项
   	},
   	get() {
   	// 计算属性一定要有返回值
   	return xxx
   	}
     }
   }
   ```



### 2 侦听器

1. 完整写法

   ```vue
   watch: {
     num: {
   	handler(newVal, oldVal) {},
   	deep: true, // 深度监听
   	immediate: true // 立即执行一次
     }
   }
   ```



### 3 计算属性与侦听器

1. `computed` 创建一个新的变量，由一个或多个数据得到它的值，`watch` 侦听一个已经存在的变量，变量变化时做相应的操作
2. `computed` 有缓存，`watch` 没有缓存
3. `computed` 偏向处理简单的业务，`watch` 偏向处理复杂的业务
4. `computed` 是同步任务，`watch` 是异步任务，也方便处理异步



### 4 `v-model`与`.sync`

​	相同点：

1. 本质都是语法糖，都能实现父子组件的双向绑定

​	

​	不同点：

1. `v-model` 默认绑定一个 `value`自定义属性和 `input` 自定义事件，`.sync` 默认绑定一个 `update:xxx` 的自定义事件
2. 一个组件只能绑定一个`v-model` ，但 `.sync` 可以绑定多个
3. `v-mdoel` 更偏向于值的修改，`.sync` 更偏向于状态的修改



### 5 `props`

1. `props` 传参是异步的，子组件要通过 `props` 值在 `created` 钩子函数中发请求时是获取不到数据的，可以直接让父组件调用解决
2. 传的值是引用类型的时候，子组件改变值，父组件也会跟着改变，但不能直接赋值



### 6 `mixin`

1. 一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。
2. 同名钩子函数将合并为一个数组，且混入对象优先执行
3. 值为对象的选项，例如 `methods`、`components` 和 `directives`，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。



### 7 `Vuex`

1. 不带命名空间时， `state` 区分模块，其他 `getters` `mutations` `actions` 都在全局，可用直接使用。
2. 带命名空间 `namespaced: true` 的模块，所有功能区分模块，提高封装度和复用。
3. `state` 里面的数据在`store` 后面加模块名，如 `$store.state.user.abc` 
4. `mutations, actions, getters`  都是在 `store` 后面直接调用 模块名加在 [ ] 里面，如 `$store.commit('[user/fn]', abc)`
5. 当子模块调用子模块里面的函数时，需要加上第三个参数 `{ root: true }`
6. 可结合 `vuex-persist` 插件做数据持久化
6. `dispatch` 函数返回的是一个 `Promise` 对象



### 8 `provide/inject`

1. `provide`：对象 或 返回对象的函数
2. `inject`：数组 或 对象(包含 `from` 和 `default`)
3. 用于父组件向子孙组件传递数据，可理解为大范围有效的 `prop`


