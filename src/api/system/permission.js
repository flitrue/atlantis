import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/system/permission/find.do',
    method: 'get',
    params
  })
}

export function deletedCase(params) {
  return request({
    url: '/system/permission/remove',
    method: 'post',
    params
  })
}

// export function getGroupTree(params) {
//   return request({
//     url: '/dictionary/bsinessType/getBusinessTypeTree',
//     method: 'get',
//     params
//   })
// }
