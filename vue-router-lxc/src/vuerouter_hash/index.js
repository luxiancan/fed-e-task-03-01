let _Vue = null
export default class VueRouter {
    static install (Vue) {
        // 1. 判断当前插件是否已经被安装
        if (VueRouter.install.installed) return
        VueRouter.install.installed = true

        // 2. 把 Vue 构造函数记录到全局变量
        _Vue = Vue

        // 3. 把创建Vue实例时传入的router对象注入到Vue实例上
        _Vue.mixin({
            beforeCreate () {
                // 如果是vue实例就执行，如果是组件就不执行
                if (this.$options.router) {
                    _Vue.prototype.$router = this.$options.router
                }
            }
        })
    }

    constructor (options) {
        this.options = options
        this.routeMap = {}
        // 创建响应式对象
        this.data = _Vue.observable({
            current: '#/'
        })
        this.init()
    }

    init () {
        this.createRouteMap()
        this.initComponents(_Vue)
        this.initEvent()
    }

    createRouteMap () {
        // 遍历所有的路由规则，把路由规则解析成键值对的形式 存储到routeMap中
        this.options.routes.forEach(route => {
            this.routeMap['#' + route.path] = route.component
        })
    }

    initComponents (Vue) {
        Vue.component('router-link', {
            props: {
                to: String
            },
            render (h) {
                return h('a', {
                    attrs: {
                        href: '#' + this.to
                    },
                }, [this.$slots.default])
            },
        })

        const self = this;
        Vue.component('router-view', {
            render (h) {
                // 当前路由组件，找不到时返回 404 组件
                const component = self.routeMap[self.data.current] || self.routeMap['#*']
                return h(component)
            }
        })
    }

    initEvent () {
        // 初始化时，将 hash 地址，也就是 包括#以及后面的地址 存储到 this.data.current
        this.data.current = window.location.hash
        // 监听 hashchange 事件，hash 改变时更新 this.data.current
        window.addEventListener('hashchange', () => {
            this.data.current = window.location.hash
        })
    }
}