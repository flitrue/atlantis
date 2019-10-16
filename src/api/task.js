import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/task/taskBase/find.do',
    method: 'post',
    data: params
  })
}
// 批量删除
export function deleteTask(params) {
  return request({
    url: '/task/taskBase/remove',
    method: 'post',
    params
  })
}

// 任务执行
export function execTask(params) {
  return request({
    url: '/task/taskBase/execTask',
    method: 'post',
    params
  })
}

// 取消定时任务
export function timingTaskCancel(params) {
  return request({
    url: '/task/taskBase/timingTaskCancel',
    method: 'post',
    data: params
  })
}

// 保存任务
export function save(params) {
  return request({
    url: '/task/taskBase',
    method: 'post',
    data: params
  })
}

// 修改任务
export function update(params) {
  return request({
    url: '/task/taskBase/update',
    method: 'post',
    data: params
  })
}

// 编辑回显任务
export function findById(params) {
  return request({
    url: '/task/taskBase/findById',
    method: 'get',
    params
  })
}

export function editTaskStep(params) {
  return request({
    url: '/task/taskBase/findCaseBy',
    method: 'get',
    params
  })
}

export function findCaseSteps(params) {
  return request({
    url: '/task/steps',
    method: 'get',
    params
  })
}
