<template>
  <div>
    <div>
      <el-button
        plain
        type="primary"
        size="small"
        @click="showList = !showList"
        >{{ showList ? '收起操作列表' : '展开操作列表' }}</el-button
      >
      <!-- <el-button @click="handleSave" type="primary" size="small"
        >保存</el-button
      > -->
      <!-- <el-button @click="handleCancel" size="small">取消</el-button> -->
    </div>
    <el-card v-if="showList" style="margin-top: 5px;">
      <OperationList
        :group-code="groupCode"
        select-type="multiple"
        @select="handleSelect"
      >
        <template slot="tableAction">
          <el-button plain type="primary" @click="handleInsert">插入</el-button>
        </template>
      </OperationList>
    </el-card>
    <el-table
      :data="operations"
      fit
      border
      highlight-current-row
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="name" label="操作名称" />
      <el-table-column prop="type" label="操作类型" />
      <el-table-column prop="mode" label="模式" />
      <el-table-column label="参数">
        <template slot-scope="scope">
          <el-input v-model="scope.row.params" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
size="mini"
@click="handleDelete(scope.$index)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.row, scope.$index)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="editVisible"
      title="编辑"
      width="80%"
      top="10px"
      append-to-body
    >
      <Edit
        ref="caseOptEdit"
        v-if="editVisible"
        :data="currentRow"
        @cancel="handleEditCancel"
        @ok="handleEditSave"
      />
    </el-dialog>
  </div>
</template>

<script>
import OperationList from '@/views/operation/simpleList'
// import { updateCaseOperation } from '@/api/case'
import Edit from '@/views/operation/edit'

export default {
  components: { OperationList, Edit },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    groupCode: {
      type: String,
      default: ''
    }
    // type: {
    //   type: String,
    //   default: '' // pre || end
    // }
  },
  data() {
    return {
      showList: false,
      selections: [],
      operations: this.value || [],
      editVisible: false,
      currentRow: {},
      editIndex: null
    }
  },
  watch: {
    value(v) {
      this.operations = v
    }
  },
  methods: {
    handleSelect(rows) {
      this.selections = rows
    },
    handleInsert() {
      this.showList = false
      this.operations = _.mergeByKey(this.operations, this.selections, 'id')
      this.$emit('input', this.operations)
    },
    handleDelete(index) {
      this.operations.splice(index, 1)
      this.$emit('input', this.operations)
    },
    formatKvs(kvsOrigin) {
      let kvs = _.cloneDeep(kvsOrigin)
      if (kvs.error) {
        this.$message({
          message: kvs.error,
          type: 'error'
        })
        return false
      }

      kvs = kvs.value

      if (!(kvs instanceof Array)) {
        kvs = [kvs]
      }
      return kvs
    },
    handleEdit(row, index) {
      this.editVisible = true
      // 缓存当前编辑的下标
      this.editIndex = index
      const { kvs, ...others } = this.currentRow
      this.currentRow = {
        ...row,
        ...others
      }
      if (kvs) {
        // 将编辑过得kvs format回显
        this.currentRow.kvs = this.formatKvs(kvs)
      }
    },
    handleEditSave() {
      // 编辑保存之后，更新
      this.operations[this.editIndex] = this.currentRow
      this.editVisible = false
    },
    handleEditCancel() {
      this.editVisible = false
    }
    // handleSave() {
    //   const key = `${this.type}Operations`
    //   const data = this.operations.map(operation => {
    //     return {
    //       id: operation.id,
    //       params: operation.params
    //     }
    //   })
    //   this.$emit('save', { [key]: data })
    //   updateCaseOperation(this.id, { [key]: data }).then(() => {
    //     this.$emit('save')
    //   })
    // },
    // handleCancel() {
    //   this.$emit('cancel')
    // }
  }
}
</script>
