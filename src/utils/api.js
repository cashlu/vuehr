import axios from "axios";
import {Message} from "element-ui";
import router from "@/router";


// 根据请求的情况，打印后端返回的RespBean.msg，或者这里自定义的错误信息。
axios.interceptors.response.use(success => {
    // TODO: 巨坑！！！如果后端报500的状态码，这里会拦截掉！其他地方不用判断status===200，
    //  因为这里放行的，只有200，后端定义的其他状态码，这里都拦截处理了。
    if (success.status && success.status === 200 && success.data.status === 500) {
        // 业务错误，例如用户名密码错误
        Message.error(success.data.msg)
        // 什么都不返回，这样请求调用方如果拿不到数据，则代表请求失败。
        return
    }
    if (success.data.msg) {
        Message.success(success.data.msg)
    }
    // 请求成功的话，直接返回了success.data，这样请求调用的位置，就不用data.data了
    return success.data;
}, error => {
    if (error.response.status === 504 || error.response.status === 404) {
        Message.error("服务器被吃了！o(╯□╰)o")
    } else if (error.response.status === 401) {
        // TODO: 因为在PermissionManager.vue中，change()方法内部会执行两个方法，都是Axios请求。
        Message.error("尚未登录，请登录！")
        // 跳转到登录页
        router.replace("/").catch(err => {
            err
        })
    } else if (error.response.status === 403) {
        Message.error("权限不足，请联系管理员！")
    } else {
        if (error.response.data.msg) {
            Message.error(error.response.data.msg)
        } else {
            Message.error("未知错误！")
        }
    }
    return
})

// 统一的请求前缀
let base = ""

// axios默认使用json格式发送数据，但是Spring Security默认使用键值对接收用户名密码，所以这里要单独处理一下登录的请求。
export const postKeyValueRequest = (url, params) => {
    return axios({
        method: "post",
        url: `${base}${url}`,
        data: params,
        // transformRequest允许在向服务器发送前，修改请求数据。注意transformRequest接受的是一个function数组。
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

// 发送json格式数据的请求
export const postRequest = (url, params) => {
    return axios({
        method: "post",
        url: `${base}${url}`,
        data: params,
    })
}

export const putRequest = (url, params) => {
    return axios({
        method: "put",
        url: `${base}${url}`,
        data: params,
    })
}
export const getRequest = (url, params) => {
    return axios({
        method: "get",
        url: `${base}${url}`,
        data: params,
    })
}

export const deleteRequest = (url, params) => {
    return axios({
        method: "delete",
        url: `${base}${url}`,
        data: params,
    })
}
