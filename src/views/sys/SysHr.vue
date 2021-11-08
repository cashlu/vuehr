<template>
    <div>
        <div class="search">
            <el-input size="small"
                      type="text"
                      v-model="keyword"
                      prefix-icon="el-icon-search"
                      @keydown.enter.native="initHrs"
                      placeholder="默认展示部分用户，可以通过用户名搜索更多用户...">
            </el-input>
            <el-button type="primary" size="small" icon="el-icon-search" @click="initHrs">搜索</el-button>
        </div>
        <div class="cardContainer">
            <el-card class="hrCard" v-for="(hr, index) in hrs" :key="index">
                <div slot="header" class="clearfix">
                    <span>{{ hr.name }}</span>
                    <el-button style="float: right; padding: 3px 0; color: red"
                               type="text"
                               @click="deleteHr(hr)"
                               icon="el-icon-delete">
                    </el-button>
                </div>
                <div>
                    <div class="imgContainer">
                        <img class="userface" :src="hr.userface" :alt="hr.name" :title="hr.name">
                    </div>
                    <div class="infoContainer">
                        <div>姓名：{{ hr.name }}</div>
                        <div>用户名：{{ hr.username }}</div>
                        <div>手机号码：{{ hr.phone }}</div>
                        <div>电话号码：{{ hr.telephone }}</div>
                        <div>地址：{{ hr.address }}</div>
                        <div>用户状态：
                            <el-switch style="display: inline-block"
                                       v-model="hr.enabled"
                                       active-color="#13ce66"
                                       inactive-color="#ff4949"
                                       @change="switchHrEnabled(hr)"
                                       active-text="启用"
                                       inactive-text="禁用">
                            </el-switch>
                        </div>
                        <div class="rolesContainer">角色：
                            <el-tag size="mini"
                                    v-for="(role, index) in hr.roles"
                                    :key="index"
                                    type="success">
                                {{ role.nameZh }}
                            </el-tag>
                            <el-popover placement="bottom"
                                        title="角色列表"
                                        width="200"
                                        trigger="click"
                                        @show="showPopover(hr)"
                                        @hide="hidePopover(hr)">
                                <el-select v-model="selectedRoles" multiple placeholder="请选择">
                                    <el-option
                                        v-for="(role, rIndex) in roles"
                                        :key="rIndex"
                                        :label="role.nameZh"
                                        :value="role.id">
                                    </el-option>
                                </el-select>
                                <el-button type="text" icon="el-icon-more" slot="reference"></el-button>
                            </el-popover>
                        </div>
                        <div>备注：{{ hr.remark }}</div>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    name: "SysHr",
    data() {
        return {
            keyword: "",
            hrs: [],
            selectedRoles: [],
            roles: [],
        }
    },
    methods: {
        initHrs() {
            this.getRequest("/system/hr/exceptMe/?keyword=" + this.keyword).then(resp => {
                if (resp.status === 200) {
                    this.hrs = resp.obj
                }
            })
        },
        switchHrEnabled(hr) {
            // 删除hr对象的authorities属性，后端反序列化时会报错，因为后端Hr没有这个属性。
            delete hr.authorities
            if (hr.id) {
                this.putRequest("/system/hr/", hr)
            } else {
                this.$message.error("更新用户状态异常，请联系管理员！")
            }
        },
        initAllRoles() {
            this.getRequest("/system/hr/roles/").then(resp => {
                if (resp.status === 200) {
                    this.roles = resp.obj
                }
            })
        },
        // 弹出popover时：
        // 1、初始化所有role的数组。
        // 2、清空selectedRoles数组。
        // 2、获取该用户的role的id，放入selectedRoles中。
        // 通过以上三步，当角色弹出框弹出时，会自动选择好该用户已经具备的角色。
        showPopover(hr) {
            this.initAllRoles()
            this.selectedRoles = []
            hr.roles.forEach(r => {
                this.selectedRoles.push(r.id)
            })
        },

        // 关闭popover时：遍历selectedRoles数组，根据该数组中的id值，向后端发起请求，更新该用户的roles。
        hidePopover(hr) {
            // 先判断用户是否对角色进行了修改
            let roles = []
            hr.roles.forEach(role => {
                roles.push(role.id)
            })
            let flag = roles.length === this.selectedRoles.length && roles.sort().toString() === this.selectedRoles.sort().toString()

            if (!flag) {
                let param = {
                    hrId: hr.id,
                    roleIds: this.selectedRoles
                };
                this.putRequest("/system/hr/role/", param).then(resp => {
                    if (resp.status === 200) {
                        this.initHrs()
                    }
                });
            }
        },
        deleteHr(hr) {
            this.$confirm('此操作将永久删除用户【'+ hr.name +'】, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                this.deleteRequest("/system/hr/" + hr.id).then(resp=>{
                    if (resp.status === 200) {
                        this.initHrs()
                    }
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });







        }
    },
    mounted() {
        this.initHrs()
    }
}
</script>

<style>
.search {
    display: flex;
    justify-content: center;
}

.search .el-input {
    width: 400px;
    margin-right: 10px;
}

.hrCard {
    width: 350px;
    margin-bottom: 20px;
}

.cardContainer {
    /*flex布局*/
    display: flex;
    /*自动换行*/
    flex-wrap: wrap;
    /*分配每行的空隙间隔*/
    justify-content: space-around;
}

.userface {
    width: 72px;
    height: 72px;
    border-radius: 72px;
}

.imgContainer {
    /*占满整个div*/
    width: 100%;
    /*flex布局*/
    display: flex;
    /*头像居中显示*/
    justify-content: center;
}

.infoContainer {
    margin-top: 20px;
}

.infoContainer div {
    font-size: 12px;
    color: #409eff;
}

.rolesContainer .el-tag {
    margin-right: 5px;

}
</style>
