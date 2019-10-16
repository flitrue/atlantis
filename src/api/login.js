import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    userName: username,
    password: password
  }
  return request({
    url: '/user/login',
    method: 'post',
    data: data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

