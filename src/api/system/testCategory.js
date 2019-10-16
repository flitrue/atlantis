import request from '@/utils/request'

export function find(params) {
  return request({
    url: '/system/testCategory/find',
    method: 'get',
    params
  })
}

export function findAll() {
  return request({
    url: '/system/testCategory/findAll',
    method: 'get'

  })
}

export function save(params) {
  return request({
    url: '/system/testCategory/save',
    method: 'post',
    data: params
  })
}

export function update(params) {
  return request({
    url: '/system/testCategory/update',
    method: 'post',
    data: params
  })
}
