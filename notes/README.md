## Vue.js 基础回顾

### 基础结构
- 使用 `new Vue({ el: '#app', data: {} }) `
- 使用 `new Vue({ data: {}, render(h) {} }).$mount('#app') `

### 生命周期
- new Vue()  新建 Vue 实例
- beforeCreate  初始化事件 & 生命周期
- created  初始化注入 & 校验
- 是否指定 “el” 选项和 “template” 选项
- beforeMount  
- mounted  创建 vm.$el并用其替换 el
- 当 data 被修改时，触发 beforeUpdate
- 虚拟 DOM 重新渲染并应用更新，触发 updated
- 当调用 vm.$destroy() 函数时，触发 beforeDestroy
- destroyed  解除绑定，销毁子组件以及事件监听器
- 销毁完毕

### Vue 语法和概念
- 插值表达式
- 指令
- 计算属性和侦听器
- Class 和 Style
- 条件渲染/列表渲染
- 表单输入绑定
- 组件
- 插槽
- 插件
- 混入 mixin
- 深入响应式原理
- 不同构建版本的 Vue

## Vue-Router 原理实现

### Hash 模式和 History 模式的区别

- 不管哪种方式，都是客户端路由的实现方式，当路径发生变化不会向服务器发送请求
- 表现形式的区别
  + Hash 模式：https://music.163.com/#/playlist?id=3102961863
  + History 模式：https://music.163.com/playlist/3102961863
- 原理的区别
  + Hash 模式是基于锚点，以及 onhashchange 事件
  + History 模式是基于 HTML5 中的 History API，history.pushState() IE 10 以后才支持， history.replaceState

### History 模式的使用
- History 需要服务器的支持
- 单页应用中，服务端不存在 http://www/testurl.com/login 这样的地址会返回找不到该页面
- 在服务端应该除了静态资源外都返回单页应用的 index.html

**History 模式 - Node.js**
```javascript
/* app.js */
const path = require('path')
// 导入处理 history 模式的模块
const history = require('connect-history-api-fallback')
// 导入 express
const express = require('express')

const app = express()
// 注册处理 history 模式的中间件
app.use(history())
// 处理静态资源的中间件，网站根目录 ../web
app.use(express.static(path.join(__dirname, '../web')))

// 开启服务器，端口是 3000
app.listen(3000, () => {
  console.log('服务器开启，端口：3000')
})
```

**History 模式 - nginx**
- 从官网下载 nginx 压缩包 http://nginx.org/en/download.html
- 把压缩包解压到 c 盘根目录，c:\nginx-1.18.0 文件夹
- 打开命令行，切换到目录 c:\nginx-1.18.0

nginx 相关命令
```bash
# 启动
start nginx
# 重启
nginx -s reload
# 停止
nginx -s stop
```

nginx.conf 文件
```conf
server {
  # ...
  location / {
    root   html;
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;
  }
}
```

### VueRouter 实现原理

Hash 模式
- URL 中 # 后面的内容作为路径地址
- 监听 hashchange 事件
- 根据当前路由地址找到对应组件重新渲染

History 模式
- 通过 history.pushState() 方法改变地址栏
- 监听 popstate 事件
- 根据当前路由地址找到对应组件重新渲染

Vue 的构建版本
- 运行时版：不支持 template 模板，需要打包的时候提前编译
- 完整版：包含运行时和编译器，体积比运行时版大 10K 左右，程序运行的时候把模板转换成 render 函数

## 模拟 Vue.js 响应式原理

### 数据驱动

数据响应式、双向绑定、数据驱动

数据响应式
- 数据模型仅仅是普通的 JS 对象，而当我们修改数据时，视图会进行更新，避免了繁琐的DOM操作，提高开发效率

双向绑定
- 数据改变，视图改变；试图改变，数据也随之改变
- 我们可以使用 v-model 在表单元素上创建双向数据绑定

数据驱动
- 数据驱动是 vue 最独特的特性之一
- 开发过程中仅需要关注数据本身，不需要关心数据是如何渲染到视图的


### 响应式的核心原理
Vue 2.x
- Object.defineProperty
- 浏览器兼容 IE8 以上（不兼容 IE8）

Vue 3.x
- Proxy
- 直接监听对象，而非属性
- ES6 中新增，IE 不支持，性能由浏览器优化

### 发布订阅模式和观察者模式

#### 发布/订阅模式
- 订阅者
- 发布者
- 信号中心

我们假定，存在一个“信号中心”，某个人物执行完成，就向信号中心“发布”（publish）一个信号，其他任务可以向信号中心“订阅”（subscribe）这个信号，从而知道什么时候自己可以开始执行。这就叫做“发布/订阅模式”（publish-subscribe pattern）

Vue 的自定义事件
```javascript
let vm = new Vue()

vm.$on('dataChange', () => {
  consloe.log('dataChange1')
})

vm.$on('dataChange', () => {
  consloe.log('dataChange2')
})

vm.$emit('dataChange')
```

兄弟组件通信过程
```javascript
// eventBus.js
// 事件中心
let eventHub = new Vue()

// ComponentA.vue
// 发布者
addTodo: function () {
  // 发布消息(事件)
  eventHub.$emit('add-todo', { text: this.newTodoText })
  this.newTodoText = ''
}

// ComponentB.vue
// 订阅者
created: function () {
  // 订阅消息(事件)
  eventHub.$on('add-todo', this.addTodo)
}
```

模拟 Vue 自定义事件的实现
```javascript
class EventEmitter {
  constructor () {
      // { 'click': [fn1, fn2], 'change': [fn] }
      this.subs = Object.create(null)
  }
  $on (eventType, handler) {
      this.subs[eventType] = this.subs[eventType] || []
      this.subs[eventType].push(handler)
  }
  $emit (eventType) {
      if (this.subs[eventType]) {
          this.subs[eventType].forEach(handler => {
              handler()
          })
      }
  }
}
```

#### 观察者模式
- 观察者（订阅者） -- Watcher
  + update(): 当事件发生时，具体要做的事情
- 目标(发布者) -- Dep
  + subs 数组: 存储所有的观察者
  + addSub(): 添加观察者
  + notify(): 当事件发生时，调用所有观察者的 update() 方法
- 没有事件中心

总结
- **观察者模式**是由具体目标调度，比如当事件触发，Dep 就会去调用观察者的方法，所以观察者模式的订阅者与发布者之间是存在依赖的
- **发布/订阅模式**由统一调度中心调用，因此发布者和订阅者不需要知道对方的存在


### 模拟Vue响应式原理

整体分析
- Vue 基本结构
- 打印 Vue 实例观察
- 整体结构
- 把 data 中的成员注入到 Vue 实例，并且把 data 成员转成 getter/setter
- Observer: 能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知 Dep

#### Vue
- 负责接收初始化的参数
- 负责把 data 中的属性注入到 Vue 实例，转换成 getter/setter
- 负责调用 observer 监听 data 中所有属性的变化
- 负责调用 compiler 解析指令/插值表达式

#### Observer
- 负责把 data 选项中的属性转换成响应式数据
- data 中的某个属性也是对象，把该属性转换成响应式数据
- 数据变化发送通知

#### Compiler
- 负责编译模板，解析指令/插值表达式
- 负责页面的首次渲染
- 当数据变化后重新渲染视图

#### Dep (Dependency)
- 收集依赖，添加观察者（watcher）
- 通知所有观察者

#### Watcher
- 当数据变化触发依赖，dep 通知所有的 Watcher 实例更新视图
- 自身实例化的时候往 dep 对象中添加自己

#### 总结
问题
- 给 data 中某个属性重新赋值成对象，是否是响应式的？ --- 是
- 给 Vue 实例新增一个成员是否是响应式的？ --- 否

## Virtual DOM 的实现原理

### 什么是 Virtual DOM
- Virtual DOM（虚拟 DOM），是由普通的 JS 对象来描述 DOM 对象，因为不是真实的 DOM 对象，所以叫 Virtual DOM
- 可以使用 Virtual DOM 来描述真实的 DOM

### 为什么使用 Virtual DOM
- 手动操作 DOM 比较麻烦，还需要考虑浏览器兼容问题，虽然 jQuery 等库简化了 DOM 操作，但是随着项目的复杂 DOM 操作复杂提升
- 为了简化 DOM 的复杂操作于是出现了各种 MVVM 框架，MVVM 框架解决了视图和状态的同步问题
- 为了简化视图的操作我们可以使用模板引擎，但是模板引擎没有解决跟踪状态变化的问题，于是 Virtual DOM 出现了
- Virtual DOM 的好处是当状态改变时不需要立即更新 DOM，只需要创建一个虚拟树来描述 DOM，Virtual DOM 内部将弄清楚如何有效(diff)的更新 DOM

### 虚拟 DOM 的作用
- 维护视图和状态的关系
- 复杂视图情况下提升渲染性能
- 除了渲染 DOM 外，还可以实现 SSR(Nuxt.js/Next.js)、原生应用(Weex/React Native)、小程序(mpvue/uni-app) 等
- 并不是所有情况使用虚拟DOM都能提升性能，只有在视图比较复杂的情况下，使用虚拟DOM才会提高渲染性能

