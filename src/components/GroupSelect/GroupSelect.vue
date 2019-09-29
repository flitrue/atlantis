<template>
  <el-cascader
    v-model="code"
    :options="businessTree"
    :show-all-levels="false"
    :props="{ value: 'groupCode', label: 'groupName', children: 'sonTypes' }"
    clearable
    change-on-select
    placeholder="请选择业务分组"
    class="c-group-select"
    @change="handleChange"
    :filterable="filterable"
  />
</template>

<script>
import _ from 'lodash'
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    filterable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      code: this.trans(this.value)
    }
  },
  computed: {
    businessTree() {
      return this.$store.getters.businessTree
    }
  },
  watch: {
    value(val) {
      this.code = this.trans(val)
    }
  },
  methods: {
    trans(v = '') {
      let n = 0
      const codes = []
      while (n < v.length) {
        codes.push(v.slice(0, n + 3))
        n += 3
      }
      return codes
    },
    handleChange(v) {
      console.log(this.code)
      console.log(v)
      this.$emit('input', _.last(v))
    }
  }
}
</script>
