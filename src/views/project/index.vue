<template>
  <el-tabs v-model="activePane" class="project-tabs">
    <el-tab-pane label="接口" name="interface">
      <interface v-if="shouldShow('interface')" />
    </el-tab-pane>
    <el-tab-pane label="用例" name="case">
      <case v-if="shouldShow('case')" />
    </el-tab-pane>
    <el-tab-pane label="任务" name="task">
      <task v-if="shouldShow('task')" />
    </el-tab-pane>
    <el-tab-pane label="报告" name="report">
      <report v-if="shouldShow('report')" />
    </el-tab-pane>
    <el-tab-pane label="操作" name="operation">
      <operation v-if="shouldShow('operation')" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Interface from '../interface'
import Case from '../case'
import Task from '../task'
import Report from '../report'
import Operation from '../operation'
import cookies from 'js-cookie'

window.PROJECT_ACTIVE_PANE_CACHE =
  cookies.get('PROJECT_ACTIVE_PANE_CACHE') || 'case'

export default {
  components: {
    Interface,
    Case,
    Task,
    Report,
    Operation
  },
  data() {
    return {
      activePane: window.PROJECT_ACTIVE_PANE_CACHE
    }
  },
  watch: {
    activePane(val) {
      cookies.set('PROJECT_ACTIVE_PANE_CACHE', val)
      window.PROJECT_ACTIVE_PANE_CACHE = val
    }
  },
  created() {},
  methods: {
    shouldShow(name) {
      return this.activePane === name
    }
  }
}
</script>

<style lang="scss">
.project-tabs {
  .el-tabs__item {
    font-size: 16px;
  }
}
</style>
