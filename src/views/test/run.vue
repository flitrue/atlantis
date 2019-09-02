<script>
import Sortable from 'sortablejs'
export default {
  data() {
    return {
      colors: [{
        text: 'Aquamarine'
      }, {
        text: 'Hotpink'
      }, {
        text: 'Gold'
      }, {
        text: 'Crimson'
      }, {
        text: 'Blueviolet'
      }, {
        text: 'Lightblue'
      }, {
        text: 'Cornflowerblue'
      }, {
        text: 'Skyblue'
      }, {
        text: 'Burlywood'
      }],
      position: 3,
      items: [{ id: 1 }, { id: 2 }],
      idMap: {},
      col: [
        {
          label: '日期',
          prop: 'date'
        },
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '地址',
          prop: 'address'
        }
      ],
      dropCol: [
        {
          label: '日期',
          prop: 'date'
        },
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '地址',
          prop: 'address'
        }
      ],
      tableData: [
        {
          id: 1,
          date: '2016-05-02',
          name: '王小虎1',
          address: '上海市普陀区金沙江路 100 弄'
        },
        {
          id: 2,
          date: '2016-05-04',
          name: '王小虎2',
          address: '上海市普陀区金沙江路 200 弄'
        },
        {
          id: 3,
          date: '2016-05-01',
          name: '王小虎3',
          address: '上海市普陀区金沙江路 300 弄'
        },
        {
          id: 4,
          date: '2016-05-03',
          name: '王小虎4',
          address: '上海市普陀区金沙江路 400 弄'
        }
      ]
    }
  },
  mounted() {
    this.rowDrop()
    this.columnDrop()
  },
  methods: {
    modifyItems: function() {
      var signal = []
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.idMap[this.tableData[i].id] !== i + 1) {
          signal.push(1)
          this.idMap[this.tableData[i].id] = i + 1
        }
      }
      console.log('tableData: ', this.tableData)
      if (signal.length === 0) {
        return
      }
      for (i = 0; i < this.items.length; i++) {
        this.items[i].id = this.idMap[this.items[i].id]
      }
      console.log(this.idMap)
      this.position = this.idMap[this.position]
      for (i = 0; i < this.tableData.length; i++) {
        this.tableData[i].id = i + 1
      }
      console.log('tableData: ', this.tableData)
    },
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0]
          _this.tableData.splice(newIndex, 0, currRow)
        }
      })
    },
    // 列拖拽
    columnDrop() {
      const wrapperTr = document.querySelector('.el-table__header-wrapper tr')
      this.sortable = Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: evt => {
          const oldItem = this.dropCol[evt.oldIndex]
          this.dropCol.splice(evt.oldIndex, 1)
          this.dropCol.splice(evt.newIndex, 0, oldItem)
        }
      })
    }
  }
}
</script>

<template>

  <div class="color-list">
    <!-- 普通拖拽 -->
    <div class="color-list">
      <div
        v-dragging="{ item: color, list: colors, group: 'a' }"
        v-for="(color) in colors"
        :key="color.text"
        class="color-item">
        {{ color.text }}
      </div>
    </div>
    <!-- 列表拖拽 -->
    <div style="width:800px" @mousedown="modifyItems()">

      <el-table
        :data="tableData"
        border
        row-key="id"
        align="left">
        <el-table-column
          v-for="(item, index) in col"
          :key="`col_${index}`"
          :prop="dropCol[index].prop"
          :label="item.label"/>
      </el-table>
      <pre style="text-align: left">
      {{ dropCol }}
      </pre>
      <!-- <button @click="modifyItems()">测试</button> -->
      <hr>
      <pre style="text-align: left">
      {{ tableData }}
      {{ idMap }}
      {{ items }}
      {{ position }}
      </pre>

    </div>
  </div>

</template>
