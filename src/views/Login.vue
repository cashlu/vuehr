<template>
    <div>


        <el-form :roles="roles" :model="loginForm">
        </el-form>
    </div>
</template>

<script>
export default {
    name: "Login",
    data() {
        return {
            roles: {
                username: [{required: true, message: "请输入用户名", trigger: "blur"}],
                password:[{required: true, message: "请输入密码", trigger: "blur"}]
            },
            loginForm:{}
        }
    }
}
</script>

<style scoped>

</style>
