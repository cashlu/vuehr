<template>
    <div>
        <el-input class="searchInput" size="small"
                  placeholder="请输入部门名称进行搜索..."
                  prefix-icon="el-icon-search"
                  v-model="filterText">
        </el-input>

        <el-tree class="filter-tree"
                 :data="departments"
                 :props="defaultProps"
                 :default-expand-all="true"
                 :filter-node-method="filterNode"
                 ref="tree">
            <!-- node指当前元素，而data代表当前元素中的数据。-->
            <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                    <!--click.stop阻止冒泡，因为button在span上，span单机会相应节点的展开和关闭-->
                    <el-button
                        type="primary"
                        size="mini"
                        class="depBtn"
                        @click.stop="() => showAddDepView(data)">
                    添加部门
                    </el-button>
                    <el-button
                        type="danger"
                        size="mini"
                        class="depBtn"
                        @click.stop="() => deleteDep(data)">
                    删除部门
                    </el-button>
                    </span>
                    </span>
        </el-tree>
        <el-dialog
            title="添加部门"
            :visible.sync="addFormVisible"
            width="30%">
            <table>
                <tr>
                    <td><el-tag>上级部门</el-tag></td>
                    <td>{{parentDep.name}}</td>
                </tr>
                <tr>
                    <td><el-tag>部门名称</el-tag></td>
                    <td><el-input size="small" v-model="newDepartment.name" autocomplete="off"></el-input></td>
                </tr>
            </table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="doAddDepartment">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "DepManager",
    data() {
        return {
            filterText: "",
            departments: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            addFormVisible:false,
            newDepartment:{
                name:"",
                parentId:"",
            },
            parentDep:{
                name:"",
            },
        }
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            // 默认是data.label，改为name，后端传回来的列表，部门名称的属性名是name。
            // value代表关键字，data代表树中的每一个节点。
            // 原理：判断待搜索名称的节点的下标，如果不为-1，则代表存在，返回该节点。
            return data.name.indexOf(value) !== -1;
        },
        initDepartments() {
            this.getRequest("/system/basic/department/").then(resp => {
                if (resp.status === 200) {
                    this.departments = resp.obj
                }
            })
        },
        showAddDepView(data) {
            this.parentDep = data
            this.newDepartment.parentId = data.id
            this.addFormVisible = true

        },
        deleteDep(data) {
            this.$confirm('此操作将永久删除部门【' + data.name + '】, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest("/system/basic/department/", data).then(resp=>{
                    if (resp && resp.status === 200) {
                        this.initDepartments()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        doAddDepartment(){
            if (this.newDepartment.name) {
                this.postRequest("/system/basic/department/", this.newDepartment).then(resp=>{
                    if (resp.status === 200) {
                        this.addFormVisible = false;
                        this.newDepartment.name = ""
                        this.newDepartment.parentId = ""
                        this.initDepartments()
                    }
                })
            }else{
                this.$message.error("请输入部门名称！")
            }
        },
    },
    watch: {
        // 搜索框绑定的变量名，和这里要相同
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    mounted() {
        this.initDepartments()
    }
}
</script>

<style>
.searchInput {
    width: 500px;
}

.filter-tree {
    margin-top: 10px;
    width: 500px;
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}

.depBtn {
    padding: 2px
}
</style>
