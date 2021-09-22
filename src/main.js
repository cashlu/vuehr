import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

import {postRequest, postKeyValueRequest, getRequest, putRequest, deleteRequest} from "@/utils/api";
// 将Api中自定义的几个请求封装，注册为Vue的插件。这样在任何地方，直接使用this.postRequest()就可以调用。
Vue.prototype.postRequest = postRequest
Vue.prototype.postKeyValueRequest = postKeyValueRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.deleteRequest = deleteRequest

Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
