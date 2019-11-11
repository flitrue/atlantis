<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-form-item>
        <el-input v-model="query.name" clearable placeholder="操作名称" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.mode" clearable placeholder="模式">
          <el-option value="kvs" label="kvs" />
          <el-option value="jar" label="jar" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.type" clearable placeholder="操作类型">
          <el-option value="data" label="数据" />
          <el-option value="assert" label="断言" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <group-select v-model="query.groupCode" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.display" placeholder="创建人" clearable />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          native-type="submit"
          @click.prevent="getList"
          >查询</el-button
        >
        <slot name="tableAction" />
      </el-form-item>
    </el-form>

    <el-table
      :data="list"
      fit
      border
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <el-table-column
        v-if="selectType === 'multiple'"
        type="selection"
        align="center"
      />
      <el-table-column prop="name" label="操作名称" />
      <el-table-column prop="mode" label="模式" />
      <el-table-column prop="type" label="操作类型" />
      <el-table-column prop="desc" label="备注" />
      <el-table-column
        :formatter="row => getGroupNameByCode(row.groupCode)"
        label="所属分组"
        prop="groupCode"
      />
      <el-table-column prop="display" label="创建人" />
      <el-table-column
        :formatter="row => formatTime(row.createTime)"
        prop="createTime"
        label="创建时间"
        width="100px"
      />
      <el-table-column
        v-if="canEdit"
        label="操作"
        fixed="right"
        align="center"
        width="70px"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="query.totalItems > 0"
      :total="query.totalItems"
      :page.sync="query.pageNo"
      :limit.sync="query.pageSize"
      @pagination="getList"
    />
    <el-dialog
      :visible.sync="editVisible"
      :title="currentRow.id ? '编辑' : '新增'"
      width="80%"
      top="10px"
    >
      <Edit
        v-if="editVisible"
        :data="currentRow"
        @cancel="editVisible = false"
        @ok="editSave"
      />
    </el-dialog>
  </div>
</template>

<script>
import GroupSelect, { getGroupNameByCode } from '@/components/GroupSelect'
import moment from 'moment'
import request from '@/api/operation'
import Pagination from '@/components/Pagination'
import Edit from './edit'

export default {
  components: { GroupSelect, Pagination, Edit },
  props: {
    title: {
      type: String,
      default: ''
    },
    groupCode: {
      type: String,
      default: ''
    },
    selectType: {
      type: String,
      default: '' // ''不可选， 'single' 单选 'multiple'
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const groupCode = this.$route.meta.groupCode || this.groupCode
    return {
      projectGroupCode: groupCode,
      editVisible: false,
      selections: [],
      currentRow: {},
      query: {
        groupCode
      },
      loading: {
        delete: false,
        fetchList: false
      },
      list: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    formatTime(time) {
      return moment(time).format('YYYY-MM-DD hh:mm:ss')
    },
    getList() {
      request.get({ params: this.query }).then(data => {
        this.list = data.result
        _.extend(this.query, {
          pageNo: data.pageNo,
          pageSize: data.pageSize,
          totalItems: data.totalItems
        })
      })
    },
    editSave(data) {
      this.editVisible = false
      this.getList()
    },
    handleAdd() {
      this.editVisible = true
      this.currentRow = {
        mode: 'kvs',
        type: 'data',
        kvsType: 'csv',
        groupCode: this.projectGroupCode
      }
    },
    handleEdit(row) {
      this.editVisible = true
      this.currentRow = {
        ...row,
        kvsType: row.kvsType || 'csv',
        groupCode: row.groupCode || this.projectGroupCode
      }
    },
    handleRowClick(row) {
      this.$emit('select', [row])
    },
    handleSelectionChange(rows) {
      this.$emit('select', rows)
    },
    getGroupNameByCode
  }
}
</script>

