<template>
  <div class="case-list">
    <h3 v-if="title" style="margin: 0">{{ title }}</h3>
    <category style="margin-bottom:10px" @change="getList" />
    <el-form size="mini" inline>
      <el-form-item>
        <el-input
          v-model="query.caseNo"
          placeholder="编号"
          style="width: 200px;"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="query.caseName"
          placeholder="名称"
          style="width: 200px;"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="query.display"
          placeholder="创建人"
          style="width: 200px;"
        />
      </el-form-item>
      <el-form-item>
        <GroupSelect v-model="query.groupCode" placeholder="分组" />
      </el-form-item>
      <el-form-item>
        <el-button
type="primary"
icon="el-icon-search"
@click="handleSearch"
          >查询</el-button
        >
        <slot name="tableAction" />
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :class="{ '--single': selectType === 'single' }"
      :data="list"
      fit
      border
      highlight-current-row
      class="case-list-table"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <el-table-column
        v-if="selectType === 'multiple'"
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column v-if="showSteps" type="expand">
        <template slot-scope="scope">
          <el-row
            v-for="step in scope.row.caseStepDtoList"
            :key="step.id"
            style="line-height: 1.5"
          >
            <el-checkbox
              class="step-checkbox"
              @change="checked => handleToggleStep(step, checked)"
            >
              <span>{{ step.basicDesc }}<br />{{ step.formatUrl }}</span>
            </el-checkbox>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column align="center" label="编号" width="60" prop="caseNo" />
      <el-table-column label="名称" width="200" prop="caseName" />
      <el-table-column label="描述" prop="caseDesc" />
      <el-table-column
        label="业务分组"
        width="110"
        align="center"
        prop="businessTypeName"
      />
      <el-table-column
        label="创建人"
        width="110"
        align="center"
        prop="display"
      />
      <el-table-column
        :formatter="row => formatTime(row.updateTimeDate)"
        align="center"
        prop="updateTimeDate"
        label="更新时间"
        width="180"
      />

      <el-table-column
        v-if="canEdit"
        align="center"
        label="操作"
        width="220px"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="editCase(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="small"
            type="primary"
            icon="el-icon-document"
            @click="clone(scope.row.caseNo)"
            >克隆</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="query.totalItems > 0"
      :total="query.totalItems"
      :page.sync="query.pageNo"
      :limit.sync="query.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getList, caseClone } from '@/api/case'
import Pagination from '@/components/Pagination'
import GroupSelect from '@/components/GroupSelect'
import Category from '../homePage/components/category'
import moment from 'moment'
import _ from 'lodash'

export default {
  components: {
    Category,
    GroupSelect,
    Pagination
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    groupCode: {
      type: String,
      default: ''
    },
    selectType: {
      type: String,
      default: '' // ''不可选， 'single' 单选 'multiple'
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    showSteps: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cloneFormat: { caseNo: '' },
      list: [],
      listLoading: false,

      selectedSteps: {},

      query: {
        pageNo: 1,
        pageSize: 20,
        totalItems: 0,
        caseNo: undefined,
        caseName: undefined,
        groupCode: this.$route.meta.groupCode || this.groupCode,
        display: ''
      }
    }
  },
  computed: {
    categoryCode() {
      return this.$store.getters.selCategory
    }
  },
  created() {
    this.getList()
  },
  methods: {
    formatTime(time) {
      return moment(time).format('YYYY-MM-DD hh:mm:ss')
    },
    getList() {
      this.listLoading = true
      this.query.categoryCode = this.categoryCode
      getList(this.query).then(res => {
        const { data } = res
        this.list = data.result
        _.extend(this.query, {
          pageNo: data.pageNo,
          pageSize: data.pageSize,
          totalItems: data.totalItems
        })
        this.listLoading = false
      })
    },
    handleSearch() {
      this.query.pageNo = 1
      this.getList()
    },
    clone(caseNo) {
      this.$confirm(
        `是否确定要对用例编号 ${caseNo} 的用例进行克隆？`,
        '确认信息',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      ).then(() => {
        this.cloneAction(caseNo)
      })
    },
    cloneAction(caseNo) {
      this.cloneFormat.caseNo = caseNo
      caseClone(this.cloneFormat).then(response => {
        if (response.errcode === 0) {
          this.$notify({
            title: '克隆成功',
            type: 'success',
            duration: 2000
          })
          this.dialogClone = false
        } else if (response.errcode === -1) {
          this.$notify({
            title: '克隆失败',
            message: response.data.message,
            type: 'danger',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '克隆失败',
            message: '请求失败',
            type: 'danger',
            duration: 2000
          })
        }
      })
    },
    editCase(row) {
      this.$router.push({
        path: '/cases/new',
        query: { caseNo: row.caseNo, caseId: row.id }
      })
    },
    handleRowClick(row) {
      this.$emit('select', [row])
    },
    handleSelectionChange(rows) {
      this.$emit('select', rows)
    },
    handleToggleStep(step, checked) {
      if (checked) this.selectedSteps[step.id] = step
      else this.selectedSteps[step.id] = null
      // this.$emit('selected-steps', this.selectedSteps)
    }
  }
}
</script>

<style lang="scss">
.case-list {
  .case-list-table {
    &.--single {
      cursor: pointer;
    }
  }
  .step-checkbox {
    .el-checkbox__label {
      vertical-align: middle;
      &:hover {
        color: #409eff;
      }
    }
  }
}
</style>

