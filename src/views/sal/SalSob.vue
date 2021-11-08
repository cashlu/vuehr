<template>
    <div>
        <div class="toolBarContainer">
            <el-button size="small" type="primary" icon="el-icon-plus" @click="showAddDialog">添加工资账套</el-button>
            <el-button size="small" type="success" icon="el-icon-refresh"></el-button>
        </div>
        <div class="tableContainer">
            <el-table :data="salaries" border stripe>
                <el-table-column type="selection" align="center" width="55px"></el-table-column>
                <el-table-column prop="name" label="账套名称" width="120px"></el-table-column>
                <el-table-column prop="basicSalary" label="基本工资" width="100px"></el-table-column>
                <el-table-column prop="bonus" label="奖金" width="100px"></el-table-column>
                <el-table-column prop="lunchSalary" label="午餐补助" width="100px"></el-table-column>
                <el-table-column prop="trafficSalary" label="交通补助" width="100px"></el-table-column>
                <el-table-column prop="allSalary" label="应发工资" width="100px"></el-table-column>

                <el-table-column label="养老金" align="center">
                    <el-table-column prop="pensionBase" label="基数" width="100px"></el-table-column>
                    <el-table-column prop="pensionPer" label="比率" width="100px"></el-table-column>
                </el-table-column>
                <el-table-column label="医疗保险" align="center">
                    <el-table-column prop="medicalBase" label="基数" width="110px"></el-table-column>
                    <el-table-column prop="medicalPer" label="比率" width="110px"></el-table-column>
                </el-table-column>
                <el-table-column label="公积金" align="center">
                    <el-table-column prop="accumulationFundBase" label="基数"
                                     width="100px"></el-table-column>
                    <el-table-column prop="accumulationFundPer" label="比率"
                                     width="100px"></el-table-column>
                </el-table-column>
                <el-table-column prop="createDate" label="启用时间" align="center" width="100px"></el-table-column>
                <el-table-column label="操作" align="center" width="200px">
                    <template v-slot="scope">
                        <el-button type="warning" size="mini" @click="showEditDialog(scope.row)">修改</el-button>
                        <el-button type="danger" size="mini" @click="deleteSalary(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="salaryDialogContainer">
            <el-dialog :title="dialogTitle" :visible.sync="salaryDialogVisible"
                       width="60%">
                <div class="stepContainer">
                    <el-form ref="addSalaryForm"
                             :inline="true"
                             :model="salaryInfo"
                             labelPosition="left">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item prop="name" label="名称:">
                                    <el-input v-model="salaryInfo.name"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-divider>基础工资</el-divider>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item prop="basicSalary" label="基本工资:">
                                    <el-input v-model="salaryInfo.basicSalary"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="bonus" label="奖金:">
                                    <el-input v-model="salaryInfo.bonus"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-divider>补助</el-divider>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item prop="lunchSalary" label="午餐补助:">
                                    <el-input v-model="salaryInfo.lunchSalary"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="trafficSalary" label="交通补助:">
                                    <el-input v-model="salaryInfo.trafficSalary"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-divider>养老金</el-divider>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item prop="pensionBase" label="养老金基数:">
                                    <el-input v-model="salaryInfo.pensionBase"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="pensionPer" label="养老金比率:">
                                    <el-input v-model="salaryInfo.pensionPer"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-divider>基础信息</el-divider>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item prop="medicalBase" label="医疗保险基数:">
                                    <el-input v-model="salaryInfo.medicalBase"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="medicalPer" label="医疗保险比率:">
                                    <el-input v-model="salaryInfo.medicalPer"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-divider>基础信息</el-divider>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item prop="accumulationFundBase" label="公积金基数:">
                                    <el-input v-model="salaryInfo.accumulationFundBase"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="accumulationFundPer" label="公积金比率:">
                                    <el-input v-model="salaryInfo.accumulationFundPer"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>

                </div>

                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="closeAddSalaryDialog">取 消</el-button>
                    <el-button size="small" type="primary" @click="doAddOrEditSalary">提 交</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    name: "SalSob",
    data() {
        return {
            salaries: [],
            salaryDialogVisible: false,
            salaryInfo: {
                name: "",
                basicSalary: 0,
                bonus: 0,
                lunchSalary: 0,
                trafficSalary: 0,
                allSalary: 0,
                pensionBase: 0,
                pensionPer: 0,
                medicalBase: 0,
                medicalPer: 0,
                accumulationFundBase: 0,
                accumulationFundPer: 0,
                createDate: "",
            },
            dialogTitle: "添加工资账套",
        }
    },
    methods: {
        initSalaries() {
            this.getRequest("/salary/sob/").then(resp => {
                if (resp.status === 200) {
                    this.salaries = resp.obj
                }
            })
        },
        showAddDialog() {
            this.salaryDialogVisible = true
        },
        showEditDialog(row) {
            this.salaryInfo = JSON.parse(JSON.stringify(row))
            this.dialogTitle = "编辑工资套账"
            this.salaryDialogVisible = true
        },
        doAddOrEditSalary() {
            if (this.salaryInfo.id) {
                this.putRequest("/salary/sob/", this.salaryInfo).then(res=>{
                    if (res.status === 200) {
                        this.salaryDialogVisible= false
                        this.initSalaryInfo()
                        this.initSalaries()
                    }
                })
            }else{
                this.postRequest("/salary/sob/", this.salaryInfo).then(resp => {
                    if (resp.status === 200) {
                        this.salaryDialogVisible = false
                        this.initSalaries()
                        this.initSalaryInfo()
                    }
                });
            }
        },
        closeAddSalaryDialog() {
            this.$refs.addSalaryForm.resetFields()
            this.salaryDialogVisible = false

        },
        initSalaryInfo() {
            this.salaryInfo = {
                name: "",
                basicSalary: 0,
                bonus: 0,
                lunchSalary: 0,
                trafficSalary: 0,
                allSalary: 0,
                pensionBase: 0,
                pensionPer: 0,
                medicalBase: 0,
                medicalPer: 0,
                accumulationFundBase: 0,
                accumulationFundPer: 0,
                createDate: "",
            }
        },
        deleteSalary(row) {
            this.$confirm('此操作将永久删除【' + row.name + '】账套, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest("/salary/sob/?id=" + row.id).then(resp => {
                    console.log(resp);
                    if (resp.status === 200) {
                        this.initSalaries()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },


    },
    mounted() {
        this.initSalaries()
    }
}
</script>

<style>
.toolBarContainer {
    display: flex;
    justify-content: space-between;
}

.tableContainer {
    margin-top: 10px;
}
</style>
