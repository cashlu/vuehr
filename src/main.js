import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import {initMenu} from "@/utils/menus";
import 'font-awesome/css/font-awesome.min.css'
import 'animate.css';


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
        // 如果用户已登录，则放行
        if (window.sessionStorage.getItem("user")) {
            initMenu(router, store)
            next();
        } else {
            // 如果用户没有登录，先跳转到登录页，登录后，再跳转回用户本来想访问的页面。
            // 解决的方法是将要跳转的url从to中提取出来，然后拼接在url上，然后登录成功后，
            // 由Login.vue页面先判断一下，如果有redirect，那么就直接跳转过去。
            next("/?redirect=" + to.path)
        }
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
