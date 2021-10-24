<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">微人事</div>
                <el-dropdown @command="commandHandler">
                    <span class="el-dropdown-link">
                        {{ user.name }}<i><img :src="attachImageUrl(user.userface)" alt="用户头像"></i>
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
                    <!--是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->
                    <el-menu router unique-opened>
                        <!--让每个菜单项的内容，和路由数组中的name属性同步-->
                        <!--遍历routers数组（index.js）,不显示hidden==true的项目-->
                        <!--index加空字符串是因为这里期待字符串，而index是数字-->
                        <el-submenu :index="index+''"
                                    v-for="(item, index) in routes" :key="index"
                                    v-if="!item.hidden">
                            <template slot="title">
                                <i style="color: #409eff; margin-right: 5px" :class="item.iconCls"></i>
                                <span>{{ item.name }}</span>
                            </template>
                            <el-menu-item :index="child.path"
                                          v-for="(child, childIndex) in item.children"
                                          :key="childIndex">{{ child.name }}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb separator-class="el-icon-arrow-right"
                                   v-if="this.$router.currentRoute.path!=='/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <!--首页才显示-->
                    <div class="homeWelcome"  v-if="this.$router.currentRoute.path==='/home'">
                        欢迎来到微人事
                    </div>
                    <router-view></router-view>
                </el-main>
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
                    // 注销时，清空store中存储的路由列表，否则换用户登录后，还是之前的菜单项
                    this.$store.commit("initRoutes", [])
                    this.$router.replace("/")
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消注销'
                    });
                });
            }
        },
        // 图片防盗链问题解决
        attachImageUrl(srcUrl) {
            if (srcUrl !== undefined) {
                return srcUrl.replace(/http\w{0,1}:\/\/p/g, 'https://images.weserv.nl/?url=p')
            }
        },
    },
    computed: {
        routes() {
            return this.$store.state.routes
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
    font-family: 华文行楷, sans-serif;
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

.homeWelcome {
    text-align: center;
    font-size: 30px;
    color: #409eff;
    font-family: 华文行楷,sans-serif;
    padding-top: 50px;

}

</style>
