<template>
  <el-dialog
    :visible.sync="visible"
    :modal="false"
    title="JSON 编辑"
    @close="handleCancel"
  >
    <Editor v-if="visible" v-model="editorValue" />
    <div slot="footer" align="right">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleOk">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Editor from './editor'

export default {
  components: { Editor },
  props: {
    value: { type: Object, default: Object },
    visible: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'json'
    }
  },
  data() {
    return {
      editorValue: _.cloneDeep(this.value.jsonData || this.value)
    }
  },
  watch: {
    value(v) {
      this.editorValue = _.cloneDeep(v.jsonData || v)
    }
  },
  methods: {
    handleCancel() {
      this.$emit('update:visible', false)
    },
    handleOk() {
      this.$emit('input', this.editorValue)
      this.$emit('update:visible', false)
    }
  }
}
</script>
