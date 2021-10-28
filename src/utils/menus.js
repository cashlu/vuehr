import {getRequest} from "@/utils/api";

// 初始化导航栏菜单数据
export const initMenu = (router, store) => {
    // 如果store中已经存储了菜单数据，那就说明已经初始化过了。
    if (store.state.routes.length > 0) {
        return
    }
    getRequest("/system/config/menu").then(data => {
        if (data) {
            let fmtRoutes = formatRoutes(data);
            // 将格式化处理好的路由数据，添加到系统的路由数组中
            router.addRoutes(fmtRoutes)
            // 将路由数据，保存到store中，避免每次都从后端请求数据。
            store.commit("initRoutes", fmtRoutes)
        }
    })
}

export const formatRoutes = (routes) => {
    let finalRoutes = []
    routes.forEach(router => {
        // 解构赋值的语法，举例：path=router.path
        let {
            path,
            component,
            name,
            meta,
            iconCls,
            children
        } = router
        // 如果children中没有数据，则为null。
        if (children && children instanceof Array) {
            // 对children递归
            children = formatRoutes(children)
        }
        let fmRouter = {
            path: path,
            name: name,
            meta: meta,
            iconCls: iconCls,
            children: children,
            // component需要单独处理一下，因为后端传过来数据是字符串，而routes中是对象。
            component(resolve) {
                if (component.startsWith("Emp")) {
                    require(['../views/emp/' + component + '.vue'], resolve);
                } else if (component.startsWith("Per")) {
                    require(['../views/per/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sal")) {
                    require(['../views/sal/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sta")) {
                    require(['../views/sta/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sys")) {
                    require(['../views/sys/' + component + '.vue'], resolve);
                }else if (component.startsWith("Home")) {
                    require(['../views/' + component + '.vue'], resolve)
                }
            }
        }

        finalRoutes.push(fmRouter)
    })

    return finalRoutes
}
