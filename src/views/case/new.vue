<template>
  <div class="app-container">
    <!--dialog弹窗start-->
    <!--基础信息弹窗-->
    <el-dialog
      :visible.sync="dialogTableVisible"
      title="基础信息接口"
      width="75%"
    >
      <div style="margin-bottom: 10px;">
        <el-button type="primary" @click="basicSaveBtn">
          确 定
        </el-button>
        <el-button @click="basicCloseBtn">
          取 消
        </el-button>
      </div>
      <basicDialog ref="childData" :group-code="caseBaseDto.groupCode" />
      <div slot="footer" class="filter-container" align="center">
        <el-button type="primary" @click="basicSaveBtn">
          确 定
        </el-button>
        <el-button @click="basicCloseBtn">
          取 消
        </el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog
      :visible.sync="highTableVisible"
      title="高级参数设置"
      style="width:1650px;"
    >
      <mock-func />
    </el-dialog> -->
    <!--用例值弹窗-->
    <el-dialog
      v-if="caseValueVisible"
      :visible.sync="caseValueVisible"
      title="用例值"
      width="60%"
      custom-class="case-value-dialog"
      @close="valueSaveBtn"
    >
      <caseValue
        ref="caseValueChild"
        :basic-format-id="currentStep.basicFormatId"
        :value-status="currentStep.valueStatus"
        :engine-type="currentStep.engineType"
        :case-step="currentStep"
      />
      <div slot="footer" class="filter-container" align="center">
        <el-button type="primary" @click="valueSaveBtn">
          确 定
        </el-button>
        <el-button @click="valueCloseBtn">
          取 消
        </el-button>
      </div>
    </el-dialog>

    <!--操作弹窗-->
    <el-dialog
      :modal="false"
      :visible.sync="showOperationEdit"
      top="20px"
      title="用例操作"
      width="80%"
    >
      <EditCaseOperation
        v-if="showOperationEdit"
        ref="editCaseOperation"
        :step="currentStep"
        :group-code="caseBaseDto.groupCode"
      />
      <div slot="footer" align="center" style="padding-bottom: 20px">
        <el-button @click="showOperationEdit = false">
          取消
        </el-button>
        <el-button type="primary" @click="submitOperation">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="reportVisible" title="试运行报告信息" width="60%">
      <dubboReportDialog
        :work-type-name="workName"
        :report-step-dto="reportStepDto"
        :basic-format-id="basicFormatId"
      />
    </el-dialog>

    <!--dubbo试运行-->
    <el-dialog
      :visible.sync="dubboVisible"
      title="dubbo试运行结果"
      width="70%"
      height="30%"
    >
      <dubboReportDialog :report-step-dto="reportStepDto" />

      <span slot="footer" class="dialog-footer">
        <el-button
type="primary"
@click="dubboVisible = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>

    <!--运行环境-->
    <el-dialog
      :modal="false"
      :visible.sync="workTypeVisible"
      title="选择试运行环境"
      width="40%"
    >
      <workType
        ref="workChild"
        :work-type-name="workName"
        :basic-format-id="basicFormatId"
      />
      <div slot="footer" class="filter-container" align="center">
        <el-button @click="workTypeVisible = false">
          取 消
        </el-button>
        <el-button type="primary" @click="workTypeBtn">
          确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showAddOtherCaseStep"
      title="添加其他用例 Step"
      width="80%"
      top="20px"
    >
      <CaseList
        ref="caseList"
        :show-steps="true"
        :group-code="caseBaseDto.groupCode"
      >
        <tempate slot="tableAction">
          <el-button type="primary" @click="addOtherCaseStep">
            添加
          </el-button>
        </tempate>
      </CaseList>
    </el-dialog>

    <el-dialog
      :visible.sync="caseReportVisible"
      title="用例报告信息"
      width="40%"
    >
      <div style="color: #409EFF;margin-bottom: 20px">
        <span @click="reportDetail">
          点击查看，任务编号为:
          <strong>{{ taskNo }}</strong>
          号,报告名称为:{{ taskName }}
        </span>
      </div>
    </el-dialog>

    <!--dialog弹窗end-->
    <el-card class="box-card card-bottom">
      <div slot="header" class="clearfix">
        <span style="font-size: 23px;">基础信息</span>
      </div>
      <div class="text item">
        <el-form
          ref="caseBaseDto"
          :model="caseBaseDto"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用例名称" prop="caseName">
            <el-input
              v-model="caseBaseDto.caseName"
              style="width: 50%"
              placeholder="用例名称"
            />
          </el-form-item>
          <el-form-item label="用例描述" prop="caseDesc">
            <el-input
              v-model="caseBaseDto.caseDesc"
              style="width: 50%"
              placeholder="用例描述"
            />
          </el-form-item>

          <el-form-item label="业务分组" prop="groupCode">
            <el-cascader
              key="groupCode"
              v-model="editGroupCode"
              :options="groups"
              :show-all-levels="false"
              :props="{
                value: 'groupCode',
                label: 'groupName',
                children: 'sonTypes'
              }"
              placeholder="请选择业务分组"
              change-on-select
              @change="setGroupCode"
            />
          </el-form-item>
          <el-form-item label="用例备注" prop="remarks">
            <el-input
              v-model="caseBaseDto.remarks"
              style="width: 50%"
              type="textarea"
              placeholder="用例备注"
            />
          </el-form-item>
          <el-form-item label="测试类别" prop="remarks">
            <el-select
              clearable
              v-model="caseBaseDto.categoryCode"
              placeholder="请选择测试类别"
            >
              <el-option
                v-for="item in testCategories"
                :value="item.categoryCode"
                :key="item.categoryCode"
                :label="item.categoryName"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card card-bottom">
      <div slot="header" class="clearfix">
        <span style="font-size: 23px;">参数实例</span>
      </div>
      <div>
        <el-button
          plain
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="dialogTableVisible = true"
        >
          添加接口
        </el-button>
        <!-- <el-button
          plain
          size="small"
          type="success"
          icon="el-icon-circle-plus"
          @click="highTableVisible = true"
        >
          高级参数设置
        </el-button> -->
        <el-button size="small" type="warning" plain @click="caseEvn">
          用例试运行
        </el-button>
        <el-button plain size="small" type="info" @click="caseReportDetail">
          试运行用例报告
        </el-button>
        <el-button plain size="small" @click="showAddOtherCaseStep = true">
          添加其他用例 Step
        </el-button>
        <div style="margin-top: 10px" @mousedown="modifyItems">
          <el-table
            :data="caseSteps"
            element-loading-text="Loading"
            border
            row-key="id"
            style="width: 100%"
          >
            <el-table-column label="序号" width="40px" align="center">
              <template slot-scope="scope">
                <span>
                  {{ scope.$index + 1 }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="basicDesc"
              label="接口名称"
              min-width="15%"
            />
            <el-table-column prop="formatUrl" label="url" min-width="26%" />
            <el-table-column
              prop="engineDesc"
              label="测试类型"
              min-width="10%"
            />
            <el-table-column prop="remark" label="备注" min-width="15%">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" style="width: 100%" />
              </template>
            </el-table-column>
            <el-table-column label="断言" align="center" min-width="8%">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.hasAssert"
                  size="medium"
                  @click="toggleAssertBtn(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="openCaseValue(scope.row)"
                >
                  用例值
                </el-button>
                <el-button
                  size="mini"
                  type="success"
                  @click="openTestRun(scope.$index, scope.row)"
                  >试运行</el-button
                >
                <div style="margin-top: 8px">
                  <el-button
                    size="mini"
                    type="info"
                    @click="editOperation(scope.row)"
                  >
                    操作和断言
                  </el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteRow(scope.$index, caseSteps)"
                  >
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <div style="margin-top:36px;margin-bottom: 36px" align="center">
      <el-button
        class="filter-item"
        type="primary"
        @click="saveNewSave('caseBaseDto')"
      >
        保存
      </el-button>
      <el-button class="filter-item" @click="$router.back(-1)">
        取消
      </el-button>
    </div>
  </div>
</template>
<style>
.card-bottom {
  margin-bottom: 10px;
}
.case-value-dialog {
  min-width: 600px;
}
</style>
<script>
import {
  getGroupTree,
  findCase,
  createCase,
  reportTestRun,
  caseRun
} from '@/api/case'
import { findByIds } from '@/api/basic'
import { setGroupCode, toJson } from '@/utils/atlantis'
import basicDialog from '../common/basicDialog.vue'
import caseValue from '../common/caseValue.vue'
import EditCaseOperation from '../common/editCaseOperation'
import workType from '../common/workType.vue'
import dubboReportDialog from '../common/dubboReportDialog.vue'
import CaseList from '@/views/case/simpleList'
import Sortable from 'sortablejs'
import ElInput from '../../../node_modules/element-ui/packages/input/src/input.vue'
// import mockFunc from './mockFunc.vue'
export default {
  components: {
    ElInput,
    EditCaseOperation,
    basicDialog,
    caseValue,
    workType,
    dubboReportDialog,
    // mockFunc,
    CaseList
  },
  data() {
    const { caseNo, caseId } = this.$route.query
    let categoryCode = ''

    if (!caseNo) categoryCode = this.$store.getters.selCategory

    return {
      stepNo: 0,
      message: {
        0: 'sucess',
        1: '未添加用例Step数据',
        2: '未添加用例数据'
      },
      showAddOtherCaseStep: false,
      currentStep: null,
      opType: 'save',
      listLoading: false,
      dialogTableVisible: false,
      highTableVisible: false,
      caseValueVisible: false,
      showOperationEdit: false,
      workTypeVisible: false,
      reportVisible: false,
      dubboVisible: false,
      caseReportVisible: false,
      assertIndex: 0,
      workIndex: 0,
      tempAssert: [],
      tempFormList: [],
      tempQueryList: [],
      caseSteps: [],
      caseReportSteps: {},
      itemsAssert: [{}],
      editGroupCode: undefined,
      caseExecutionEnv: '',
      caseEnvStatus: '',
      taskNo: '',
      taskName: '',
      assertMap: {
        code: '',
        codeValue: '',
        assertSite: 'status',
        assertDesc: '',
        json: '',
        jsonSchema: '',
        statusCode: ''
      },
      basicFormatId: undefined,
      groups: [],
      idMap: {},
      boolAssert: true,
      position: 0,
      workName: '',
      caseBaseDto: {
        id: caseId,
        caseNo,
        categoryCode,
        caseName: '',
        caseDesc: '',
        groupCode: '',
        engineTypeId: '',
        remarks: ''
      },
      // step试运行结果存储载体
      reportStepDto: undefined,
      testCategories: this.$store.getters.allCategories,
      rules: {
        caseName: [
          { required: true, message: '请输入用例名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        caseDesc: [
          { required: true, message: '请输入用例描述', trigger: 'blur' }
        ],
        groupCode: [
          { required: true, message: '请选择业务分组', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getGroupList()
    this.getCaseInfo()
  },
  mounted() {
    this.rowDrop()
  },
  methods: {
    getGroupList() {
      getGroupTree().then(response => {
        this.groups = response.data
      })
    },
    getCaseInfo() {
      var query = {
        caseNo: this.caseBaseDto.caseNo,
        caseId: this.caseBaseDto.id
      }
      if (!this.isEmpty(this.caseBaseDto.caseNo)) {
        findCase(query).then(response => {
          if (response.errcode === 0) {
            this.caseBaseDto = this.backCaseBase(response.data.caseBaseDto)
            this.editGroupCode = setGroupCode(this.caseBaseDto.groupCode)
            this.caseSteps = this.parseSteps(response.data.caseStepDtos)
            this.listLoading = false
          } else {
            this.listLoading = false
            this.$notify({
              title: '失败',
              message: response.errmsg,
              type: 'warning',
              duration: 2000
            })
          }
        })
      } else if (!this.isEmpty(this.$route.query.ids)) {
        const format = {}
        if (typeof this.$route.query.ids === 'string') {
          format['ids'] = []
          format['ids'].push(this.$route.query.ids)
        } else {
          format['ids'] = this.$route.query.ids
        }
        findByIds(format).then(response => {
          console.log('====response:' + response.data.toString())
          this.caseSteps = this.basicDataFormat(response.data)
        })
      }
    },
    backCaseBase(caseBase) {
      var newBase = {
        id: caseBase.id,
        caseNo: caseBase.caseNo,
        caseName: caseBase.caseName,
        caseDesc: caseBase.caseDesc,
        groupCode: caseBase.groupCode,
        engineTypeId: caseBase.engineTypeId,
        categoryCode: caseBase.categoryCode,
        remarks: caseBase.remarks
      }
      return newBase
    },
    parseSteps(steps = []) {
      steps.forEach((step, i) => {
        step.onlyNo = i + 1
        step.valueStatus = true
        step.assertResults = step.assertResults || []
        step.uplinkParams = step.uplinkParams || []
        step.assertOperations = []
        step.remark = step.remark
        step.hasAssert = !!step.assertResults.length

        step.assertResults = step.assertResults.filter(assert => {
          if (assert.assertOperation) {
            step.assertOperations.push(assert.assertOperation)
            return false
          }
          _.map(assert.assertDict, (val, key) => {
            assert.code = key
            assert.codeValue = val
          })
          return true
        })

        step.tempForms = []
        if (step.bodyParamType === 'FORM') {
          _.map(step.interfacForms, (val, key) => {
            val = this.isEmpty(val) ? '' : val
            step.tempForms.push({ formKey: key, formValue: val })
          })
        }

        step.tempQueries = []
        if (step.existQuery) {
          _.map(step.interfacQueries, (val, key) => {
            val = this.isEmpty(val) ? '' : val
            step.tempQueries.push({ queryKey: key, queryValue: val })
          })
        }

        step.interfacHeaders = _.map(step.interfacHeaders, (val, key) => {
          val = this.isEmpty(val) ? '' : val
          return { headerKey: key, headerValue: val }
        })
      })

      return steps
    },
    // step试运行
    openTestRun(rIndex, _row) {
      this.workIndex = rIndex
      this.basicFormatId = _row.basicFormatId
      this.caseEnvStatus = ''

      if (_row.engineType === 'INTERFAC') {
        var workName = this.caseSteps[rIndex].executionEnv
        if (!this.isEmpty(workName)) {
          this.workName = workName
        } else {
          this.workName = ''
        }
        this.workTypeVisible = true
      } else {
        this.listLoading = true
        var caseReportSteps = this.deparseStep(
          this.caseSteps[this.workIndex],
          1
        )
        this.$delete(caseReportSteps, 'hasUpdValue')
        this.$delete(caseReportSteps, 'id')
        this.$delete(caseReportSteps, 'bodyParamType')
        this.$delete(caseReportSteps, 'existQuery')

        reportTestRun(caseReportSteps).then(response => {
          if (response.errcode === 0) {
            this.reportStepDto = response.data
            this.dubboVisible = true
            this.listLoading = false
          } else {
            var message = response.errmsg
            if (response.data !== null && response.data.message !== '') {
              message = response.data.message
            }
            this.listLoading = false
            this.$notify({
              title: '失败',
              message: message,
              type: 'warning',
              duration: 3000
            })
          }
          this.listLoading = false
        })
      }
    },

    setGroupCode(values) {
      if (values != null && values.length > 0) {
        this.caseBaseDto.groupCode = values[values.length - 1]
      }
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    toggleAssertBtn(row) {
      row.hasAssert = !row.hasAssert
    },
    basicSaveBtn() {
      var caseDatas = this.$refs.childData.selectDatas
      const baseDatas = this.caseSteps
      if (caseDatas.length > 0) {
        const caseDataList = this.basicDataFormat(caseDatas)
        if (caseDataList.length > 0) {
          for (var h = 0; h < caseDataList.length; h++) {
            caseDataList[h].paramType = this.$refs.childData.paramType
            baseDatas.push(caseDataList[h])
          }
        }
        this.caseSteps = baseDatas
      }
      this.dialogTableVisible = false
    },

    basicDataFormat(caseDatas) {
      const stepAssDatas = []
      const max_no = this.caseSteps.length
      for (var i = 0; i < caseDatas.length; i++) {
        var engineType = caseDatas[i].engineTypeIdValue
        var engineTypeId = caseDatas[i].id
        var engineTypeValue = caseDatas[i].engineTypeDescValue
        const newSteps = {
          onlyNo: max_no + i + 1,
          basicFormatId: caseDatas[i].id,
          basicNo: caseDatas[i].basicNo,
          basicDesc: caseDatas[i].basicDesc,
          formatUrl: caseDatas[i].formatUrl,
          engineDesc: engineTypeValue,
          engineType: engineType,
          executionEnv: undefined,
          hasUpdValue: false,
          hasAssert: false,
          engineTypeId: engineTypeId,
          assertResults: [],
          uplinkParams: [],
          tempForms: [],
          tempQueries: [],
          interfacForms: [],
          interfacQueries: [],
          interfacHeaders: [],
          interfacJson: undefined,
          bodyParamType: null,
          remark: null,
          existQuery: false,
          valueStatus: false
        }
        stepAssDatas.push(newSteps)
      }
      return stepAssDatas
    },

    //    用例值
    // 关闭用例值按钮
    valueCloseBtn() {
      this.valueSaveBtn()
    },
    // 打开用例值弹窗
    openCaseValue(row) {
      this.caseValueVisible = true
      this.currentStep = row
    },
    // save用例值按钮
    valueSaveBtn() {
      var interfacForms = this.$refs.caseValueChild.paramData.formKeylist
      var interfacHeaders = this.$refs.caseValueChild.paramData.headerList
      var interfacJson = this.$refs.caseValueChild.paramData.interfacJson
      var paramExample = this.$refs.caseValueChild.paramData.paramExample
      var hasUpdValue = this.$refs.caseValueChild.paramData.hasUpdValue
      var bodyParamType = this.$refs.caseValueChild.paramData.bodyParamType
      var existQuery = this.$refs.caseValueChild.paramData.existQuery
      var valueShowStatus = this.$refs.caseValueChild.valueShow
      var dataType = this.$refs.caseValueChild.dataType
      if (dataType !== 'DUBBO') {
        if (!this.isEmpty(interfacJson)) {
          try {
            interfacJson = JSON.stringify(JSON.parse(interfacJson))
          } catch (err) {
            this.$notify({
              title: 'json 格式错误',
              type: 'error'
            })
            return false
          }
        }
      }
      if (valueShowStatus) {
        this.currentStep.hasUpdValue = true
        if (bodyParamType === 'FORM') {
          if (interfacForms !== undefined && interfacForms.length > 0) {
            this.$set(this.currentStep, 'tempForms', [])
            var names = this.$refs.caseValueChild.$refs.formKeyName
            var values = this.$refs.caseValueChild.$refs.formKeyValue
            for (var i = 0; i < names.length; i++) {
              var value = values[i].$refs.input.value
              if (this.isEmpty(value)) {
                value = ''
                this.currentStep.hasUpdValue = false
              }
              this.currentStep.tempForms.push({
                formKey: names[i].value,
                formValue: value
              })
            }
          }
        }
        if (existQuery) {
          this.$set(this.currentStep, 'tempQueries', [])
          var queryValues = this.$refs.caseValueChild.$refs.queryKeyValue
          var queryNames = this.$refs.caseValueChild.$refs.queryKeyName
          for (var h = 0; h < queryNames.length; h++) {
            var valueH = queryValues[h].$refs.input.value
            if (this.isEmpty(valueH)) {
              valueH = ''
              this.currentStep.hasUpdValue = false
            }
            this.currentStep.tempQueries.push({
              queryKey: queryNames[h].value,
              queryValue: valueH
            })
          }
        }
        this.currentStep.interfacHeaders = interfacHeaders
        this.currentStep.interfacJson = interfacJson
        this.currentStep.paramExample = paramExample
        // this.currentStep.hasUpdValue = true
        this.currentStep.bodyParamType = bodyParamType
        this.currentStep.existQuery = existQuery
        this.currentStep.valueStatus = hasUpdValue
      } else {
        this.currentStep.hasUpdValue = false
      }

      this.caseValueVisible = false
    },
    basicCloseBtn() {
      this.dialogTableVisible = false
    },
    editOperation(row) {
      this.currentStep = row
      this.showOperationEdit = true
    },

    // 断言弹框确定
    submitOperation() {
      _.extend(this.currentStep, this.$refs.editCaseOperation.data)
      this.showOperationEdit = false
    },
    // 选择step试运行环境
    workTypeBtn() {
      this.workTypeVisible = false
      if (this.caseEnvStatus === 'caseRun') {
        this.caseExecutionEnv = this.$refs.workChild.workName
        this.caseTestRun()
      } else {
        this.workTypeVisible = false
        this.listLoading = true
        this.workName = this.$refs.workChild.workName
        this.caseSteps[
          this.workIndex
        ].executionEnv = this.$refs.workChild.workName
        //        this.workName=this.$refs.workChild.workName
        var caseReportSteps = this.deparseStep(
          this.caseSteps[this.workIndex],
          1
        )
        this.$set(caseReportSteps, 'executionEnv', this.workTypeName)
        this.$delete(caseReportSteps, 'hasUpdValue')
        this.$delete(caseReportSteps, 'id')
        this.$delete(caseReportSteps, 'bodyParamType')
        this.$delete(caseReportSteps, 'existQuery')

        this.caseReportSteps = caseReportSteps

        reportTestRun(this.caseReportSteps).then(response => {
          if (response.errcode === 0) {
            this.reportStepDto = response.data || {}
            this.listLoading = false
            this.reportVisible = true
          } else {
            var message = response.errmsg
            if (response.data !== null && response.data.message !== '') {
              message = response.data.message
            }
            this.listLoading = false
            this.$notify({
              title: '失败',
              message: message,
              type: 'warning',
              duration: 3000
            })
          }
        })
      }
    },
    deparseOperations(operations, type) {
      if (!operations) return []
      return operations.map(o => {
        const data = {
          operationId: o.id,
          params: o.params
        }
        if (type === 'assert') return { assertOperation: data }
        return data
      })
    },
    deparseSteps(caseSteps) {
      var stepDatas = []
      for (var i = 0; i < caseSteps.length; i++) {
        var mapData = this.deparseStep(caseSteps[i], i + 1)
        stepDatas.push(mapData)
      }
      return stepDatas
    },
    deparseStep(stepCase, execNo) {
      const stepData = stepCase
      const mapData = _.cloneDeep(
        _.pick(stepCase, [
          'basicFormatId',
          'existQuery',
          'bodyParamType',
          'engineType',
          'formatUrl',
          'existQuery',
          'remark',
          'interfacJson',
          'hasUpdValue'
        ])
      )

      _.extend(mapData, {
        id: this.caseBaseDto.id,
        execNo,
        caseNo: this.caseBaseDto.caseNo,
        preOperations: this.deparseOperations(stepData.preOperations),
        endOperations: this.deparseOperations(stepData.endOperations)
      })

      if (stepData.hasAssert === true) {
        let newAssert = this.assertData(stepData.assertResults)
        newAssert = newAssert.concat(
          this.deparseOperations(stepData.assertOperations, 'assert')
        )
        mapData.assertResults = newAssert
      }

      if (stepData.bodyParamType === 'FORM') {
        if (stepData.tempForms.length > 0) {
          var bodyMap = {}
          for (var i = 0; i < stepData.tempForms.length; i++) {
            var value = stepData.tempForms[i].formValue
            if (this.isEmpty(value)) {
              value = ''
            }
            bodyMap[stepData.tempForms[i].formKey] = value
          }
          if (JSON.stringify(bodyMap) !== '{}') {
            mapData['interfacForms'] = bodyMap
          }
        }
      }
      if (this.isEmpty(stepData.bodyParamType)) {
        mapData['bodyParamType'] = null
      }
      if (stepData.existQuery === true) {
        var queryMap = {}
        for (var m = 0; m < stepData.tempQueries.length; m++) {
          var valueS = stepData.tempQueries[m].queryValue
          if (this.isEmpty(valueS)) {
            valueS = ''
          }
          queryMap[stepData.tempQueries[m].queryKey] = valueS
        }
        if (JSON.stringify(queryMap) !== '{}') {
          mapData['interfacQueries'] = queryMap
        }
      }
      if (
        !this.isEmpty(stepData.interfacHeaders) &&
        stepData.interfacHeaders.length > 0
      ) {
        var headerMap = {}
        for (var n = 0; n < stepData.interfacHeaders.length; n++) {
          headerMap[stepData.interfacHeaders[n].headerKey] =
            stepData.interfacHeaders[n].headerValue
        }
        if (JSON.stringify(headerMap) !== '{}') {
          mapData['interfacHeaders'] = headerMap
        }
        //        mapData['interfacHeaders'] = stepData.interfacHeaders
      }
      return mapData
    },
    assertData(results) {
      if (this.isEmpty(results)) return []
      var assertRes = []
      for (var i = 0; i < results.length; i++) {
        var assertNode = {}
        var objMap = {}
        assertNode['assertSite'] = results[i].assertSite
        if (!this.isEmpty(results[i].statusCode)) {
          assertNode['statusCode'] = results[i].statusCode
        }
        if (!this.isEmpty(results[i].jsonSchema)) {
          assertNode['jsonSchema'] = results[i].jsonSchema
        }
        if (!this.isEmpty(results[i].json)) {
          assertNode['json'] = results[i].json
        }
        if (!this.isEmpty(results[i].assertDesc)) {
          assertNode['assertDesc'] = results[i].assertDesc
        }
        //          if(this.isEmpty(codeValue)){
        //            codeValue='';
        //          }
        if (!this.isEmpty(results[i].code)) {
          objMap[results[i].code] = results[i].codeValue
        }
        if (JSON.stringify(objMap) !== '{}') {
          assertNode['assertDict'] = objMap
        }
        assertRes.push(assertNode)
      }
      return assertRes
    },
    saveNewSave(formName) {
      debugger
      let validStatus = true
      this.$refs[formName].validate(valid => {
        if (!valid) {
          validStatus = false
        }
      })
      if (!validStatus) {
        return
      }
      var saveParam = this.saveEntityParam()
      const assertResult = this.accessCaseSteps(saveParam)
      if (assertResult === 1) {
        this.$notify({
          title: '失败',
          message: this.message[assertResult],
          type: 'warning',
          duration: 3000
        })
        return
      } else if (assertResult === 2) {
        this.$notify({
          title: '失败',
          message: `序号${this.stepNo} ` + this.message[assertResult],
          type: 'warning',
          duration: 3000
        })
        return
      }
      createCase(saveParam).then(response => {
        if (response.errcode === 0) {
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 3000
          })
          setTimeout(() => {
            this.$router.go(-1)
          }, 500)
        } else {
          let errmsg = response.errmsg
          if (response.data !== null && response.data.message !== null) {
            errmsg = response.data.message
          }
          this.$notify({
            title: '失败',
            message: errmsg,
            type: 'warning',
            duration: 3000
          })
        }
      })
    },
    // 校验保存参数合理性
    accessCaseSteps(saveParam) {
      const caseSteps = saveParam.caseStepDtos || []

      if (!caseSteps.length) return 1

      for (let i = 0; i < caseSteps.length; i++) {
        if (!caseSteps[i].hasUpdValue) {
          this.stepNo = i + 1
          return 2
        }
      }
      return 0
    },
    caseEvn() {
      this.caseEnvStatus = 'caseRun'
      this.workTypeVisible = true
    },
    caseTestRun() {
      var runParam = this.saveEntityParam()
      // if (this.isEmpty(this.caseExecutionEnv)) {
      //   this.$notify({
      //     title: '失败',
      //     message: '运行环境不能为空！',
      //     type: 'warning',
      //     duration: 2000
      //   })
      // }
      runParam.categoryCode = this.caseBaseDto.categoryCode
      caseRun(runParam, this.caseExecutionEnv).then(response => {
        if (response.errcode === 0) {
          this.caseReportVisible = true
          this.taskNo = response.data.taskNo
          this.taskName = response.data.taskName
        } else {
          this.$notify({
            title: '失败',
            message: response.data.message,
            type: 'warning',
            duration: 2000
          })
        }
      })
    },
    reportDetail() {
      this.$router.push({
        path: '/reports/reportDetailList',
        query: { reportNo: '', op: 'latest', taskNo: this.taskNo }
      })
    },
    caseReportDetail() {
      if (this.taskNo === '' || this.taskNo === undefined) {
        this.$notify({
          title: '提示',
          message: '请先试运行生成报告！',
          type: 'warning',
          duration: 2000
        })
      } else {
        this.$router.push({
          path: '/reports/reportDetailList',
          query: { reportNo: '', op: 'latest', taskNo: this.taskNo }
        })
      }
    },
    addOtherCaseStep() {
      const steps = []
      _.map(this.$refs.caseList.selectedSteps, step => {
        if (step) steps.push(step)
      })
      this.caseSteps = this.caseSteps.concat(this.parseSteps(steps))
      this.showAddOtherCaseStep = false
    },
    saveEntityParam() {
      var type = 'SAVE'
      if (!this.isEmpty(this.caseBaseDto.caseNo)) {
        type = 'UPDATE'
      }
      var caseBase = this.caseBaseDto
      //      this.$set(caseBase,"engineTypeId","888888")
      //      this.$set(caseBase,"categoryCode","Regression")
      var caseSteps = this.deparseSteps(this.caseSteps)
      var formData = {
        opType: type,
        caseBaseDto: caseBase,
        caseStepDtos: caseSteps
      }
      return formData
    },
    isEmpty(val) {
      switch (typeof val) {
        case 'string':
          return val.replace(/^\s*/, '').replace(/\s*$/, '').length === 0
        case 'number':
          return val === 0
        case 'object':
          if (
            val === null ||
            JSON.stringify(val) === '{}' ||
            val === undefined ||
            JSON.stringify(val) === '[]'
          ) {
            return true
          }
          return false
        case 'array':
          return val.length === 0
        default:
          return true
      }
    },
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')

      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.caseSteps.splice(oldIndex, 1)[0]
          _this.caseSteps.splice(newIndex, 0, currRow)
        }
      })
    },
    modifyItems() {
      var signal = []
      for (var i = 0; i < this.caseSteps.length; i++) {
        if (this.idMap[this.caseSteps[i].onlyNo] !== i + 1) {
          signal.push(1)
          this.idMap[this.caseSteps[i].onlyNo] = i + 1
        }
      }
      if (signal.length === 0) {
        return
      }
      for (let i = 0; i < this.caseSteps.length; i++) {
        for (let j = 0; j < this.caseSteps[i].uplinkParams.length; j++) {
          this.caseSteps[i].uplinkParams[j].execNo = this.idMap[
            this.caseSteps[i].uplinkParams[j].execNo
          ]
        }
      }
      this.position = this.idMap[this.position]
      for (i = 0; i < this.caseSteps.length; i++) {
        this.caseSteps[i].execNo = i + 1
      }
    },
    toJson(value) {
      return toJson(value)
    }
  }
}
</script>
