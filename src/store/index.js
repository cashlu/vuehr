import Vue from "vue";
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        // 保存当前用户授权访问的路由（菜单项）
        routes: [],
    },
    mutations:{
        // 初始化路由，调用时可不用传state参数
        initRoutes(state, data){
            state.routes = data
        }
    },
    actions:{

    }
})
