import request from '@/utils/request'

export function getWorkType(params) {
  return request({
    url: '/dictionary/workType/getWorkType',
    method: 'get',
    params
  })
}
