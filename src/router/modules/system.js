/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  name: 'System',
  meta: {
    title: 'System',
    icon: 'table'
  },
  children: [
    {
      path: 'userInfo',
      component: () => import('@/views/system/userInfo'),
      name: 'UserInfo',
      meta: { title: 'UserInfo' }
    },
    {
      path: 'groupInfo',
      component: () => import('@/views/system/groupInfo'),
      name: 'GroupInfo',
      meta: { title: 'GroupInfo' }
    }
  ]
}
export default systemRouter
