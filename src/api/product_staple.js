import request from '@/utils/request'

export function prostaplelist(data) {
  return request({
    url: '/v1/product/staple/query/list',
    method: 'post',
    data
  })
}
