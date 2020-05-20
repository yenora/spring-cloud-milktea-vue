import request from '@/utils/request'

/**
 * 订单相关接口
 */
export function pageList(query) {
  return request({
    url: '/v1/orders/pageResult',
    method: 'post',
    data: query
  })
}

export function delData(id) {
  return request({
    url: '/v1/orders/' + id,
    method: 'delete'
  })
}

/**
 * 订单详情相关接口
 */
export function queryDetailList(query) {
  return request({
    url: '/v1/orders/detail/query/list',
    method: 'post',
    data: query
  })
}
