<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">微人事</div>
                <el-dropdown @command="commandHandler">
                    <span class="el-dropdown-link">
                        {{ user.name }}<i><img :src="user.userface" alt="用户头像"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <!--item的command属性，只是一个标记，不是点击事件，点击事件在上面的el-dropdown标签上。
                        每个item的command是点击事件的参数。-->
                        <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
                        <el-dropdown-item command="setting">设置</el-dropdown-item>
                        <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu
                        default-active="2"
                        class="el-menu-vertical-demo"
                        @open="handleOpen"
                        @close="handleClose">
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>导航一</span>
                            </template>
                            <el-menu-item index="1-1">选项1</el-menu-item>
                            <el-menu-item index="1-2">选项2</el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>Main</el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    name: "Home",
    data() {
        return {
            // 将sessionStorage中获取的JSON格式的字符串，转换为JS对象。
            user: JSON.parse(window.sessionStorage.getItem("user"))
        }
    },
    methods: {
        commandHandler(command) {
            if (command === "logout") {
                // 确认注销
                this.$confirm('此操作将注销登录用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.getRequest("/logout")
                    window.sessionStorage.removeItem("user")
                    this.$router.replace("/")
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消注销'
                    });
                });
            }
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }
    }
}
</script>

<style>
.homeHeader {
    background-color: #409eff;
    /*使用flex布局（弹性布局）*/
    display: flex;
    /*元素在交叉轴上居中显示，这里的元素是header上面的文字，logo和链接*/
    align-items: center;
    /*两端对齐，元素中间的空白相等*/
    justify-content: space-between;
    padding: 0 15px;
    /*让padding和border的尺寸，包含在总体的width中，内容区的实际宽度是width减去(border + padding)的值。*/
    box-sizing: border-box;
}

.homeHeader .title {
    font-size: 30px;
    font-family: 华文行楷,sans-serif;
    color: #ffffff;
}

.el-dropdown-link {
    cursor: pointer;
}

.el-dropdown-link img {
    width: 48px;
    height: 48px;
    /*让图片变成圆形*/
    border-radius: 24px;
    margin-left: 8px;
}

.el-dropdown-link {
    /*让文字垂直居中，现将父容器定义为flex模式，然后这是居中。*/
    display: flex;
    align-items: center;
}

</style>
