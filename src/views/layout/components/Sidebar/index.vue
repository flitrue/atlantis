<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-radio-group v-model="activeName" size="small" class="switch-tab">
      <el-radio-button label="project">
        项目
      </el-radio-button>
      <el-radio-button label="setting">
        配置
      </el-radio-button>
    </el-radio-group>
    <el-menu
      v-if="activeName === 'project'"
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      mode="vertical"
    >
      <sidebar-item
        v-for="route in projectRouters"
        :key="route.path"
        :item="route"
        :base-path="'project/' + route.path"
      />
    </el-menu>
    <el-menu
      v-if="activeName === 'setting'"
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      mode="vertical"
    >
      <sidebar-item
        v-for="route in routers"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem },
  data() {
    return {
      activeName: 'project'
    }
  },
  computed: {
    ...mapGetters(['projectRouters', 'sidebar', 'routers']),
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style lang="scss">
.scrollbar-wrapper {
  background: rgb(48, 65, 86);
  // padding-top: 50px;
  // position: relative;
  .switch-tab {
    margin: 15px auto;
    display: block;
    text-align: center;
    // position: fixed;
    // top: 15px;
    // left: 50%;
    // transform: translateX(-50%);
  }
}
</style>
