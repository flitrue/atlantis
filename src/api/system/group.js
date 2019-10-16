import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/system/group/find.do',
    method: 'get',
    params
  })
}

export function deletedCase(params) {
  return request({
    url: '/system/group/remove',
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
