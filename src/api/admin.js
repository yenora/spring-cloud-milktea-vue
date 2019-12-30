import request from '@/utils/request'

export function getNameArray(key) {
  return request({
    url: '/v1/admin/array/name',
    method: 'get',
    params: { key }
  })
}

export function registry(data) {
  return request({
    url: '/v1/admin/add',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/v1/admin/login',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/v1/admin/update',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/v1/admin/' + id,
    method: 'delete'
  })
}

export function getInfo(token) {
  return request({
    url: '/v1/admin/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/v1/admin/logout',
    method: 'post'
  })
}
