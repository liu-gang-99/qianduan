1. ### `setup`

   - 在 `beforeCreate` 钩子函数执行前执行，此时还没有创建组件实例，所以 `this` 指向 `undfined`

   - 模板中需要使用的数据和函数需要在 `setup` 中返回

   - `setup` 默认不支持 `async` 修饰符

     

2. ### 生命周期

   |     `vue2`      |      `vue3`       |
   | :-------------: | :---------------: |
   | `beforeCreate`  |      `setup`      |
   |    `created`    |      `setup`      |
   |  `beforeMount`  |  `onBeforeMount`  |
   |    `mounted`    |    `onMounted`    |
   | `beforeUpdate`  | `onBeforeUpdate`  |
   |    `updated`    |    `onUpdated`    |
   | `beforeDestroy` | `onBeforeUnmount` |
   |   `destroyed`   |   `onUnmounted`   |
   
   
   
3. ### `reactive`

   - 将复杂类型的数据转化为响应式数据

      

4. ### `toRef`

   - `toRef` 的本质是引用关系，修改响应式数据会影响原始数据

   - `toREf` 转换响应式数据时才会引起页面刷新，普通对象则不会

     

5. ### `toRefs`

   - `toRefs` 只能接收响应式对象，并将其属性转换为单独响应式数据

      

6. ### `ref`函数

   - `ref` 函数常用于简单数据类型的响应式数据

   - `ref` 函数仅能监听基本类型的变化，不能监听复杂类型的变化

      

7. ### `ref` 属性

   - 创建响应式数据，并返回给模板使用，再将数据绑定到模板中，最后就可以通过这个变量操作DOM或组件

      

8. ### `computed`

   - 完整写法

   - ```vue
      const xxx = computed({
        get() {
        	return xxx
        },
        set(val) {
        	改变依赖项...
        }
      })
      ```

      
   
9. ### `watch`

   - 完整写法

   - ```vue
      watch(
        () => obj.xxx, // 侦听对象中某个属性需用函数形式
        () => {
        	相关操作...
        },
        {
        	deep: true,
        	immediate: true
        }
      )
      ```

      

10. ### `v-model`

   - | `vue2`  |       `vue3`        |
      | :-----: | :-----------------: |
      | `value` |    `modelValue`     |
      | `input` | `update:modelValue` |

      


