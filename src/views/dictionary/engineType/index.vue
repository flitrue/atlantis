<template>
  <div class="app-container">
    <!-- <div class="filter-container">
      <el-input v-model="listQuery.storeName" placeholder="仓库名称" style="width: 200px;" class="filter-item" clearable/>
      <el-input v-model="listQuery.storeAddress" placeholder="仓库地址" style="width: 200px;" class="filter-item" clearable/>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div> -->
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" plain @click="save">新增</el-button>
      <el-dialog :visible.sync="dialogSave" title="新增仓库地址" width="30%">
        <div class="demo-input-suffix">
          测试类型标识：
          <el-input
            v-model="engineType"
            placeholder="请输入测试类型标识"
            clearable/>
          测试类型名称：
          <el-input
            v-model="description"
            placeholder="请输入测试类型名称"
            clearable/>
        </div>
        <div slot="footer" class="filter-container">
          <el-button @click="dialogSave = false">取 消</el-button>
          <el-button type="primary" @click="saveST">确 定</el-button>
        </div>
      </el-dialog>
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

      <el-table-column label="引擎类型">
        <template slot-scope="scope">
          <span>{{ scope.row.engineType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="引擎名称">
        <template slot-scope="scope">
          {{ scope.row.description }}
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
      <el-table-column align="center" prop="created_at" label="创建时间" >
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createTimeDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" type="primary" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
          <!-- <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogEdit" title="编辑仓库地址" width="30%">
      <div class="demo-input-suffix">
        测试类型标识：
        <el-input
          v-model="engineType"
          placeholder="请输入测试类型标识"
          clearable/>
        测试类型名称：
        <el-input
          v-model="description"
          placeholder="请输入测试类型名称"
          clearable/>
      </div>
      <div slot="footer" class="filter-container">
        <el-button @click="dialogEdit = false">取 消</el-button>
        <el-button type="primary" @click="editST">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fachList, save, update } from '@/api/dictionary/engineType'

export default {
  data() {
    return {
      list: null,
      total: 0,
      id: 0,
      listLoading: true,

      listQuery: {
        pageNo: 1,
        pageSize: 20,
        storeName: undefined,
        storeAddress: undefined,
        order: 'false'
      },

      dialogEdit: false,
      dialogSave: false,

      engineType: '',
      description: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fachList(this.listQuery).then(response => {
        console.log('response', response)
        this.list = response.data.data.result
        this.total = response.data.data.totalItems
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
      this.engineType = ''
      this.storeAddress = ''
      this.dialogSave = true
    },
    saveST() {
      const formData = {}
      formData['engineType'] = this.engineType
      formData['description'] = this.description
      save(formData).then(Response => {
        console.log('save', Response)
      })
      this.dialogSave = false
    },
    edit(engineType) {
      this.engineType = engineType.engineType
      this.description = engineType.description
      this.id = engineType.id
      this.dialogEdit = true
    },
    editST() {
      const formData = {}
      formData['engineType'] = this.engineType
      formData['description'] = this.description
      formData['id'] = this.id
      update(formData).then(Response => {
        console.log('update', Response)
      })
      this.dialogEdit = false
    }
  }

}
</script>
