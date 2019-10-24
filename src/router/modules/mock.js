/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const basicRouter = {
  path: '/mock',
  component: Layout,
  name: 'mock',
  meta: {
    roles: ['ADMIN', 'USER'],
    icon: 'base_2',
    title: 'MOCK 设置'
  },
  children: [
    // 添加接口
    {
      path: '',
      component: () => import('@/views/mock'),
      meta: { title: 'MOCK 设置' }
    }
  ]
}

export default basicRouter
