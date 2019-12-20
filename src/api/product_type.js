import request from '@/utils/request'

export function protypelist(data) {
  return request({
    url: '/v1/product/type/query/list',
    method: 'post',
    data
  })
}
