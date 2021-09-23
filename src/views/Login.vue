<template>
    <div>
        <el-form :rules="rules" ref="loginForm" :model="loginForm" class="loginContainer">
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item prop="username">
                <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password" auto-complete="off"
                          placeholder="请输入密码"></el-input>
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
        }
    },
    methods: {
        submitLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.postKeyValueRequest("/doLogin", this.loginForm).then(resp => {
                        // 在axios的response拦截器中，已经对response做了处理，如果后端返回错误的话，resp不会有值。
                        if (resp) {
                            window.sessionStorage.setItem("user", JSON.stringify(resp.obj))
                            // push可以后退，replace不能回退。这里我们不希望登录后，还能后退到登录页。
                            this.$router.replace("/home")
                        }
                    })
                } else {
                    console.log('error submit!!');
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
