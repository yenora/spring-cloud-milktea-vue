import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/v1/admin/login',
    method: 'post',
    data
  })
}

export function logout(token) {
  return request({
    url: '/v1/admin/logout',
    method: 'post',
    params: { token }
  })
}

export function registry(data) {
  return request({
    url: '/v1/admin/add',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/v1/admin/info',
    method: 'get',
    params: { token }
  })
}

export function updateInfo(data) {
  return request({
    url: '/v1/admin/update',
    method: 'post',
    data
  })
}

export function delInfo(id) {
  return request({
    url: '/v1/admin/' + id,
    method: 'delete'
  })
}
