<template>
  <SimpleList can-edit select-type="multiple" @select="handleSelect" ref="list">
    <template slot="tableAction">
      <el-button
type="primary"
icon="el-icon-plus"
plain
@click="addCase"
        >新增</el-button
      >
      <el-button
        type="success"
        icon="el-icon-circle-plus"
        plain
        @click="addBasicFormat"
        >添加基础信息</el-button
      >
      <el-button
type="warning"
icon="el-icon-success"
plain
@click="addTask"
        >生成任务</el-button
      >
      <el-button
        :disabled="selections.length === 0"
        type="danger"
        icon="el-icon-delete"
        plain
        @click="handleDelete"
        >删除</el-button
      >
    </template>
  </SimpleList>
</template>

<script>
import { deletedCase } from '@/api/case'
import SimpleList from './simpleList'
import _ from 'lodash'

export default {
  components: {
    SimpleList
  },
  data() {
    return {
      selections: []
    }
  },
  methods: {
    handleSelect(rows) {
      this.selections = rows
    },
    addCase() {
      this.$router.push({ path: '/cases/new' })
    },
    addTask() {
      this.$router.push({
        path: '/tasks/editTask',
        query: {
          caseIds: _.map(this.selections, 'id'),
          groupCode: this.$route.meta.groupCode
        }
      })
    },
    // 新增基础数据
    addBasicFormat() {
      this.$router.push({ path: '/interface/addBasic' })
    },
    handleDelete() {
      const params = { ids: _.map(this.selections, 'id') }
      this.$confirm('确认删除吗？').then(res => {
        deletedCase(params).then(response => {
          if (response.errcode === 0) {
            this.$refs.list.getList()
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
