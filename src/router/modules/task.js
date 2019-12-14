/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const taskRouter = {
  path: '/tasks',
  component: Layout,
  redirect: 'task/editTask',
  alwaysShow: true,
  name: 'tasks',
  meta: {
    title: '任务',
    icon: 'lock',
    roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [
    // {
    //   path: 'user',
    //   name: 'SELF',
    //   component: () => import('@/views/atlantis/task/index'),
    //   meta: { title: '个人', icon: 'user' }
    // },
    // {
    //   path: 'group',
    //   name: 'GROUP',
    //   component: () => import('@/views/atlantis/task/index'),
    //   meta: { title: '所属组', icon: 'peoples' }
    // },
    // {
    //   path: 'all',
    //   name: 'ALL',
    //   component: () => import('@/views/atlantis/task/index'),
    //   meta: { title: '全部', icon: 'all' }
    // },
    {
      path: 'editTask',
      name: 'editTask',
      component: () => import('@/views/task/editTask'),
      meta: { title: '编辑任务', icon: 'edit' }
    },
    {
      path: 'task/editStep',
      name: 'editStep',
      component: () => import('@/views/task/editStep'),
      meta: { title: '编辑用例', icon: 'edit' }
    },
    {
      path: 'testJson',
      name: 'testJson',
      component: () => import('@/views/task/jsondate'),
      meta: { title: 'testJson', icon: 'edit' }
    }
  ]
}

export default taskRouter
