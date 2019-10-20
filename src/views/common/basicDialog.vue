<template>
  <div class="hello">
    <el-form>
      <el-form-item label="接口参数的填充方式" size="mini">
        <el-radio-group v-model="paramType">
          <el-radio label="data">示例数据</el-radio>
          <el-radio label="placeholder">占位符</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-input
          v-model="listQuery.formatUrl"
          placeholder="URL"
          style="width: 17%;"
          class="filter-item"
          clearable
        />
        <el-input
          v-model="listQuery.basicDesc"
          placeholder="基础数据名称"
          style="width: 17%;"
          class="filter-item"
          clearable
        />
        <el-input
          v-model="listQuery.display"
          placeholder="创建人"
          style="width: 17%;"
          class="filter-item"
          clearable
        />
        <el-select
          v-model="listQuery.storeTypeId"
          style="width: 17%;"
          class="filter-item"
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
        <GroupSelect v-model="listQuery.groupCode"/>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >查询</el-button
        >
      </el-row>
    </el-form>

    <el-table
      v-loading="listLoading"
      ref="childData"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelection"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        align="center"
        label="编号"
        min-width="7%"
        prop="id"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.basicNo }}
        </template>
      </el-table-column>
      <el-table-column label="基础信息URL" min-width="30%">
        <template slot-scope="scope">
          <span>{{ scope.row.formatUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="基础信息名称" min-width="20%" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.basicDesc }}</span>
        </template>
      </el-table-column>

      <el-table-column label="版本" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.version }}
        </template>
      </el-table-column>
      <el-table-column label="测试类型" min-width="15%">
        <template slot-scope="scope">
          {{ scope.row.engineType && scope.row.engineType.description }}
        </template>
      </el-table-column>
      <el-table-column label="业务分组" min-width="10%" align="center">
        <template slot-scope="scope">
          {{ scope.row.businessType && scope.row.businessType.groupName }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" min-width="10%" align="center">
        <template slot-scope="scope">
          {{ scope.row.display }}
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
import Pagination from '@/components/Pagination'
import GroupSelect from '@/components/GroupSelect'
import { getList } from '@/api/basic'
export default {
  components: {
    Pagination,
    GroupSelect
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
      listLoading: true,
      paramType: 'data',
      total: 0,
      storeTypeList: null,
      items: [{}],
      dataRec: [],
      selectDatas: [],
      dialogTableVisible: false,
      engineTypeId: {},
      businessTypeTree: [],
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        formatUrl: undefined,
        basicDesc: undefined,
        display: undefined,
        order: 'true',
        groupCode: this.groupCode,
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
      getList(this.listQuery).then(response => {
        this.list = response.data.page.result
        this.storeTypeList = response.data.storeTypeList
        this.total = response.data.page.totalItems
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleSelection(val) {
      this.selectDatas = val
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
    }
  }
}
</script>
