<template>
  <div style="padding: 0px;padding-bottom: 20px">
    <el-tabs
      v-show="valueShow"
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
    >
      <el-tab-pane v-if="dataType == 'DUBBO'" label="dubbo 参数" name="dubbo">
        <div v-if="paramData != null" class="pane-param">
          <el-input
            v-model="paramData.interfacJson"
            style="width: 90%;padding-left: 10px;"
            rows="11"
            type="textarea"
            placeholder="dubbo参数"
          />
        </div>
        <div v-else="">
          <span>该用例无结构化参数</span>
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-if="dataType === 'INTERFAC' && paramData.bodyParamType === 'FORM'"
        label="form 参数"
        name="form"
      >
        <div
          v-if="
            paramData.tempForms !== undefined && paramData.tempForms.length > 0
          "
          class="pane-param"
        >
          <div
            v-for="(item, index) in paramData.tempForms"
            :key="index"
            class="pane-param-el"
          >
            <el-input
              ref="formKeyName"
              v-model="item.formKey"
              size="medium"
              style="width: 45%;"
              placeholder="form参数名"
            />
            <el-input
              ref="formKeyValue"
              v-model="item.formValue"
              size="medium"
              style="width: 45%;"
              placeholder="参数值"
            />
          </div>
        </div>
        <div v-else="" class="pane-param">
          <div
            v-for="(item, index) in paramData.formKeylist"
            :key="item"
            class="pane-param-el"
          >
            <el-input
              ref="formKeyName"
              v-model="paramData.formKeylist[index]"
              size="medium"
              style="width: 45%;"
              placeholder="form参数名"
            />
            <el-input
              ref="formKeyValue"
              size="medium"
              style="width: 45%;"
              placeholder="参数值"
            />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-if="dataType === 'INTERFAC' && paramData.bodyParamType === 'JSON'"
        label="json 参数"
        name="json"
      >
        <div class="pane-param">
          <el-input
            v-model="paramData.interfacJson"
            rows="10"
            style="width: 100%;"
            type="textarea"
            placeholder="json 参数"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-if="paramData.existQuery == true || paramData.existQuery == 'true'"
        label="query 参数"
        name="query"
      >
        <div
          v-if="
            paramData.tempQueries != undefined &&
              paramData.tempQueries.length > 0
          "
          class="pane-param"
        >
          <div
            v-for="(item, index) in paramData.tempQueries"
            :key="index"
            class="pane-param-el"
          >
            <el-input
              ref="queryKeyName"
              v-model="item.queryKey"
              size="medium"
              class="queryKeyName"
              style="width: 45%;"
              placeholder="query参数名"
            />
            <el-input
              ref="queryKeyValue"
              v-model="item.queryValue"
              size="medium"
              class="queryValueName"
              style="width: 45%;"
              placeholder="参数值"
            />
          </div>
        </div>
        <div v-else="" class="pane-param">
          <div
            v-for="(item, index) in paramData.queryKeylist"
            :key="index"
            class="pane-param-el"
          >
            <el-input
              ref="queryKeyName"
              v-model="paramData.queryKeylist[index]"
              size="medium"
              class="queryKeyName"
              style="width: 45%;"
              placeholder="query参数名"
            />
            <el-input
              ref="queryKeyValue"
              size="medium"
              class="queryValueName"
              style="width: 45%;"
              placeholder="参数值"
            />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-if="
          dataType == 'INTERFAC' &&
            Array.isArray(paramData.headerList) &&
            paramData.headerList.length
        "
        label="header 参数"
        name="header"
      >
        <div class="pane-param">
          <div
            v-for="(item, index) in paramData.headerList"
            :key="index"
            class="pane-param-el"
          >
            <el-input
              v-model="item.headerKey"
              size="medium"
              style="width: 45%;"
              placeholder="header参数名"
            />
            <el-input
              v-model="item.headerValue"
              size="medium"
              style="width: 45%;"
              placeholder="参数值"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-show="!valueShow" type="card">
      <span>该用例无结构化参数</span>
    </el-tabs>
  </div>
</template>
<style>
.pane-param {
  padding-left: 10px;
}

.pane-param-el {
  padding-bottom: 10px;
}
</style>
<script>
import { getParamData, getDubboParamData } from '@/api/case'

export default {
  props: {
    basicFormatId: {
      type: String,
      required: true,
      default: ''
    },
    // 判断是否为第一次编辑
    valueStatus: {
      type: Boolean,
      default: false
    },
    engineType: {
      type: String,
      default: ''
    },
    caseStep: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      paramData: {
        bodyParamType: '',
        existQuery: false,
        headerList: [],
        formKeylist: [],
        interfacJson: '',
        paramExample: '',
        queryKeylist: [],
        tempForms: [],
        tempQueries: [],
        hasUpdValue: this.valueStatus
      },
      valueShow: true,
      activeName: 'form',
      dataType: this.engineType,
      queryList: {
        basicFormatId: this.basicFormatId
      }
    }
  },
  watch: {
    basicFormatId: function(newVal) {
      this.queryList.basicFormatId = newVal
      this.hasUpdValue = true
      console.log(this.paramData.hasUpdValue)
    },
    caseStep: {
      handler(newV) {
        this.tempForms = newV.tempForms
        this.tempQueries = newV.tempQueries
        _.extend(this.paramData, newV)
      },
      deep: true
    }
  },
  created() {
    this.getParamValue()
  },
  methods: {
    getParamValue() {
      var type = this.dataType

      if (type === 'INTERFAC') {
        if (this.valueStatus) {
          this.valueShow = true
          _.extend(this.paramData, this.caseStep)
          this.paramData.headerList = this.caseStep.interfacHeaders
          this.paramData.interfacJson = this.formatJsonStr(
            this.paramData.interfacJson
          )

          this.tabShowValid(false)
        } else {
          getParamData({
            ...this.queryList,
            needPlaceHolder: this.caseStep.paramType === 'placeholder'
          }).then(response => {
            if (response.errcode === 0) {
              this.valueShow = true
              _.extend(this.paramData, response.data)
              this.$set(this.paramData, 'hasUpdValue', true)
              console.log(this.paramData.hasUpdValue)
              this.tabShowValid(false)
            } else {
              this.valueShow = false
            }
          })
        }
      } else if (type === 'DUBBO') {
        if (this.valueStatus) {
          this.valueShow = true
          _.extend(this.paramData, this.caseStep)
          this.paramData.interfacJson = this.formatJsonStr(
            this.paramData.interfacJson
          )
          // this.paramData.paramExample = this.formatJsonStr(
          //   this.paramData.paramExample
          // )
          this.tabShowValid(false)
        } else {
          getDubboParamData(this.queryList).then(response => {
            if (response.errcode === 0) {
              this.valueShow = true
              const { hasDubboFormatR, dubboFormatR = {}} = response.data || {}
              if (hasDubboFormatR) {
                const tempQueries = []
                if (dubboFormatR.existQuery) {
                  _.map(dubboFormatR.interfacQueries, (val, key) => {
                    tempQueries.push({
                      queryKey: val.keyName,
                      queryValue: ''
                    })
                  })
                }
                this.paramData.tempQueries = tempQueries
                _.extend(
                  this.paramData,
                  this.dubboParam(response.data.dubboFormatR)
                )
                this.$set(this.paramData, 'hasUpdValue', false)
              }
              this.tabShowValid(false)
            } else {
              this.valueShow = false
            }
          })
        }
      }
      return Promise.resolve(/* 这里是需要返回的数据*/)
    },
    dubboParam(data) {
      if (data !== null && data !== '' && data !== undefined) {
        const paramExp = data.paramExample
        if (paramExp !== null && paramExp !== '' && paramExp !== undefined) {
          var formatParamExp = this.formatJsonStr(paramExp)
          this.$set(data, 'paramExample', formatParamExp)
          this.$set(data, 'interfacJson', formatParamExp)
        } else {
          this.$set(data, 'paramExample', '')
          this.$set(data, 'interfacJson', '')
        }
      }

      return data
    },
    tabShowValid(actionStatus) {
      //        var actionStatus = false
      if (this.dataType === 'INTERFAC') {
        if (this.paramData.bodyParamType === 'FORM' && actionStatus === false) {
          actionStatus = true
          this.activeName = 'form'
        } else if (
          this.paramData.bodyParamType === 'JSON' &&
          actionStatus === false
        ) {
          actionStatus = true
          this.activeName = 'json'
        } else if (
          this.paramData.existQuery === true &&
          actionStatus === false
        ) {
          actionStatus = true
          this.activeName = 'query'
        } else {
          actionStatus = true
          this.activeName = 'header'
        }
      } else {
        this.activeName = 'dubbo'
      }
    },
    handleClick(tab, event) {
      console.log(tab, event)
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
    }
  }
}
</script>
