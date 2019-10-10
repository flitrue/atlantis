<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.display" placeholder="姓名" style="width: 200px;" class="filter-item"/>
      <el-input v-model="listQuery.account" placeholder="域账号" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <div class="filter-container">
      <el-button class="filter-item" type="danger" icon="el-icon-delete" plain @click="handleDelete">删除</el-button>
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
      @sort-change="sortChange">
      <el-table-column
        align="center"
        type="selection"
        width="55"/>
      <el-table-column align="center" label="序号" prop="id" sortable="custom" width="80">
        <template slot-scope="scope">
          <!--{{ scope.$index+1}}-->
          {{ scope.$index + (listQuery.pageNo - 1) * listQuery.pageSize + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.display }}</span>
        </template>
      </el-table-column>
      <el-table-column label="域账号" align="center" >
        <template slot-scope="scope">
          {{ scope.row.account }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱">
        <template slot-scope="scope">
          {{ scope.row.mail }}
        </template>
      </el-table-column>

      <el-table-column label="职位" >
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="部门">
        <template slot-scope="scope">
          {{ scope.row.department }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="发布时间">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createTimeDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="primary" icon="el-icon-document">权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"/>

  </div>
</template>

<script>
import { getList, deletedCase } from '@/api/system/user'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      display: undefined,
      account: undefined,
      mail: undefined,
      department: undefined,
      title: undefined,
      createTimeDate: 11,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        display: undefined,
        account: undefined,
        ids: []
      }
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
      for (var i = 0; i < val.length; i++) {
        this.listQuery.ids.push(val[i].id)
      }
    },
    handleDelete() {
      deletedCase(this.listQuery).then(response => {
        // console.log('====:' + response)
        if (response.errcode === 0) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          setTimeout(() => {
            this.handleFilter()
          }, 2 * 1000)
        } else {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'warning',
            duration: 2000
          })
        }
      })
    }

  }
}
</script>
