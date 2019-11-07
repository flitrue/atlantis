<template>
  <div class="app-container">
    <el-steps :active="active" finish-status="success">
      <el-step title="基础信息" />
      <el-step title="基础信息详情" />
    </el-steps>
    <el-button style="margin-top: 12px;" @click="back">上一步</el-button>
    <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
    <div
      v-loading="loading"
      v-if="statusCode === 1"
      element-loading-text="拼命加载中"
    >
      <basicDetails
        v-if="getEngType(formDataInfo.engineTypeId) === 'INTERFAC'"
        ref="basicDetailsChild"
        :type-json-options="typeJsonOptions"
        :format-id="formatId"
        :basic-no="basicNo"
        :basic-name="basicName"
        :basic-url="basicUrl"
        :basic-version="basicVersion"
        :form-detail-data="formDetailData"
        :format-detail-func="formatDetailFunc"
      />
      <dubboInfo
        v-if="getEngType(formDataInfo.engineTypeId) === 'DUBBO'"
        :format-id="formatId"
        style="margin-top:10px;"
        :type-json-options="typeJsonOptions"
      />
    </div>
    <div v-if="statusCode === 0">
      <basicInfo
        ref="basicInfoChild"
        :store-type-list="storeTypeList"
        :engine-type-list="engineTypeList"
        :business-type-tree="businessTypeTree"
        :form-data-info="formDataInfo"
        :store-echo="storeEcho"
        :format-detail-func="formatDetailFunc"
      />
    </div>
  </div>
</template>
<script>
import basicInfo from './basicInfo.vue'
import basicDetails from './basicDetail.vue'
import dubboInfo from './dubboInfo.vue'
import { getGroupTree } from '@/api/businessType'
import { fachList } from '@/api/dictionary/engineType'
import { fachAll } from '@/api/dictionary/storeType'
import { foramtInfoEdit, foramtDetail } from '@/api/basic'
export default {
  components: {
    basicInfo,
    basicDetails,
    dubboInfo
  },
  data() {
    return {
      active: 0,
      statusCode: 0,
      loading: false,
      storeTypeList: [],
      engineTypeList: [],
      businessTypeTree: [],
      formatId: '',
      basicNo: '',
      basicName: '',
      basicUrl: '',
      basicVersion: '',
      formatDetailFunc: 'save',
      dubboInfo: {},
      typeJsonOptions: [
        { type: 'STRING', name: 'string' },
        { type: 'INT', name: 'int' },
        { type: 'BOOLEAN', name: 'boolean' },
        { type: 'DATETIME', name: 'dateTime' },
        { type: 'LONG', name: 'Long' },
        { type: 'OBJECT', name: 'object' },
        { type: 'ARRAY', name: 'array' },
        { type: 'FLOAT', name: 'float' },
        { type: 'DOUBLE', name: 'double' }
      ],
      formDataInfo: {
        formatUrl: '',
        id: '',
        urlEnv: '',
        basicDesc: '',
        version: '',
        versionDesc: '',
        engineTypeId: '',
        groupCode: '',
        storeTypeId: '',
        basicNo: '',
        remarks: ''
      },
      formDetailData: {
        id: '',
        basicFormatId: '',
        basicNo: '',
        caseSubMethod: 'POST',
        interfacForms: [],
        interfacQueries: [],
        interfacHeaders: [],
        interfacJson: {},
        bodyParamType: 'JSON',
        existQuery: '',
        remarks: '',
        jsonId: ''
      },
      storeEcho: []
    }
  },
  watch: {
    active: {
      handler(newVal) {
        if (newVal === 0) {
          this.statusCode = 0
        } else if (newVal === 1) {
          this.saveBasicInfo()
        }
      }
    },
    statusCode: {
      handler(newVal) {}
    }
  },
  created() {
    this.businessData()
    this.engineTypeData()
    this.storeTypeData()
    const formatId = this.$route.query.formatId
    console.log('11', formatId)
    if (!formatId) {
      console.log('22')
      this.formatDetailFunc = 'save'
    } else {
      this.formatDetailFunc = 'update'
      const engType = this.$route.query.engineType
      if (engType === 'INTERFAC') {
        this.basicInterfacData(formatId)
      } else if (engType === 'DUBBO') {
        this.basicDubboData(formatId)
      }
    }
  },
  methods: {
    next() {
      if (this.active < 2) {
        this.active++
      }
    },
    back() {
      this.active = 0
    },
    returnForamtDetail() {
      var formData = {}
      formData['basicFormatId'] = this.formatId
      foramtDetail(formData).then(response => {
        if (response.errcode === 0) {
          this.formatId = response.data.formatId
          this.basicNo = response.data.basicNo
        } else {
          this.$notify({
            title: '保存基础系信息失败',
            message: response.errmsg,
            type: 'danger',
            duration: 2000
          })
          // this.list = response.data.page.result
          // this.listLoading = false
        }
      })
    },
    businessData() {
      getGroupTree().then(response => {
        if (response.errcode === 0) {
          this.businessTypeTree = response.data
        }
      })
    },
    storeTypeData() {
      fachAll().then(response => {
        this.storeTypeList = response.data.data.storeTypeList
      })
    },
    engineTypeData() {
      fachList().then(response => {
        this.engineTypeList = response.data.data.result
        if (this.formDataInfo.engineTypeId === '') {
          for (let i = 0; i < this.engineTypeList.length; i++) {
            if (this.engineTypeList[i].engineType === 'INTERFAC') {
              this.formDataInfo.engineTypeId = this.engineTypeList[i].id
            }
          }
        }
      })
    },
    saveBasicInfo() {
      this.active = 0
      if (this.formDataInfo.id === '') {
        this.handleBasicInfo(this.formDataInfo)
      }
      foramtInfoEdit(this.formDataInfo).then(response => {
        if (response.errcode === 0) {
          this.statusCode = 1
          this.active = 2
          if (
            this.formDataInfo.id === '' ||
            this.formDataInfo.id === undefined
          ) {
            this.basicName = this.formDataInfo.basicDesc
            this.basicUrl = this.formDataInfo.formatUrl
            this.basicVersion = this.formDataInfo.version
            this.formatId = response.data.formatId
            this.basicNo = response.data.basicNo
            this.formDataInfo.id = response.data.formatId
            this.formDataInfo.basicNo = response.data.basicNo
          } else {
            this.basicName = this.formDataInfo.basicDesc
            this.basicUrl = this.formDataInfo.formatUrl
            this.basicVersion = this.formDataInfo.version
            this.formatId = this.formDataInfo.id
            this.basicNo = this.formDataInfo.basicNo
          }
        } else if (response.errcode === -1) {
          this.$notify({
            title: '保存基础系信息失败',
            message: response.data.message,
            type: 'danger',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '保存基础系信息失败',
            message: '服务保存失败',
            type: 'danger',
            duration: 2000
          })
        }
      })
    },
    handleBasicInfo(formDataInfo) {
      if (this.getEngType(formDataInfo.engineTypeId) === 'DUBBO') {
        delete formDataInfo.urlEnv
        delete formDataInfo.formatUrl
      }
    },
    basicInterfacData(formatId) {
      const formData = {}
      formData['basicFormatId'] = formatId
      foramtDetail(formData).then(response => {
        if (response.errcode === 0) {
          this.formDataInfo.formatUrl = response.data.basicFormat.formatUrl
          this.formDataInfo.id = response.data.basicFormat.id
          this.formDataInfo.urlEnv = response.data.basicFormat.urlEnv
          this.formDataInfo.basicDesc = response.data.basicFormat.basicDesc
          this.formDataInfo.version = response.data.basicFormat.version
          this.formDataInfo.versionDesc = response.data.basicFormat.versionDesc
          this.formDataInfo.engineTypeId =
            response.data.basicFormat.engineTypeId
          this.formDataInfo.groupCode = response.data.basicFormat.groupCode
          this.formDataInfo.storeTypeId = response.data.basicFormat.storeTypeId
          this.formDataInfo.basicNo = response.data.basicFormat.basicNo
          this.formDataInfo.remarks = response.data.basicFormat.remarks

          this.formDetailData.basicFormatId = response.data.basicFormat.id
          this.formDetailData.basicNo = response.data.basicFormat.basicNo
          this.formDetailData.interfacJson =
            response.data.interfacParamData.interfacJson
          this.formDetailData.interfacForms =
            response.data.interfacParamData.interfacForms
          this.formDetailData.interfacQueries =
            response.data.interfacParamData.interfacQueries
          this.formDetailData.interfacHeaders =
            response.data.interfacParamData.interfacHeaders
          this.formDetailData.jsonId = response.data.interfacParamData.jsonId
          this.formDetailData.remarks = response.data.interfacParamData.remarks
          this.formDetailData.caseSubMethod =
            response.data.interfacParamData.caseSubMethod
          this.formDetailData.id = response.data.interfacParamData.id
          this.writeBack()
        } else {
          this.$notify({
            title: '查询基础信息失败',
            message: response.errmsg,
            type: 'danger',
            duration: 2000
          })
        }
      })
    },
    basicDubboData(formatId) {
      const formData = {}
      formData['basicFormatId'] = formatId
      foramtDetail(formData).then(response => {
        if (response.errcode === 0) {
          this.formDataInfo.id = response.data.basicFormat.id
          this.formDataInfo.formatUrl = response.data.basicFormat.formatUrl
          this.formDataInfo.basicDesc = response.data.basicFormat.basicDesc
          this.formDataInfo.version = response.data.basicFormat.version
          this.formDataInfo.versionDesc = response.data.basicFormat.versionDesc
          this.formDataInfo.engineTypeId =
            response.data.basicFormat.engineTypeId
          this.formDataInfo.groupCode = response.data.basicFormat.groupCode
          this.formDataInfo.storeTypeId = response.data.basicFormat.storeTypeId
          this.formDataInfo.basicNo = response.data.basicFormat.basicNo
          this.formDataInfo.remarks = response.data.basicFormat.remarks
          this.writeBack()
        } else {
          this.$notify({
            title: '查询基础信息失败',
            message: response.errmsg,
            type: 'danger',
            duration: 2000
          })
        }
      })
    },

    writeBack() {
      const back = []
      for (let i = 0; i < this.formDataInfo.groupCode.length / 3; i++) {
        back.push(this.formDataInfo.groupCode.slice(0, (i + 1) * 3))
      }
      this.storeEcho = back
    },
    getEngType(id) {
      for (let i = 0; i < this.engineTypeList.length; i++) {
        if (this.engineTypeList[i].id === id) {
          return this.engineTypeList[i].engineType
        }
      }
    }
  }
}
</script>
