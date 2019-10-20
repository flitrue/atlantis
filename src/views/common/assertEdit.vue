<template>
  <div>
    <el-button
plain
type="primary"
size="small"
@click="addAssert"
      >增加</el-button
    >
    <el-button
      plain
      type="primary"
      size="small"
      :key="assert.key"
      v-for="assert in shortcutAsserts"
      @click="handleTagClicked(assert)"
    >
      {{ assert.label }}
    </el-button>
    <el-form :inline="true" size="small" style="margin-top: 10px">
      <div
        v-for="(assert, index) in assertsData"
        :key="assert.key"
        style="margin-bottom: -10px"
      >
        <el-form-item>
          <el-select v-model="assert.assertSite" placeholder="断言类型">
            <el-option
              v-for="item in test"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="assert.assertSite === 'status'">
          <el-input v-model="assert.statusCode" placeholder="Status内容" />
        </el-form-item>
        <el-form-item v-if="assert.assertSite === 'jsonSchema'">
          <el-input v-model="assert.jsonSchema" placeholder="jsonSchema内容" />
        </el-form-item>
        <el-form-item v-if="assert.assertSite === 'body'">
          <el-input v-model="assert.code" placeholder="BodyCode" />
        </el-form-item>
        <el-form-item v-if="assert.assertSite === 'body'">
          <el-input v-model="assert.codeValue" placeholder="BodyCode内容" />
        </el-form-item>
        <el-form-item v-if="assert.assertSite === 'json'">
          <el-input
            type="textarea"
            :rows="5"
            v-model="assert.json"
            placeholder="Json内容"
          />
        </el-form-item>
        <el-form-item v-if="assert.assertSite === 'header'">
          <el-input v-model="assert.code" placeholder="HeaderCode" />
        </el-form-item>
        <el-form-item v-if="assert.assertSite === 'header'">
          <el-input v-model="assert.codeValue" placeholder="HeaderCode内容" />
        </el-form-item>
        <el-form-item v-if="assert.assertSite === 'cookie'">
          <el-input v-model="assert.code" placeholder="Cookie" />
        </el-form-item>
        <el-form-item v-if="assert.assertSite === 'cookie'">
          <el-input v-model="assert.codeValue" placeholder="Cookie内容" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="assert.assertDesc" placeholder="断言描述" />
        </el-form-item>

        <el-form-item>
          <el-button
            :disabled="assert.length === 1"
            plain
            type="danger"
            icon="el-icon-delete"
            @click="deleteAssertData(index)"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      test: [
        { value: 'status', label: 'Status' },
        { value: 'body', label: 'Body' },
        { value: 'json', label: 'Json' },
        { value: 'header', label: 'Header' },
        { value: 'cookie', label: 'Cookie' },
        { value: 'jsonSchema', label: 'JsonSchema' }
      ],
      assertsData: this.value.map((assert, i) => {
        assert.key = Date.now() + i
        return assert
      }),
      /** 快捷断言添加 */
      shortcutAsserts: [
        {
          key: 'status_200',
          label: 'status=200',
          value: { assertSite: 'status', statusCode: 200 }
        },
        {
          key: 'body.errcode_0',
          label: 'body.errcode=0',
          value: { assertSite: 'body', code: 'errcode', codeValue: 0 }
        },
        {
          key: 'body.errcode1_0',
          label: 'body.errorCode=0',
          value: { assertSite: 'body', code: 'errorCode', codeValue: 0 }
        },
        {
          key: 'body.ret_true',
          label: 'body.ret=true',
          value: { assertSite: 'body', code: 'ret', codeValue: 'true' }
        }
      ]
    }
  },
  methods: {
    addAssert: function() {
      this.assertsData.push({
        assertSite: 'status',
        key: Date.now()
      })
      this.$emit('input', this.assertsData)
    },
    // 删除断言
    deleteAssertData(index) {
      this.assertsData.splice(index, 1)
      this.$emit('input', this.assertsData)
    },
    handleTagClicked(assert = {}) {
      this.assertsData.push({
        ...assert.value,
        key: Date.now()
      })
      this.$emit('input', this.assertsData)
    }
  }
}
</script>

