<template>
  <div class="app-container" >
    <el-card class="box-card" style="width:750px;">
      <div slot="header" class="clearfix">
        <span>高级参数设置</span>
      </div>
      <div>
        <el-scrollbar>
          <el-container style="border: 1px solid #eee">
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
              <el-menu
                v-for="(values,key) in dataFormats"
                :key="key"
                class="el-menu-vertical-demo"
                text-color="#3C3C3C"
                active-text-color="#2894FF"
                @open="handleOpen"
                @close="handleClose">
                <el-submenu :index="key">
                  <template slot="title">
                    <i class="el-icon-menu"/>
                    <span>{{ funcKeyName[key] }}</span>
                  </template>
                  <div
                    v-for="item in values"
                    :key="item">
                    <el-menu-item
                      :index="key+'-'+item"
                      @click="getFunc(key,item)">
                      {{ funcKeyName[item] }}
                    </el-menu-item>
                  </div>
                </el-submenu>
              </el-menu>
            </el-aside>
            <div v-if="dataFormatKey === 'dataTypePreset'">
              <el-container width="550px">
                <el-main>
                  <div
                    v-for="(value,index) in func"
                    :key="index">
                    <el-radio v-model="funcValue" :label="value" style="width:150px;" border>{{ funcKeyName[value] }}</el-radio>
                  </div>
                </el-main>
              </el-container>
            </div>
            <div v-if="dataFormatKey === 'dataFormatCustom'">
              <el-container>
                <el-main>
                  <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addGlobal">新增</el-button>
                  <div
                    v-for="(value,index) in func"
                    :key="index"
                    class="format-param">
                    <div class="format-param">
                      <el-input
                        v-if="value.id != undefined"
                        :disabled="true"
                        v-model="value.variableKey"
                        class="filter-item"
                        style="width: 150px;"/>
                      <el-input
                        v-if="value.id === undefined"
                        v-model="value.variableKey"
                        class="filter-item"
                        style="width: 150px;"/>
                      <el-input
                        v-model="value.variableValue"
                        class="filter-item"
                        style="width: 150px;"/>
                      <el-button type="success" icon="el-icon-check" @click="gerateGlobal('CUSTOM','GVARIABLE',value,index)"/>
                      <el-button type="danger" class="filter-item" size="middle" icon="el-icon-delete" plain @click="delGlobal(index,value)"/>
                    </div>
                  </div>
                </el-main>
              </el-container>
            </div>
            <div v-if="dataFormatKey === 'dataTypePreset' && funcValue != ''">
              <el-container>
                <el-main>
                  <div
                    v-for="(value,index) in dataProcesMap[funcValue]"
                    :key="index">
                    <el-radio v-model="funcHandle" :label="value" style="width:120px;" border>{{ funcKeyName[value] }}</el-radio>
                  </div>
                </el-main>
              </el-container>
            </div>
          </el-container>
        </el-scrollbar>
      </div>
    </el-card>
    <el-card style="width:750px;">
      表达式：{{ expression }}
    </el-card>
  </div>
</template>
<script>
import { mockFunc, globalDataEdit, globalDataDel } from '@/api/case'
export default {
  data() {
    return {
      globalVariables: [],
      dataCustomMap: [],
      dataFormats: [],
      dataProcesMap: [],
      dataContentMap: [],
      func: [],
      funcHandle: '',
      funcValue: '',
      expression: '',
      dataFormatKey: '',
      funcKey: '',
      funcKeyName: {
        dataFormatCustom: '自定义',
        dataTypePreset: 'MOCK',
        STRING: '字符串',
        ARRAY: '数组',
        CUSTOM: '自定义变量',
        NOW: '当前时间',
        NOWNEXT: '当前时间下一天',
        INT: '整型',
        FLOAT: '浮点型',
        MD5: 'MD5加密'
      },
      modelRule: {
        NOW: 'yyyy-MM-dd HH:mm:ss',
        NOWNEXT: 'yyyy-MM-dd HH:mm:ss',
        INT: '1-9',
        FLOAT: '1-9,1-9'
      }
    }
  },
  watch: {
    funcValue: {
      handler(newVal) {
        if (newVal !== '') {
          this.expression = `$BEFORE()${this.funcKey}(@${newVal}(${this.modelRule[newVal]}))$`
        } else {
          this.expression = ''
        }
        console.log(this.expression)
        this.funcHandle = ''
      }
    },
    funcHandle: {
      handler(newVal) {
        if (newVal !== '') {
          this.expression = `$BEFORE()${this.funcKey}(@${this.funcValue}(${this.modelRule[this.funcValue]})|@${newVal})$`
          console.log(this.expression)
        }
      }
    }
  },
  created() {
    this.analysisMockFunc()
  },

  methods: {
    analysisMockFunc() {
      mockFunc().then(Response => {
        if (Response.errcode === 0) {
          this.globalVariables = Response.data.globalVariables
          this.dataCustomMap = Response.data.dataCustomMap
          this.dataFormats = Response.data.dataFormats
          this.dataProcesMap = JSON.parse(Response.data.dataProcesMap)
          this.dataContentMap = Response.data.dataContentMap
        }
      })
    },
    getFunc(key, item) {
      if (key === 'dataTypePreset') {
        this.func = this.dataContentMap['CUSTOM']
      } else if (key === 'dataFormatCustom') {
        this.func = this.globalVariables
      }
      this.dataFormatKey = key
      this.funcKey = item
      this.funcHandle = ''
      this.funcValue = ''
    },
    gerateGlobal(funcKey, funcValue, global, index) {
      console.log('global', global)
      const formData = {}
      if (global.variableKey === '') {
        this.$message({
          showClose: true,
          message: `第${index + 1}行自定义变量KEY不能为空`,
          type: 'error'
        })
        return
      }
      formData['variableKey'] = global.variableKey
      formData['variableValue'] = global.variableValue
      globalDataEdit(formData).then(Response => {
        if (Response.errcode === 0) {
          this.funcKey = funcKey
          this.expression = `$BEFORE()${funcKey}(@${funcValue}(${global.variableKey}))$`
          console.log('expression', this.expression)
        }
      })
    },
    addGlobal() {
      this.func.push(
        { 'variableKey': '', 'variableValue': '' }
      )
      console.log(this.itemsForm, 'aaaa')
    },
    delGlobal: function(index, gloal) {
      console.log('index', index)
      // not allow to delete the first
      const x = this.func.slice()
      x.splice(index, 1)
      this.func = x
      const formData = {}
      formData['variableKey'] = global.variableKey
      globalDataDel(formData).then(Response => {
        if (Response.errcode === 0) {
          this.$message({
            showClose: true,
            message: `删除自定义变量${gloal.variableKey}成功`,
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: `删除自定义变量${gloal.variableKey}失败`,
            type: 'error'
          })
        }
      })
    },
    handleOpen(key, keyPath) {
    },
    handleClose(key, keyPath) {
    }
  }
}
</script>

<style>
  .el-header {
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>
