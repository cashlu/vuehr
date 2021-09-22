// 定义一个临时的代理对象，解决开发过程中的跨域问题
let proxyObj = {}
proxyObj["/"]={
    ws:false,
    target:"http://localhost:8081",
    changeOrigin:true,
    pathRewrite:{
        "^/":""
    }
}

module.exports={
    devServer:{
        host: "localhost",
        port: 8080,
        proxy: proxyObj
    }
}
