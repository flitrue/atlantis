<template>
  <div class="filter-container">
    <div class="pane-param">
      <el-input
        :autosize="{ minRows: 10, maxRows: 20 }"
        v-model="json"
        style="width: 90%;"
        type="textarea"
        placeholder="json 参数"
      />
    </div>
  </div>
</template>
<style>
.pane-param {
  padding-left: 10px;
}
.pane-param-el {
  padding-bottom: 10px;
}
</style>
<script>
export default {
  data() {
    return {
      json: ''
    }
  }
}
</script>
