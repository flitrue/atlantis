/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

export default {
  path: '/project',
  component: Layout,
  name: 'project',
  meta: {
    roles: ['ADMIN', 'USER'],
    title: '项目',
    icon: 'cases_3'
  },
  hidden: true,
  children: [
    {
      path: '',
      component: () => import('@/views/project'),
      name: '',
      meta: { title: '查询全部', icon: 'base_2' }
    }
  ]
}
