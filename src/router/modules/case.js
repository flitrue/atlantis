/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const caseRouter = {
  path: '/cases',
  component: Layout,
  name: 'cases',
  meta: {
    roles: ['ADMIN', 'USER'],
    icon: 'cases_3'
  },
  hidden: true,
  // dynType: 'cases',
  children: [
    // 用例新增
    {
      path: '/cases/new',
      hidden: true,
      component: () => import('@/views/case/new'),
      name: 'addCases',
      meta: { title: '添加用例信息', icon: 'base_2' }
    }

    // 用例查询全部
    // {
    //   path: '',
    //   component: () => import('@/views/atlantis/case/index'),
    //   name: 'all',
    //   meta: { title: '查询全部', icon: 'base_2' },
    //   hidden: false
    // }
  ]
}

export default caseRouter
