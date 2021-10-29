<template>
    <div>
        <div>
            <el-input class="jobLevelNameInput"
                      prefix-icon="el-icon-plus"
                      size="small"
                      placeholder="添加职称..."
                      v-model="jobLevel.name">
            </el-input>
            <el-select v-model="jobLevel.titleLevel" placeholder="职称等级" size="small">
                <el-option
                    v-for="item in titleLevels"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>
            <el-button class="addJobLevelBtn"
                       icon="el-icon-plus"
                       size="small"
                       type="primary"
                       @click="addJobLevel">添加
            </el-button>
        </div>
        <div class="tableDiv">
            <el-table
                :data="jobLevels"
                @selection-change="handleSelectionChange"
                border
                stripe
                size="small"
                style="width: 100%">
                <el-table-column type="selection"
                                 width="55">
                </el-table-column>
                <el-table-column prop="id"
                                 label="编号"
                                 width="55">
                </el-table-column>
                <el-table-column prop="name"
                                 label="职称名称"
                                 width="180">
                </el-table-column>
                <el-table-column prop="titleLevel"
                                 label="职称等级"
                                 width="150">
                </el-table-column>
                <el-table-column prop="createDate"
                                 label="创建时间"
                                 width="180">
                </el-table-column>
                <el-table-column prop="enabled"
                                 label="是否启用"
                                 width="100">
                    <template v-slot="scope">
                        <el-tag type="success" v-if="scope.row.enabled===true">已启用</el-tag>
                        <el-tag type="warning" v-else>未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template v-slot="scope">
                        <el-button
                            size="mini"
                            @click="showEditDialog(scope.row)">编辑
                        </el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button class="batchDelBtn" type="danger" size="small" @click="batchDeleteJobLevels"
                       :disabled="multipleSelection.length===0">批量删除</el-button>
        </div>
        <el-dialog
            title="修改职称"
            :visible.sync="dialogVisible"
            width="30%">
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag>职称名称</el-tag>
                        </td>
                        <td>
                            <el-input class="updateJobLevelName" size="small" v-model="updateJobLevel.name"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>职称等级</el-tag>
                        </td>
                        <td>
                            <el-select class="updateJobLevelTitleLevel" v-model="updateJobLevel.titleLevel"
                                       placeholder="职称等级"
                                       size="small">
                                <el-option
                                    v-for="item in titleLevels"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>启用状态</el-tag>
                        </td>
                        <td>
                            <el-switch class="updateJobLevelEnabled"
                                       v-model="updateJobLevel.enabled"
                                       active-color="#13ce66"
                                       inactive-color="#ff4949">
                            </el-switch>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="handleUpdate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "JobLevelManager",
    data() {
        return {
            jobLevel: {
                name: "",
                titleLevel: "",
            },
            updateJobLevel: {
                name: "",
                titleLevel: "",
                enabled: null,
            },
            // 这个属性最理想还是应该由后端来维护
            titleLevels: ["正高级", "副高级", "中级", "初级", "员级"],
            jobLevels: [],
            multipleSelection: [],
            dialogVisible: false,
        }
    },
    methods: {
        initJobLevelList() {
            this.getRequest("/system/basic/jobLevel/").then(resp => {
                if (resp.status === 200) {
                    this.jobLevels = resp.obj
                }
            })
        },
        addJobLevel() {
            if (this.jobLevel.name && this.jobLevel.titleLevel) {
                this.postRequest("/system/basic/jobLevel/", this.jobLevel).then(resp => {
                    if (resp.status === 200) {
                        this.initJobLevelList()
                        this.jobLevel.name = ""
                        this.jobLevel.titleLevel = ""
                    }
                });
            } else {
                this.$message.warning("请填写完整的职称信息，包括名称和等级！")
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        showEditDialog(row) {
            Object.assign(this.updateJobLevel, row)
            this.dialogVisible = true
        },
        handleDelete(row) {
            this.$confirm('此操作将永久删除【' + row.name + '】职称, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest("/system/basic/jobLevel/" + row.id).then(resp => {
                    if (resp.status === 200) {
                        this.initJobLevelList()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        handleUpdate(){
            if (this.updateJobLevel.name && this.updateJobLevel.titleLevel) {
                this.putRequest("/system/basic/jobLevel/", this.updateJobLevel).then(resp=>{
                    this.dialogVisible = false
                    this.initJobLevelList()
                })
            }else{
                this.$message.warning("请输入完整的职称信息！")
            }
        },
        batchDeleteJobLevels(){
            this.$confirm('此操作将永久删除【'+ this.multipleSelection.length +'】个职称, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids = []
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    ids.push(this.multipleSelection[i].id)
                }
                this.deleteRequest("/system/basic/jobLevel/", ids).then(resp => {
                    if (resp.status === 200) {
                        this.initJobLevelList()
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
        this.initJobLevelList()
    }
}
</script>

<style>
.jobLevelNameInput {
    width: 300px;
    margin-right: 10px;
}

.addJobLevelBtn {
    margin-left: 10px;
}

.tableDiv {
    margin-top: 10px;
}

.updateJobLevelName {
    width: 200px;
    margin-left: 10px;
}

.updateJobLevelTitleLevel {
    width: 200px;
    margin-left: 10px;
}

.updateJobLevelEnabled {
    margin-left: 10px;
}
</style>
