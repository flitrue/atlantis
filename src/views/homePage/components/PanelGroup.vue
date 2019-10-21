<template>
  <el-row :gutter="40" class="panel-group">

    <el-col v-for="(item,index) in categoryList" :xs="12" :sm="12" :lg="8" :key="index" class="card-panel-col" >
      <div :style="changeStyle(item, true)" class="card-panel" @click="colClick(item)">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description" >
          <el-tooltip :content="item.desc" class="item" effect="dark" placement="bottom-end">
            <div :style="changeStyle(item)" class="card-panel-text">{{ item.categoryName }}</div>
          </el-tooltip>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>

export default {

  data() {
    return {
      loading: false,
      categoryCheckList: [],
      categoryList: [],
      category: undefined

    }
  },
  computed: {

  },
  created() {
    this.initCategory()
  },
  methods: {
    initCategory() {
      this.categoryCheckList = this.$store.getters.categories
      this.categoryList = this.$store.getters.allCategories
      this.category = this.$store.getters.selCategory
    },
    trimStr(str) {
      var retStr = str
      if (retStr.length > 6) {
        retStr = retStr.substring(0, 6)
      }
      return retStr
    },
    colClick(item) {
      this.category = item.categoryCode
      this.$store.dispatch('setSelCategory', this.category)
      this.$router.push({ path: '/project' })
    },
    changeStyle(item, outSide) {
      if (item.categoryCode === this.category) {
        return outSide ? 'background-color:rgba(0, 0, 0, 0.1)' : 'font-size:20px;font-color：#34bfa3;'
      } else {
        return ''
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:click {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
