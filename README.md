# 卢显灿 ｜ Part 3 | 模块一

## 简答题

### 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如果把新增成员设置成响应式数据，它的内部原理是什么。
```javascript
let vm = new Vue({
    el: '#el'
    data: {
        o: 'object',
        dog: {}
    },
    method: {
        clickHandler () {
            // 该 name 属性是否是响应式的
            this.dog.name = 'Trump'
        }
    }
})
```

答：题目中通过 `this.dog.name = 'Trump'` 给 dog 增加的成员 不是响应式数据。

在 Vue 中可以通过 `Vue.set( target, propertyName/index, value )` 或者 `this.$set( target, propertyName/index, value )` 的方式为 target 对象动态添加响应式数据。Vue 2.x 中的原理是：类似于调用 `defineReactive(obj, key, val)` 方法，利用 `Object.defineProperty` 的 getter 和 setter 实现响应式数据。


### 2、请简述 Diff 算法的执行过程

答：

DOM操作是很耗性能的，因此需要尽量减少DOM操作。找出本次DOM必须更新的节点来更新，其他的不更新，这个“找出”的过程，就需要diff算法。

diff算法主要执行过程：
- patch(container, vnode) ，首次渲染，将 container 转为 vnode，并对比新旧 VNode 是否相同节点然后更新DOM
- patch(vnode, newVnode) ，数据改变二次渲染，对比新旧 VNode 是否相同节点然后更新DOM
- createElm(vnode, insertedVnodeQueue)，先执行用户的 init 钩子函数，然后把 vnode 转换成真实 DOM（此时没有渲染到页面），最后返回新创建的 DOM
- updateChildren(elm, oldCh, ch, insertedVnodeQueue), 如果 VNode 有子节点，并且与旧VNode子节点不相同则执行 updateChildren()，比较子节点的差异并更新到DOM

## 编程题

### 1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。
答：参考项目 ./vue-router-lxc ，文件路径： ./vue-router-lxc/src/vuerouter_hash/index.js

### 2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。
答：参考项目 ./mini-vue-lxc ，文件路径： ./mini-vue-lxc/js/compiler.js

部分代码
```javascript
    // 处理 v-html 指令
    htmlUpdater (node, value, key) {
        node.innerHTML = value
        new Watcher(this.vm, key, newValue => {
            node.innerHTML = newValue
        })
    }
    // 处理 v-on 指令
    onUpdater (node, value, key, eventType) {
        node.addEventListener(eventType, value)
        new Watcher(this.vm, key, newValue => {
            node.removeEventListener(eventType, value)
            node.addEventListener(eventType, newValue)
        })
    }
```

### 3、参考 Snabbdom 提供的电影列表的示例，利用 Snabbdom 实现类似的效果

答：参考项目 ./snabbdom-demo


## 项目文件说明

- notes : 笔记
- mini-vue-lxc : 小型 vue 框架，实现了响应式、插值表达式、部分指令等功能
- vue-router-lxc : 基于 vue-cli 模拟实现了 vue-router 的两种模式 history 和 hash
- snabbdom-demo : 使用 snabbdom 开发的小 demo，用于学习和巩固 snabbdom 的基本用法
