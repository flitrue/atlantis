import request from '@/utils/request'

export function getWorkType(params) {
  return request({
    url: '/dictionary/workType/getWorkType',
    method: 'get',
    params
  })
}

export function fachList(params) {
  return request({
    url: '/dictionary/workType/find',
    method: 'get',
    params
  })
}

export function saveWorkType(params) {
  return request({
    url: '/dictionary/workType/save',
    method: 'post',
    data: params
  })
}

export function updateWorkType(params) {
  return request({
    url: '/dictionary/workType/update',
    method: 'post',
    data: params
  })
}

export function removeWorkType(params) {
  return request({
    url: '/dictionary/workType/remove',
    method: 'post',
    data: params
  })
}
