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
                border
                stripe
                size="small"
                style="width: 70%">
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
                                 width="180">
                </el-table-column>
                <el-table-column label="操作">
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
        </div>
        <el-dialog
            title="修改职位"
            :visible.sync="dialogVisible"
            width="30%">
            <div>
                <el-tag>职位名称</el-tag>
                <el-input class="updatePosInput" size="small" v-model="updatePos.name"></el-input>
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
                name: ""
            },
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
                    this.updatePos = {}
                    this.dialogVisible = false
                }
            })
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

</style>
