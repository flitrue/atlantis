/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const systemRouter = {
  path: 'system',
  component: Layout,
  name: 'system',
  meta: {
    roles: ['ADMIN'],
    title: '系统管理',
    icon: 'nested'
  },
  children: [
    {
      path: '/testCategory',
      component: () => import('@/views/atlantis/system/testCategory/index'),
      meta: { title: '测试类别', icon: 'clipboard' }
    },
    {
      path: '/user',
      component: () => import('@/views/atlantis/system/user/index'),
      name: 'user',
      meta: { title: '用户管理', icon: 'user' },
      children: []
    },
    {
      path: '/group',
      component: () => import('@/views/atlantis/system/group/index'),
      name: 'group',
      meta: { title: '用户分组管理', icon: 'peoples' },
      children: []
    },
    {
      path: '/menu',
      component: () => import('@/views/atlantis/system/menu/index'),
      name: 'menu',
      meta: { title: '菜单管理', icon: 'list' },
      children: []
    },
    {
      path: '/permission',
      component: () => import('@/views/atlantis/system/permission/index'),
      name: 'permission',
      meta: { title: '操作权限管理', icon: 'eye' },
      children: []
    },

    // 分组编辑权限
    {
      path: 'group/editMenuPerm',
      component: () => import('@/views/atlantis/system/group/editMenuPerm'),
      name: 'editMenuPerm',
      meta: { title: '编辑菜单权限', icon: 'edit' },
      hidden: true
    }
  ]
  // path: '/interface',
  // component: Layout,
  // name: 'interface',
  // meta: {
  //   title: '基础信息',
  //   icon: 'base_2'
  // },
  // children: [
  //   {
  //     path: '001',
  //     component: () => import('@/views/basic/index'),
  //     name: '001',
  //     meta: { title: '订单支付组', icon: 'folder_close' },
  //     children: []
  //   }
  // ]
}

export default systemRouter
