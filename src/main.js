import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import {initMenu} from "@/utils/menus";
import 'font-awesome/css/font-awesome.min.css'


import {postRequest, postKeyValueRequest, getRequest, putRequest, deleteRequest} from "@/utils/api";
// 将Api中自定义的几个请求封装，注册为Vue的插件。这样在任何地方，直接使用this.postRequest()就可以调用。
Vue.prototype.postRequest = postRequest
Vue.prototype.postKeyValueRequest = postKeyValueRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.deleteRequest = deleteRequest

Vue.config.productionTip = false

Vue.use(ElementUI)

// 全局导航守卫
// 在导航跳转之前执行的钩子函数
router.beforeEach((to, from, next) => {
    // 除了login页面以外的其他页面，执行菜单的初始化。
    if (to.path === '/') {
        next()
    } else {
        initMenu(router, store)
        next();
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
