<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.caseNo"
        placeholder="编号"
        style="width: 200px;"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.caseName"
        placeholder="名称"
        style="width: 200px;"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.display"
        placeholder="创建人"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button
      >
    </div>

    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        align="center"
        label="序号"
        prop="id"
        sortable="custom"
        width="80"
      >
        <template slot-scope="scope">
          <!--{{ scope.$index+1}}-->
          {{ scope.$index + (listQuery.pageNo - 1) * listQuery.pageSize + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="名称" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.caseName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="编号" width="60">
        <template slot-scope="scope">{{ scope.row.caseNo }}</template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">{{ scope.row.caseDesc }}</template>
      </el-table-column>
      <!--<el-table-column label="测试类型" width="110" align="center">-->
      <!--<template slot-scope="scope">-->
      <!--{{ scope.row.engineTypeName }}-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="业务分组" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.businessTypeName }}</template>
      </el-table-column>
      <el-table-column label="创建人" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.display }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="发布时间"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTimeDate }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getList } from '@/api/case'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  props: {
    groupCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      caseNo: undefined,
      caseName: undefined,
      caseDesc: undefined,
      businessTypeName: undefined,
      engineTypeName: undefined,
      display: undefined,
      createTimeDate: 11,
      selectCases: [],
      listQuery: {
        pageNo: 1,
        groupCode: this.groupCode,
        pageSize: 20,
        caseNo: undefined,
        caseName: undefined,
        display: undefined,
        ids: []
      }
    }
  },
  watch: {
    $route(val) {
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.result
        this.total = response.data.totalItems
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.order = 'false'
      } else {
        this.listQuery.order = 'true'
      }
      this.handleFilter()
    },
    handleSelectionChange(val) {
      this.selectCases = val
      //      for (var i = 0; i < val.length; i++) {
      //        this.listQuery.ids.push(val[i].id)
      //      }
    }
  }
}
</script>
