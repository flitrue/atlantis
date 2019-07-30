<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="拼命加载中"
  >
    <!--添加用例弹框-->
    <el-dialog :visible.sync="caseTableVisible" title="用例列表" width="75%">
      <div style="margin-left:20px;">
        <el-button type="primary" @click="addCaseConfirm">确 定</el-button>
        <el-button @click="caseTableVisible = false">取 消</el-button>
      </div>
      <caseList ref="taskData" :group-code="taskBase.groupCode" />
      <div slot="footer" class="filter-container" align="center">
        <el-button type="primary" @click="addCaseConfirm">确 定</el-button>
        <el-button @click="caseTableVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <div v-show="stepShow">
      <editTaskStep
        ref="editStep"
        :edit-case-no="queryCaseNo"
        @saveStepData="saveStepData"
        @cancelStepData="stepShow = false"
      />
    </div>
    <div v-show="!stepShow">
      <el-card class="box-card card-bottom">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <div class="text item">
          <el-form
            ref="taskBase"
            :rules="rules"
            :model="taskBase"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="任务名称" prop="taskName">
                  <el-input v-model="taskBase.taskName" type="textarea" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注">
                  <el-input v-model="taskBase.remarks" type="textarea" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="业务分组" prop="groupCode">
                  <el-cascader
                    key="groupCode"
                    v-model="groupCodeCopy"
                    :options="businessTypeTrees"
                    :show-all-levels="false"
                    :props="{
                      value: 'groupCode',
                      label: 'groupName',
                      children: 'sonTypes'
                    }"
                    placeholder="请选择业务分组"
                    class="filter-item"
                    change-on-select
                    style="width:100%"
                    @change="getGroupCode"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="执行环境">
                  <el-select
                    v-model="taskBase.executionEnv"
                    class="filter-item"
                    clearable
                    placeholder="请选择执行环境"
                    style="width:100%"
                  >
                    <el-option
                      v-for="item in workTypeList"
                      :value="item.workName"
                      :key="item.workName"
                      :label="item.workName"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="测试类别" prop="categoryCode">
                  <el-select
                    v-model="taskBase.categoryCode"
                    class="filter-item"
                    placeholder="请选择测试类别"
                    style="width:100%"
                  >
                    <el-option
                      v-for="item in testCategories"
                      :value="item.categoryCode"
                      :key="item.categoryCode"
                      :label="item.categoryName"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
      <el-card class="box-card card-bottom" style="margin-top:10px;">
        <div slot="header" class="clearfix">
          <span>用例列表</span>
        </div>
        <el-button
          class="filter-item"
          type="success"
          icon="el-icon-circle-plus"
          plain
          style="margin-bottom:5px;"
          @click="caseTableVisible = true"
          >添加用例
        </el-button>
        <div class="text item">
          <el-table
            :data="taskCases"
            fit
            border
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column
              align="center"
              label="序号"
              prop="id"
              sortable="custom"
              width="80px"
            >
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="用例名称" prop="id">
              <template slot-scope="scope">
                {{ scope.row.caseName }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="用例编号" prop="id">
              <template slot-scope="scope">
                {{ scope.row.caseNo }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="所属分组" prop="id">
              <template slot-scope="scope">
                {{ scope.row.businessTypeName }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              width="200px"
              class-name="small-padding fixed-width"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="!query.taskId"
                  size="small"
                  type="success"
                  @click="selectOperation(scope.row)"
                >
                  选择操作
                </el-button>
                <el-button
                  v-if="scope.row.caseIdStatus == 'old'"
                  size="small"
                  type="primary"
                  @click="editStepValue(scope.$index, scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteRow(scope.$index, taskCases)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <div style="margin-top:36px;margin-bottom: 36px" align="center">
        <el-button
          class="filter-item"
          type="primary"
          @click="saveTask('taskBase')"
          >保存</el-button
        >
        <el-button
class="filter-item"
@click="$router.back(-1)"
          >取消</el-button
        >
      </div>
    </div>
    <el-dialog
      :visible.sync="showOperationEdit"
      width="80%"
      top="20px"
      title="选择操作"
    >
      <CaseOperation v-model="operations" :group-code="currentCase.groupCode" />
      <div slot="footer">
        <el-button @click="showOperationEdit = false">取消</el-button>
        <el-button type="primary" @click="addOperation">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findById, save, update } from '@/api/task'
import { setGroupCode, checkEmpty } from '@/utils/atlantis'
import { findByCaseIds } from '@/api/case'
import editTaskStep from './editStep.vue'
import caseList from './caseList.vue'
import CaseOperation from '@/views/common/caseOperation'
import moment from 'moment'

export default {
  components: {
    caseList,
    CaseOperation,
    editTaskStep
  },
  data() {
    const groupCode = this.$route.query.groupCode
    let defaultName = `参数化_${moment().format('YYYYMMDD_hhmm')}`
    if (this.$route.query.caseIds) {
      defaultName = ''
    }
    return {
      loading: false,
      caseTableVisible: false,
      stepShow: false,
      queryCaseNo: '',
      query: {
        taskId: this.$route.query.taskId,
        opType: ''
      },
      defaultName,
      businessTypeTrees: [],
      workTypeList: [],
      testCategories: [],
      taskCases: [],
      taskEditIndex: 0,
      groupCodeCopy: setGroupCode(groupCode),
      taskBase: {
        taskNo: undefined,
        taskName: defaultName,
        groupCode,
        executionEnv: undefined,
        categoryCode: 'Interface',
        remarks: undefined
      },
      currentCase: {},
      operations: [],
      showOperationEdit: false,
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        groupCode: [
          { required: true, message: '请选择业务分组', trigger: 'blur' }
        ],
        categoryCode: [
          { required: true, message: '请选择测试类别', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    defaultName(name) {
      this.taskBase.taskName = this.taskBase.taskName || name
    },
    taskCases: {
      handler(newV) {
        this.taskCases = newV
      },
      deep: true
    }
  },
  created() {
    this.taskFind()
  },
  methods: {
    addOperation() {
      this.currentCase.operations = _.cloneDeep(this.operations)
      this.operations = []
      this.showOperationEdit = false
    },
    selectOperation(row) {
      this.currentCase = row
      this.operations = row.operations || []
      this.showOperationEdit = true
    },
    taskFind() {
      this.loading = true
      if (!checkEmpty(this.query.taskId)) {
        this.$set(this.query, 'opType', 'update')
      } else {
        this.$set(this.query, 'opType', 'save')
        console.log(JSON.stringify(this.$route.query.caseIds))
        if (
          this.$route.query.caseIds !== undefined &&
          this.$route.query.caseIds !== null &&
          JSON.stringify(this.$route.query.caseIds) !== '[]'
        ) {
          console.log('caseIds', this.$route.query.caseIds)
          const format = {}
          if (typeof this.$route.query.caseIds === 'string') {
            format['ids'] = []
            format['ids'].push(this.$route.query.caseIds)
          } else {
            format['ids'] = this.$route.query.caseIds
          }
          findByCaseIds(format).then(response => {
            console.log('response', response)
            this.taskCases = this.addTaskField(response.data)
          })
        }
      }
      this.findTaskById()
    },
    // 编辑/新增 任务回显数据
    findTaskById() {
      findById(this.query).then(response => {
        if (!checkEmpty(this.query.taskId)) {
          if (response.errcode === 0) {
            this.taskCases = this.addTaskField(response.data.taskCases)
            this.taskBase = response.data.taskBase
            this.workTypeList = response.data.workTypeList
            this.businessTypeTrees = response.data.businessTypeTrees
            this.testCategories = response.data.testCategories
            this.groupCodeCopy = setGroupCode(this.taskBase.groupCode)
            this.loading = false
          } else {
            var message = response.errmsg
            if (response.data != null && response.data.message !== null) {
              message = response.data.message
            }
            this.loading = false
            this.$notify({
              title: '失败',
              message: message,
              type: 'warning',
              duration: 3000
            })
          }
        } else {
          // 非编辑，只获取下拉数据
          this.workTypeList = response.data.workTypeList
          this.businessTypeTrees = response.data.businessTypeTrees
          this.testCategories = response.data.testCategories
        }
        this.loading = false
      })
    },
    editStepValue(index, _row) {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1 * 1000)

      this.queryCaseNo = _row.caseNo
      this.taskEditIndex = index
      this.$refs.editStep.getCaseInfo(
        _row.id,
        this.taskCases[this.taskEditIndex],
        index + 1
      )
      this.stepShow = true
    },
    saveStepData(val) {
      if (!checkEmpty(val.data)) {
        this.taskCases[this.taskEditIndex].caseSteps = val.data
      }
      this.stepShow = false
    },
    // 设置groupCode值用于查询
    getGroupCode(values) {
      if (values != null && values.length > 0) {
        this.taskBase.groupCode = values[values.length - 1]
      }
    },
    // 给step增添字段
    addTaskField(cases) {
      let defaultName = ''
      if (!checkEmpty(cases) && cases !== undefined) {
        cases.forEach(newCase => {
          defaultName += newCase.caseName + '_'
          this.$set(newCase, 'caseIdStatus', 'old')
          this.$set(newCase, 'caseSteps', [])
        })
      }
      this.defaultName = `${defaultName}参数化_${moment().format(
        'YYYYMMDD_hhmm'
      )}`
      return cases
    },
    // 删除数据
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    // 添加用例弹窗数据
    addCaseConfirm() {
      var optionCases = this.$refs.taskData.selectCases
      const newTaskCases = this.taskCases
      if (optionCases.length > 0) {
        for (var i = 0; i < optionCases.length; i++) {
          this.$set(optionCases[i], 'caseIdStatus', 'new')
          newTaskCases.push(optionCases[i])
        }
      }
      this.taskCases = newTaskCases
      this.caseTableVisible = false
    },

    deparseTaskData() {
      const data = _.pick(this.taskBase, [
        'taskName',
        'executionEnv',
        'categoryCode',
        'groupCode',
        'remarks'
      ])
      // 组装编辑数据
      if (this.query.taskId) {
        data.id = this.query.taskId
        data.taskCaseIds = []
        data.caseIdsMap = []
        data.caseStepDtos = []
        this.taskCases.forEach((taskCase = {}, i) => {
          data.taskCaseIds.push(taskCase.id)
          data.caseIdsMap.push({
            caseId: taskCase.id,
            status: taskCase.caseIdStatus,
            taskCaseNo: i + 1
          })

          _.forEach(taskCase.caseSteps, (step, i) => {
            data.caseStepDtos.push({
              taskCaseId: taskCase.id,
              caseExecNo: i + 1,
              execNo: step.execNo,
              interfacForms: step.interfacForms,
              interfacQueries: step.interfacQueries,
              interfacHeaders: step.interfacHeaders,
              interfacJson: step.interfacJson,
              assertResults: step.assertResults
            })
          })
        })
      } else {
        // 组装创建的数据
        data.caseOperations = this.taskCases.map(taskCase => ({
          caseId: taskCase.id,
          operations: taskCase.operations
        }))
      }
      return data
    },

    saveTask(formName) {
      var id = this.query.taskId
      var formData = this.deparseTaskData()
      let validStatus = true
      this.$refs[formName].validate(valid => {
        if (!valid) {
          validStatus = false
        }
      })
      if (validStatus) {
        if (checkEmpty(id)) {
          save(formData).then(response => {
            if (response.errcode === 0) {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              setTimeout(() => {
                this.$router.go(-1)
              }, 2 * 1000)
            } else {
              var message = response.errmsg
              if (response.data != null && response.data.message !== null) {
                message = response.data.message
              }
              this.$notify({
                title: '失败',
                message: message,
                type: 'warning',
                duration: 2000
              })
            }
          })
        } else {
          update(formData).then(response => {
            if (response.errcode === 0) {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              setTimeout(() => {
                this.$router.go(-1)
              }, 2 * 1000)
            } else {
              var message = response.errmsg
              if (response.data != null && response.data.message !== null) {
                message = response.data.message
              }
              this.$notify({
                title: '失败',
                message: message,
                type: 'warning',
                duration: 2000
              })
            }
          })
        }
      }
    }
  }
}
</script>

