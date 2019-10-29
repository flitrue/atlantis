<template>
  <div>
    <!-- <el-button class="filter-item" type="primary" icon="el-icon-plus">新增分组</el-button> -->
    <template>
      <el-table :data="formatData" :row-style="showRow" v-bind="$attrs">
        <el-table-column v-if="columns.length===0" width="150">
          <template slot-scope="scope">
            <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
            <span v-if="iconShow(0,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
              <i v-if="!scope.row._expanded" class="el-icon-plus"/>
              <i v-else class="el-icon-minus"/>
            </span>
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column v-for="(column, index) in columns" v-else :key="column.value" :label="column.text" :width="column.width">
          <template slot-scope="scope">
            <!-- Todo -->
            <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
            <span v-for="space in scope.row._level" v-if="index === 0" :key="space" class="ms-tree-space"/>
            <span v-if="iconShow(index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index,scope.row)">
              <i v-if="!scope.row._expanded" class="el-icon-plus"/>
              <i v-else class="el-icon-minus"/>
            </span>
            <span v-if="column.value !== 'action'">{{ scope.row[column.value] }}</span>
            <span v-if="column.value === 'action'">
              <el-button size="small" type="primary" icon="el-icon-edit" @click="dialogEditClick(scope.row)">编辑</el-button>
              <el-dialog :visible.sync="dialogEdit" :title="'编辑分组 '+groupName" width="30%">
                <div class="demo-input-suffix">
                  分组名称：
                  <el-input
                    v-model="groupName"
                    placeholder="请输入分组名称"
                    clearable/>
                  业务等级：
                  <el-input
                    :disabled="true"
                    v-model="level"
                    placeholder="请输入业务等级"
                    clearable/>
                </div>
                <div slot="footer" class="filter-container">
                  <el-button @click="dialogEdit = false">取 消</el-button>
                  <el-button type="primary" @click="editBT">确 定</el-button>
                </div>
              </el-dialog>
              <el-button size="small" type="primary" icon="el-icon-plus" @click="saveSonNode(scope.row)">新增子分组</el-button>
              <el-dialog :visible.sync="dialogSave" title="新增业务分组" width="30%">
                <div class="demo-input-suffix">
                  父分组名称：
                  <el-input
                    :disabled="true"
                    v-model="groupName"/>
                  子分组名称：
                  <el-input
                    v-model="sonGroupName"
                    placeholder="请输入子分组名称"
                    clearable/>
                  业务等级：
                  <el-input
                    :disabled="true"
                    v-model="level"
                    placeholder="请输入业务等级"/>
                </div>
                <div slot="footer" class="filter-container">
                  <el-button @click="dialogSave = false">取 消</el-button>
                  <el-button type="primary" @click="saveBT">确 定</el-button>
                </div>
              </el-dialog>
              <!-- <el-button size="small" type="danger" icon="el-icon-delete" @click="remove(scope.row.id)">删除</el-button> -->
            </span>
          </template>
        </el-table-column>
        <slot/>
      </el-table>
    </template>
  </div>
</template>
<script>
import { getLevelOneData, getSonData, editData, saveData } from '@/api/businessType'
import treeToArray from '@/components/TreeTable/eval'
export default {
  data() {
    return {
      columns: [
        {
          text: '分组名称',
          value: 'groupName'
        },
        {
          text: '创建人',
          value: 'display'
        },
        {
          text: '创建时间',
          value: 'createTimeDate'
        },
        {
          text: '操作',
          value: 'action'
        }
      ],
      busnessTypedata: [
      ],
      sonGroupName: '',
      groupName: '',
      level: '',
      id: '',
      dialogEdit: false,
      dialogSave: false
    }
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      let tmp
      if (!Array.isArray(this.busnessTypedata)) {
        tmp = [this.busnessTypedata]
      } else {
        tmp = this.busnessTypedata
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs
        ? Array.concat([tmp, this.expandAll], this.evalArgs)
        : [tmp, this.expandAll]
      return func.apply(null, args)
    }
  },
  watch: {
    busnessTypedata: {
      handler(newVal) {
      }
    }
  },
  created() {
    this.businessData()
  },
  methods: {

    businessData() {
      getLevelOneData().then(Response => {
        this.busnessTypedata = Response.data.result
      })
    },
    dialogEditClick(busnessTypedata) {
      this.groupName = busnessTypedata.groupName
      this.level = busnessTypedata.level
      this.id = busnessTypedata.id
      this.dialogEdit = true
    },
    editBT(busnessTypedata) {
      const formatData = {}
      formatData['groupName'] = this.groupName
      formatData['id'] = this.id
      editData(formatData).then(Response => {
        console.log(Response)
      })
      this.businessData()
      this.dialogEdit = false
    },
    saveSonNode(busnessTypedata) {
      this.groupName = busnessTypedata.groupName
      this.level = busnessTypedata.level + 1
      this.id = busnessTypedata.id
      this.dialogSave = true
    },
    saveBT(busnessTypedata) {
      const buTone = {}
      buTone['groupName'] = this.sonGroupName
      buTone['level'] = this.level
      buTone['parentId'] = this.id
      saveData(buTone).then(Response => {
        console.log(Response)
      })
      this.dialogSave = false
    },
    showRow: function(row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true
      row.row._show = show
      return show
        ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;'
        : 'display:none;'
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex, businessTypeOne) {
      const record = this.formatData[trIndex]
      record._expanded = !record._expanded
      if (record._expanded) {
        this.getSonBuData(businessTypeOne)
      }
    },
    // 图标显示
    iconShow(index, record) {
      return index === 0 && record.children
    },
    getSonBuData(businessTypeOne) {
      const formatData = {}
      formatData['parentId'] = businessTypeOne.id
      getSonData(formatData).then(Response => {
        console.log(Response)
        businessTypeOne.children = Response.data.businessTypeSonList
        const x = this.busnessTypedata.slice()
        this.busnessTypedata = x
      })
    },
    remove(id) {
      console.log('id', id)
      const formatData = {}
      formatData['ids'] = [id]
    }
  }
}
</script>
<style rel="stylesheet/css">
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<style scoped>
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 18px;
  height: 14px;
}
.ms-tree-space::before {
  content: "";
}
.processContainer {
  width: 100%;
  height: 100%;
}
table td {
  line-height: 26px;
}
.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: #2196f3;
  margin-left: -18px;
}
</style>
