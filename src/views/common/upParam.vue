<template>
  <el-card class="box-card">
    <el-button type="primary" style="margin-bottom: 10px;" @click="addUpVisible">增 加</el-button>
    <div v-for="(upVisibleData,index) in uplinkParams2" :key="index" class="filter-container">
      <!--根据当前接口类型，assignList不同-->
      <!--dubbo接口-->
      <span v-if="engineType==='DUBBO'" >
        <el-select v-model="upVisibleData.assignType" style="width: 10%;" class="filter-item" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in dSelect"
            :key="item.value"
            :label="item.type"
            :value="item.value"/>
        </el-select>
      </span>
      <!--http接口-->
      <span v-else="">
        <el-select v-model="upVisibleData.assignType" style="width:10%;" class="filter-item" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in gTest"
            :key="item.value"
            :label="item.type"
            :value="item.value"/>
        </el-select>
      </span>

      <el-input v-model="upVisibleData.assignCode" style="width: 32%;" class="filter-item" placeholder="赋值KEY"/>
      <el-select v-model="upVisibleData.execNo" style="width: 8%;" class="filter-item" filterable clearable placeholder="请选择">
        <el-option
          v-for="(item,index) in upStepTypesArray"
          :key="index"
          :label="item.execNo"
          :value="item.execNo"/>
      </el-select>
      <span v-if="getEngineTypeByNo(upVisibleData.execNo) === 'DUBBO'">
        <el-select v-model="upVisibleData.returnType" style="width: 10%;" class="filter-item" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in dSelect"
            :key="item.value"
            :label="item.type"
            :value="item.value"/>
        </el-select>
      </span>
      <span v-else="">
        <el-select v-model="upVisibleData.returnType" style="width: 10%;" class="filter-item" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in dReturn"
            :key="item.value"
            :label="item.type"
            :value="item.value"/>
        </el-select>
      </span>

      <el-input v-model="upVisibleData.returnCode" style="width: 32%;" class="filter-item" placeholder="取值KEY"/>
      <el-button type="danger" class="filter-item" style="width: 50px;" size="small" icon="el-icon-delete" plain @click="deleteupVisibleData(index)"/>
    </div>

    <!-- <div v-else="" class="filter-container">
          <el-select v-model="upVisibleData.assignType" style="width: 200px;" class="filter-item" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in gTest"
              :key="item.value"
              :label="item.type"
              :value="item.value"/>
          </el-select>
          <el-input v-model="upVisibleData.assignCode" style="width: 200px;" class="filter-item" placeholder="赋值KEY"/>
          <el-select v-model="upVisibleData.execNo" style="width: 200px;" class="filter-item" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in fPosition-1"
              :key="item"
              :label="item"
              :value="item"/>
          </el-select>
          <el-select v-model="upVisibleData.returnType" style="width: 200px;" class="filter-item" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in rTest"
              :key="item.value"
              :label="item.type"
              :value="item.value"/>
          </el-select>
          <el-input v-model="upVisibleData.returnCode" style="width: 200px;" class="filter-item" placeholder="取值KEY"/>
          <el-button type="danger" class="filter-item" style="width: 50px;" size="middle" icon="el-icon-delete" plain @click="deleteupVisibleData"/>
        </div> -->

  </el-card>
</template>

<script>

export default {
  props: {
    uplinkParams: {
      type: Array,
      default: function() {
        return []
      }

    },
    upStepTypesArrayCopy: {
      type: Array,
      default: function() {
        return []
      }
    },
    // index: {
    //   type: Number,
    //   required: true
    // },
    // items: {
    //   type: Array,
    //   default: Array
    // },
    fPosition: {
      type: Number,
      required: true
    },
    engineType: {
      type: String,
      default: 'String'
    }
  },
  data() {
    return {
      uplinkParams2: this.uplinkParams,
      upStepTypesArray: this.upStepTypesArrayCopy,
      gTest: [
        { type: 'Json', value: 'JSON' },
        { type: 'Header', value: 'HEADER' },
        { type: 'Query', value: 'QUERY' },
        { type: 'Form', value: 'FORM' }
      ],
      rTest: [
        { type: 'Json', value: 'JSON' },
        { type: 'Cookie', value: 'COOKIE' },
        { type: 'Header', value: 'HEADER' }
      ],
      dSelect: [
        { type: 'Dubbo', value: 'DUBBO' }
      ],
      dReturn: [
        { type: 'Json', value: 'JSON' },
        { type: 'Cookie', value: 'COOKIE' },
        { type: 'Header', value: 'HEADER' }
      ]

    }
  },
  watch: {
    uplinkParams: {
      handler(val) {
        this.uplinkParams2 = val
      }
    },
    upStepTypesArrayCopy: {
      handler(val) {
        this.upStepTypesArray = val
      }
    }
  },
  created() {
  },
  methods: {
    // 删除一行
    deleteupVisibleData(index) {
      if (index >= 0) {
        this.uplinkParams2.splice(index, 1)
      }
    },
    // 动态添加上行参数
    addUpVisible() {
      this.uplinkParams2.push(
        {
          assignCode: '',
          returnCode: '',
          assignType: '',
          returnType: '',
          execNo: undefined
        }
      )
    },
    // 根据当前选择exexNo获取上行接口类型
    getEngineTypeByNo(execNo) {
      if (execNo <= this.upStepTypesArray.length) {
        var upStepType = this.upStepTypesArray[execNo - 1]
        return upStepType.engineType
      } else {
        return ''
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
