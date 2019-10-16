import request from '@/utils/request'

// 回显dubbo接口信息
export function find(params) {
  return request({
    url: '/dubbo/formatR/find',
    method: 'get',
    params
  })
}

// 保存
export function save(params) {
  return request({
    url: '/dubbo/formatR/save',
    method: 'post',
    data: params
  })
}

// 修改
export function update(params) {
  return request({
    url: '/dubbo/formatR/update',
    method: 'post',
    data: params
  })
}

// 获取所有dubbo service的列表
export function getDubboService(params) {
  return request({
    url: '/dubbo/formatR/getDubboService',
    method: 'post',
    data: params
  })
}

// dubbo试运行
export function testRunDubbo(params) {
  return request({
    url: '/dubbo/formatR/testRunDubbo',
    method: 'post',
    data: params
  })
}

// 导入json
export function importJson(data) {
  return request({
    url: '/basic/format/swagger/import/json',
    method: 'post',
    data
  })
}

export function getServiceProvider(params) {
  return request({
    url: '/dubbo/formatR/service/provider',
    method: 'get',
    params
  })
}

export function getFormatRService(params) {
  return request({
    url: '/dubbo/formatR/service',
    method: 'get',
    params
  })
}
