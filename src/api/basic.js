import request from '@/utils/request'

const mockUrl = ''
// const mockUrl = 'http://api-doc.fiiish.cn/mock/272/atlantis'

export function getList(params) {
  return request({
    url: '/basic/format/find.do',
    method: 'get',
    params
  })
}

export function findByIds(params) {
  return request({
    url: '/basic/format/findByIds',
    method: 'get',
    params
  })
}

export function importJson(params) {
  return request({
    url: '/basic/json/uploadJson',
    method: 'post',
    params
  })
}

export function remove(params) {
  return request({
    url: '/basic/format/remove',
    method: 'post',
    params
  })
}

export function foramtInfoEdit(params) {
  let urlString
  if (params.id === '' || params.id === undefined) {
    delete params.id
    urlString = '/basic/format/save'
  } else {
    urlString = '/basic/format/update'
  }
  return request({
    url: urlString,
    method: 'post',
    data: params
  })
}

export function formatClone(params) {
  return request({
    url: '/basic/format/clone',
    method: 'post',
    params
  })
}

export function foramtDetail(params) {
  return request({
    url: '/interfac/basicFormatR/find',
    method: 'get',
    params
  })
}

export function basicFormatRSave(params, funcm) {
  let urlString
  if (funcm === 'save') {
    urlString = '/interfac/basicFormatR/save'
  } else {
    urlString = '/interfac/basicFormatR/update'
  }
  return request({
    url: urlString,
    method: 'post',
    data: params
  })
}

export function fetchSwaggerList(url, engineTypeId) {
  return request.get(`${mockUrl}/basic/format/swagger/import`, {
    pureData: true,
    params: { url, engineTypeId }
  })
}

export function batchUpdateInterface(data) {
  return request.post(`${mockUrl}/basic/format/batch`, data, {
    pureData: true
  })
}
