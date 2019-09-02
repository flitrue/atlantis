
<template>
  <div class="hello">
    <div>
      <el-button
type="primary"
@click="dialogFormVisible = true"
        >添加断言</el-button
      >
      <el-container>
        <el-dialog
          :visible.sync="dialogFormVisible"
          :before-close="closeDialog"
          title="添加断言"
          width="80%"
        >
          <div class="filter-container">
            <el-button
              type="primary"
              size="middle"
              icon="el-icon-plus"
              plain
              @click="addAssert"
              >增 加</el-button
            >
          </div>
          <assertPage
            v-for="(item, index) in itemsAssert"
            :key="index"
            :index="index"
            :items="itemsAssert"
            @deleteIndex="delAssert"
            @uploadData="getDataAssert"
          />
          <div class="filter-container">
            <el-button
              type="danger"
              class="filter-item"
              size="middle"
              icon="el-icon-delete"
              plain
              @click="delAssert"
              >删 除</el-button
            >
          </div>
          <div slot="footer" class="filter-container">
            <el-button @click="callOf('test')">取 消</el-button>
            <el-button
type="primary"
@click="dialogFormVisible = false"
              >确 定</el-button
            >
          </div>
        </el-dialog>
      </el-container>
    </div>
    <div>
      <el-button type="primary" @click="actionVisible = true">试运行</el-button>
      <el-dialog :visible.sync="actionVisible" title="试运行" width="50%">
        <actionPage />

        <div slot="footer" class="filter-container">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button
type="primary"
@click="dialogTableVisible = false"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>

    <div>
      <el-button type="primary" @click="reportVisible = true">报告</el-button>
      <el-dialog :visible.sync="reportVisible" title="试运行报告" width="70%">
        <reportPage />

        <div slot="footer" class="filter-container">
          <el-button @click="reportVisible = false">关 闭</el-button>
        </div>
      </el-dialog>
    </div>

    <div>
      <el-button
type="primary"
@click="dialogUpVisible = true"
        >添加上行参数</el-button
      >
      <el-dialog
        :visible.sync="dialogUpVisible"
        title="添加上行参数"
        width="85%"
      >
        <el-button
          type="primary"
          size="middle"
          icon="el-icon-plus"
          plain
          @click="addUpVisible"
          >增加</el-button
        >
        <upParametersPage
          v-for="(item, index) in itemsUpParameters"
          :key="index"
          :index="index"
          :items="itemsUpParameters"
          :f-position="fPosition"
          @deleteIndex="delUpVisible"
          @uploadData="getDataUpVisible"
        />
        <el-button
          type="danger"
          class="filter-item"
          size="middle"
          icon="el-icon-delete"
          plain
          @click="delUpVisible"
          >删 除</el-button
        >
        <div>{{ itemsUpParameters }}</div>
      </el-dialog>
    </div>

    <div>
      <el-button
type="primary"
@click="dialogTableVisible = true"
        >添加基础信息接口</el-button
      >
      <el-dialog
        :visible.sync="dialogTableVisible"
        title="基础信息接口"
        width="75%"
      >
        <basicDialog />
        <div slot="footer" class="filter-container">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button
type="primary"
@click="dialogTableVisible = false"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import assertPage from '../common/assert.vue'
import upParametersPage from './upParameters.vue'
import actionPage from './action.vue'
import basicDialog from '../common/basicDialog.vue'
import reportPage from './report.vue'

export default {
  components: {
    assertPage,
    basicDialog,
    upParametersPage,
    actionPage,
    reportPage
  },
  data() {
    return {
      assertMap: { code: '', type: 'Status', desc: '', content: '' },
      fPosition: 5,
      itemsAssert: [{}],
      itemsUpParameters: [{}],
      dataRec: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogUpVisible: false,
      actionVisible: false,
      reportVisible: false
    }
  },

  methods: {
    //  add assertData
    addAssert: function() {
      this.itemsAssert.push(this.assertMap)
      console.log(this.itemsAssert, 'aaaa')
    },
    // delete assertData
    delAssert: function(index) {
      //  not allow to delete the first
      if (index !== 0) {
        this.itemsAssert.splice(index, 1)
        console.log('deleted:', JSON.stringify(this.itemsAssert))
      }
    },
    //  get the assertData from child
    getDataAssert: function(val) {
      const index = val.index
      this.itemsAssert[index] = val.data
      console.log('I got the data:', JSON.stringify(this.itemsAssert))
    },
    //  add upVisibleData
    addUpVisible: function() {
      this.itemsUpParameters.push({
        gkey: '',
        rkey: '',
        gtype: 'Json',
        rtype: 'Json',
        position: ''
      })
    },
    // delete upVisibleData
    delUpVisible: function(index) {
      //  not allow to delete the first
      if (index !== 0) {
        this.itemsUpParameters.splice(index, 1)
        console.log('deleted:', JSON.stringify(this.itemsUpParameters))
      }
    },
    //  get the upVisibleData from child
    getDataUpVisible: function(val) {
      const index = val.index
      this.itemsUpParameters[index] = val.data
      console.log('I got the data:', JSON.stringify(this.itemsUpParameters))
    },
    closeDialog(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          location.reload()
        })
        .catch(_ => {})
    },
    callOf(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: left;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: left;
  line-height: 20px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
