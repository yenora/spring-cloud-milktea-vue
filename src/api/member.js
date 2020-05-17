import request from '@/utils/request'

export function pageList(query) {
  return request({
    url: '/v1/member/pageResult',
    method: 'post',
    data: query
  })
}

export function delData(id) {
  return request({
    url: '/v1/member/' + id,
    method: 'delete'
  })
}

export function insertData(data) {
  return request({
    url: '/v1/member/add',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/v1/member/update',
    method: 'put',
    data
  })
}
