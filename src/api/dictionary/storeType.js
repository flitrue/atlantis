import request from '@/utils/request'

export function fachList(params) {
  return request({
    url: '/dictionary/storeType/find',
    method: 'get',
    params
  })
}

export function fachAll() {
  return request({
    url: '/dictionary/storeType/findAll',
    method: 'get'
  })
}

export function save(params) {
  return request({
    url: '/dictionary/storeType/save',
    method: 'post',
    data: params
  })
}

export function update(params) {
  return request({
    url: '/dictionary/storeType/update',
    method: 'post',
    data: params
  })
}

export function remove(params) {
  return request({
    url: '/dictionary/storeType/remove',
    method: 'post',
    data: params
  })
}
