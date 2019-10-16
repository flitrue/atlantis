import request from '@/utils/request'

export function getDashboard() {
  return request({
    url: '/dashboard/getDashboard.do',
    method: 'get'

  })
}
