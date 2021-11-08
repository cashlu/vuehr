<template>
    <div>
        <el-form :rules="rules" ref="loginForm" :model="loginForm" class="loginContainer"
                 v-loading="loading"
                 element-loading-text="正在登录..."
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(0, 0, 0, 0.8)"
        >
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item prop="username">
                <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password" auto-complete="off"
                          placeholder="请输入密码" @keydown.enter.native="submitLogin"></el-input>
            </el-form-item>
            <el-checkbox class="loginRememberMe" v-model="checked"></el-checkbox>
            <el-button type="primary" style="width: 100%" @click="submitLogin">登录</el-button>
        </el-form>
    </div>
</template>

<script>

export default {
    name: "Login",
    data() {
        return {
            rules: {
                username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                password: [{required: true, message: "请输入密码", trigger: "blur"}]
            },
            loginForm: {
                username: "admin",
                password: "123",
            },
            checked: true,
            loading: false,
        }
    },
    methods: {
        submitLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    // 展示loading
                    this.loading = true

                    this.postKeyValueRequest("/doLogin", this.loginForm).then(resp => {
                        // 不论登录成功与否，loading都要关掉
                        this.loading = false

                        // 在axios的response拦截器中，已经对response做了处理，如果后端返回错误的话，resp不会有值。
                        if (resp) {
                            window.sessionStorage.setItem("user", JSON.stringify(resp.obj))
                            // 先判断一下，路径中是否有redirect参数，如果有，说明用户是在未登录前访问某页面，main.js中
                            // 的导航守卫发现用户没登录，先跳转到登录页面的。这是后如果用户登录成功了，需要自动跳转到redirect
                            // 参数后面的路径中。
                            let path = this.$route.query.redirect;
                            console.log(path);
                            // push可以后退，replace不能回退。这里我们不希望登录后，还能后退到登录页。
                            this.$router.replace((path === '/' || path === undefined) ? "/home" : path)
                        }
                    })
                } else {
                    this.$message.error("请填写正确的用户名及密码")
                    return false;
                }
            });
        }
    }
}
</script>

<style>
/* 将登录表单设置为悬浮卡片的样式 */
.loginContainer {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 15px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
    margin: 15px auto 20px auto;
    text-align: center;
    color: #505458;
}

.loginRememberMe {
    text-align: left;
    margin: 0 0 15px 0;
}
</style>
