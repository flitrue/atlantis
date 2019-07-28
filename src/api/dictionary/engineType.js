import request from '@/utils/request'

export function fachList(params) {
  return request({
    url: '/dictionary/engineType/find',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/dictionary/engineType/save',
    method: 'post',
    data: params
  })
}

export function update(params) {
  return request({
    url: '/dictionary/engineType/update',
    method: 'post',
    data: params
  })
}

export function remove(params) {
  return request({
    url: '/dictionary/engineType/remove',
    method: 'post',
    data: params
  })
}
