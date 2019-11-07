<template>
  <div>
    <el-card class="box-card card-bottom">
      <div slot="header" class="clearfix">
        <span style="font-size: 23px;">基本设置</span>
      </div>
      <div class="text item">
        <el-form :model="basicFormat" label-width="100px" class="demo-ruleForm">
          <el-form-item label="接口名称" prop="caseName">
            <el-input
              :disabled="true"
              v-model="basicFormat.basicDesc"
              style="width: 50%"
            />
          </el-form-item>
          <el-form-item label="接口URL" prop="caseDesc">
            <el-input
              :disabled="true"
              v-model="basicFormat.formatUrl"
              style="width: 50%"
            />
          </el-form-item>
          <el-form-item label="接口版本" prop="caseDesc">
            <el-input
              :disabled="true"
              v-model="basicFormat.version"
              style="width: 50%"
            />
          </el-form-item>
        </el-form>
        <el-form
          :model="params"
          :rules="rule"
          ref="basicFormatForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="注册中心">
            <el-radio-group
              @change="handleZkAddressChange"
              style="width: 100%"
              v-model="params.zkAddress"
            >
              <el-radio
label="zookeeper://10.2.3.45:2181"
                >dev -- 10.2.3.45:2181</el-radio
              >
              <el-radio
label="zookeeper://172.16.81.70:2181"
                >test -- 172.16.81.70:2181</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="消费者版本">
            <el-input
              v-model="params.consVersion"
              clearable
              placeholder="请输入消费者version"
              @change="versionChange"
              style="width: 50%"
            />
          </el-form-item>
          <el-form-item label="提供者环境" prop="provGroup">
            <el-select
              v-model="params.provGroup"
              placeholder="选择提供者环境"
              style="width: 50%;"
              @change="groupChange"
            >
              <el-option label="fvt" value="fvt" />
              <el-option label="t1Group" value="t1Group" />
              <el-option label="t2Group" value="t2Group" />
            </el-select>
          </el-form-item>
          <el-form-item label="接口名称" prop="interfacPath">
            <el-autocomplete
              class="inline-input"
              v-model="params.interfacPath"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              :trigger-on-focus="false"
              style="width: 50%"
            ></el-autocomplete>
            <!-- <el-select
              v-model="params.interfacPath"
              filterable
              placeholder="接口名称"
              @change="handleInterfacPathChange"
              style="width: 50%"
            >
              <el-option
                v-for="item in interfaceOptions"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="方法名称" prop="methodName">
            <el-autocomplete
              class="inline-input"
              v-model="params.methodName"
              :fetch-suggestions="queryMethodSearch"
              placeholder="请输入内容"
              :trigger-on-focus="false"
              style="width: 50%"
            ></el-autocomplete>
            <!-- <el-select
              v-model="params.methodName"
              filterable
              placeholder="方法名称"
              @change="handleInterfacPathChange"
              style="width: 50%"
            >
              <el-option
                v-for="item in funcOptions"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              >
              </el-option> -->
            <!-- </el-select> -->
          </el-form-item>
          <el-form-item label="参数类型" prop="paramTypesString">
            <el-input
              v-model="params.paramTypesString"
              clearable
              placeholder="多个参数类型以英文分号分隔。"
              style="width: 50%"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card card-bottom">
      <el-tabs v-model="activeName">
        <el-tab-pane label="Body" name="body">
          <div style="margin-top: 20px">
            <div class="custom-tree-container">
              <div class="block">
                <jsonDialog ref="paramExample" />
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="query" label="Query">
          <div class="filter-container">
            <el-button
              type="primary"
              size="middle"
              icon="el-icon-plus"
              plain
              @click="addDataQuery"
              >增 加</el-button
            >
          </div>
          <div v-for="(item, index) in itemsQuery" :key="index">
            <div class="format-param">
              <el-input
                v-model="item.keyName"
                style="width: 200px;"
                class="filter-item"
                placeholder="名称"
              />
              <el-select
                v-model="item.keyType"
                style="width: 130px;"
                class="filter-item"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="itemType in typeJsonOptions"
                  :key="itemType.type"
                  :label="itemType.name"
                  :value="itemType.type"
                />
              </el-select>
              <el-checkbox v-model="item.required" />
              <el-input
                v-model="item.remarks"
                style="width: 200px;"
                class="filter-item"
                placeholder="备注"
              />
              <el-button
                type="danger"
                class="filter-item"
                size="middle"
                icon="el-icon-delete"
                plain
                @click="delDataQuery(index)"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <div style="margin-top:36px;margin-bottom: 36px" align="center">
      <el-button
class="filter-item"
type="primary"
@click="basicFormatREditBtn"
        >立即创建</el-button
      >
      <el-button class="filter-item" @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script>
import jsonDialog from '../common/importJson.vue'
import {
  update,
  find,
  save,
  getDubboService,
  getServiceProvider,
  getFormatRService
} from '@/api/dubbo'
import { get } from 'lodash'
export default {
  components: {
    jsonDialog
  },
  props: {
    formatDetailFunc: {
      type: String,
      default: ''
    },
    typeJsonOptions: {
      type: Array,
      required: true
    },
    formatId: {
      type: String,
      default: ''
    },
    basicNo: {
      type: String,
      default: ''
    },
    basicName: {
      type: String,
      default: ''
    },
    basicUrl: {
      type: String,
      default: ''
    },
    basicVersion: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dropListType: {
        INTERFACEPATH: 'INTERFACEPATH',
        METHODNAME: 'METHODNAME',
        PROVIDERNAME: 'PROVIDERNAME',
        PARAMEXAMPLE: 'PARAMEXAMPLE'
      },
      message: {
        0: 'success',
        1: '请求头参数内容缺失',
        2: 'query参数内容缺失',
        3: 'form参数内容缺失',
        4: 'json参数内容缺失'
      },
      activeName: 'body',
      radio: 'JSON',
      screenWidth: document.body.clientWidth,
      widthx: {
        keyNameWidth: 0,
        keyTypeWidth: 120,
        checkboxWidth: 20,
        remarkWidth: 150,
        operateWidth: 200,
        size: 100
      },
      params: {
        id: undefined,
        basicFormatId: this.formatId,
        zkAddress: 'zookeeper://10.2.3.45:2181',
        provGroup: '',
        consVersion: undefined,
        providerName: undefined,
        interfacPath: undefined,
        methodName: undefined,
        paramTypes: [],
        paramTypesString: '',
        parameter: undefined,
        paramExample: undefined,
        jsonSchema: undefined,
        remarks: undefined,
        dropListType: undefined
      },
      basicFormat: {
        basicNo: undefined,
        formatUrl: undefined,
        basicDesc: undefined,
        version: undefined
      },
      rule: {
        interfacPath: [
          { required: true, message: '请输入接口名称', trigger: 'blur' }
        ],
        methodName: [
          { required: true, message: '请输入方法名称', trigger: 'blur' }
        ]
      },
      itemsQuery: [],
      interfaceOptions: [],
      funcOptions: []
    }
  },
  watch: {
    screenWidth(val) {
      if (val > 1900) {
        this.widthx.keyNameWidth = 100
        this.widthx.keyTypeWidth = 210
        this.widthx.checkboxWidth = 20
        this.widthx.remarkWidth = 230
        this.widthx.operateWidth = 300
        this.widthx.size = 80
      } else {
        this.widthx.keyNameWidth = 0
        this.widthx.keyTypeWidth = 110
        this.widthx.checkboxWidth = 20
        this.widthx.remarkWidth = 130
        this.widthx.operateWidth = 200
        this.widthx.size = 100
      }
      this.screenWidth = val
    },
    widthx(newval) {}
  },
  created() {
    this.findDubbo()
  },
  // 获取页面分辨率
  mounted() {
    const that = this
    window.onresize = () => {
      return () => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      }
    }
  },
  methods: {
    querySearch(queryString, cb) {
      var results = queryString
        ? this.interfaceOptions.filter(this.createFilter(queryString))
        : this.interfaceOptions
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    queryMethodSearch(queryString, cb) {
      var results = queryString
        ? this.funcOptions.filter(this.createFilter(queryString))
        : this.funcOptions
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
        )
      }
    },
    handleZkAddressChange(v) {
      this.getInterfaceOptions()
    },
    handleInterfacPathChange(v) {
      this.getFuncOptions()
    },
    formatJsonStr(params) {
      const json = this.toJson(params)
      if (typeof json === 'object') return JSON.stringify(json, null, 2)
      if (typeof json === 'string') return json
    },
    toJson(value) {
      try {
        var json = JSON.parse(value)
        return json
      } catch (exception) {
        return value
      }
    },
    findDubbo() {
      this.loading = true
      find({ basicFormatId: this.formatId }).then(response => {
        if (response.errcode === 0) {
          this.params.paramTypesString = ''
          if (response.data.basicFormat !== null) {
            this.basicFormat = response.data.basicFormat
          }
          if (response.data.hasDubboFormatR === true) {
            this.params = response.data.dubboFormatR
            this.params.paramTypesString = Array.isArray(this.params.paramTypes)
              ? this.params.paramTypes.join(';')
              : ''
            this.params.createTimeDate = undefined
            this.itemsQuery =
              get(response, 'data.dubboFormatR.interfacQueries', []) || []
            this.$refs.paramExample.json = this.formatJsonStr(
              this.params.paramExample
            )
          }
          // 给zk赋值
          this.params.zkAddress = this.params.zkAddress
            ? this.params.zkAddress
            : 'zookeeper://10.2.3.45:2181'
          // 获取接口候选项
          this.handleZkAddressChange()
          // 获取方法候选项
          if (this.params.interfacPath) {
            this.handleInterfacPathChange()
          }
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
      })
    },
    async getInterfaceOptions() {
      const zkAddr = this.params.zkAddress.replace('zookeeper://', '')
      try {
        const formatRServiceResult = await getFormatRService({ zkAddr })
        if (formatRServiceResult.errcode === 0) {
          const data = formatRServiceResult.data || []
          this.interfaceOptions = data.map((el, idx) => ({
            key: `${el}_${idx}`,
            label: el,
            value: el
          }))
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getFuncOptions() {
      const zkAddr = this.params.zkAddress.replace('zookeeper://', '')
      const serviceName = this.params.interfacPath
      try {
        const formatRServiceResult = await getServiceProvider({
          zkAddr,
          serviceName
        })
        if (formatRServiceResult.errcode === 0) {
          const data = formatRServiceResult.data || []
          data.forEach((el, idx) => {
            const methods = el.methods || ''
            methods.split(',').forEach((method, index) => {
              this.funcOptions.push({
                key: `${method}_${idx}_${index}`,
                methodName: method,
                label: method,
                value: method
              })
            })
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    groupChange() {
      this.params.dropListType = this.dropListType.INTERFACEPATH
      this.loading = true
      getDubboService(this.params).then(response => {
        if (response.errcode === 0) {
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
      })
    },
    versionChange() {
      this.groupChange()
    },
    basicFormatREditBtn() {
      this.$refs['basicFormatForm'].validate(valid => {
        if (valid) {
          if (!this.formatId) {
            this.formatDetailFunc = 'save'
          }
          this.loading = true
          const { paramTypesString, ...otherParams } = this.params
          otherParams.paramTypes = paramTypesString.split(';')
          const paramExample = this.$refs.paramExample.json
          if (otherParams.id) {
            update({
              ...otherParams,
              paramExample,
              interfacQueries: this.itemsQuery
            }).then(response => {
              this.saveReturn(response)
            })
          } else {
            save({
              ...otherParams,
              paramExample,
              interfacQueries: this.itemsQuery
            }).then(response => {
              this.saveReturn(response)
            })
          }
        } else {
          return false
        }
      })
    },
    saveReturn(response) {
      if (response.errcode === 0) {
        this.loading = false
        this.$router.go(-1)
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
    },
    cancel() {
      this.$router.back()
    },
    //  add assertData
    addDataQuery: function() {
      this.itemsQuery.push({
        keyName: '',
        keyType: '',
        remarks: '',
        required: 'false'
      })
    },
    // delete assertData
    delDataQuery: function(index) {
      //  not allow to delete the first
      const x = this.itemsQuery.slice()
      x.splice(index, 1)
      this.itemsQuery = x
    }
  }
}
</script>
<style>
.card-bottom {
  margin-bottom: 10px;
}

.format-param {
  margin-bottom: 10px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-tree-node__content {
  padding-bottom: 20px;
  padding-top: 20px;
}
</style>
