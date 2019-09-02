<template>

  <div class="filter-container">
    <el-select v-model="upVisibleData.gtype" style="width: 200px;" class="filter-item" filterable clearable placeholder="请选择">
      <el-option
        v-for="item in gTest"
        :key="item.type"
        :label="item.type"
        :value="item.type"/>
    </el-select>
    <el-input v-model="upVisibleData.gkey" style="width: 200px;" class="filter-item" placeholder="赋值KEY"/>
    <el-select v-model="upVisibleData.position" style="width: 200px;" class="filter-item" filterable clearable placeholder="请选择">
      <el-option
        v-for="item in fPosition-1"
        :key="item"
        :label="item"
        :value="item"/>
    </el-select>
    <el-select v-model="upVisibleData.rtype" style="width: 200px;" class="filter-item" filterable clearable placeholder="请选择">
      <el-option
        v-for="item in rTest"
        :key="item.type"
        :label="item.type"
        :value="item.type"/>
    </el-select>
    <el-input v-model="upVisibleData.gkey" style="width: 200px;" class="filter-item" placeholder="取值KEY"/>
  </div>
</template>

<script>

export default {
  props: {
    index: {
      type: Number,
      required: true
    },
    items: {
      type: Array,
      default: Array
    },
    fPosition: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      gTest: [
        { type: 'Json' },
        { type: 'Header' },
        { type: 'Query' },
        { type: 'Form' }
      ],
      rTest: [
        { type: 'Json' },
        { type: 'Cookie' },
        { type: 'Header' }
      ],
      upVisibleData: {
        gkey: '',
        rkey: '',
        gtype: 'Json',
        rtype: 'Json',
        position: ''
      }
    }
  },
  watch: {
    upVisibleData: {
      handler(newV, oldV) {
        this.$emit('uploadData', { index: this.index, data: newV })
      },
      deep: true
    },
    items: {
      deep: true
    }
  },
  methods: {
    deleteupVisibleData: function() {
      this.$emit('deleteIndex', this.index)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
