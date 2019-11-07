<template>
  <div class="interface-import">
    <TypeSelect v-model="engineTypeId" type="engineType" style="width: 120px" />
    <el-input v-model="swaggerUrl" placeholder="地址" style="width: 60%">
      <el-button slot="append" @click="fetchSwaggerList">查看</el-button>
    </el-input>
    <el-button @click="importJSON">导入JSON</el-button>
    <div class="action">
      <el-switch v-model="checkAll" active-text="全部" inactive-text="批量" />

      <span>
        <el-button :disabled="selections.length === 0" @click="showEdit = true">
          编辑
        </el-button>
        <el-button :disabled="selections.length === 0" @click="save">
          保存
        </el-button>
      </span>
    </div>

    <el-table
      v-loading="loading"
      ref="table"
      :data="tableData"
      border
      @selection-change="handleTableSelect"
    >
      <el-table-column v-if="!checkAll" type="selection" align="center" />
      <el-table-column label="url" prop="basicFormat.formatUrl">
        <template slot-scope="scope">
          {{
            scope.row.interfacBasicFormatR &&
              scope.row.interfacBasicFormatR.caseSubMethod
          }}&ensp;
          {{ scope.row.basicFormat.formatUrl }}
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="basicFormat.basicDesc" />
      <el-table-column
        :formatter="row => (row.isRepeat ? '是' : '否')"
        label="是否重复"
        prop="isRepeat"
        align="center"
        width="80px"
      />
      <el-table-column label="版本" prop="basicFormat.version" align="center" />
      <el-table-column
        :formatter="row => getEngineNameById(row.basicFormat.engineTypeId)"
        label="测试类型"
        align="center"
      />
      <el-table-column
        :formatter="row => getGroupNameByCode(row.basicFormat.groupCode)"
        label="业务分组"
        align="center"
      />
      <el-table-column
        :formatter="row => getStoreNameById(row.basicFormat.storeTypeId)"
        label="仓库地址"
        align="center"
      />
    </el-table>

    <pagination
      v-show="totalItems > 0"
      :total="totalItems"
      :page.sync="pageNo"
      :limit.sync="pageSize"
      @pagination="handlePagination"
    />

    <el-dialog :visible.sync="showEdit" top="20px" title="字段编辑">
      <el-form label-width="80px">
        <el-form-item label="测试类型">
          <TypeSelect v-model="formDataInfo.engineTypeId" type="engineType" />
        </el-form-item>

        <el-form-item label="仓库地址">
          <TypeSelect
            v-model="formDataInfo.storeTypeId"
            type="storeType"
            filterable
          />
        </el-form-item>

        <el-form-item label="接口版本">
          <el-input v-model="formDataInfo.version" style="width: 50%" />
        </el-form-item>

        <el-form-item label="业务分组">
          <GroupSelect v-model="formDataInfo.groupCode" filterable />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="editSave">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="importJsonVisible" title="json数据" width="60%">
      <jsonDialog ref="childData" />
      <div slot="footer" class="filter-container" align="center">
        <el-button @click="jsonCloseBtn">取 消</el-button>
        <el-button type="primary" @click="jsonSaveBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import GroupSelect, { getGroupNameByCode } from '@/components/GroupSelect'
import TypeSelect, {
  getEngineNameById,
  getStoreNameById
} from '@/components/TypeSelect'
import Pagination from '@/components/Pagination'
import { fetchSwaggerList, batchUpdateInterface } from '@/api/basic.js'
import jsonDialog from '../common/importJson.vue'
import { importJson } from '@/api/dubbo'

export default {
  components: { jsonDialog, GroupSelect, TypeSelect, Pagination },
  data() {
    return {
      engineTypeId: '',
      swaggerUrl: '',
      selections: [],
      formDataInfo: {
        groupCode: this.$route.query.groupCode
      },
      loading: false,
      showEdit: false,
      checkAll: false,
      listData: [],
      tableData: [],
      totalItems: 0,
      pageNo: 1,
      pageSize: 20,
      importJsonVisible: false
    }
  },
  watch: {
    listData(val) {
      this.getTableData()
    },
    pageNo() {
      this.getTableData()
    },
    pageSize() {
      this.getTableData()
    },
    checkAll(val) {
      if (val === true) {
        this.selections = this.listData
      } else {
        this.selections = []
        this.$refs.table.clearSelection()
      }
    },
    engineTypeId(val) {
      this.formDataInfo.engineTypeId = val
    }
  },
  methods: {
    getTableData() {
      this.totalItems = this.listData.length
      this.tableData = this.listData.slice(
        (this.pageNo - 1) * this.pageSize,
        this.pageNo * this.pageSize
      )
    },
    handlePagination({ page, limit }) {
      this.pageNo = page
      this.limit = limit
    },
    fetchSwaggerList() {
      this.loading = true
      fetchSwaggerList(this.swaggerUrl, this.engineTypeId)
        .then(data => {
          this.checkAll = false
          this.listData = data.map((d, i) => {
            d.index = i
            return d
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    editSave() {
      const selectMap = _.groupBy(this.selections, 'index')
      const selectIndexs = []
      this.listData = this.listData.map((row, i) => {
        if (selectMap[row.index]) {
          selectIndexs.push(i)
          row.basicFormat = { ...row.basicFormat, ...this.formDataInfo }
        }
        return row
      })

      this.$nextTick(() => {
        // 重置选择的 row
        if (!this.checkAll) {
          selectIndexs.forEach(i =>
            this.$refs.table.toggleRowSelection(this.listData[i], true)
          )
        } else {
          this.selections = this.listData
        }
      })

      this.showEdit = false
    },
    handleTableSelect(val = []) {
      this.selections = val
    },
    save() {
      const selections = _.cloneDeep(this.selections)
      selections.forEach(select => delete select.index)
      batchUpdateInterface(selections).then(() => {
        this.sliceSavedData()
      })
    },
    sliceSavedData() {
      const sliceIndexs = this.selections.map(s => s.index)
      this.listData = this.listData
        .filter((d, i) => {
          if (sliceIndexs.indexOf(i) === -1) {
            return true
          }
        })
        .map((d, i) => {
          d.index = i
          return d
        })
      this.checkAll = false
      this.selections = []
    },
    getEngineNameById,
    getStoreNameById,
    getGroupNameByCode,
    importJSON() {
      this.importJsonVisible = true
    },
    jsonCloseBtn() {
      this.importJsonVisible = false
    },
    jsonSaveBtn() {
      var jsonData = this.$refs.childData.json
      var formData = { engineTypeId: this.engineTypeId }
      formData['json'] = jsonData
      importJson(formData).then(response => {
        if (response.errcode === 0) {
          this.checkAll = false
          this.listData = response.data.map((d, i) => {
            d.index = i
            return d
          })
        } else {
          this.$notify({
            title: '解析数据失败',
            message: response.errmsg,
            type: 'danger',
            duration: 2000
          })
        }
      })
      this.importJsonVisible = false
    }
  }
}
</script>

<style scoped>
.action {
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
