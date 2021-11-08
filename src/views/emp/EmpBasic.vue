<template>
    <div>
        <!--上部分搜索栏容器-->
        <div>
            <div class="operationContainer">
                <!--搜索框部分-->
                <div class="search">
                    <el-input class="searchInput"
                              :disabled="normalSearchDisabled"
                              placeholder="请输入员工姓名..."
                              size="mini"
                              prefix-icon="el-icon-search"
                              v-model="queries.name"
                              @keydown.enter.native="initEmps"
                              clearable
                              @clear="initEmps"></el-input>
                    <el-button type="primary" :disabled="normalSearchDisabled"
                               size="mini" icon="el-icon-search" @click="initEmps">搜索
                    </el-button>
                    <el-button type="primary" size="mini" :icon="advancedSearchIcon" @click="triggleSearchCard">高级搜索
                    </el-button>

                </div>
                <!--导入导出按钮，及添加员工按钮部分-->
                <div>
                    <el-upload class="importUploader"
                               action="/employee/basic/import"
                               :show-file-list="false"
                               :before-upload="beforeUpload"
                               :on-success="importSuccess"
                               :on-error="importError">
                        <el-button size="mini"
                                   type="danger"
                                   :loading="importDataBtnLoading"
                                   icon="el-icon-download">
                            导入数据
                        </el-button>
                    </el-upload>
                    <el-button size="mini" type="success" icon="el-icon-upload2" @click="exportData">导出数据</el-button>
                    <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="showAddEmpDialog">
                        添加员工
                    </el-button>
                </div>
            </div>
            <!--高级搜索框部分-->
            <transition enter-active-class="animated  zoomIn" leave-active-class="animated zoomOut">
                <el-card class="advancedSearchContainer" v-show="advancedSearchVisible">
                    <el-row>
                        <el-col :span="5">
                            政治面貌:
                            <el-select size="mini" v-model="queries.politicStatusId"
                                       placeholder="可模糊搜索"
                                       filterable style="width: 130px">
                                <el-option
                                    v-for="item in politicStatus"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            民族:
                            <el-select size="mini" v-model="queries.nationId"
                                       filterable
                                       placeholder="可模糊搜索"
                                       style="width: 130px">
                                <el-option
                                    v-for="item in nations"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            职位:
                            <el-select size="mini" v-model="queries.positionId"
                                       placeholder="请选择"
                                       style="width: 130px">
                                <el-option
                                    v-for="item in positions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            职称:
                            <el-select size="mini" v-model="queries.jobLevelId"
                                       placeholder="请选择"
                                       style="width: 130px">
                                <el-option
                                    v-for="item in jobLevels"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="7">
                            聘用形式:
                            <el-radio-group size="mini" v-model="queries.engageForm">
                                <el-radio-button label="劳动合同">劳动合同</el-radio-button>
                                <el-radio-button label="劳务合同">劳务合同</el-radio-button>
                            </el-radio-group>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top: 10px">
                        <el-col :span="5">
                            所属部门:
                            <el-cascader size="mini"
                                         :props="cascaderProps"
                                         clearable
                                         :show-all-levels="false"
                                         v-model="queries.departmentId"
                                         :options="departmentsTree"
                                         style="width: 130px">
                            </el-cascader>
                        </el-col>
                        <el-col :span="10">
                            入职日期:
                            <el-date-picker size="mini"
                                            v-model="queries.beginDateRange"
                                            type="daterange"
                                            value-format="yyyy-MM-dd"
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="5" :offset="4">
                            <el-button-group>
                                <el-button size="mini"
                                           type="primary"
                                           icon="el-icon-search"
                                           @click="initEmps('advanced')">搜索
                                </el-button>
                                <el-button size="mini" type="warning" icon="el-icon-delete"
                                           @click="emptyQueries">取消
                                </el-button>
                            </el-button-group>
                        </el-col>
                    </el-row>
                </el-card>
            </transition>
        </div>
        <!--下部分表格容器-->
        <div class="tableContainer">
            <el-table
                v-loading="loading"
                element-loading-text="数据加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                :data="emps"
                stripe
                border
                style="width: 100%">
                <el-table-column type="selection"
                                 width="55">
                </el-table-column>
                <el-table-column fixed
                                 align="left"
                                 prop="name"
                                 label="姓名"
                                 width="100">
                </el-table-column>
                <el-table-column prop="workId"
                                 label="工号"
                                 width="90">
                </el-table-column>
                <el-table-column prop="gender"
                                 label="性别"
                                 align="center"
                                 width="60">
                </el-table-column>
                <el-table-column prop="birthday"
                                 label="出生日期"
                                 align="center"
                                 width="140">
                </el-table-column>
                <el-table-column prop="idCard"
                                 label="身份证号"
                                 width="180">
                </el-table-column>
                <el-table-column prop="wedlock"
                                 label="婚姻状况"
                                 align="center"
                                 width="80">
                </el-table-column>
                <el-table-column prop="nation.name"
                                 label="民族"
                                 align="center"
                                 width="70">
                </el-table-column>
                <el-table-column prop="nativePlace"
                                 label="籍贯"
                                 width="100">
                </el-table-column>
                <el-table-column prop="politicsStatus.name"
                                 label="政治面貌"
                                 width="120">
                </el-table-column>
                <el-table-column prop="email"
                                 label="电子邮件"
                                 width="250">
                </el-table-column>
                <el-table-column prop="phone"
                                 label="电话号码"
                                 align="center"
                                 width="120">
                </el-table-column>
                <el-table-column prop="address"
                                 label="地址"
                                 width="250">
                </el-table-column>
                <el-table-column prop="department.name"
                                 label="所属部门"
                                 width="120">
                </el-table-column>
                <el-table-column prop="position.name"
                                 label="职位"
                                 width="140">
                </el-table-column>
                <el-table-column prop="jobLevel.name"
                                 label="职称"
                                 width="140">
                </el-table-column>
                <el-table-column prop="engageForm"
                                 label="聘用形式"
                                 align="center"
                                 width="80">
                </el-table-column>
                <el-table-column prop="tiptopDegree"
                                 label="最高学历"
                                 align="center"
                                 width="80">
                </el-table-column>
                <el-table-column prop="specialty"
                                 label="专业"
                                 align="center"
                                 width="150">
                </el-table-column>
                <el-table-column prop="school"
                                 label="毕业院校"
                                 align="center"
                                 width="150">
                </el-table-column>
                <el-table-column prop="beginDate"
                                 label="入职日期"
                                 align="center"
                                 width="140">
                </el-table-column>
                <el-table-column prop="workState"
                                 label="在职状态"
                                 align="center"
                                 width="140">
                </el-table-column>
                <el-table-column prop="conversionTime"
                                 label="转正日期"
                                 align="center"
                                 width="140">
                </el-table-column>
                <el-table-column prop="beginContract"
                                 label="合同起始日期"
                                 align="center"
                                 width="140">
                </el-table-column>
                <el-table-column prop="endContract"
                                 label="合同结束日期"
                                 align="center"
                                 width="140">
                </el-table-column>
                <el-table-column label="合同期限"
                                 align="center"
                                 width="100">
                    <template v-slot:default="scope">
                        <el-tag>{{ scope.row.contractTerm }}</el-tag>
                        年
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="260" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary">查看高级资料</el-button>
                        <el-button size="mini" type="warning" @click="showEditEmpDialog(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="deleteEmp(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="paginationContainer">
                <el-pagination background
                               layout="sizes, prev, pager, next, jumper, ->, total, slot"
                               :total="total"
                               @current-change="currentChange"
                               @size-change="handleSizeChange">
                </el-pagination>
            </div>
        </div>

        <!--添加员工对话框容器-->
        <!--TODO: 表单的布局方式很丑，不能兼容窗口的伸缩以及手机，需要修改！改为响应式布局！-->
        <!--TODO: 字段顺序也需要调整一下，例如身份证号，应放在姓名的后面。-->
        <div class="empFormDialogContainer">
            <el-dialog
                :title="dialogTitle"
                :visible.sync="empFormDialogVisible"
                width="80%">
                <div>
                    <el-form ref="empForm" :model="emp" :rules="empFormRule">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item size="small" label="姓名:" prop="name">
                                    <el-input prefix-icon="el-icon-edit"
                                              placeholder="请输入员工姓名"
                                              v-model="emp.name"
                                              style="width: 150px">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item size="small" label="性别:" prop="gender">
                                    <el-radio-group v-model="emp.gender">
                                        <el-radio-button label="男">男</el-radio-button>
                                        <el-radio-button label="女">女</el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item size="small" label="出生日期:" prop="birthday">
                                    <el-date-picker
                                        v-model="emp.birthday"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="请选择"
                                        style="width: 130px">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item size="small" label="政治面貌:" prop="politicId">
                                    <el-select v-model="emp.politicId"
                                               placeholder="可模糊搜索"
                                               filterable style="width: 200px">
                                        <el-option
                                            v-for="item in politicStatus"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="5">
                                <el-form-item size="small" label="民族:" prop="nationId">
                                    <el-select v-model="emp.nationId"
                                               filterable
                                               placeholder="可模糊搜索"
                                               style="width: 130px">
                                        <el-option
                                            v-for="item in nations"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item size="small" label="籍贯:" prop="nativePlace">
                                    <el-input prefix-icon="el-icon-edit"
                                              placeholder="请输入省市县"
                                              v-model="emp.nativePlace"
                                              style="width: 150px">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item size="small" label="邮箱:" prop="email">
                                    <el-input prefix-icon="el-icon-message"
                                              placeholder="请输入邮箱"
                                              v-model="emp.email"
                                              style="width: 150px">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item size="small" label="地址:" prop="address">
                                    <el-input prefix-icon="el-icon-edit"
                                              placeholder="请输入地址"
                                              v-model="emp.address"
                                              style="width: 180px">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item size="small" label="职位:" prop="posId">
                                    <el-select v-model="emp.posId" placeholder="请选择"
                                               style="width: 150px">
                                        <el-option
                                            v-for="item in positions"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item size="small" label="职称:" prop="jobLevelId">
                                    <el-select v-model="emp.jobLevelId" placeholder="请选择"
                                               style="width: 150px">
                                        <el-option
                                            v-for="item in jobLevels"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item size="small" label="部门:" prop="departmentId">
                                    <el-cascader :props="cascaderProps"
                                                 clearable
                                                 :show-all-levels="false"
                                                 v-model="emp.departmentId"
                                                 :options="departmentsTree"
                                                 style="width: 130px">
                                    </el-cascader>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item size="small" label="电话:" prop="phone">
                                    <el-input prefix-icon="el-icon-phone"
                                              placeholder="请输入电话号码"
                                              v-model="emp.phone"
                                              style="width: 150px">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item size="small" label="工号:" prop="workId">
                                    <el-input v-model="emp.workId"
                                              disabled
                                              style="width: 150px">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <!--TODO: 从后端获取学历列表-->
                                <el-form-item size="small" label="学历:" prop="tiptopDegree">
                                    <el-select v-model="emp.tiptopDegree" placeholder="请选择"
                                               style="width: 150px">
                                        <el-option
                                            v-for="item in tiptopDegrees"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item size="small" label="毕业院校:" prop="school">
                                    <el-input prefix-icon="el-icon-edit"
                                              placeholder="请输入毕业院校"
                                              v-model="emp.school"
                                              style="width: 150px">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item size="small" label="专业:" prop="specialty">
                                    <el-input prefix-icon="el-icon-edit"
                                              placeholder="请输入专业名称"
                                              v-model="emp.specialty"
                                              style="width: 150px">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item size="small" label="入职日期:" prop="beginDate">
                                    <el-date-picker
                                        v-model="emp.beginDate"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="请选择"
                                        style="width: 130px">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item size="small" label="转正日期:" prop="conversionTime">
                                    <el-date-picker
                                        v-model="emp.conversionTime"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="请选择"
                                        style="width: 130px">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item size="small" label="合同起始日期:" prop="beginContract">
                                    <el-date-picker
                                        v-model="emp.beginContract"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="请选择"
                                        style="width: 130px">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item size="small" label="合同终止日期:" prop="endContract">
                                    <el-date-picker
                                        v-model="emp.endContract"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="请选择"
                                        style="width: 130px">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item size="small" label="身份证号:" prop="idCard">
                                    <el-input prefix-icon="el-icon-edit"
                                              placeholder="请输入身份证号"
                                              v-model="emp.idCard"
                                              style="width: 150px">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item size="small" label="聘用形式:" prop="engageForm">
                                    <el-radio-group v-model="emp.engageForm">
                                        <el-radio-button label="劳动合同">劳动合同</el-radio-button>
                                        <el-radio-button label="劳务合同">劳务合同</el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item size="small" label="婚姻状况:" prop="wedlock">
                                    <el-radio-group v-model="emp.wedlock">
                                        <el-radio-button label="未婚">未婚</el-radio-button>
                                        <el-radio-button label="已婚">已婚</el-radio-button>
                                        <el-radio-button label="离异">离异</el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="closeEmpFormDialog">取 消</el-button>
                    <el-button type="primary" @click="doAddOrUpdateEmp">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {getRequest} from "@/utils/api";

export default {
    name: "EmpBasic",
    data() {
        return {
            page: 1,
            size: 10,
            total: 0,
            emps: [],
            loading: false,
            emp: {
                name: "",
                gender: "男",
                birthday: null,
                idCard: "",
                wedlock: "未婚",
                nationId: null,
                nativePlace: "",
                politicId: null,
                email: "",
                phone: "",
                address: "",
                departmentId: null,
                jobLevelId: null,
                posId: null,
                engageForm: "劳动合同",
                tiptopDegree: "",
                specialty: "",
                school: "",
                beginDate: null,
                notworkDate: null,
                workState: "在职",
                workId: "",
                beginContract: null,
                endContract: null,
                contractTerm: null,
                conversionTime: null,
                workAge: null
            },
            empFormDialogVisible: false,
            nations: [],
            politicStatus: [],
            jobLevels: [],
            positions: [],
            // TODO：这点处理的不好，学历最好还是后端来维护
            tiptopDegrees: ["小学", "初中", "高中", "本科", "硕士", "博世"],
            // 级联选择器的配置项
            cascaderProps: {
                label: "name",
                value: "id",
                // expandTrigger: 'hover',
                checkStrictly: true,
                // 只获取最后一级的值（true则会获取各级的一个数组）
                emitPath: false,
            },
            departmentsTree: [],
            empFormRule: {
                name: [{required: true, message: "请输入员工姓名", trigger: "blur"}],
                gender: [{required: true, message: "请选择性别", trigger: "blur"}],
                birthday: [{required: true, message: "请选择出生日期", trigger: "blur"}],
                idCard: [
                    {required: true, message: "请输入员工身份证号码", trigger: "blur"},
                    {
                        pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                        message: '身份证号码格式不正确',
                        trigger: 'blur'
                    }
                ],
                wedlock: [{required: true, message: "请选择婚姻状况", trigger: "blur"}],
                nationId: [{required: true, message: "请选择民族", trigger: "blur"}],
                nativePlace: [{required: true, message: "请输入籍贯", trigger: "blur"}],
                politicId: [{required: true, message: "请选择政治面貌", trigger: "blur"}],
                email: [
                    {required: true, message: "请输入邮箱地址", trigger: "blur"},
                    {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
                ],
                phone: [{required: true, message: "请输入电话号码", trigger: "blur"}],
                address: [{required: true, message: "请输入地址", trigger: "blur"}],
                departmentId: [{required: true, message: "请选择部门", trigger: "blur"}],
                jobLevelId: [{required: true, message: "请选择职称", trigger: "blur"}],
                posId: [{required: true, message: "请选择职位", trigger: "blur"}],
                engageForm: [{required: true, message: "请选择雇佣形式", trigger: "blur"}],
                tiptopDegree: [{required: true, message: "请选择学历", trigger: "blur"}],
                specialty: [{required: true, message: "请输入专业", trigger: "blur"}],
                beginDate: [{required: true, message: "请选择入职日期", trigger: "blur"}],
                beginContract: [{required: true, message: "请选择合同起始日期", trigger: "blur"}],
                endContract: [{required: true, message: "请选择合同截止日期", trigger: "blur"}],
                conversionTime: [{required: true, message: "请选择转正日期", trigger: "blur"}],
                school: [{required: true, message: "请输入毕业院校", trigger: "blur"}],


            },
            dialogTitle: "",
            importDataBtnLoading: false,
            advancedSearchVisible: false,
            normalSearchDisabled: false,
            advancedSearchIcon: "el-icon-bottom",
            queries: {
                name: "",
                politicStatusId: "",
                nationId: "",
                positionId: "",
                jobLevelId: "",
                engageForm: "",
                departmentId: "",
                // 入职时间的搜索范围，组件传的是一个数组
                beginDateRange: "",
                searchType: "normal",
            }
        }
    },
    methods: {
        initEmps(searchType) {
            this.loading = true;
            let url = "/employee/basic/"

            if (searchType && searchType === "advanced") {
                url += "?page=" + this.page + "&size=" + this.size
                    + "&politicStatusId=" + this.queries.politicStatusId + "&nationId=" + this.queries.nationId
                    + "&positionId=" + this.queries.positionId + "&jobLevelId=" + this.queries.jobLevelId
                    + "&engageForm=" + this.queries.engageForm + "&departmentId=" + this.queries.departmentId
                    + "&beginDateRange=" + this.queries.beginDateRange


                this.loading = false
                this.getRequest(url).then(resp => {
                    this.loading = false
                    if (resp) {
                        this.emps = resp.data
                        this.total = resp.total
                    }
                })
            } else {
                url += "?page=" + this.page + "&size=" + this.size + "&name=" + this.queries.name
                this.getRequest(url).then(resp => {
                    this.loading = false
                    if (resp) {
                        this.emps = resp.data
                        this.total = resp.total
                    }
                })
            }

        },
        currentChange(page) {
            this.page = page
            this.initEmps()
        },
        handleSizeChange(size) {
            this.size = size
            // 职位列表，在打开对话框的时候初始化。
            this.initEmps()
        },
        showAddEmpDialog() {
            this.emptyEmp()
            this.dialogTitle = "添加员工"
            this.getMaxWorkId()
            this.empFormDialogVisible = true
        },
        showEditEmpDialog(row) {
            this.dialogTitle = "编辑员工"
            this.empFormDialogVisible = true
            // 利用JSON进行深拷贝，如果直接引用对象的，在表单编辑的过程中，表格的数据也会跟着变化，如果取消编辑，
            // 还需要重新刷新表格。所以利用JSON来实现深拷贝，避免表单和表格互相影响。
            this.emp = JSON.parse(JSON.stringify(row))
        },
        // 民族、政治面貌、职称列表，变化的频率极低，一起获取后，放在sessionStorage中。
        initCommonData() {
            if (!window.sessionStorage.getItem("nations")) {
                this.getRequest("/employee/basic/nations/").then(resp => {
                    if (resp.status === 200) {
                        this.nations = resp.obj
                        window.sessionStorage.setItem("nations", JSON.stringify(resp.obj))
                    }
                })
            } else {
                this.nations = JSON.parse(window.sessionStorage.getItem("nations"))
            }
            if (!window.sessionStorage.getItem("politics")) {
                this.getRequest("/employee/basic/politics/").then(resp => {
                    if (resp.status === 200) {
                        this.politicStatus = resp.obj
                        window.sessionStorage.setItem("politics", JSON.stringify(resp.obj))
                    }
                })
            } else {
                this.politicStatus = JSON.parse(window.sessionStorage.getItem("politics"))
            }
            if (!window.sessionStorage.getItem("jobLevels")) {
                this.getRequest("/employee/basic/jobLevels/").then(resp => {
                    if (resp.status === 200) {
                        this.jobLevels = resp.obj
                        window.sessionStorage.setItem("jobLevels", JSON.stringify(resp.obj))
                    }
                })
            } else {
                this.jobLevels = JSON.parse(window.sessionStorage.getItem("jobLevels"))
            }
        },
        initDepartments() {
            if (!window.sessionStorage.getItem("departmentsTree")) {
                this.getRequest("/employee/basic/departments/").then(resp => {
                    if (resp.status === 200) {
                        this.departmentsTree = resp.obj
                        window.sessionStorage.setItem("departmentsTree", JSON.stringify(resp.obj))
                    }
                })
            } else {
                this.departmentsTree = JSON.parse(window.sessionStorage.getItem("departmentsTree"))
            }
        },
        initPositions() {
            this.getRequest("/employee/basic/positions/").then(resp => {
                if (resp.status === 200) {
                    this.positions = resp.obj
                }
            })
        },
        // 方法名有歧义，应该是获取可用的workId
        getMaxWorkId() {
            this.getRequest("/employee/basic/maxWorkId/").then(resp => {
                if (resp.status === 200) {
                    this.emp.workId = resp.obj
                }
            })
        },
        closeEmpFormDialog() {
            this.empFormDialogVisible = false
            this.emptyEmp()
        },
        doAddOrUpdateEmp() {
            // 如果emp有ID，则为更新，没有ID则为添加。
            if (this.emp.id) {
                this.$refs["empForm"].validate((valid) => {
                    if (valid) {
                        this.putRequest("/employee/basic/", this.emp).then(resp => {
                            if (resp.status === 200) {
                                this.empFormDialogVisible = false
                                this.initEmps()
                                this.$refs["empForm"].resetFields()
                            }
                        })
                    }
                });
            } else {
                this.$refs["empForm"].validate((valid) => {
                    if (valid) {
                        this.postRequest("/employee/basic/", this.emp).then(resp => {
                            if (resp.status === 200) {
                                this.empFormDialogVisible = false
                                this.initEmps()
                                this.$refs["empForm"].resetFields()
                            }
                        })
                    }
                });
            }

        },
        deleteEmp(row) {
            this.$confirm('此操作将永久删除员工【' + row.name + '】, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest("/employee/basic/" + row.id).then(resp => {
                    if (resp.status === 200) {
                        this.initEmps()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });


        },
        // 用于清空this.emp的内容。主要用在每次关闭表单后。
        emptyEmp() {
            this.emp = {
                name: "",
                gender: "男",
                birthday: null,
                idCard: "",
                wedlock: "未婚",
                nationId: null,
                nativePlace: "",
                politicId: null,
                email: "",
                phone: "",
                address: "",
                departmentId: null,
                jobLevelId: null,
                posId: null,
                engageForm: "劳动合同",
                tiptopDegree: "",
                specialty: "",
                school: "",
                beginDate: null,
                notworkDate: null,
                workState: "在职",
                workId: "",
                beginContract: null,
                endContract: null,
                contractTerm: null,
                conversionTime: null,
                workAge: null
            }
        },
        emptyQueries() {
            this.queries = {
                name: "",
                politicStatusId: "",
                nationId: "",
                positionId: "",
                jobLevelId: "",
                engageForm: "",
                departmentId: "",
                beginDateRange: "",
                searchType: "normal",
            }
            this.triggleSearchCard()
            this.initEmps()

        },
        exportData() {
            window.open("/employee/basic/export/", "_parent")
        },
        beforeUpload() {
            this.importDataBtnLoading = true
        },
        importSuccess(response, file, fileList) {
            this.importDataBtnLoading = false
            this.initEmps()
        },
        importError(err, file, fileList) {
            this.importDataBtnLoading = false
        },
        triggleSearchCard() {
            this.advancedSearchVisible = !this.advancedSearchVisible
            this.normalSearchDisabled = !this.normalSearchDisabled
            if (this.advancedSearchIcon === "el-icon-top") {
                this.advancedSearchIcon = "el-icon-bottom"
            } else {
                this.advancedSearchIcon = "el-icon-top"
            }
        },
    },
    mounted() {
        this.initEmps()
        this.initCommonData()
        this.initPositions()
        this.initDepartments()

    }
}
</script>

<style>
.operationContainer {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

}

.searchInput {
    width: 200px;
    margin-right: 10px;
}

.tableContainer {
    margin-top: 20px;
}

.paginationContainer {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
}

.importUploader {
    display: inline-block;
    margin-right: 10px;
}

.advancedSearchContainer {
    /*border: 1px solid #409eff;*/
    /*border-radius: 5px;*/
    /*padding的尺寸，包含在容器尺寸里面，挤压内部的元素，而不是撑大容器。*/
    box-sizing: border-box;
    /*padding: 5px;*/
    margin: 10px 0;
    font-size: 12px;
}

.zoomIn {
    animation: zoomIn;
    animation-duration: 0.5s;
}

.zoomOut {
    animation: zoomOut;
    animation-duration: 0.5s;
}

</style>
