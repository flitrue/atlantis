<template>
  <div class="app-container">
    <!--dialog弹窗start-->

    <!--用例值弹窗-->
    <el-dialog
      v-if="caseValueVisible"
      :visible.sync="caseValueVisible"
      title="用例值"
      width="60%"
      @close="valueSaveBtn"
    >
      <caseValue
        ref="caseValueChild"
        :basic-format-id="basicFormatId"
        :value-status="caseSteps[caseValueIndex].valueStatus"
        :engine-type="engineType"
        :case-step="caseSteps[caseValueIndex]"
      />
      <div slot="footer" class="filter-container" align="center">
        <el-button type="primary" @click="valueSaveBtn">确 定</el-button>
        <el-button @click="valueCloseBtn">取 消</el-button>
      </div>
    </el-dialog>

    <!--断言弹窗-->
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
        :read-only="{
          preOperations: true,
          endOperations: true,
          assertOperations: true
        }"
        :group-code="caseBaseDto.groupCode"
        active="assert"
      />
      <div slot="footer" align="center" style="padding-bottom: 20px">
        <el-button @click="showOperationEdit = false">取消</el-button>
        <el-button type="primary" @click="submitOperation">确定</el-button>
      </div>
    </el-dialog>

    <!--dialog弹窗end-->
    <el-card class="box-card card-bottom">
      <div slot="header" class="clearfix">
        <span style="font-size: 23px;">用例基础信息</span>
      </div>
      <div class="text item">
        <el-form
          ref="caseBaseDto"
          :model="caseBaseDto"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用例名称" prop="caseName">
            <el-input
              v-model="caseBaseDto.caseName"
              :disabled="true"
              style="width: 50%"
              placeholder="用例名称"
            />
          </el-form-item>
          <el-form-item label="用例描述" prop="caseDesc">
            <el-input
              v-model="caseBaseDto.caseDesc"
              :disabled="true"
              style="width: 50%"
              placeholder="用例描述"
            />
          </el-form-item>

          <el-form-item label="业务分组" prop="groupCode">
            <el-cascader
              key="groupCode"
              v-model="editGroupCode"
              :disabled="true"
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
              :disabled="true"
              v-model="caseBaseDto.remarks"
              style="width: 50%"
              type="textarea"
              placeholder="用例备注"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card card-bottom">
      <div slot="header" class="clearfix">
        <span style="font-size: 23px;">用例参数实例</span>
      </div>
      <div>
        <!--<el-button type="primary" icon="el-icon-plus" plain @click="dialogTableVisible = true">添加接口</el-button>-->
        <div style="margin-top: 10px">
          <el-table
            :data="caseSteps"
            element-loading-text="Loading"
            border
            style="width: 100%"
          >
            <el-table-column fixed prop="id" label="序号" min-width="5%">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column
              prop="basicDesc"
              label="接口名称"
              min-width="20%"
            />
            <el-table-column prop="formatUrl" label="url" min-width="35%" />
            <el-table-column
              prop="engineDesc"
              label="测试类型"
              min-width="15%"
            />
            <el-table-column fixed="right" label="操作" width="200px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="openCaseValue(scope.$index, scope.row)"
                  >用例值</el-button
                >
                <el-button
                  size="mini"
                  type="info"
                  @click="editOperation(scope.row)"
                  >操作和断言</el-button
                >
                <!--<div style="margin-top: 8px">-->
                <!--<el-button-->
                <!--v-if="caseSteps[scope.$index].hasUpParam"-->
                <!--size="mini"-->
                <!--type="warning"-->
                <!--@click="openUpParamDialog(scope.$index)">上行参数-->
                <!--</el-button>-->
                <!--</div>-->
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <div style="margin-top:36px;margin-bottom: 36px" align="center">
      <el-button class="filter-item" @click="cancelNewSave">取消</el-button>
      <el-button
class="filter-item"
type="primary"
@click="saveNewSave"
        >保存</el-button
      >
    </div>
  </div>
</template>
<style>
.card-bottom {
  margin-bottom: 10px;
}
</style>
<script>
import { getGroupTree } from '@/api/case'
import { editTaskStep, findCaseSteps } from '@/api/task'
import { setGroupCode } from '@/utils/atlantis'
import caseValue from '../common/caseValue.vue'
import EditCaseOperation from '../common/editCaseOperation'

export default {
  components: {
    caseValue,
    EditCaseOperation
  },
  props: {
    editCaseNo: {
      type: String,
      required: true,
      default: 'String'
    }
  },
  data() {
    return {
      opType: 'save',
      currentStep: null,
      showOperationEdit: false,
      listLoading: false,
      dialogTableVisible: false,
      caseValueVisible: false,
      dialogFormVisible: false,
      dialogUpVisible: false,
      workTypeVisible: false,
      reportVisible: false,
      dubboVisible: false,
      fPosition: 2,
      assertIndex: 0,
      upParamIndex: 0,
      caseValueIndex: 0,
      workIndex: 0,
      tempUpParam: [],
      tempAssert: [],
      tempFormList: [],
      tempQueryList: [],
      valueStatus: false,
      caseSteps: [],
      dubboResult: undefined,
      caseReportSteps: {},
      itemsAssert: [{}],
      editGroupCode: undefined,
      backStepData: [],
      assertMap: {
        code: '',
        codeValue: '',
        assertSite: 'status',
        assertDesc: '',
        json: '',
        jsonSchema: '',
        statusCode: ''
      },
      engineType: undefined,
      basicFormatId: undefined,
      groups: [],
      workName: '',
      caseBaseDto: {
        id: '',
        caseNo: this.editCaseNo,
        caseName: '',
        caseDesc: '',
        groupCode: '',
        remarks: ''
      }
    }
  },
  watch: {
    tempUpParam: {
      handler(newV) {
        console.log('=====tempUpParam:' + newV)
      }
    }
  },
  created() {
    this.getGroupList()
  },

  methods: {
    editOperation(row) {
      this.currentStep = row
      this.currentStep.hasAssert = true
      this.showOperationEdit = true
    },

    // 断言弹框确定
    submitOperation() {
      this.currentStep.assertResults = this.$refs.editCaseOperation.data.assertResults
      // _.extend(this.currentStep, this.$refs.editCaseOperation.data)
      this.showOperationEdit = false
    },
    getGroupList() {
      getGroupTree().then(response => {
        this.groups = response.data
      })
    },
    getCaseInfo(newCaseId, baseCase, execNo) {
      var query = {
        taskCaseId: newCaseId
      }
      findCaseSteps(query).then(response => {
        this.caseBaseDto = response.data.caseBaseDto
        this.editGroupCode = setGroupCode(this.caseBaseDto.groupCode)
        const backSteps = baseCase.caseSteps
        const caseStatus = baseCase.caseIdStatus
        if (!this.isEmpty(backSteps)) {
          this.caseSteps = this.editCaseStep(backSteps)
        } else {
          //          this.caseSteps =[];
          if (caseStatus === 'old') {
            var queryParam = {
              caseId: baseCase.id,
              caseIdStatus: caseStatus,
              caseExecNo: execNo
            }
            editTaskStep(queryParam).then(response => {
              if (response.errcode === 0) {
                const taskSteps = response.data.editTask.taskSteps
                if (!this.isEmpty(taskSteps)) {
                  this.caseSteps = this.editTaskBack(taskSteps)
                }
              }
            })
          } else {
            this.caseSteps = this.editCaseStep(response.data.caseStepDtos)
          }
        }
      })
    },

    editTaskBack(editStep) {
      const initTaskData = editStep
      if (editStep.length > 0) {
        for (var i = 0; i < editStep.length; i++) {
          var asserts = editStep[i].assertResults
          if (!this.isEmpty(asserts) && asserts.length > 0) {
            this.$set(initTaskData[i], 'hasAssert', true)
            const newAssert = []
            for (var j = 0; j < asserts.length; j++) {
              if (!this.isEmpty(asserts[j].assertDict)) {
                for (var key in asserts[j].assertDict) {
                  var code = key
                  var codeValue = asserts[j].assertDict[key]
                  //                  this.$delete(initTaskData[i].assertResults[j], 'assertDict')
                  newAssert.push(asserts[j])
                  this.$set(newAssert[j], 'code', code)
                  this.$set(newAssert[j], 'codeValue', codeValue)
                }
              } else {
                if (!this.isEmpty(asserts[j].assertSite)) {
                  newAssert.push(asserts[j])
                }
              }
            }
            this.$set(initTaskData[i], 'assertResults', newAssert)
          } else {
            this.$set(initTaskData[i], 'hasAssert', false)
            this.$set(initTaskData[i], 'assertResults', [])
          }
          if (
            !this.isEmpty(editStep[i].uplinkParams) &&
            editStep[i].uplinkParams.length > 0
          ) {
            this.$set(initTaskData[i], 'hasUpParam', true)
          } else {
            this.$set(initTaskData[i], 'hasUpParam', false)
            this.$set(initTaskData[i], 'uplinkParams', [])
          }
          this.$set(initTaskData[i], 'valueStatus', true)
          if (editStep[i].bodyParamType === 'FORM') {
            if (!this.isEmpty(editStep[i].interfacForms)) {
              var tempForms = []
              for (var formKey in editStep[i].interfacForms) {
                var formValue = editStep[i].interfacForms[formKey]
                if (this.isEmpty(formValue)) {
                  formValue = ''
                }
                tempForms.push({ formKey: formKey, formValue: formValue })
              }
              this.$set(initTaskData[i], 'tempForms', tempForms)
            }
          }

          if (!this.isEmpty(editStep[i].interfacQueries)) {
            var tempQueries = []
            for (var queryKey in editStep[i].interfacQueries) {
              var queryValue = editStep[i].interfacQueries[queryKey]
              if (this.isEmpty(queryValue)) {
                queryValue = ''
              }
              tempQueries.push({ queryKey: queryKey, queryValue: queryValue })
            }
            this.$set(initTaskData[i], 'tempQueries', tempQueries)
          }
          if (!this.isEmpty(editStep[i].interfacHeaders)) {
            var interfacHeaders = []
            for (var headKey in editStep[i].interfacHeaders) {
              var value = editStep[i].interfacHeaders[headKey]
              if (this.isEmpty(value)) {
                value = ''
              }
              interfacHeaders.push({ headerKey: headKey, headerValue: value })
            }
            this.$set(initTaskData[i], 'interfacHeaders', interfacHeaders)
          }
          if (!this.isEmpty(editStep[i].interfacJson)) {
            this.$set(initTaskData[i], 'interfacJson', editStep[i].interfacJson)
          }
        }
      }
      return initTaskData
    },
    editCaseStep(steps) {
      if (steps.length > 0) {
        for (var i = 0; i < steps.length; i++) {
          var asserts = steps[i].assertResults
          if (!this.isEmpty(asserts) && asserts.length > 0) {
            this.$set(steps[i], 'hasAssert', true)
            for (var j = 0; j < asserts.length; j++) {
              if (!this.isEmpty(asserts[j].assertDict)) {
                for (var key in asserts[j].assertDict) {
                  var code = key
                  var codeValue = asserts[j].assertDict[key]
                  this.$delete(steps[i].assertResults[j], 'assertDict')
                  this.$set(steps[i].assertResults[j], 'code', code)
                  this.$set(steps[i].assertResults[j], 'codeValue', codeValue)
                }
              }
            }
          } else {
            this.$set(steps[i], 'hasAssert', false)
            this.$set(steps[i], 'assertResults', [])
          }
          if (
            !this.isEmpty(steps[i].uplinkParams) &&
            steps[i].uplinkParams.length > 0
          ) {
            this.$set(steps[i], 'hasUpParam', true)
          } else {
            this.$set(steps[i], 'hasUpParam', false)
            this.$set(steps[i], 'uplinkParams', [])
          }
          this.$set(steps[i], 'valueStatus', true)
          if (steps[i].bodyParamType === 'FORM') {
            if (!this.isEmpty(steps[i].interfacForms)) {
              var tempForms = []
              for (var formKey in steps[i].interfacForms) {
                var formValue = steps[i].interfacForms[formKey]
                if (this.isEmpty(formValue)) {
                  formValue = ''
                }
                tempForms.push({ formKey: formKey, formValue: formValue })
              }
              this.$set(steps[i], 'tempForms', tempForms)
            }
          }

          if (steps[i].existQuery && !this.isEmpty(steps[i].interfacQueries)) {
            var tempQueries = []
            for (var queryKey in steps[i].interfacQueries) {
              var queryValue = steps[i].interfacQueries[queryKey]
              if (this.isEmpty(queryValue)) {
                queryValue = ''
              }
              tempQueries.push({ queryKey: queryKey, queryValue: queryValue })
            }
            this.$set(steps[i], 'tempQueries', tempQueries)
          }
          if (
            !this.isEmpty(steps[i].interfacHeaders) &&
            !this.isEmpty(steps[i].interfacHeaders)
          ) {
            var interfacHeaders = []
            for (var headKey in steps[i].interfacHeaders) {
              var value = steps[i].interfacHeaders[headKey]
              if (this.isEmpty(value)) {
                value = ''
              }
              interfacHeaders.push({ headerKey: headKey, headerValue: value })
            }
            this.$set(steps[i], 'interfacHeaders', interfacHeaders)
          }
        }
      }
      return steps
    },
    setGroupCode(values) {
      if (values != null && values.length > 0) {
        this.caseBaseDto.groupCode = values[values.length - 1]
      }
    },
    // 关闭用例值按钮
    valueCloseBtn() {
      this.valueSaveBtn()
    },
    // 打开用例值弹窗
    openCaseValue(index, _row) {
      this.caseValueVisible = true
      this.engineType = _row.engineType
      this.basicFormatId = _row.basicFormatId
      this.caseValueIndex = index
      this.valueStatus = this.caseSteps[this.caseValueIndex].valueStatus
      console.log('valueStatus:' + this.valueStatus)
    },
    // save用例值按钮
    valueSaveBtn() {
      console.log(this.$refs.caseValueChild.paramData.hasUpdValue)
      var interfacForms = this.$refs.caseValueChild.paramData.formKeylist
      var interfacHeaders = this.$refs.caseValueChild.paramData.headerList
      var interfacJson = this.$refs.caseValueChild.paramData.interfacJson
      var hasUpdValue = this.$refs.caseValueChild.paramData.hasUpdValue
      var bodyParamType = this.$refs.caseValueChild.paramData.bodyParamType
      var existQuery = this.$refs.caseValueChild.paramData.existQuery
      var valueShowStatus = this.$refs.caseValueChild.valueShow
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
      if (valueShowStatus) {
        if (bodyParamType === 'FORM') {
          if (interfacForms !== undefined && interfacForms.length > 0) {
            this.$set(this.caseSteps[this.caseValueIndex], 'tempForms', [])
            var names = this.$refs.caseValueChild.$refs.formKeyName
            var values = this.$refs.caseValueChild.$refs.formKeyValue
            for (var i = 0; i < names.length; i++) {
              var value = values[i].$refs.input.value
              if (this.isEmpty(value)) {
                value = ''
              }
              this.caseSteps[this.caseValueIndex].tempForms.push({
                formKey: names[i].value,
                formValue: value
              })
            }
          }
        }
        if (existQuery) {
          this.$set(this.caseSteps[this.caseValueIndex], 'tempQueries', [])
          var queryValues = this.$refs.caseValueChild.$refs.queryKeyValue
          var queryNames = this.$refs.caseValueChild.$refs.queryKeyName
          for (var h = 0; h < queryNames.length; h++) {
            var valueH = queryValues[h].$refs.input.value
            if (this.isEmpty(valueH)) {
              valueH = ''
            }
            this.caseSteps[this.caseValueIndex].tempQueries.push({
              queryKey: queryNames[h].value,
              queryValue: valueH
            })
          }
        }
        this.caseSteps[this.caseValueIndex].interfacHeaders = interfacHeaders
        this.caseSteps[this.caseValueIndex].interfacJson = interfacJson
        this.caseSteps[this.caseValueIndex].hasUpdValue = true
        this.caseSteps[this.caseValueIndex].bodyParamType = bodyParamType
        this.caseSteps[this.caseValueIndex].existQuery = existQuery
        this.caseSteps[this.caseValueIndex].valueStatus = hasUpdValue
      } else {
        this.caseSteps[this.caseValueIndex].hasUpdValue = false
      }

      this.caseValueVisible = false
    },
    saveStepDatas(caseSteps) {
      var stepDatas = []
      for (var i = 0; i < caseSteps.length; i++) {
        var mapData = this.analyzeStep(caseSteps[i], i + 1)
        stepDatas.push(mapData)
      }
      return stepDatas
    },
    analyzeStep(stepCase, execNo) {
      var stepData = stepCase
      var mapData = {}
      if (!this.isEmpty(this.caseBaseDto.id)) {
        mapData['id'] = this.caseBaseDto.id
      }
      if (!this.isEmpty(stepData.basicFormatId)) {
        mapData['basicFormatId'] = stepData.basicFormatId
      }
      if (!this.isEmpty(stepData.existQuery)) {
        mapData['existQuery'] = stepData.existQuery
      }
      if (!this.isEmpty(stepData.bodyParamType)) {
        mapData['bodyParamType'] = stepData.bodyParamType
      }
      if (!this.isEmpty(stepData.engineType)) {
        mapData['engineType'] = stepData.engineType
      }
      if (!this.isEmpty(stepData.formatUrl)) {
        mapData['formatUrl'] = stepData.formatUrl
      }
      if (!this.isEmpty(this.caseBaseDto.caseNo)) {
        mapData['caseNo'] = this.caseBaseDto.caseNo
      }
      if (!this.isEmpty(stepData.engineDesc)) {
        mapData['engineDesc'] = stepData.engineDesc
      }
      if (!this.isEmpty(stepData.basicDesc)) {
        mapData['basicDesc'] = stepData.basicDesc
      }
      mapData['execNo'] = execNo
      if (stepData.hasAssert === true) {
        if (
          !this.isEmpty(stepData.assertResults) &&
          stepData.assertResults.length > 0
        ) {
          var newAssert = this.assertData(stepData.assertResults)
          mapData['assertResults'] = newAssert
        }
      }
      if (stepData.hasUpParam === true) {
        if (
          !this.isEmpty(stepData.uplinkParams) &&
          stepData.uplinkParams.length > 0
        ) {
          mapData['uplinkParams'] = stepData.uplinkParams
        }
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
      mapData['existQuery'] = stepData.existQuery
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
      if (!this.isEmpty(stepData.interfacJson)) {
        mapData['interfacJson'] = stepData.interfacJson
      }
      mapData['hasUpdValue'] = stepData.hasUpdValue
      return mapData
    },
    saveNewSave() {
      var caseSteps = this.saveStepDatas(this.caseSteps)
      this.$emit('saveStepData', { stats: false, data: caseSteps })
    },
    cancelNewSave() {
      this.$emit('cancelStepData')
    },
    assertData(results) {
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
    }
  }
}
</script>
