<template>
  <div>
    <el-form-item label="操作名称">
      <el-input v-model="fieldsData.name" />
      <span
        v-if="fieldsData.method"
        style="color: gray;display: block; margin-bottom: -15px"
        >*方法名：{{ fieldsData.method }}</span
      >
    </el-form-item>
    <el-form-item label="分组">
      <GroupSelect v-model="fieldsData.groupCode" />
    </el-form-item>
    <el-form-item label="操作类型">
      <el-radio-group v-model="fieldsData.type">
        <el-radio label="data">数据</el-radio>
        <el-radio label="assert" :disabled="!fieldsData.id">断言</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="备注">
      <el-input :rows="2" v-model="fieldsData.desc" type="textarea" />
    </el-form-item>
    <el-form-item v-if="fieldsData.mode === 'kvs'" label="数据集">
      <template>
        <el-radio-group v-model="fieldsData.kvsType">
          <el-radio label="csv">CSV</el-radio>
          <el-radio label="json">JSON</el-radio>
        </el-radio-group>
        <DataEditor v-model="fieldsData.kvs" :mode="fieldsData.kvsType" />
      </template>
    </el-form-item>
  </div>
</template>

<script>
import GroupSelect from '@/components/GroupSelect'
import DataEditor from '@/components/DataEditor'
export default {
  components: { GroupSelect, DataEditor },
  props: {
    fieldsData: {
      required: true,
      type: Object,
      default: () => ({})
    }
  },
  // computed: {
  //   disableAssertType() {
  //     if(!fieldsData.id)
  //   }
  // },
  data() {
    return {
      showDataEditor: false
    }
  }
}
</script>
