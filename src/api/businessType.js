import request from '@/utils/request'

export function getGroupTree(params) {
  // const cacheData = window.localStorage.getItem('businessTypeTree')
  // if (cacheData) return Promise.resolve(JSON.parse(cacheData))

  return request({
    url: '/dictionary/bsinessType/getBusinessTypeTree',
    method: 'get',
    params
  })
  // .then(data => {
  //   window.localStorage.setItem('businessTypeTree', JSON.stringify(data))
  //   return data
  // })
}

export function getLevelOneData(params) {
  return request({
    url: '/dictionary/bsinessType/find',
    method: 'get',
    params
  })
}

export function getSonData(params) {
  return request({
    url: '/dictionary/bsinessType/findSonGroup',
    method: 'post',
    params
  })
}

export function saveData(params) {
  return request({
    url: '/dictionary/bsinessType/save',
    method: 'post',
    data: params
  })
}

export function editData(params) {
  return request({
    url: '/dictionary/bsinessType/update',
    method: 'post',
    data: params
  })
}

export function deleteData(params) {
  return request({
    url: '/dictionary/bsinessType/remove',
    method: 'post',
    data: params
  })
}
