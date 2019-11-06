import { findAll } from '@/api/system/testCategory'
import { fachList as fetchEngineType } from '@/api/dictionary/engineType'
import { fachAll as fetchStoreType } from '@/api/dictionary/storeType'
// import { fachList as fetchWorkType } from '@/api/dictionary/workType'

const basic = {
  namespaced: true,
  state: {
    categories: [],
    // 所有测试类型
    allCategories: [],
    // 当前选中测试类型
    selCategory: '',
    businessTree: [],
    engineTypes: [],
    storeTypes: []
  },
  mutations: {
    ADD_TEST_CATEGORY: (state, category) => {
      state.categories.push(category)
    },
    SET_TEST_CATEGORY: (state, categories) => {
      state.categories = categories
    },
    SET_ALL_CATEGORY: (state, allCategories) => {
      state.allCategories = allCategories
    },
    SET_BUSINESS_TREE: (state, businessTree) => {
      state.businessTree = businessTree
    },
    SET_SEL_CATEGORY: (state, selCategory) => {
      state.selCategory = selCategory
    }
  },
  actions: {
    addTestCategory({ commit }, category) {
      commit('ADD_TEST_CATEGORY', category)
    },
    setTestCategory({ commit }, categories) {
      commit('SET_TEST_CATEGORY', categories)
    },
    setBusinessTree({ commit }, businessTree) {
      commit('SET_BUSINESS_TREE', businessTree)
    },
    setSelCategory({ commit }, selCategory) {
      commit('SET_SEL_CATEGORY', selCategory)
    },
    // 初始化测试类型，业务分组
    initSetCategory({ commit }) {
      return findAll().then(response => {
        const categoryList = response.data.retList
        const checkList = response.data.codeList
        const selCategory = response.data.code
        const businessTreeList = response.data.businessTypeTree
        const allGroupCodes = getAllGroupCodes(businessTreeList)

        commit('SET', { 'basic.allGroupCodes': allGroupCodes })
        commit('SET_BUSINESS_TREE', businessTreeList)
        commit('SET_TEST_CATEGORY', checkList)
        commit('SET_ALL_CATEGORY', categoryList)
        commit('SET_SEL_CATEGORY', selCategory)
      })
    },
    initEngineTypes({ commit }) {
      return fetchEngineType().then(({ data: res }) => {
        const { data } = res
        commit('SET', { 'basic.engineTypes': data.result })
      })
    },
    initStoreType({ commit }) {
      return fetchStoreType().then(({ data: res }) => {
        const { data } = res
        commit('SET', { 'basic.storeTypes': data.storeTypeList })
      })
    },
    // 获取前置数据
    initStore() {
      Promise.all([
        this.dispatch('initEngineTypes'),
        this.dispatch('initSetCategory'),
        this.dispatch('initStoreType')
      ]).then(() => this.dispatch('GenerateRoutes'))
    }
  }
}

function getAllGroupCodes(tree = [], allGroupCodes = []) {
  tree.forEach(node => {
    if (node.groupCode) {
      allGroupCodes.push(node)
    }
    if (node.sonTypes) {
      getAllGroupCodes(node.sonTypes, allGroupCodes)
    }
  })
  return allGroupCodes
}

export default basic
