<template>
  <div class="filter-container" align="center">
    <span style="">执行环境：</span>
    <el-select v-model="workName" style="width: 300px;" class="filter-item" filterable clearable placeholder="请选择">
      <el-option
        v-for="item in list"
        :key="item.id"
        :label="item.workName"
        :value="item.workName"/>
    </el-select>
  </div>
</template>

<script>
import { getWorkType } from '@/api/workType'
export default {
  props: {
    basicFormatId: {
      type: String,
      required: true,
      default: 'String'
    },
    workTypeName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      workId: '',
      workName: ''
    }
  },
  watch: {
    basicFormatId: {
      handler(newV) {
        if (this.workTypeName !== '' && this.workTypeName !== null && this.workTypeName !== undefined) {
          this.workName = this.workTypeName
        } else {
          this.workName = ''
        }
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      getWorkType().then(response => {
        this.list = response.data.data
        this.listLoading = false
      })
    }
  }
}
</script>
