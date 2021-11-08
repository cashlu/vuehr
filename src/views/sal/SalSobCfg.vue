<template>
    <div>
        <!--TODO：这个页面没有工具栏，可以考虑加一个批量设置的工具栏-->
        <div class="tableContainer">
            <el-table :data="employees" border stripe size="small">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="姓名" prop="name" fixed width="120"></el-table-column>
                <el-table-column label="工号" prop="workId" width="120"></el-table-column>
                <el-table-column label="电子邮件" prop="email" width="200"></el-table-column>
                <el-table-column label="电话号码" prop="phone" width="120"></el-table-column>
                <el-table-column label="所属部门" prop="department.name" width="120"></el-table-column>
                <el-table-column label="工资账套" align="center" width="150">
                    <template v-slot="scope">
                        <!--鼠标悬浮在账套名称后展示的账套详情-->
                        <!-- 必须v-if判断一下，如果某个员工没有设置账套，后端传过来的salary是null-->
                        <el-tooltip placement="left" v-if="scope.row.salary">
                            <div slot="content">
                                <table>
                                    <tr>
                                        <td>基本工资:</td>
                                        <td> {{ scope.row.salary.basicSalary }}</td>
                                    </tr>
                                    <tr>
                                        <td>奖金:</td>
                                        <td> {{ scope.row.salary.bonus }}</td>
                                    </tr>
                                    <tr>
                                        <td>午餐补助:</td>
                                        <td> {{ scope.row.salary.lunchSalary }}</td>
                                    </tr>
                                    <tr>
                                        <td>交通补助:</td>
                                        <td> {{ scope.row.salary.trafficSalary }}</td>
                                    </tr>
                                    <tr>
                                        <td>应发工资:</td>
                                        <td> {{ scope.row.salary.allSalary }}</td>
                                    </tr>
                                    <tr>
                                        <td>养老金基数:</td>
                                        <td> {{ scope.row.salary.pensionBase }}</td>
                                    </tr>
                                    <tr>
                                        <td>养老金比率:</td>
                                        <td> {{ scope.row.salary.pensionPer }}</td>
                                    </tr>
                                    <tr>
                                        <td>医疗保险基数:</td>
                                        <td> {{ scope.row.salary.medicalBase }}</td>
                                    </tr>
                                    <tr>
                                        <td>医疗保险比率:</td>
                                        <td> {{ scope.row.salary.medicalPer }}</td>
                                    </tr>
                                    <tr>
                                        <td>公积金基数:</td>
                                        <td> {{ scope.row.salary.accumulationFundBase }}</td>
                                    </tr>
                                    <tr>
                                        <td>公积金比率:</td>
                                        <td> {{ scope.row.salary.accumulationFundPer }}</td>
                                    </tr>
                                </table>
                            </div>
                            <el-tag size="mini">{{ scope.row.salary.name }}</el-tag>
                        </el-tooltip>
                        <el-tag type="warning" v-else>暂未设置</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="105">
                    <template v-slot="scope">
                        <el-popover placement="left"
                                    title="修改工资账套"
                                    width="200"
                                    @show="showPopover(scope.row.salary)"
                                    @hide="hidePopover(scope.row)"
                                    trigger="click">
                            <div>
                                <el-select v-model="currentSalaryId" placeholder="请选择" size="mini">
                                    <el-option
                                        v-for="item in salaries"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <el-button slot="reference" type="danger" size="mini">修改账套</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
            <div class="paginationContainer">
                <el-pagination background
                               layout="total, sizes,prev, pager, next, jumper, ->"
                               @current-change="currentChange"
                               @size-change="sizeChange"
                               :current-page="currentPage"
                               :page-sizes="[10, 20, 50, 100]"
                               :page-size="currentSize"
                               :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SalSobCfg",
    data() {
        return {
            employees: [],
            salaries: [],
            // 表格内所有修改账套的selection，都绑定了这个公共值。所以提前给他设置一个没有意义的初始值。
            // 每次打开popover的时候，都会执行showPopover()回调函数，在根据不同的行，给这个属性设置相应的值。
            currentSalaryId: null,
            // 分页相关的变量
            total: 0,
            currentPage: 1,
            currentSize: 10,

        }
    },
    mounted() {
        this.initEmployees()
        this.initSalaries()
    },

    methods: {
        initEmployees() {
            this.getRequest(`/salary/sobcfg/?page=${this.currentPage}&size=${this.currentSize}`).then(resp => {
                // this.getRequest(`/salary/sobcfg/`).then(resp => {

                if (resp) {
                    this.employees = resp.data
                    this.total = resp.total
                    console.log(this.employees)

                }
            })
        },
        initSalaries() {
            this.getRequest("/salary/sobcfg/salary/").then(resp => {
                if (resp.status === 200) {
                    this.salaries = resp.obj
                }
            })
        },
        // 打开“修改账套”弹出框时，回调的方法
        showPopover(row) {
            if (row) {
                this.currentSalaryId = row.id;
            }else{
                this.currentSalaryId = null
            }


        },
        // 隐藏“修改账套”弹出框时，回调的方法
        // TODO: 修改为其中selection选中的值发生变化，再除法update
        hidePopover(row) {
            if (this.currentSalaryId) {
                this.putRequest("/salary/sobcfg/?eid=" + row.id + "&sid=" + this.currentSalaryId).then(resp => {
                    if (resp.status === 200) {
                        this.initEmployees()
                    }
                });
            }
        },
        // 换页
        currentChange(page) {
            this.currentPage = page
            this.initEmployees()
        },
        sizeChange(size) {
            this.currentSize = size
            this.initEmployees()
        }
    },

}
</script>

<style>
.paginationContainer {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}
</style>
