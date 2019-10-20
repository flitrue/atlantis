<template>
  <el-card class="box-card">
    <el-button
      type="primary"
      size="small"
      icon="el-icon-plus"
      plain
      @click="addAssert"
    >增加</el-button
    >

    <div
      v-for="(assertData, index) in assertResults2"
      :key="index"
      style="margin-top:5px;"
    >
      <el-select
        v-model="assertData.assertSite"
        style="width: 14%;"
        class="filter-item"
        filterable
      >
        <el-option
          v-for="item in test"
          :key="item.type"
          :label="item.value"
          :value="item.type"
        />
      </el-select>
      <el-input
        v-if="assertData.assertSite === 'status'"
        ref="test"
        v-model="assertData.statusCode"
        style="width: 25%;"
        class="filter-item"
        placeholder="Status内容"
      />
      <el-input
        v-if="assertData.assertSite === 'jsonSchema'"
        v-model="assertData.jsonSchema"
        style="width: 25%;"
        class="filter-item"
        placeholder="jsonSchema内容"
      />
      <el-input
        v-if="assertData.assertSite === 'body'"
        v-model="assertData.code"
        style="width: 25%;"
        class="filter-item"
        placeholder="BodyCode"
      />
      <el-input
        v-if="assertData.assertSite === 'body'"
        v-model="assertData.codeValue"
        style="width: 25%;"
        class="filter-item"
        placeholder="BodyCode内容"
      />
      <el-input
        v-if="assertData.assertSite === 'json'"
        v-model="assertData.json"
        style="width: 25%;"
        class="filter-item"
        placeholder="Json内容"
      />
      <el-input
        v-if="assertData.assertSite === 'header'"
        v-model="assertData.code"
        style="width: 25%;"
        class="filter-item"
        placeholder="HeaderCode"
      />
      <el-input
        v-if="assertData.assertSite === 'header'"
        v-model="assertData.codeValue"
        style="width: 25%;"
        class="filter-item"
        placeholder="HeaderCode内容"
      />
      <el-input
        v-if="assertData.assertSite === 'cookie'"
        v-model="assertData.code"
        style="width: 25%;"
        class="filter-item"
        placeholder="Cookie"
      />
      <el-input
        v-if="assertData.assertSite === 'cookie'"
        v-model="assertData.codeValue"
        style="width: 25%;"
        class="filter-item"
        placeholder="Cookie内容"
      />
      <el-input
        v-model="assertData.assertDesc"
        style="width: 25%;"
        class="filter-item"
        placeholder="断言描述"
      />
      <el-button
        type="danger"
        class="filter-item"
        size="small"
        icon="el-icon-delete"
        plain
        @click="deleteAssertData"
      >删 除
      </el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    assertResultsCopy: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      test: [
        { type: 'status', value: 'Status' },
        { type: 'body', value: 'Body' },
        { type: 'json', value: 'Json' },
        { type: 'header', value: 'Header' },
        { type: 'cookie', value: 'Cookie' },
        { type: 'jsonSchema', value: 'JsonSchema' }
      ],
      assertResults2: this.assertResultsCopy,
      assertData: {
        code: '',
        codeValue: '',
        assertSite: '',
        assertDesc: '',
        json: '',
        jsonSchema: '',
        statusCode: ''
      }
    }
  },
  watch: {
    assertResultsCopy: function(val) {
      this.assertResults2 = val
    }
  },
  mounted() {},
  methods: {
    addAssert: function() {
      this.assertResults2.push({
        code: '',
        codeValue: '',
        assertSite: 'status',
        assertDesc: '',
        json: '',
        jsonSchema: '',
        statusCode: ''
      })
    },
    // 删除断言
    deleteAssertData(index) {
      //  not allow to delete the first
      if (index !== 0) {
        this.assertResults2.splice(index, 1)
      }
    }
  }
}
</script>
