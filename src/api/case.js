import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/cases/base/find.do',
    method: 'get',
    params
  })
}

export function deletedCase(params) {
  return request({
    url: '/cases/base/remove',
    method: 'post',
    params
  })
}

export function caseClone(params) {
  return request({
    url: '/cases/base/caseClone',
    method: 'post',
    params
  })
}

export function createCase(params) {
  return request({
    url: '/cases/step/saveAll',
    method: 'post',
    data: params
  })
}

export function caseRun(params, env) {
  return request({
    url:
      '/cases/step/testRunCase.do?executionEnv=' +
      env +
      '&executionType=IMMEDIATELY',
    method: 'post',
    data: params
  })
}

export function findCase(params) {
  return request({
    url: '/cases/step/find',
    method: 'get',
    params
  })
}

export function getParamData(params) {
  return request({
    url: '/interfac/basicFormatR/getFormatData',
    method: 'get',
    params
  })
}

export function getDubboParamData(params) {
  return request({
    url: '/dubbo/formatR/getDubboParams',
    method: 'get',
    params
  })
}

export function getGroupTree(params) {
  return request({
    url: '/dictionary/bsinessType/getBusinessTypeTree',
    method: 'get',
    params
  })
}

export function reportTestRun(params) {
  return request({
    // url: '/cases/step/testRun',
    url: '/cases/step/newTestRun',
    method: 'post',
    data: params
  })
}

export function mockFunc() {
  return request({
    url: '/mock/format/findFormat',
    method: 'get'
  })
}

export function globalDataEdit(params) {
  return request({
    url: '/global/globalvari/saveOrUpdate',
    method: 'post',
    data: params
  })
}

export function globalDataDel(params) {
  return request({
    url: '/global/globalvari/remove',
    method: 'post',
    data: params
  })
}

export function findByCaseIds(params) {
  return request({
    url: '/cases/base/findByIds',
    method: 'get',
    params
  })
}

export function updateCaseOperation(id, data, options = {}) {
  return request.patch(`/cases/step/${id}/operations`, data, options)
}
