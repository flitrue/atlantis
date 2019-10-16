import request from '@/utils/request1'

export function getWorkType(params) {
  return request({
    url: '/dictionary/workType/getWorkType',
    method: 'get',
    params
  })
}
