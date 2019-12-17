import request from '@/utils/request'

export function prosearchstaple(ids) {
  return request({
    url: '/v1/product/staple/getByIds',
    method: 'post',
    params: { ids }
  })
}
