<template>
  <div>
    <category style="margin-bottom:10px" @change="getList" />
    <el-form inline size="mini">
      <el-form-item>
        <el-select v-model="query.queryType" @change="getList">
          <el-option label="个人" value="SELF" />
          <el-option label="所属组" value="GROUP" />
          <el-option label="全部" value="ALL" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.reportNo" placeholder="报告编号" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.taskNo" placeholder="任务编号" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.reportName" placeholder="报告名称" />
      </el-form-item>
      <el-form-item v-if="query.queryType !== 'SELF'">
        <GroupSelect v-model="query.groupCode" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
        <el-button
          plain
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete"
          :disabled="!this.reportNos.length"
        >
          删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column
        align="center"
        label="报告编号"
        width="80"
        prop="reportNo"
      >
      </el-table-column>

      <el-table-column align="center" label="任务编号" width="80" prop="taskNo">
      </el-table-column>

      <el-table-column label="报告名称" min-width="400px">
        <template slot-scope="scope">
          <span>{{ scope.row.reportName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务分组" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.groupName }}
        </template>
      </el-table-column>

      <el-table-column label="运行状态" width="120" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.taskRunStatus === true">
            <i class="el-icon-success" style="color:green" />
          </template>
          <template v-if="scope.row.taskRunStatus === false">
            <i class="el-icon-error" style="color:red" />
          </template>
        </template>
      </el-table-column>
      <el-table-column label="测试类型" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.categoryName }}
        </template>
      </el-table-column>
      <el-table-column label="执行人" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.display }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="108"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-tickets"
            @click="showReportList(scope.row.reportNo)"
          >
            报告
          </el-button>
          <!-- <el-button size="mini" type="primary" icon="el-icon-document">克隆</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="query.pageNo"
      :limit.sync="query.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getList, deleteReport } from '@/api/report'
import Pagination from '@/components/Pagination'
import GroupSelect from '@/components/GroupSelect'
import Category from '../homePage/components/category'
import _ from 'lodash'

export default {
  components: {
    Pagination,
    GroupSelect,
    Category
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      reportNo: undefined,
      taskNo: undefined,
      reportName: undefined,
      groupName: undefined,
      taskRunStatus: undefined,
      display: undefined,
      businessTypeTrees: [],
      reportNos: [],
      query: {
        queryType: 'ALL',
        pageNo: 1,
        pageSize: 20,
        reportNo: undefined,
        reportName: undefined,
        // queryType: this.$route.name,
        groupCode: this.$route.meta.groupCode
      }
    }
  },
  computed: {
    categoryCode() {
      return this.$store.getters.selCategory
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.query.categoryCode = this.categoryCode
      getList(this.query).then(response => {
        this.list = response.data.page.result
        this.total = response.data.page.totalItems
        this.businessTypeTrees = response.data.businessTypeTrees
        this.listLoading = false
      })
    },
    handleFilter() {
      this.query.pageNo = 1
      this.getList()
    },
    // 跳转报告列表详情
    showReportList(reportNo) {
      this.$router.push({
        path: '/reports/reportDetailList',
        query: { reportNo: reportNo, op: 'byReportNo', taskNo: '' }
      })
    },

    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.query.order = 'true'
      } else {
        this.query.order = 'false'
      }
      this.handleFilter()
    },
    handleSelectionChange(val) {
      this.reportNos = _.map(val, 'reportNo')
    },
    // 设置groupCode值用于查询
    setGroupCode(values) {
      if (values != null && values.length > 0) {
        this.query.groupCode = values[values.length - 1]
      }
    },
    handleDelete() {
      this.$confirm('确认删除吗？').then(res => {
        deleteReport({ reportNos: this.reportNos }).then(response => {
          if (response.errcode === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.handleFilter()
          }
        })
      })
    }
  }
}
</script>
