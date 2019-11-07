<template>
  <div>
    <el-card class="box-card card-bottom">
      <div slot="header" class="clearfix">
        <span style="font-size: 23px;">基础数据信息</span>
      </div>

      <el-form
        ref="formDataInfo"
        :model="formDataInfo"
        :rules="rule"
        label-width="110px"
        class="demo-ruleForm"
      >
        <el-form-item label="测试类型" prop="engineTypeId" style="width: 100px">
          <el-select
            v-model="formDataInfo.engineTypeId"
            :disabled="formDataInfo.import"
            clearable
            filterable
            style="width: 130px;"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in engineTypes"
              :key="item.id"
              :label="item.description"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="showUrl" label="URL" prop="formatUrl">
          <el-input
            v-model="formDataInfo.formatUrl"
            style="width: 50%"
            placeholder="填写URL"
          />
        </el-form-item>
        <el-form-item
          v-if="getEngType(formDataInfo.engineTypeId) === 'INTERFAC'"
          label="环境变量标识"
        >
          <el-input
            v-model="formDataInfo.urlEnv"
            style="width: 50%"
            placeholder="填写替换环境变量标识"
          />
        </el-form-item>
        <el-form-item label="基础信息名称" prop="basicDesc">
          <el-input
            v-model="formDataInfo.basicDesc"
            style="width: 50%"
            placeholder="填写基础信息名称"
          />
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input
            v-model="formDataInfo.version"
            style="width: 50%"
            placeholder="填写版本"
          />
        </el-form-item>
        <el-form-item label="版本描述">
          <el-input
            v-model="formDataInfo.versionDesc"
            style="width: 50%"
            placeholder="版本描述"
          />
        </el-form-item>
        <el-form-item label="所属分组" prop="groupCode">
          <group-select v-model="formDataInfo.groupCode" />
        </el-form-item>
        <el-form-item label="仓库地址" prop="storeTypeId">
          <el-select
            v-model="formDataInfo.storeTypeId"
            style="width: 50%;"
            class="filter-item"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in storeTypes"
              :key="item.id"
              :label="item.storeName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="formDataInfo.remarks"
            style="width: 50%"
            placeholder="填写备注"
          />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import GroupSelect from '@/components/GroupSelect'
export default {
  components: {
    GroupSelect
  },
  props: {
    formDataInfo: {
      type: Object,
      default: Object
    },
    formatDetailFunc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      rule: {
        engineTypeId: [
          { required: true, message: '请选择测试类型', trigger: 'blur' }
        ],
        formatUrl: [
          { required: true, message: '请输入接口URI信息', trigger: 'blur' }
        ],
        basicDesc: [
          { required: true, message: '请输入基础数据名称', trigger: 'blur' }
        ],
        version: [
          { required: true, message: '请输入基础信息版本', trigger: 'blur' }
        ],
        groupCode: [
          {
            required: true,
            message: '请选择基础信息所属业务分组',
            trigger: 'blur'
          }
        ],
        storeTypeId: [
          {
            required: true,
            message: '请选择基础信息所属仓库地址',
            trigger: 'blur'
          }
        ],
        itemsQuery: []
      }
    }
  },
  computed: {
    showUrl() {
      const { formDataInfo, formatDetailFunc, getEngType } = this
      const isUpdateDubbo =
        formatDetailFunc === 'update' &&
        getEngType(formDataInfo.engineTypeId) === 'DUBBO'

      return (
        getEngType(formDataInfo.engineTypeId) === 'INTERFAC' ||
        (isUpdateDubbo && formDataInfo.formatUrl)
      )
    },
    engineTypes() {
      return this.$store.state.basic.engineTypes
    },
    storeTypes() {
      return this.$store.state.basic.storeTypes
    }
  },
  watch: {
    formDataInfo: {
      handler(newVal) {}
    }
  },
  created() {
    if (!this.formDataInfo.engineTypeId) {
      this.setEngId('INTERFAC')
    }
  },
  methods: {
    setEngId(type) {
      const engine = _.find(this.engineTypes, { engineType: type }) || {}
      this.formDataInfo.engineTypeId = engine.id
    },
    getEngType(id) {
      for (let i = 0; i < this.engineTypes.length; i++) {
        if (this.engineTypes[i].id === id) {
          return this.engineTypes[i].engineType
        }
      }
    }
  }
}
</script>
