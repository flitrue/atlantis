<template>
  <div v-loading="loading" class="dashboard-editor-container">
    <!-- <category ref="category"/> -->
    <panel-group ref="panelGroup" />
    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="caseCountList" :legendData="businessNames"/>
    </el-row> -->
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="32">
        <div class="chart-wrapper">
          用例数统计
          <bar-chart :chart-data="caseCountBar" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import PanelGroup from './components/PanelGroup'
import BarChart from './components/BarChart'
import { getDashboard } from '@/api/dashboard/dashboard'
export default {
  components: {
    PanelGroup,
    BarChart
  },
  data() {
    return {
      loading: false,
      caseCountBar: undefined
    }
  },
  created() {
    this.getDashboard()
  },
  mounted() {},
  methods: {
    getDashboard() {
      this.loading = true
      getDashboard().then(response => {
        if (response.errcode === 0) {
          this.caseCountBar = response.data.caseCountBar
          this.loading = false
        } else {
          var message = response.errmsg
          if (response.data !== null && response.data.message !== '') {
            message = response.data.message
          }
          this.loading = false
          this.$notify({
            title: '查询异常',
            message: message,
            type: 'warning',
            duration: 3000
          })
        }
        this.listLoading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
