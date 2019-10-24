/** When your routing table is too long, you can split it into small modules**/

// import Layout from '@/views/layout/Layout'

const componentMap = {
  cases: () => import('@/views/case'),
  basic: () => import('@/views/interface'),
  project: () => import('@/views/project')
}

export function getBusinessTypeRouter(
  typeRouter,
  businessTreeList,
  type = 'basic'
) {
  const businessTypeTree = deepBusinessTree(
    businessTreeList,
    componentMap[type]
  )

  if (businessTypeTree !== null && businessTypeTree.length > 0) {
    for (var i = 0; i < businessTypeTree.length; i++) {
      typeRouter.children.push(businessTypeTree[i])
    }
  }

  return typeRouter
}

function deepBusinessTree(businessTreeList, component, arr = []) {
  if (businessTreeList != null && businessTreeList.length > 0) {
    for (var i = 0; i < businessTreeList.length; i++) {
      var businessType = businessTreeList[i]
      var nowPath = {
        path: businessType.groupCode,
        component: component,
        name: businessType.groupCode,
        meta: {
          title: businessType.groupName,
          icon: 'folder_close',
          groupCode: businessType.groupCode
        },
        children: []
      }

      var sonTypes = businessType.sonTypes
      if (sonTypes != null && sonTypes.length > 0) {
        var childrenArr = []
        childrenArr.push({
          path: '',
          component: component,
          name: businessType.groupCode,
          meta: {
            title: '全部',
            icon: 'all',
            groupCode: businessType.groupCode
          },
          hidden: false
        })
        var sonArr = deepBusinessTree(sonTypes, component, childrenArr)
        nowPath.children = sonArr
      } else {
        nowPath = {
          path: businessType.groupCode,
          component: component,
          name: businessType.groupCode,
          meta: {
            title: businessType.groupName,
            icon: 'leaf',
            groupCode: businessType.groupCode
          },
          children: []
        }
      }
      arr.push(nowPath)
    }
  }
  return arr
}
