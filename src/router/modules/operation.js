/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

export default {
  path: '/operation',
  component: Layout,
  name: 'operation',
  meta: {
    roles: ['ADMIN', 'USER']
  },
  hidden: true,
  children: [
    // 用例新增
    // {
    //   path: 'new',
    //   hidden: true,
    //   component: () => import('@/views/operation/new'),
    //   name: 'newOperation',
    //   meta: { title: '添加用例操作' }
    // },
    // {
    //   path: 'batchNew',
    //   hidden: true,
    //   component: () => import('@/views/operation/batchNew'),
    //   name: 'batchNewOperation',
    //   meta: { title: '批量添加用例操作' }
    // }
  ]
}
