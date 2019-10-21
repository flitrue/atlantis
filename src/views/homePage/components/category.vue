<template>
  <div>
    <el-radio-group v-model="category" size="small">
      <el-radio-button label="" key="all">全部</el-radio-button>
      <el-radio-button
        v-for="item in categoryList"
        :label="item.categoryCode"
        :key="item.categoryCode"
        >{{ item.categoryName }}</el-radio-button
      >
    </el-radio-group>
    <!-- <el-checkbox-group v-model="categoryCheckList" size="mini" @change="checkChange">
      <el-checkbox v-for="(item) in categoryList" :label="item.categoryCode" :key="item.categoryCode" style="margin-right:10px">{{ item.categoryName }}</el-checkbox>
    </el-checkbox-group> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false
    }
  },
  computed: {
    category: {
      get() {
        return this.$store.getters.selCategory
      },
      set(v) {
        this.$store.dispatch('setSelCategory', v)
      }
    },
    categoryCheckList() {
      return this.$store.getters.categories
    },
    categoryList() {
      return this.$store.getters.allCategories
    }
  },
  watch: {
    category(v) {
      this.$emit('change', v)
    }
  },
  methods: {
    setCategory(category) {
      this.category = category
    },
    setAllCategory(list) {
      this.categoryList = list
    }
  }
}
</script>
