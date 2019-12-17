import request from '@/utils/request'

export function prosearchtype(id) {
  return request({
    url: '/v1/product/type/getById',
    method: 'post',
    params: { id }
  })
}
