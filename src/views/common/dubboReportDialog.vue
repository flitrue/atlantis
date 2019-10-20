<template>
  <!-- 弹出对话框 -->
  <el-tabs v-model="stepActiveName" @tab-click="handleClick">
    <el-tab-pane label="请求" name="request">
      <el-container>
        <el-header>URL</el-header>
        <el-main>{{ reportStepDto.httpUrl }}</el-main>
      </el-container>
      <el-container v-if="!!reportStepDto.headers">
        <el-header>Header</el-header>
        <el-main>
          <el-row v-for="(value, key) in reportStepDto.headers" :key="key">
            <el-col
:span="4"
              ><div
                class="grid-content bg-purple-light"
                style="font-weight:bold"
              >
                {{ key }}:
              </div></el-col
            >
            <el-col
:span="20"
              ><div class="grid-content bg-purple-light">
                {{ value }}
              </div></el-col
            >
          </el-row>
        </el-main>
      </el-container>
      <el-container v-if="!!reportStepDto.forms">
        <el-header>Body</el-header>
        <el-main>{{ reportStepDto.forms }}</el-main>
      </el-container>
      <el-container v-if="!!reportStepDto.json">
        <el-header>Body</el-header>
        <el-main>
          <json-viewer
            v-if="reportStepDto.json !== null"
            :value="toJson(reportStepDto.json)"
            :expand-depth="5"
            copyable
            boxed
            sort
          />
        </el-main>
      </el-container>
    </el-tab-pane>
    <el-tab-pane label="返回" name="response">
      <div v-if="!!reportStepDto.runResult">
        <el-container
          v-if="
            reportStepDto.runResult && reportStepDto.runResult.status !== null
          "
        >
          <el-header>Status</el-header>
          <el-main>{{ reportStepDto.runResult.status }}</el-main>
        </el-container>
        <el-container
          v-if="
            reportStepDto.runResult.header !== null &&
              reportStepDto.runResult.header !== undefined
          "
        >
          <el-header>Header</el-header>
          <el-main>
            <el-row
              v-for="(value, key) in reportStepDto.runResult.header"
              :key="key"
            >
              <el-col
:span="4"
                ><div
                  class="grid-content bg-purple-light"
                  style="font-weight:bold"
                >
                  {{ key }}:
                </div></el-col
              >
              <el-col
:span="20"
                ><div class="grid-content bg-purple-light">
                  {{ value }}
                </div></el-col
              >
            </el-row>
          </el-main>
        </el-container>
        <el-container v-if="!!reportStepDto.runResult.body">
          <el-header>Body</el-header>
          <el-main>
            <json-viewer
              v-if="reportStepDto.runResult.body !== null"
              :value="toJson(reportStepDto.runResult.body)"
              :expand-depth="5"
              copyable
              boxed
              sort
            />
          </el-main>
        </el-container>
      </div>
      <div v-if="!!reportStepDto.runResult === false">
        信息异常
      </div>
    </el-tab-pane>
    <el-tab-pane label="验证结果" name="result">
      <el-container>
        <el-header>测试结果</el-header>
        <el-main>
          <template
v-if="reportStepDto.stepRunStatus === true"
            ><i
class="el-icon-success"
style="color:green"
          /></template>
          <template
v-if="reportStepDto.stepRunStatus === false"
            ><i
class="el-icon-error"
style="color:red"
          /></template>
        </el-main>
      </el-container>
      <el-container
        v-if="
          reportStepDto.runResult.runtime !== null ||
            reportStepDto.runResult.runtime !== undefined
        "
      >
        <el-header>运行时长</el-header>
        <el-main>{{ reportStepDto.runResult.runtime }}(毫秒)</el-main>
      </el-container>
      <el-container
        v-if="
          !!reportStepDto.assertResults &&
            reportStepDto.assertResults.length > 0
        "
      >
        <el-header>断言结果</el-header>
        <el-main>
          <el-row
            v-for="(item, index) in reportStepDto.assertResults"
            :key="index"
          >
            <el-col :span="24">
              <span
                v-if="item.assertRelust !== null"
                class="grid-content bg-purple-light"
              >
                <template
v-if="item.assertRelust === 'SUCCESS'"
                  ><i
class="el-icon-success"
style="color:green"
                /></template>
                <template
v-if="item.assertRelust === 'FAIL'"
                  ><i
class="el-icon-error"
style="color:red"
                /></template>
              </span>
              <span
                v-if="item.assertSite !== null"
                class="grid-content bg-purple-light"
              >
                {{ item.assertSite }}：
              </span>
              <span
                v-if="item.statusCode !== null"
                class="grid-content bg-purple-light"
              >
                {{ item.statusCode }}
              </span>
              <span v-if="!!item.assertDict">
                {{ item.assertDict }}
              </span>

              <div
                v-if="!!item.jsonSchema"
                class="grid-content bg-purple-light"
              >
                {{ item.jsonSchema }}
              </div>
              <div v-if="!!item.json" class="grid-content bg-purple-light">
                {{ item.json }}
              </div>
              <div
                v-if="!!item.assertErrorInfo"
                class="grid-content bg-purple-light"
              >
                失败原因：{{ item.assertErrorInfo }}
              </div>
              <div
                v-if="!!item.assertDesc"
                class="grid-content bg-purple-light"
              >
                断言描述：{{ item.assertDesc }}
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-tab-pane>
  </el-tabs>
  <!-- <el-button type="warning" icon="el-icon-view" @click=" showThis = false">报告详情</el-button> -->
</template>

<script>
import { toJson } from '@/utils/atlantis'
import JsonViewer from 'vue-json-viewer'
export default {
  components: {
    JsonViewer
  },
  props: {
    reportNo: {
      type: String,
      default: ''
    },
    execNo: {
      type: Number,
      default: 0
    },
    reportCaseId: {
      type: String,
      default: ''
    },
    reportStepDto: {
      type: Object,
      default: Object
    }
  },
  data() {
    return {
      listLoading: false,
      stepActiveName: 'request'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    toJson(value) {
      return toJson(value)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-header,
.el-footer {
  color: rgb(17, 17, 17);
  text-align: center;
  font-size: 16px;
  font-style: oblique;
  line-height: 60px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: left;
  line-height: 20px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple-dark2 {
  background: #f2f6fc;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
