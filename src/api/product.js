import request from '@/utils/request'

export function prolist(query) {
  return request({
    url: '/v1/product/pageResult',
    method: 'post',
    data: query
  })
}

export function prodel(id) {
  return request({
    url: '/v1/product/del',
    method: 'get',
    params: { id }
  })
}

export function proinsert(data) {
  return request({
    url: '/v1/product/create',
    method: 'post',
    data
  })
}

export function proupdate(data) {
  return request({
    url: '/v1/product/update',
    method: 'post',
    data
  })
}
