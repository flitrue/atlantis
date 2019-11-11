<template>
  <div>
    <SimpleList
      ref="list"
      can-edit
      select-type="multiple"
      @select="handleSelectRow"
    >
      <template slot="tableAction">
        <el-button
          plain
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
        >新增</el-button
        >
        <el-button
          :disabled="selections.length === 0"
          plain
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete"
        >删除</el-button
        >
      </template>
    </SimpleList>
  </div>
</template>

<script>
import SimpleList from './simpleList'
import request from '@/api/operation'
import _ from 'lodash'

export default {
  components: { SimpleList },
  data() {
    return {
      selections: []
    }
  },
  methods: {
    handleAdd() {
      this.$refs.list.handleAdd()
    },
    handleSelectRow(rows) {
      this.selections = rows
    },
    handleDelete() {
      this.$confirm('确认删除吗？').then(() => {
        const ids = _.map(this.selections, 'id')
        request.delete(ids).then(() => this.$refs.list.getList())
      })
    }
  }
}
</script>

