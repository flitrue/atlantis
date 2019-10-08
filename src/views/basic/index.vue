<template>
  <div class="app-container">
    <el-card class="box-card card-bottom">
      <div slot="header" class="clearfix">
        <span style="font-size: 23px;">基础数据信息</span>
      </div>

      <el-form ref="formDataInfo" :model="formDataInfo" :rules="rule" label-width="110px" class="demo-ruleForm">
        <el-form-item label="测试类型" prop="engineTypeId" style="width: 100px">
          <el-select
            v-model="formDataInfo.engineTypeId"
            style="width: 130px;"
            class="filter-item"
            filterable
            clearable
            placeholder="请选择"
            :disabled="formatDetailFunc === 'update'">
            <el-option
              v-for="item in engineTypeList"
              :key="item.id"
              :label="item.description"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="getEngType(formDataInfo.engineTypeId) === 'INTERFAC' || (formatDetailFunc === 'update'
          && getEngType(formDataInfo.engineTypeId) === 'DUBBO' && formDataInfo.formatUrl !=='' && formDataInfo.formatUrl !== null && formDataInfo.formatUrl !== undefined )"
          label="URL"
          prop="formatUrl">
          <el-input v-model="formDataInfo.formatUrl" style="width: 50%" placeholder="填写URL"/>
        </el-form-item>
        <el-form-item
          v-if="getEngType(formDataInfo.engineTypeId) === 'INTERFAC'"
          label="环境变量标识">
          <el-input v-model="formDataInfo.urlEnv" style="width: 50%" placeholder="填写替换环境变量标识"/>
        </el-form-item>
        <el-form-item label="基础信息名称" prop="basicDesc">
          <el-input v-model="formDataInfo.basicDesc" style="width: 50%" placeholder="填写基础信息名称"/>
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="formDataInfo.version" style="width: 50%" placeholder="填写版本"/>
        </el-form-item>
        <el-form-item label="版本描述">
          <el-input v-model="formDataInfo.versionDesc" style="width: 50%" placeholder="版本描述"/>
        </el-form-item>
        <el-form-item label="所属分组" prop="groupCode">
          <el-cascader
            key="groupCode"
            :options="businessTypeTree"
            :show-all-levels="false"
            :props="{value:'groupCode',label:'groupName',children:'sonTypes'}"
            v-model="storeEcho"
            style="width: 50%;"
            placeholder="请选择业务分组"
            change-on-select
            filterable
            clearable
            @change="setGroupCode"/>
        </el-form-item>
        <el-form-item label="仓库地址" prop="storeTypeId">
          <el-select
            v-model="formDataInfo.storeTypeId"
            style="width: 50%;"
            class="filter-item"
            filterable
            clearable
            placeholder="请选择">
            <el-option
              v-for="item in storeTypeList"
              :key="item.id"
              :label="item.storeName"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formDataInfo.remarks" style="width: 50%" placeholder="填写备注"/>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    storeTypeList: {
      type: Array,
      default: Array
    },
    engineTypeList: {
      type: Array,
      default: Array
    },
    businessTypeTree: {
      type: Array,
      default: Array
    },
    formDataInfo: {
      type: Object,
      default: Object
    },
    storeEcho: {
      type: Array,
      default: Array
    },
    formatDetailFunc: {
      type: String,
      default: ''
    }
  },
  data() {
    // var checkAge = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error('年龄不能为空'))
    //   }
    // }
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
          { required: true, message: '请选择基础信息所属业务分组', trigger: 'blur' }
        ],
        storeTypeId: [
          { required: true, message: '请选择基础信息所属仓库地址', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    formDataInfo: {
      handler(newVal) {
        console.log('new formDataInfo', newVal)
      }
    }
  },
  created() {
    console.log('formDataInfo', this.getEngType(this.formDataInfo.engineTypeId) === 'INTERFAC')
  },
  methods: {
    setGroupCode(values) {
      if (values != null && values.length > 0) {
        this.formDataInfo.groupCode = values[values.length - 1]
      }
    },
    getEngType(id) {
      for (let i = 0; i < this.engineTypeList.length; i++) {
        if (this.engineTypeList[i].id === id) {
          return this.engineTypeList[i].engineType
        }
      }
    }
  }
}
</script>
