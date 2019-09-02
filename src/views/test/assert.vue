<template>
  <div class="filter-container">
    <el-select v-model="assertData.type" style="width: 200px;" class="filter-item" filterable clearable placeholder="请选择">
      <el-option
        v-for="item in test"
        :key="item.type"
        :label="item.type"
        :value="item.type"/>
    </el-select>
    <el-input v-if="assertData.type === 'Status'" ref="test" v-model="assertData.content" style="width: 200px;" class="filter-item" placeholder="Status内容"/>
    <el-input v-if="assertData.type === 'JsonSchema'" v-model="assertData.content" style="width: 200px;" class="filter-item" placeholder="jsonSchema内容"/>
    <el-input v-if="assertData.type === 'Body'" v-model="assertData.code" style="width: 200px;" class="filter-item" placeholder="BodyCode"/>
    <el-input v-if="assertData.type === 'Body'" v-model="assertData.content" style="width: 200px;" class="filter-item" placeholder="BodyCode内容"/>
    <el-input v-if="assertData.type === 'Json'" v-model="assertData.content" style="width: 200px;" class="filter-item" placeholder="Json内容"/>
    <el-input v-if="assertData.type === 'Header'" v-model="assertData.code" style="width: 200px;" class="filter-item" placeholder="HeaderCode"/>
    <el-input v-if="assertData.type === 'Header'" v-model="assertData.content" style="width: 200px;" class="filter-item" placeholder="HeaderCode内容"/>
    <el-input v-if="assertData.type === 'Cookie'" v-model="assertData.code" style="width: 200px;" class="filter-item" placeholder="Cookie"/>
    <el-input v-if="assertData.type === 'Cookie'" v-model="assertData.content" style="width: 200px;" class="filter-item" placeholder="Cookie内容"/>
    <el-input v-model="assertData.desc" style="width: 200px;" class="filter-item" placeholder="断言描述"/>
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
    }
  },
  data() {
    return {
      test: [
        { type: 'Status' },
        { type: 'Body' },
        { type: 'Json' },
        { type: 'Header' },
        { type: 'Cookie' },
        { type: 'JsonSchema' }
      ],
      assertData: {
        code: '',
        type: 'Status',
        desc: '',
        content: ''
      }
    }
  },
  watch: {
    assertData: {
      handler(newV, oldV) {
        this.$emit('uploadData', { index: this.index, data: newV })
      },
      deep: true
    },
    items: {
      deep: true
    }
  }
  // methods: {
  //   deleteassertData: function() {
  //     this.$emit('deleteIndex',this.index)
  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
