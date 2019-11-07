<template>
  <div>
    <el-card class="box-card card-bottom">
      <div slot="header" class="clearfix">
        <span style="font-size: 23px;">基本设置</span>
      </div>
      <div class="text item">
        <el-form label-width="100px" class="demo-ruleForm">
          <el-form-item label="接口名称" prop="caseName">
            <el-input v-model="basicName" style="width: 50%" />
          </el-form-item>
          <el-form-item label="接口URL" prop="caseDesc">
            <el-input v-model="basicUrl" style="width: 50%" />
          </el-form-item>
          <el-form-item label="接口版本" prop="caseDesc">
            <el-input v-model="basicVersion" style="width: 50%" />
          </el-form-item>
          <el-form-item label="提交方式" prop="caseDesc">
            <template>
              <el-select
                v-model="formDetailData.caseSubMethod"
                style="width: 130px;"
                @change="subMethodChange"
              >
                <el-option
                  v-for="item in subMethod"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </template>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card card-bottom">
      <div slot="header" class="clearfix">
        <span style="font-size: 23px;">基础格式参数</span>
      </div>
      <div>
        <div style="margin-top: 10px">
          <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
            <el-tab-pane
              v-if="formDetailData.caseSubMethod === 'POST'"
              label="Body"
              name="first"
            >
              <div>
                <input v-model="radio" type="radio" name="test" value="FORM" />
                <el-tag type="info">FORM</el-tag>
                <input v-model="radio" type="radio" name="test" value="JSON" />
                <el-tag type="info">JSON</el-tag>
              </div>
              <div v-if="radio == 'FORM'" style="margin-top: 20px">
                <div class="filter-container">
                  <el-button
                    type="primary"
                    size="middle"
                    icon="el-icon-plus"
                    plain
                    @click="addDataForm"
                    >增 加</el-button
                  >
                </div>
                <div v-for="(item, index) in itemsForm" :key="index">
                  <div class="format-param">
                    <el-input
                      v-model="item.keyName"
                      style="width: 200px;"
                      class="filter-item"
                      placeholder="名称"
                    />
                    <el-select
                      v-model="item.keyType"
                      style="width: 130px;"
                      class="filter-item"
                      filterable
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="itemType in typeJsonOptions"
                        :key="itemType.type"
                        :label="itemType.name"
                        :value="itemType.type"
                      />
                    </el-select>
                    <el-checkbox v-model="item.required" />
                    <el-input
                      v-model="item.remarks"
                      style="width: 200px;"
                      class="filter-item"
                      placeholder="备注"
                    />
                    <el-button
                      type="danger"
                      class="filter-item"
                      size="middle"
                      icon="el-icon-delete"
                      plain
                      @click="delDataForm(index)"
                    />
                  </div>
                </div>
              </div>
              <div v-if="radio == 'JSON'" style="margin-top: 20px">
                <el-button
                  type="success"
                  style="margin-bottom: 10px;"
                  plain
                  @click="importJsonVisible = true"
                  >导入json</el-button
                >
                <!--导入json弹窗-->
                <div>
                  <el-dialog
                    :visible.sync="importJsonVisible"
                    title="json参数数据"
                    width="60%"
                  >
                    <jsonDialog ref="childData" />
                    <div slot="footer" class="filter-container" align="center">
                      <el-button @click="jsonCloseBtn">取 消</el-button>
                      <el-button
type="primary"
@click="jsonSaveBtn"
                        >确 定</el-button
                      >
                    </div>
                  </el-dialog>
                </div>
                <div class="custom-tree-container">
                  <div class="block">
                    <el-tree
                      :data="data6"
                      :props="{ label: 'keyName', children: 'objectNodes' }"
                      :expand-on-click-node="false"
                      :style="'width:' + widthx.size + '%'"
                      node-key="index"
                      default-expand-all
                    >
                      <span
                        slot-scope="{ node, data }"
                        class="custom-tree-node"
                      >
                        <span :style="'width:' + keyNameSet(data) + 'px'">
                          <el-input
                            v-model="data.keyName"
                            class="filter-item"
                            placeholder="名称"
                          />
                        </span>
                        <span :style="'width:' + widthx.keyTypeWidth + 'px'">
                          <el-select
                            v-model="data.keyType"
                            class="filter-item"
                            filterable
                            clearable
                            placeholder="请选择"
                            @change="changeData(data)"
                          >
                            <el-option
                              v-for="item in typeJsonOptions"
                              :key="item.type"
                              :label="item.name"
                              :value="item.type"
                            />
                          </el-select>
                        </span>
                        <span :style="'width:' + widthx.checkboxWidth + 'px'">
                          <el-checkbox v-model="data.required" />
                        </span>
                        <span :style="'width:' + widthx.remarkWidth + 'px'">
                          <el-input
                            v-model="data.remark"
                            class="filter-item"
                            placeholder="备注"
                          />
                        </span>
                        <span :style="'width:' + widthx.operateWidth + 'px'">
                          <el-button
                            type="success"
                            icon="el-icon-setting"
                            plain
                          />
                          <el-button
                            type="danger"
                            icon="el-icon-delete"
                            plain
                            @click="remove(node, data)"
                          />
                          <el-tooltip
                            v-if="data.keyType === 'OBJECT' && node.level === 1"
                            class="item"
                            effect="dark"
                            content="添加子节点"
                            placement="top"
                          >
                            <el-button
                              class="filter-item"
                              type="primary"
                              icon="el-icon-plus"
                              plain
                              @click="addNode(data, 0)"
                            />
                          </el-tooltip>
                          <el-tooltip
                            v-if="data.keyType === 'OBJECT' && node.level > 1"
                            class="item"
                            effect="dark"
                            content="添加兄弟/子节点"
                            placement="top"
                          >
                            <el-dropdown>
                              <span class="el-dropdown-link">
                                <el-button
                                  class="filter-item"
                                  type="primary"
                                  icon="el-icon-plus"
                                  plain
                                />
                              </span>
                              <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item
                                  icon="el-icon-circle-plus"
                                  @click.native="addNode(data, 1)"
                                  >兄弟节点</el-dropdown-item
                                >
                                <el-dropdown-item
                                  icon="el-icon-plus"
                                  @click.native="addNode(data, 0)"
                                  >子节点</el-dropdown-item
                                >
                              </el-dropdown-menu>
                            </el-dropdown>
                          </el-tooltip>
                        </span>
                      </span>
                    </el-tree>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane :name="priority" label="Query">
              <div class="filter-container">
                <el-button
                  type="primary"
                  size="middle"
                  icon="el-icon-plus"
                  plain
                  @click="addDataQuery"
                  >增 加</el-button
                >
              </div>
              <div v-for="(item, index) in itemsQuery" :key="index">
                <div class="format-param">
                  <el-input
                    v-model="item.keyName"
                    style="width: 200px;"
                    class="filter-item"
                    placeholder="名称"
                  />
                  <el-select
                    v-model="item.keyType"
                    style="width: 130px;"
                    class="filter-item"
                    filterable
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="itemType in typeJsonOptions"
                      :key="itemType.type"
                      :label="itemType.name"
                      :value="itemType.type"
                    />
                  </el-select>
                  <el-checkbox v-model="item.required" />
                  <el-input
                    v-model="item.remarks"
                    style="width: 200px;"
                    class="filter-item"
                    placeholder="备注"
                  />
                  <el-button
                    type="danger"
                    class="filter-item"
                    size="middle"
                    icon="el-icon-delete"
                    plain
                    @click="delDataQuery(index)"
                  />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Headers" name="third">
              <div class="filter-container">
                <el-button
                  type="primary"
                  size="middle"
                  icon="el-icon-plus"
                  plain
                  @click="addDataHeader"
                  >增 加</el-button
                >
              </div>
              <div
                v-for="(item, index) in itemsHeader"
                :key="index"
                :value="item"
              >
                <div class="format-param">
                  <el-input
                    v-model="item.headerKey"
                    style="width: 200px;"
                    class="filter-item"
                    placeholder="名称"
                  />
                  <el-input
                    v-model="item.headerValue"
                    style="width: 200px;"
                    class="filter-item"
                    placeholder="值"
                  />
                  <el-input
                    v-model="item.remarks"
                    style="width: 200px;"
                    class="filter-item"
                    placeholder="备注"
                  />
                  <el-button
                    type="danger"
                    class="filter-item"
                    size="middle"
                    icon="el-icon-delete"
                    plain
                    @click="delDataHeader(index)"
                  />
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-card>
    <div style="margin-top:36px;margin-bottom: 36px" align="center">
      <el-button
class="filter-item"
type="primary"
@click="basicFormatREditBtn"
        >立即创建</el-button
      >
      <el-button class="filter-item" @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<style>
.card-bottom {
  margin-bottom: 10px;
}

.format-param {
  margin-bottom: 10px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-tree-node__content {
  padding-bottom: 20px;
  padding-top: 20px;
}
</style>
<script>
import treeToArray from '@/components/baseFile/basicFormat'
import arrayToTree from '@/components/baseFile/coverBasic'
import jsonDialog from '../common/importJson.vue'
import { importJson, basicFormatRSave } from '@/api/basic'
import deleteNode from '@/components/baseFile/add'
import addNodes from '@/components/baseFile/addNode'
export default {
  components: {
    jsonDialog
  },
  props: {
    formatDetailFunc: {
      type: String,
      default: ''
    },
    formDetailData: {
      type: Object,
      required: true
    },
    typeJsonOptions: {
      type: Array,
      required: true
    },
    formatId: {
      type: String,
      default: ''
    },
    basicNo: {
      type: String,
      default: ''
    },
    basicName: {
      type: String,
      default: ''
    },
    basicUrl: {
      type: String,
      default: ''
    },
    basicVersion: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      message: {
        0: 'success',
        1: '请求头参数内容缺失',
        2: 'query参数内容缺失',
        3: 'form参数内容缺失',
        4: 'json参数内容缺失'
      },
      data6: [],
      a: '1',
      subMethod: ['POST', 'GET'],
      priority: 'second',
      importJsonVisible: false,
      activeName2: 'first',
      radio: 'JSON',
      screenWidth: document.body.clientWidth,
      widthx: {
        keyNameWidth: 0,
        keyTypeWidth: 120,
        checkboxWidth: 20,
        remarkWidth: 150,
        operateWidth: 200,
        size: 100
      },
      itemsHeader: [],
      itemsQuery: [],
      itemsForm: []
    }
  },
  watch: {
    screenWidth(val) {
      if (val > 1900) {
        this.widthx.keyNameWidth = 100
        this.widthx.keyTypeWidth = 210
        this.widthx.checkboxWidth = 20
        this.widthx.remarkWidth = 230
        this.widthx.operateWidth = 300
        this.widthx.size = 80
      } else {
        this.widthx.keyNameWidth = 0
        this.widthx.keyTypeWidth = 110
        this.widthx.checkboxWidth = 20
        this.widthx.remarkWidth = 130
        this.widthx.operateWidth = 200
        this.widthx.size = 100
      }
      this.screenWidth = val
    },
    widthx(newval) {},
    formDetailData: {
      handler(newVal) {
        if (newVal.caseSubMethod === 'GET') {
          this.priority = 'first'
        } else {
          this.priority = 'second'
        }
      }
    }
  },
  created() {
    this.getListData()
  },
  // 获取页面分辨率
  mounted() {
    const that = this
    window.onresize = () => {
      return () => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      }
    }
  },
  methods: {
    getListData() {
      this.data6 = treeToArray(
        this.generateJson(this.formDetailData.interfacJson)
      )
      if (this.formDetailData.interfacHeaders) {
        console.log('1', this.formDetailData.interfacHeaders)
        this.itemsHeader = this.formDetailData.interfacHeaders
      }
      if (this.formDetailData.interfacQueries) {
        console.log('2', this.formDetailData.interfacQueries)
        this.itemsQuery = this.formDetailData.interfacQueries
      }
      if (this.formDetailData.interfacForms) {
        console.log('3', this.formDetailData.interfacForms)
        this.itemsForm = this.formDetailData.interfacForms
      }
    },
    handleClick(tab, event) {},
    // 生成json数据
    generateJson(jsonData) {
      if (
        jsonData === null ||
        jsonData === undefined ||
        JSON.stringify(this.formDetailData.interfacJson) === '{}' ||
        jsonData.objectNodes === null
      ) {
        return [
          {
            keyName: '',
            objectNodes: [],
            keyType: 'OBJECT',
            remarks: '',
            required: false
          }
        ]
      }
      return jsonData.objectNodes
    },
    // 删除节点数据
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.objectNodes || parent.data
      const index = children.findIndex(d => d.keyName === data.keyName)
      children.splice(index, 1)
    },

    jsonCloseBtn() {
      this.importJsonVisible = false
    },
    jsonSaveBtn() {
      var jsonData = this.$refs.childData.json
      var formData = {}
      formData['json'] = jsonData
      importJson(formData).then(response => {
        if (response.errcode === 0) {
          var datas = response.data.message.objectNodes
          this.data6 = treeToArray(datas)
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
    },
    changeData(s) {
      const data6Cash = this.data6.slice()
      this.data6 = deleteNode(s, data6Cash)
      if (s.keyType === 'ARRAY') {
        this.addNode(s, 0)
      }
    },
    keyNameSet(n) {
      return this.widthx.keyNameWidth + n.widthPx
    },
    addNode(dataCurrent, level) {
      const dataAll = this.data6.slice()
      addNodes(dataAll, dataCurrent, level)
      this.data6 = dataAll
    },
    dataAssembly() {
      this.formDetailData.basicFormatId = this.formatId
      this.formDetailData.basicNo = this.basicNo
      if (this.assertBodyEmpty(this.itemsHeader)) {
        if (this.assertBodyContent(this.itemsHeader)) {
          for (let i = 0; i < this.itemsHeader.length; i++) {
            delete this.itemsHeader[i].createTimeDate
          }
          this.formDetailData.interfacHeaders = this.itemsHeader
        } else {
          return 1
        }
      } else {
        delete this.formDetailData.interfacHeaders
      }
      if (this.assertBodyEmpty(this.itemsQuery)) {
        if (this.assertBodyContent(this.itemsQuery)) {
          for (let i = 0; i < this.itemsQuery.length; i++) {
            delete this.itemsQuery[i].createTimeDate
          }
          this.formDetailData.existQuery = true
          this.formDetailData.interfacQueries = this.itemsQuery
        } else {
          return 2
        }
      } else {
        delete this.formDetailData.interfacQueries
        this.formDetailData.existQuery = false
      }
      if (this.formDetailData.caseSubMethod === 'POST') {
        if (this.radio === 'FORM') {
          this.formDetailData.bodyParamType = 'FORM'
          delete this.formDetailData.interfacJson
          if (this.assertBodyEmpty(this.itemsForm)) {
            if (this.assertBodyContent(this.itemsForm)) {
              for (let i = 0; i < this.itemsForm.length; i++) {
                delete this.itemsForm[i].createTimeDate
              }
              this.formDetailData.interfacForms = this.itemsForm
            } else {
              return 3
            }
          } else {
            delete this.formDetailData.bodyParamType
            delete this.formDetailData.interfacForms
          }
        } else if (this.radio === 'JSON') {
          this.formDetailData.bodyParamType = 'JSON'
          delete this.formDetailData.interfacForms

          if (this.assertBodyEmpty(this.data6)) {
            const result = arrayToTree(this.data6)
            if (this.assertBodyContent(result)) {
              this.formDetailData.interfacJson = {}
              this.formDetailData.interfacJson['objectNodes'] = result
            } else {
              return 4
            }
          } else {
            delete this.formDetailData.bodyParamType
            delete this.formDetailData.interfacJson
          }
        }
      } else {
        delete this.formDetailData.bodyParamType
        delete this.formDetailData.interfacJson
        delete this.formDetailData.interfacForms
      }
      return 0
    },
    assertBodyEmpty(form) {
      if (form === undefined || form.length === 0) {
        return false
      }
      return true
    },
    assertBodyContent(form) {
      for (let i = 0; i < form.length; i++) {
        if (JSON.stringify(form[i]) === '{}') {
          return false
        }
        for (const key in form[i]) {
          if (key !== 'remarks' && key !== 'keyRule' && key !== 'objectNodes') {
            if (
              form[i][key] === '' ||
              form[i][key] === undefined ||
              form[i][key] === null
            ) {
              return false
            }
          }
        }
      }
      return true
    },
    basicFormatREditBtn() {
      const code = this.dataAssembly()
      if (code !== 0) {
        this.$notify({
          title: '参数缺失',
          message: this.message[code],
          type: 'danger',
          duration: 2000
        })
        return
      }
      if (!this.formDetailData.id) {
        this.formatDetailFunc = 'save'
      }
      basicFormatRSave(this.formDetailData, this.formatDetailFunc).then(
        response => {
          if (response.errcode === 0) {
            this.$notify({
              title: '保存基础系信息成功',
              type: 'succes',
              duration: 2000
            })
            this.$router.back()
          } else if (response.errcode === -1) {
            this.$notify({
              title: '保存基础信息失败',
              message: response.data.errmsg,
              type: 'danger',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '保存基础信息失败',
              message: '服务响应失败',
              type: 'danger',
              duration: 2000
            })
          }
        }
      )
    },
    subMethodChange() {
      const r = Object.assign({}, this.formDetailData)
      this.formDetailData = r
    },
    //  add assertData
    addDataHeader: function() {
      this.itemsHeader.push({ headerKey: '', headerValue: '', remarks: '' })
    },
    // delete assertData
    delDataHeader: function(index) {
      //  not allow to delete the first
      const x = this.itemsHeader.slice()
      x.splice(index, 1)
      this.itemsHeader = x
    },
    //  add assertData
    addDataQuery: function() {
      this.itemsQuery.push({
        keyName: '',
        keyType: '',
        remarks: '',
        required: 'false'
      })
    },
    // delete assertData
    delDataQuery: function(index) {
      //  not allow to delete the first
      const x = this.itemsQuery.slice()
      x.splice(index, 1)
      this.itemsQuery = x
    },
    //  add assertData
    addDataForm: function() {
      this.itemsForm.push({
        keyName: '',
        keyType: '',
        remarks: '',
        required: 'false'
      })
    },
    // delete assertData
    delDataForm: function(index) {
      //  not allow to delete the first
      const x = this.itemsForm.slice()
      x.splice(index, 1)
      this.itemsForm = x
    },
    cancel() {
      this.$router.back()
    },
    open2() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.dataAssembly()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
