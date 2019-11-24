<template>
  <div>
    <category style="margin-bottom:10px" @change="getList" />
    <el-form inline size="mini">
      <el-form-item>
        <el-select v-model="query.queryType" @change="getList">
          <el-option label="个人" value="SELF" />
          <el-option label="所属组" value="GROUP" />
          <el-option label="全部" value="ALL" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.taskNo" placeholder="编号" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.taskName" placeholder="名称" />
      </el-form-item>
      <el-form-item v-if="query.queryType !== 'SELF'">
        <GroupSelect v-model="query.groupCode" />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="query.executionEnv"
          filterable
          clearable
          placeholder="执行环境"
        >
          <el-option
            v-for="item in workTypeList"
            :key="item.id"
            :label="item.workName"
            :value="item.workName"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="query.executionStatus"
          filterable
          clearable
          placeholder="执行状态"
        >
          <el-option
            v-for="item in executionStatusList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
        <el-button type="primary" icon="el-icon-plus" plain @click="addTask">
          新增
        </el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          plain
          @click="handleDelete"
          :disabled="!taskNos.length"
        >
          删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="编号" width="60" prop="taskNo">
      </el-table-column>

      <el-table-column label="名称" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.taskName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="业务分组" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.groupName }}
        </template>
      </el-table-column>
      <el-table-column label="测试类别" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.categoryName }}
        </template>
      </el-table-column>
      <el-table-column label="执行状态" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.executionStatus === 'PREPARE'">准备中</span>
          <span v-if="scope.row.executionStatus === 'TO_BE_EXEC'">待执行</span>
          <span v-if="scope.row.executionStatus === 'EXECUTING'">
            <span style="color:blue">执行中</span>
          </span>
          <span v-if="scope.row.executionStatus === 'EXE_FAILD'">
            <span style="color:red">执行失败</span>
          </span>
          <span v-if="scope.row.executionStatus === 'EXE_SUCESS'">
            <span style="color:green">执行成功</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="执行环境" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.executionEnv }}
        </template>
      </el-table-column>
      <el-table-column label="执行类型" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.executionType === 'IMMEDIATELY'">立即执行</span>
          <span v-if="scope.row.executionType === 'TIMING'">
            <el-tooltip content="点击取消定时任务" placement="bottom">
              <i
                class="el-icon-question"
                @click="cancelTiming(scope.row.timingInfo)"
              >
                <span style="color:green;">定时执行</span>
              </i>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.display }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="createTimeDate"
        label="发布时间"
        width="200"
        :formatter="row => formatTime(row.createTimeDate)"
      />
      <el-table-column
        align="center"
        label="操作"
        width="280px"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="editTask(scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-caret-right"
            @click="execTask(scope.row.id, scope.row)"
          >
            执行
          </el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-tickets"
            @click="showReportList(scope.row.taskNo)"
          >
            报告
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="query.pageNo"
      :limit.sync="query.pageSize"
      @pagination="getList"
    />
    <!-- 选择执行环境-->
    <SelExecDialog
      v-if="showAlertModal"
      :show.sync="showAlertModal"
      :task-id="selExeEnv.taskId"
      :execution-env="selExeEnv.executionEnv"
      :work-type-list="workTypeList"
      :recipient-list="selExeEnv.recipientList"
      @submit="execSubmit"
    />
    <!--任务执行方式-->
    <el-dialog :visible.sync="timingShow" title="执行方式" width="450px">
      <el-form label-width="80px">
        <el-form-item label="执行方式">
          <el-select
            v-model="timingInfo.planType"
            :disabled="true"
            style="width:100%;"
          >
            <el-option label="一次" value="ONCE" />
            <el-option label="每天一次" value="EVERYDAY" />
            <el-option label="每周一次" value="EVERYWEEK" />
            <el-option label="每月一次" value="EVERYMONTH" />
            <el-option label="分钟间隔" value="EVERYMINUTE" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行时间">
          <el-input
            :value="timingInfo.runTime | timeFormate"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          v-if="timingInfo.planType === 'EVERYMINUTE'"
          label="间隔分钟"
        >
          <el-input
            v-model.number="timingInfo.intervalTime"
            :disabled="true"
            type="number"
          />
        </el-form-item>
        <el-form-item style="align:center;">
          <el-button type="primary" @click="timingTaskCancel">
            取消任务
          </el-button>
          <el-button @click="timingShow = false">
            关 闭
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { getList, deleteTask, timingTaskCancel } from '@/api/task'
import Pagination from '@/components/Pagination'
import GroupSelect from '@/components/GroupSelect'
import SelExecDialog from './SelExecDialog'
import Category from '../homePage/components/category'
import _ from 'lodash'

export default {
  components: {
    SelExecDialog,
    GroupSelect,
    Pagination,
    Category
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      dialogIndex: -1,
      timingShow: false,
      showAlertModal: false,
      taskNo: undefined,
      taskName: undefined,
      groupName: undefined,
      engineTypeName: undefined,
      executionEnv: undefined,
      executionType: undefined,
      executionStatus: undefined,
      display: undefined,
      createTimeDate: undefined,
      lastModifyTimeDate: undefined,
      workTypeList: [],
      timingInfo: {
        runTime: undefined,
        planType: undefined,
        intervalTime: undefined,
        taskId: undefined
      },
      executionStatusList: [
        { key: 'PREPARE', value: '准备中' },
        { key: 'TO_BE_EXEC', value: '待执行' },
        { key: 'EXECUTING', value: '执行中' },
        { key: 'EXE_FAILD', value: '执行失败' },
        { key: '<EXE_></EXE_>SUCESS', value: '执行成功' }
      ],
      taskNos: [],
      query: {
        pageNo: 1,
        pageSize: 20,
        taskNo: undefined,
        taskName: undefined,
        queryType: 'ALL',
        executionEnv: undefined,
        executionStatus: undefined,
        groupCode: this.$route.meta.groupCode
      },
      selExeEnv: {
        taskId: undefined,
        executionEnv: ''
      }
    }
  },
  computed: {
    categoryCode() {
      return this.$store.getters.selCategory
    }
  },
  watch: {
    dialogIndex: function(newV, oldV) {
      this.dialogIndex = newV
    },
    list: {
      handler(newV) {}
    }
  },

  created() {
    this.getList()
  },
  filters: {
    timeFormate: function(value) {
      return moment(value).format('YYYY-MM-DD hh:mm:ss')
    }
  },

  methods: {
    formatTime(time) {
      if (!time) return ''
      return moment(time).format('YYYY-MM-DD hh:mm:ss')
    },
    getList() {
      this.listLoading = true
      this.query.categoryCode = this.categoryCode
      getList(this.query).then(response => {
        this.list = response.data.page.result
        this.total = response.data.page.totalItems
        this.workTypeList = response.data.workTypeList
        this.listLoading = false
      })
    },
    handleFilter() {
      this.query.pageNo = 1
      this.getList()
    },

    // addCase() {
    //   this.$router.push({path: '/new'});
    // },

    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.query.order = 'false'
      } else {
        this.query.order = 'true'
      }
      this.handleFilter()
    },
    handleSelectionChange(val) {
      this.taskNos = _.map(val, 'taskNo')
    },
    handleDelete() {
      var formData = {
        taskNos: this.taskNos
      }
      this.$confirm('确认删除吗？').then(response => {
        deleteTask(formData).then(response => {
          if (response.errcode === 0) {
            this.handleFilter()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          }
        })
      })
    },
    // 任务跳转报告列表详情（查看当前最新报告）
    showReportList(taskNo) {
      this.$router.push({
        path: '/reports/reportDetailList',
        query: { reportNo: '', op: 'latest', taskNo: taskNo }
      })
    },
    // 选择执行环境dailog关闭
    execSubmit(...data) {
      setTimeout(() => {
        this.handleFilter()
      }, 1 * 1000)
    },
    setDialogIndex(index, _row) {
      console.log('====:' + _row.toString())
      if (_row.executionStatus === 'EXECUTING') {
        this.$notify({
          title: '失败',
          message: '任务正在执行，稍后再试',
          type: 'warning',
          duration: 3000
        })
        return
      }
      this.dialogIndex = index
    },
    showExecDialog: function(index) {
      if (this.dialogIndex === index) {
        return true
      } else {
        return false
      }
    },
    execTask(id, _row) {
      if (
        _row.executionStatus === 'EXECUTING' ||
        _row.executionStatus === 'TO_BE_EXEC'
      ) {
        let titleEnv
        if (_row.executionStatus === 'EXECUTING') {
          titleEnv = '正在执行'
        } else {
          titleEnv = '待执行'
        }
        this.$notify({
          title: '失败',
          message: '该任务' + titleEnv + ',请稍后再试！',
          type: 'warning',
          duration: 2000
        })
        return
      }
      this.selExeEnv.taskId = id
      this.selExeEnv.executionEnv = _row.executionEnv
      this.showAlertModal = true
      this.selExeEnv.recipientList = _row.recipientList
    },
    cancelTiming(time) {
      if (time !== null && time !== '' && time !== undefined) {
        if (time.runTime !== '') {
          this.timingInfo.runTime = time.runTimeDate
        }
        if (time.planType !== '') {
          this.timingInfo.planType = time.planType
        }
        if (time.intervalTime !== '') {
          this.timingInfo.intervalTime = time.intervalTime
        }
        this.timingInfo.taskId = time.taskId
      }
      this.timingShow = true
    },
    timingTaskCancel() {
      this.loading = true
      this.timingInfo.runTime = undefined
      timingTaskCancel(this.timingInfo).then(response => {
        if (response.errcode === 0) {
          this.timingShow = false
          this.$notify({
            title: '成功',
            message: '取消成功',
            type: 'success',
            duration: 3000
          })
          setTimeout(() => {
            this.getList()
          }, 3000)
        } else {
          var message = response.errmsg
          if (response.data != null && response.data.message !== null) {
            message = response.data.message
          }
          this.loading = false
          this.$notify({
            title: '失败',
            message: message,
            type: 'warning',
            duration: 3000
          })
        }
      })
    },
    addTask() {
      this.$router.push({
        path: '/tasks/editTask',
        query: { groupCode: this.$route.meta.groupCode }
      })
    },
    editTask(taskId) {
      console.log('taskId....' + taskId)
      this.$router.push({ path: '/tasks/editTask', query: { taskId: taskId }})
    },
    testJson() {
      this.$router.push({ path: '/tasks/testJson' })
    }
  }
}
</script>
