<template>
  <!-- 弹出对话框 -->
  <el-dialog
    :visible="show"
    :modal="false"
    title="执行类型"
    width="500px"
    :before-close="cancel"
  >
    <el-form
      ref="execType"
      :model="execType"
      :label-position="labelPosition"
      :rules="rules2"
      label-width="100px"
      status-icon
      class="demo-ruleForm"
    >
      <el-form-item label="执行类型">
        <el-radio-group v-model="execType.executionType">
          <el-radio label="IMMEDIATELY">
            立即执行
          </el-radio>
          <el-radio label="TIMING">
            定时执行
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="执行环境">
        <el-select
          v-model="execType.executionEnv"
          class="filter-item"
          filterable
          clearable
          placeholder="执行环境"
          style="width: 100%;"
        >
          <el-option
            v-for="item in workTypeList"
            :key="item.id"
            :label="item.workName"
            :value="item.workName"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="execType.executionType === 'TIMING'" label="执行方式">
        <el-select
          v-model="execType.planType"
          placeholder="选择执行方式"
          style="width: 100%;"
        >
          <el-option label="一次" value="ONCE" />
          <el-option label="每天一次" value="EVERYDAY" />
          <el-option label="每周一次" value="EVERYWEEK" />
          <el-option label="每月一次" value="EVERYMONTH" />
          <el-option label="分钟间隔" value="EVERYMINUTE" />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="
          execType.executionType === 'TIMING' &&
            execType.planType !== 'EVERYMINUTE'
        "
        label="执行时间"
      >
        <el-date-picker
          v-model="execType.actionTime"
          :picker-options="pickerOptions1"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          style="width: 100%;"
          align="right"
        />
      </el-form-item>
      <el-form-item
        v-if="execType.planType === 'EVERYMINUTE'"
        label="间隔分钟"
        prop="intervalTime"
      >
        <el-input
          v-model.number="execType.intervalTime"
          type="number"
          min="5"
          max="1440"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="recipient">
        <el-input
          v-model="execType.recipient"
          placeholder="请输入正确的邮箱，多个邮箱以英文分号分隔。"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button @click="cancel">
        取 消
      </el-button>
      <el-button type="primary" @click="execTaskSubmit('execType')">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { execTask } from '@/api/task'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: String,
      default: ''
    },
    executionEnv: {
      type: String,
      default: ''
    },
    workTypeList: {
      type: Array,
      default: null
    },
    recipientList: {
      type: Array
    }
  },
  data() {
    var checkIntervalTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入间隔分钟'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value < 5) {
            callback(new Error('必须大于5分钟'))
          } else if (value >= 1440) {
            callback(new Error('必须小于1440分钟'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    var checkEmails = (rule, value, callback) => {
      if (value !== '' && value !== undefined) {
        const emailArray = String(value).split(';') || []
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (emailArray.find(email => !emailRegex.test(email))) {
          callback(new Error('请输入正确的邮箱，多个邮箱以英文分号分隔。'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    return {
      inputVisible: false,
      inputValue: '',
      listLoading: false,
      stepActiveName: 'request',
      labelPosition: 'right',
      execType: {
        taskId: this.taskId,
        executionType: 'IMMEDIATELY',
        executionEnv: this.executionEnv,
        planType: undefined,
        intervalTime: 5,
        actionTime: '',
        recipient: this.recipientList ? _.join(this.recipientList, ';') : ''
      },
      pickerOptions1: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      rules2: {
        intervalTime: [{ validator: checkIntervalTime, trigger: 'blur' }],
        recipient: [{ validator: checkEmails, trigger: 'blur' }]
      }
    }
  },
  watch: {
    taskId: function(nVal) {
      this.execType.taskId = nVal
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    cancel() {
      this.$emit('update:show', false)
    },
    execTaskSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('submit')
          this.$emit('update:show', false)
          this.listLoading = true
          execTask(this.execType).then(response => {
            if (response.errcode === 0) {
              this.$notify({
                title: '成功',
                message: '任务已提交执行，等待2s任务执行完成后查询最新报告！',
                type: 'success',
                duration: 3000
              })
            } else {
              var message = response.errmsg
              if (response.data != null && response.data.message !== null) {
                message = response.data.message
              }
              this.$notify({
                title: '失败',
                message: message,
                type: 'warning',
                duration: 3000
              })
            }
            this.listLoading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
