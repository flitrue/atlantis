<template>
  <el-main>
    <!-- 图表 -->
    <el-row :gutter="32">

      <el-col :xs="24" :sm="24" :lg="8">
        用例成功率
        <div class="chart-wrapper">
          <pie-chart
            :series-name="seriesName"
            :opinion="opinion"
            :opinion-data="opinionData"
            :height="peiHeight"
          />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        step成功率
        <div class="chart-wrapper">
          <pie-chart :series-name="seriesNameStep" :opinion="opinion" :opinion-data="opinionStepData" :height="peiHeight" />
        </div>
      </el-col>
    </el-row>
    <!-- 下拉面板 -->
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item
        v-for="(item, index) in caseList"
        :key="item.caseExecNo"
        :name="index"
      >
        <template slot="title">
          <div style="margin-left:10px;">
            {{ item.caseDesc }}
            <i class="header-icon el-icon-info" />
          </div>
        </template>
        <el-table
          ref="multipleTable"
          v-loading="listLoading"
          :data="item.reportStepList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column align="center" label="序号" prop="id" width="80px">
            <template slot-scope="scope">
              <!--{{ scope.$index+1}}-->
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="Step" min-width="45%">
            <template slot-scope="scope">
              {{ scope.row.httpUrl }}
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="15%">
            <template slot-scope="scope">
              {{ scope.row.remark }}
            </template>
          </el-table-column>
          <el-table-column label="测试类型" min-width="12%" align="center">
            <template slot-scope="scope">
              <template
                v-if="scope.row.engineType === 'DUBBO'"
              >
                Dubbo接口
              </template>
              <template
                v-if="scope.row.engineType === 'INTERFAC'"
              >
                Http接口
              </template>
              <template
                v-if="scope.row.engineType === 'WEB_UI'"
              >
                Web_UI
              </template>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="7%" align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.stepRunStatus === true">
                <i class="el-icon-success" style="color:green" />
              </template>
              <template v-if="scope.row.stepRunStatus === false">
                <i class="el-icon-error" style="color:red" />
              </template>
            </template>
          </el-table-column>
          <el-table-column label="报告详情" min-width="12%" align="center">
            <template slot-scope="scope">
              <!-- 弹出对话框 -->
              <el-button
                type="warning"
                icon="el-icon-view"
                @click="
                  openStepDetail(scope.row.execNo, scope.row.reportCaseId)
                "
              >
                报告详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          :modal="false"
          :visible.sync="showAlertModal"
          title="报告详情"
        >
          <step-detail-dialog
            v-if="showAlertModal"
            :report-no="reportNo"
            :exec-no="execNo"
            :report-case-id="reportCaseId"
          />
        </el-dialog>
      </el-collapse-item>
    </el-collapse>
  </el-main>
</template>

<script>
import { findReportCase } from '@/api/report'
import PieChart from '@/views/dashboard/admin/components/PieChart'
import StepDetailDialog from './StepDetailDialog'
export default {
  components: {
    StepDetailDialog,
    PieChart
  },

  data() {
    return {
      listLoading: true,
      stepActiveName: 'request',
      peiHeight: '330px',
      dialogIndex: '',
      activeNames: [0],
      showAlertModal: false,
      caseList: [],
      opinion: ['成功', '失败'],
      seriesName: '用例成功率',
      seriesNameStep: 'step成功率',
      opinionData: [],
      opinionStepData: [],
      reportNo: this.$route.query.reportNo,
      execNo: undefined,
      reportCaseId: undefined,
      listQuery: {
        reportNo: this.$route.query.reportNo,
        op: this.$route.query.op,
        taskNo: this.$route.query.taskNo
      }
    }
  },
  created() {
    this.listQuery.val = this.reportNo
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      findReportCase(this.listQuery).then(response => {
        if (response.errcode === 0) {
          this.reportNo = response.data.reportNo
          this.listQuery.reportNo = response.data.reportNo
          this.caseList = response.data.caseList
          this.opinionData.push({
            value: response.data.seccessTotal,
            name: '成功'
          })
          this.opinionData.push({
            value: response.data.failTotal,
            name: '失败'
          })
          this.opinionStepData.push({ value: response.data.successCount, name: '成功' })
          this.opinionStepData.push({ value: response.data.failCount, name: '失败' })
        } else {
          var message = response.errmsg
          if (response.data !== null && response.data.message !== '') {
            message = response.data.message
          }
          this.$notify({
            title: '查询异常',
            message: message,
            type: 'warning',
            duration: 3000
          })
        }

        this.listLoading = false
      })
    },
    CloseModal(...data) {
      this.showAlertModal = data[0]
    },
    handleChange(val) {
      console.log(val)
    },
    openStepDetail(execNo, caseId) {
      this.execNo = execNo
      this.reportCaseId = caseId
      this.showAlertModal = true
    }
  }
}
</script>
