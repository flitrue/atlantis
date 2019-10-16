import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/report/reportBase/find.do',
    method: 'post',
    data: params
  })
}
// 批量删除
export function deleteReport(params) {
  return request({
    url: '/report/reportBase/remove.do',
    method: 'post',
    params
  })
}

// 报告用例及step执行结果列表
export function findReportCase(params) {
  return request({
    url: '/report/reportStep/findReport.do',
    method: 'get',
    params
  })
}

// 报告step执行结果详情
export function findStepDetail(params) {
  return request({
    url: '/report/reportStep/findDetail.do',
    method: 'get',
    params
  })
}
