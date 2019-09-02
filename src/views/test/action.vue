<template>
  <div class="filter-container">
    <el-select v-model="workName" style="width: 200px;" class="filter-item" filterable clearable placeholder="请选择">
      <el-option
        v-for="item in list"
        :key="item.id"
        :label="item.workName"
        :value="item.id"/>
    </el-select>
  </div>
</template>
<script>
import { getWorkType } from '@/api/workType'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      workName: ''
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      getWorkType().then(response => {
        this.list = response.data.data.result
        this.listLoading = false
      })
    }
  }
}
</script>
