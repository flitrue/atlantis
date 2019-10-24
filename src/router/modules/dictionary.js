import Layout from '@/views/layout/Layout'

const dictionaryRouter = {
  path: 'dictionary',
  component: Layout,
  name: 'dictionary',
  meta: { roles: ['ADMIN', 'USER'], title: '字典管理', icon: 'list' },
  children: [

    {
      path: '/businessType',
      name: 'businessType',
      component: () => import('@/views/atlantis/dictionary/busnessType/index'),
      meta: {
        title: '业务分组',
        icon: 'clipboard'
      }
    },
    {
      path: '/workType',
      name: 'workType',
      component: () => import('@/views/atlantis/dictionary/workType/index'),
      meta: {
        title: '执行环境',
        icon: 'clipboard'
      }
    },
    {
      path: '/storeType',
      name: 'storeType',
      component: () => import('@/views/atlantis/dictionary/storeType/index'),
      meta: {
        title: '仓库地址',
        icon: 'clipboard'
      }
    },
    {
      path: '/engineType',
      name: 'engineType',
      component: () => import('@/views/atlantis/dictionary/engineType/index'),
      meta: {
        title: '执行引擎',
        icon: 'clipboard'
      }
    }
  ]
}

export default dictionaryRouter
