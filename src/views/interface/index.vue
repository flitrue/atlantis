<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-form-item>
        <el-input v-model="listQuery.formatUrl" clearable placeholder="URL" />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.basicDesc"
          clearable
          placeholder="基础数据名称"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.basicNo"
          placeholder="接口编号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.display" placeholder="创建人" clearable />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.storeTypeId"
          filterable
          clearable
          placeholder="仓库名称"
        >
          <el-option
            v-for="item in storeTypeList"
            :key="item.id"
            :label="item.storeName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          native-type="submit"
          @click.prevent="handleFilter"
        >
          查询
        </el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          plain
          @click="save"
        >
          新增
        </el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          plain
          @click="importApi"
        >
          导入
        </el-button>
        <el-button
          class="filter-item"
          type="warning"
          icon="el-icon-success"
          plain
          @click="obtainCase"
        >
          生成用例
        </el-button>
        <!-- <el-button class="filter-item" type="warning" icon="el-icon-success" plain @click="obtainTask">生成任务</el-button> -->
        <el-button
          :disabled="ids.length === 0"
          plain
          class="filter-item"
          type="danger"
          icon="el-icon-delete"
          @click="removeIds"
        >
          删除
        </el-button>
        <!-- <el-button class="filter-item" type="primary" @click="handleFilter">修改业务分组</el-button> -->
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
      @sort-change="sortChange"
      @selection-change="basicIdGet"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column
        align="center"
        label="编号"
        width="80"
        prop="id"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.basicNo }}
        </template>
      </el-table-column>
      <el-table-column label="基础信息名称" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.basicDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="基础信息URL" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.formatUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.version }}
        </template>
      </el-table-column>
      <el-table-column label="测试类型" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.engineType && scope.row.engineType.description }}
        </template>
      </el-table-column>
      <el-table-column label="业务分组" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.businessType && scope.row.businessType.groupName }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.display }}
        </template>
      </el-table-column>

      <el-table-column
        :formatter="row => formatTime(row.createTimeDate)"
        align="center"
        prop="createTimeDate"
        label="发布时间"
        width="180"
      />
      <el-table-column
        align="center"
        label="操作"
        width="200"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-document"
            @click="clonePage(scope.row)"
          >
            克隆
          </el-button>
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
    <el-dialog :visible.sync="dialogClone" title="基础信息克隆" width="30%">
      <div class="demo-input-suffix">
        基础信息URI：
        <el-input
          v-model="cloneFormat.formatUrl"
          :disabled="true"
        />基础信息版本：
        <el-input
          v-model="cloneFormat.version"
          placeholder="请输入基础信息版本"
          clearable
        />基础信息版本描述：
        <el-input
          v-model="cloneFormat.versionDesc"
          placeholder="请输入基础信息版本描述"
          clearable
        />
      </div>
      <div slot="footer" class="filter-container">
        <el-button @click="dialogClone = false">
          取 消
        </el-button>
        <el-button type="primary" @click="clone">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, remove, formatClone } from '@/api/basic'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import moment from 'moment'

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    let groupCode
    if (this.$route.name !== 'all') {
      groupCode = this.$route.name
    }
    return {
      dialogClone: false,
      cloneFormat: {
        id: '',
        version: '',
        formatUrl: '',
        versionDesc: ''
      },
      list: null,
      total: 0,
      id: 0,
      listLoading: true,
      storeTypeList: undefined,
      engineTypeList: undefined,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        formatUrl: undefined,
        basicDesc: undefined,
        basicNo: undefined,
        display: undefined,
        groupCode: groupCode,
        storeTypeId: undefined
      },
      ids: []
      //        statusOptions: ['published', 'draft', 'deleted'],
    }
  },
  watch: {
    $route(val) {
      var groupCode = this.$route.name
      if (groupCode !== 'all') {
        this.listQuery.groupCode = this.$route.name
      }
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    formatTime(time) {
      return moment(time).format('YYYY-MM-DD hh:mm:ss')
    },
    clonePage(basic) {
      this.dialogClone = true
      this.cloneFormat.id = basic.id
      this.cloneFormat.formatUrl = basic.formatUrl
    },
    clone() {
      formatClone(this.cloneFormat).then(response => {
        console.log('test', response.data.message)
        if (response.errcode === 0) {
          this.$notify({
            title: '克隆成功',
            type: 'success',
            duration: 2000
          })
          this.dialogClone = false
        } else if (response.errcode === -1) {
          this.$notify({
            title: '克隆失败',
            message: response.data.message,
            type: 'danger',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '克隆失败',
            message: '请求失败',
            type: 'danger',
            duration: 2000
          })
        }
      })
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data.page.result
        this.storeTypeList = response.data.storeTypeList
        this.engineTypeList = response.data.engineTypeList
        this.total = response.data.page.totalItems
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
    save() {
      this.$router.push({
        path: '/interface/addBasic',
        query: { basicFormatId: undefined }
      })
    },
    edit(row) {
      const { engineType = {}, id } = row
      this.$router.push({
        path: '/interface/addBasic',
        query: {
          formatId: id,
          engineType: engineType.engineType
        }
      })
    },
    obtainTask() {
      this.$router.push({ path: '/tasks/editTask' })
    },
    obtainCase() {
      this.$router.push({ path: '/cases/new', query: { ids: this.ids }})
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.order = 'false'
      } else {
        this.listQuery.order = 'true'
      }
      this.handleFilter()
    },
    basicIdGet(val) {
      this.ids = _.map(val, 'id')
    },
    importApi() {
      this.$router.push({
        path: '/interface/import',
        query: { groupCode: this.listQuery.groupCode }
      })
    },
    removeIds() {
      const formdata = {}
      formdata['ids'] = this.ids
      this.$confirm('确认删除吗？').then(() => {
        remove(formdata).then(response => {
          if (response.errcode === 0) {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          }
        })
      })
    }
  }
}
</script>
