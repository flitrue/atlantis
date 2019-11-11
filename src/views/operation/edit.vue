<template>
  <el-form label-width="80px">
    <el-form-item v-if="!data.id" label="模式">
      <el-radio-group v-model="data.mode">
        <el-radio label="kvs">
          kvs
        </el-radio>
        <el-radio label="jar">
          jar
        </el-radio>
        <el-radio label="sql" disabled>
          sql
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <ImportJar
      v-if="!data.id && data.mode === 'jar'"
      ref="importJar"
      :group-code="data.groupCode"
    />
    <Fields
      v-if="data.id || data.mode !== 'jar'"
      ref="fields"
      :fields-data="data"
    />
    <el-form-item>
      <el-button @click="handleCancel">
        取消
      </el-button>
      <el-button type="primary" @click="handleSave">
        保存
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import GroupSelect from '@/components/GroupSelect'
import request from '@/api/operation'
import ImportJar from './_importJar'
import Fields from './_fields'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { GroupSelect, ImportJar, Fields },
  props: {
    data: {
      required: true,
      type: Object
    }
  },
  data() {
    return {}
  },
  methods: {
    handleCancel() {
      this.$emit('cancel')
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
    handleSave() {
      let data
      const type = this.data.id ? 'save' : 'create'

      if (this.data.id) {
        // 组装编辑的数据
        data = this.$refs.fields.fieldsData
        const kvs = this.formatKvs(data.kvs)
        if (!kvs) return false
        data.kvs = kvs
      } else if (this.data.mode === 'kvs') {
        // 组装kvs模式下，创建的数据
        data = this.$refs.fields.fieldsData
        const kvs = this.formatKvs(data.kvs)
        if (!kvs) return false
        data = [{ ...data, kvs }]
      } else if (this.data.mode === 'jar') {
        // 组装jar模式下，创建的数据
        data = this.$refs.importJar.functionList
      }

      request[type](data, { patch: true }).then(() => this.$emit('ok', data))
    }
  }
}
</script>
