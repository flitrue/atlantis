
<template>
  <section>
    <el-form-item label="jar 包">
      <el-upload
        action="/atlantis/operations/jar"
        accept=".jar"
        :file-list="fileList"
        :on-change="handleUploadChange"
        :on-success="handleUpload"
        drag
        class="upload-demo"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </el-form-item>
    <el-form-item label="导入列表">
      <el-table :data="functionList" border>
        <el-table-column prop="method" label="方法名称" />
        <el-table-column prop="name" label="操作名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" />
          </template>
        </el-table-column>
        <el-table-column label="操作类型">
          <template slot-scope="scope">
            <el-select v-model="scope.row.type">
              <el-option label="数据" value="data" />
              <el-option label="断言" value="assert" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="groupCode" label="分组">
          <template slot-scope="scope">
            <GroupSelect v-model="scope.row.groupCode" />
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.desc" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作"></el-table-column> -->
      </el-table>
    </el-form-item>
  </section>
</template>

<script>
import GroupSelect from '@/components/GroupSelect'

export default {
  components: { GroupSelect },
  props: {
    groupCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileList: [],
      functionList: []
    }
  },
  methods: {
    handleUploadChange(file, fileList) {
      if (fileList.length > 1) {
        this.fileList = fileList.slice(-1)
      }
    },
    handleUpload(res) {
      if (res.errcode) {
        this.$message({
          title: '失败',
          message: res.errmsg,
          type: 'error',
          duration: 2000
        })
      } else {
        res.data.forEach(d => {
          d.groupCode = this.groupCode
          d.name = d.method
          d.type = 'data'
          d.mode = 'jar'
        })
        this.functionList = res.data
      }
    }
  }
}
</script>
