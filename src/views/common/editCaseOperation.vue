<template>
  <el-tabs v-model="activePane" class="eidt-case-operation">
    <el-tab-pane
      v-if="data.hasAssert"
      :class="{ 'read-only': readOnly.assert }"
      label="自定义断言"
      name="assert"
    >
      <AssertEdit v-model="data.assertResults" :group-code="groupCode" />
    </el-tab-pane>
    <el-tab-pane
      v-if="data.hasAssert"
      :class="{ 'read-only': readOnly.assertOperations }"
      label="断言操作"
      name="assertOperations"
    >
      <CaseOperation
        v-model="data.assertOperations"
        :group-code="groupCode"
        type="assert"
      />
    </el-tab-pane>
    <el-tab-pane
      :class="{ 'read-only': readOnly.preOperations }"
      label="前置操作"
      name="preOperations"
    >
      <CaseOperation
        v-model="data.preOperations"
        :group-code="groupCode"
        type="pre"
      />
    </el-tab-pane>
    <el-tab-pane
      :class="{ 'read-only': readOnly.endOperations }"
      label="后置操作"
      name="endOperations"
    >
      <CaseOperation
        v-model="data.endOperations"
        :group-code="groupCode"
        type="end"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import AssertEdit from './assertEdit'
import CaseOperation from './caseOperation'

export default {
  components: {
    AssertEdit,
    CaseOperation
  },
  props: {
    active: {
      type: String,
      default: 'assert'
    },
    groupCode: {
      type: String,
      default: ''
    },
    step: {
      type: Object,
      default: () => {}
    },
    readOnly: {
      type: Object,
      default: Object
    }
  },
  data() {
    const hasAssert = this.step.hasAssert
    let defaultPane = this.active

    if (!hasAssert && defaultPane === 'assert') {
      defaultPane = 'preOperations'
    }

    return {
      activePane: defaultPane,
      data: _.cloneDeep(this.step)
    }
  },
  methods: {
    shouldShow(name) {
      return this.activePane === name
    },
    handleChange(data) {
      this.$emit('input')
    }
  }
}
</script>

<style>
.eidt-case-operation .read-only {
  position: relative;
  pointer-events: none;
}
.eidt-case-operation .read-only:after {
  content: '只读';
  color: #fff;
  text-align: right;
  font-size: 20px;
  padding: 10px;
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}
</style>
