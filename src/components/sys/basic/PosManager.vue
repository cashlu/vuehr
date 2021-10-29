<template>
    <div>
        <div>
            <el-input class="positionInput"
                      size="small"
                      placeholder="添加职位..."
                      prefix-icon="el-icon-plus"
                      v-model="position.name"
                      @keydown.enter.native="addPosition">
            </el-input>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="addPosition">添加</el-button>
        </div>
        <div class="tableDiv">
            <el-table
                :data="positions"
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
                                 label="职位名称"
                                 width="180">
                </el-table-column>
                <el-table-column prop="createDate"
                                 label="创建时间"
                                 width="150">
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
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="showEditDialog(scope.row)">编辑
                        </el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button class="batchDelBtn" type="danger" size="small" @click="batchDeletePos"
                       :disabled="multipleSelection.length===0">批量删除
            </el-button>
        </div>
        <el-dialog
            title="修改职位"
            :visible.sync="dialogVisible"
            width="30%">
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag>职位名称</el-tag>
                        </td>
                        <td>
                            <el-input class="updateJobLevelName" size="small" v-model="updatePos.name"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>启用状态</el-tag>
                        </td>
                        <td>
                            <el-switch class="updateJobLevelEnabled"
                                       v-model="updatePos.enabled"
                                       active-color="#13ce66"
                                       inactive-color="#ff4949">
                            </el-switch>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "PosManager",
    data() {
        return {
            position: {
                name: "",
            },
            positions: [],
            dialogVisible: false,
            updatePos: {
                name: "",
                enabled: null
            },
            multipleSelection: [],
        }
    },
    methods: {
        initPositions() {
            this.getRequest("/system/basic/pos/").then(resp => {
                if (resp) {
                    this.positions = resp.obj
                }
            })
        },
        showEditDialog(row) {
            Object.assign(this.updatePos, row)
            this.dialogVisible = true
        },
        handleDelete(index, row) {
            this.$confirm('此操作将永久删除【' + row.name + '】职位, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest("/system/basic/pos/" + row.id).then(resp => {
                    if (resp.status === 200) {
                        this.initPositions()
                    } else {
                        this.$message.error("删除失败!")
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        addPosition() {
            if (!this.position.name) {
                this.$message.warning("请输入要添加的职位名称")
            } else {
                this.postRequest("/system/basic/pos/", this.position).then(resp => {
                    if (resp.status === 200) {
                        this.position.name = null
                        this.initPositions()
                    }
                });
            }
        },
        doUpdate() {
            this.putRequest("/system/basic/pos/", this.updatePos).then(resp => {
                if (resp) {
                    this.initPositions()
                    this.updatePos.name = ""
                    this.updatePos.enabled = null
                    this.dialogVisible = false
                }
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        batchDeletePos() {
            this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】个职位, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids = []
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    ids.push(this.multipleSelection[i].id)
                }
                this.deleteRequest("/system/basic/pos/", ids).then(resp => {
                    if (resp.status === 200) {
                        this.initPositions()
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
        this.initPositions()
    }
}
</script>

<style>
.positionInput {
    width: 300px;
    margin-right: 10px;
}

.tableDiv {
    margin-top: 10px;
}

.updatePosInput {
    width: 200px;
    margin-left: 10px;
}

.batchDelBtn {
    margin-top: 20px;
}

</style>
