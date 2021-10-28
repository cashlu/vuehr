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
                       type="primary">添加
            </el-button>
        </div>
        <div class="tableDiv">
            <el-table
                :data="jobLevels"
                @selection-change="handleSelectionChange"
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
                                 label="职称名称"
                                 width="180">
                </el-table-column>
                <el-table-column prop="titleLevel"
                                 label="职称等级"
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
                            @click="handleDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>
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
            // 这个属性最理想还是应该由后端来维护
            titleLevels: ["正高级", "副高级", "中级", "初级", "员级"],
            jobLevels: [],
        }
    },
    methods: {
        getAllJobLevels(){

        },
        addJobLevel() {

        },
        handleSelectionChange() {

        },
        showEditDialog(row) {

        },
        handleDelete(row) {

        }
    },
    mounted() {
        this.getAllJobLevels()
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

.tableDiv{
    margin-top: 10px;
}
</style>
