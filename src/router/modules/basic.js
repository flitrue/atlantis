/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const basicRouter = {
  path: '/interface',
  component: Layout,
  name: 'interface',
  dynType: 'basic',
  meta: {
    roles: ['ADMIN', 'USER'],
    icon: 'base_2'
  },
  hidden: true,
  children: [
    // 添加接口
    {
      path: 'addBasic',
      component: () => import('@/views/interface/editStep'),
      name: 'addBasic',
      meta: { title: '添加基础信息', icon: 'base_2' },
      hidden: true
    },
    {
      path: 'import',
      component: () => import('@/views/interface/import'),
      name: 'import',
      meta: { title: '从 swagger 导入' },
      hidden: true
    },
    {
      path: 'dubboInfo',
      component: () => import('@/views/interface/dubboInfo'),
      name: 'Dubbo基础信息',
      hidden: true,
      meta: {
        title: 'Dubbo基础信息'
      }
    }
    // {
    //   path: 'basicAll',
    //   component: () => import('@/views/basic/index'),
    //   name: 'all',
    //   meta: { title: '查询全部', icon: 'folder_close' },
    //   children: []
    // }
  ]
}

export default basicRouter
