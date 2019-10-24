/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const reportRouter = {
  path: '/reports',
  component: Layout,
  name: 'reports',
  // meta: { roles: ['ADMIN', 'USER'], icon: 'report' },
  hidden: true,
  children: [
    {
      path: 'user',
      name: 'SELF',
      component: () => import('@/views/report/index'),
      meta: { title: '个人', icon: 'user' }
    },
    {
      path: 'group',
      name: 'GROUP',
      component: () => import('@/views/report/index'),
      meta: { title: '所属组', icon: 'peoples' }
    },
    {
      path: 'all',
      name: 'ALL',
      component: () => import('@/views/report/index'),
      meta: { title: '全部', icon: 'all' }
    },
    {
      path: 'reportDetailList',
      name: 'reportDetailList',
      hidden: true,
      component: () => import('@/views/report/reportDetailList'),
      meta: { title: '报告列表详情', icon: 'user' }
    }
  ]
}

export default reportRouter
