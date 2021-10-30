<template>
    <div>
        <div class="roleInput">
            <el-input size="small" placeholder="请输入角色英文名..." v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input size="small" placeholder="请输入角色中文名..." v-model="role.nameZh"></el-input>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="doAddRole">添加角色</el-button>
        </div>
        <div class="roleCollapse">
            <el-collapse accordion @change="change" v-model="activeName">
                <el-collapse-item :title=role.nameZh :name="role.id" v-for="(role, index) in roles" :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问资源</span>
                            <el-button style="float: right; padding: 3px 0; color:red" type="text"
                                       icon="el-icon-delete" @click="deleteRole(role)"></el-button>
                        </div>
                        <div>
                            <el-tree :data="allMenus"
                                     :props="defaultProps"
                                     show-checkbox
                                     :default-checked-keys="selectedMenus"
                                     node-key="id"
                                     :key="index"
                                     ref="tree">
                            </el-tree>
                            <div style="display: flex; justify-content: flex-end">
                                <el-button size="mini" @click="cancleUpdate">取消修改</el-button>
                                <el-button size="mini" type="primary" @click="doUpdate(role.id, index)">确认修改</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
export default {
    name: "PermissionManager",
    data() {
        return {
            role: {
                name: "",
                nameZh: "",
            },
            roles: [],
            allMenus: [],
            selectedMenus: [],
            defaultProps: {
                children: "children",
                label: "name"
            },
            activeName: -1,

        }
    },
    methods: {
        initRoles() {
            this.getRequest("/system/basic/permission/").then(resp => {
                if (resp.status === 200) {
                    this.roles = resp.obj;
                }
            })
        },

        initAllMenus() {
            this.getRequest("/system/basic/permission/menus/").then(resp => {
                if (resp.status === 200) {
                    this.allMenus = resp.obj
                }
            })
        },

        // 折叠面板展开的回调函数，参数是每个面板的name属性。模板中定义了是role.id
        change(rid) {
            // 折叠面板展开或者关闭时，都会调用这个函数，区别是展开时有name，关闭时没有。这里不需要响应关闭操作，所以判断一下。
            if (rid) {
                this.initAllMenus()
                this.initMidsByRid(rid)
            }
        },

        // 根据roleId获取具备权限的MenuId
        initMidsByRid(rid) {
            this.getRequest("/system/basic/permission/mids/" + rid).then(resp => {
                this.selectedMenus = resp.obj
            })
        },

        // 确认提交对权限的修改
        doUpdate(rid, index) {
            // 有几个role，就会有几个tree，所以还传入了index，作为区分。
            let tree = this.$refs.tree[index]
            let checkedKeys = tree.getCheckedKeys(tree)
            // 这个update执行后，什么都不需要做，所以不需要后续的钩子函数。
            this.putRequest("/system/basic/permission/" + rid, checkedKeys).then(resp => {
                if (resp.status === 200) {
                    this.activeName = -1
                }
            })
        },
        cancleUpdate() {
            this.activeName = -1
        },
        doAddRole() {
            if (this.role.name && this.role.nameZh) {
                this.postRequest("/system/basic/permission/role/", this.role).then(resp => {
                    if (resp.status === 200) {
                        this.role.name = ""
                        this.role.nameZh = ""
                        this.initRoles()
                    }
                })
            } else {
                this.$message.warning("请填写完整的角色数据！")
            }
        },
        deleteRole(role) {
            this.$confirm('此操作将永久删除【' + role.nameZh + '】角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // this.$message({
                //     type: 'success',
                //     message: '删除成功!'
                // });
                this.deleteRequest("/system/basic/permission/role/" + role.id).then(resp=>{
                    if (resp.status === 200) {
                        // 这句关闭折叠页的操作实际不需要，但是加上后，貌似视觉效果稍微平滑一些。
                        this.activeName = -1
                        this.initRoles()
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
        this.initRoles()
    }
}
</script>

<style>
.roleInput .el-input {
    width: 300px;
    margin-right: 5px;
}

.roleCollapse {
    margin-top: 10px;
    width: 705px;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

.box-card {
    width: 600px;
}


</style>
