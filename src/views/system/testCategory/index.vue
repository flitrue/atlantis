<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.categoryName" placeholder="类别名称" style="width: 200px;" class="filter-item" clearable/>
      <el-input v-model="listQuery.categoryCode" placeholder="标识" style="width: 200px;" class="filter-item" clearable/>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <!--<el-select v-model="listQuery.status" :placeholder="listQuery.status" clearable style="width: 150px" class="filter-item">-->
      <!--<el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>-->
      <!--</el-select>-->
    </div>
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" plain @click="dialogFormVisible = true">新增</el-button>
      <!--
      <el-button class="filter-item" type="warning" icon="el-icon-success" plain>生成用例</el-button>
      <el-button class="filter-item" type="warning" icon="el-icon-success" plain>生成任务</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" plain>删除</el-button> -->
      <!-- <el-button class="filter-item" type="primary" @click="handleFilter">修改业务分组</el-button> -->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column
        type="selection"/>
      <el-table-column align="center" label="序号" prop="id" sortable="custom" width="80">
        <template slot-scope="scope">
          {{ scope.$index + (listQuery.pageNo - 1) * listQuery.pageSize + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.categoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标识">
        <template slot-scope="scope">
          {{ scope.row.categoryCode }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center">
        <template slot-scope="scope">
          {{ scope.row.display }}
        </template>
      </el-table-column>
      <!--<el-table-column class-name="status-col" label="状态" width="110" align="center">-->
      <!--<template slot-scope="scope">-->
      <!--<el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" prop="created_at" label="发布时间" >
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createTimeDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" type="primary" icon="el-icon-edit">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="dialogFormVisible" title="测试类别信息" >
      <el-form :model="testCategory" label-width="100px">
        <el-form-item label="类别名称" >
          <el-input v-model="testCategory.categoryName" placeholder="请输入类别名称"/>
        </el-form-item>
        <el-form-item label="类别名称" >
          <el-input v-model="testCategory.categoryCode" placeholder="请输入类别标识"/>
        </el-form-item>
        <el-form-item label="描述" >
          <el-input v-model="testCategory.desc" type="textarea" placeholder="请输入描述"/>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { find, save } from '@/api/system/testCategory'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: { Pagination },

  data() {
    return {
      list: null,
      total: 0,
      id: 0,
      listLoading: true,
      dialogFormVisible: false,
      testCategory: {
        id: undefined,
        categoryName: undefined,
        categoryCode: undefined,
        desc: undefined
      },
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        formatUrl: undefined,
        basicDesc: undefined,
        order: 'false',
        storeTypeId: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      find(this.listQuery).then(response => {
        console.log('SSSS', response)
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
    save() {
      this.listLoading = true
      save(this.testCategory).then(response => {
        if (response.errcode === 0) {
          this.listLoading = false
          this.$notify({
            title: '成功',
            message: '保存成功！',
            type: 'success',
            duration: 3000
          })
          this.cancel()
          this.getList()
        } else {
          var message = response.errmsg
          if (response.data != null && response.data.message !== null) {
            message = response.data.message
          }
          this.listLoading = false
          this.$notify({
            title: '失败',
            message: message,
            type: 'warning',
            duration: 3000
          })
        }
      })
    },
    cancel() {
      this.dialogFormVisible = false
      this.testCategory.id = undefined
      this.testCategory.categoryName = undefined
      this.testCategory.categoryCode = undefined
      this.testCategory.desc = undefined
    }
  }

}
</script>
