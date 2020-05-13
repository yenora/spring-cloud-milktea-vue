import request from '@/utils/request'

/**
 * 产品相关接口
 */
export function productList(query) {
  return request({
    url: '/v1/product/pageResult',
    method: 'post',
    data: query
  })
}

export function productDel(id) {
  return request({
    url: '/v1/product/' + id,
    method: 'delete'
  })
}

export function productInsert(data) {
  return request({
    url: '/v1/product/add',
    method: 'post',
    data
  })
}

export function productUpdate(data) {
  return request({
    url: '/v1/product/update',
    method: 'put',
    data
  })
}

export function queryProductListBySize(size) {
  return request({
    url: '/v1/product/query/list/size',
    method: 'post',
    params: { size }
  })
}

/**
 * 产品类型相关接口
 */
export function typeList(query) {
  return request({
    url: '/v1/product/type/pageResult',
    method: 'post',
    data: query
  })
}

export function typeDel(id) {
  return request({
    url: '/v1/product/type/' + id,
    method: 'delete'
  })
}

export function typeInsert(data) {
  return request({
    url: '/v1/product/type/add',
    method: 'post',
    data
  })
}

export function typeUpdate(data) {
  return request({
    url: '/v1/product/type/update',
    method: 'put',
    data
  })
}

export function queryTypelist(data) {
  return request({
    url: '/v1/product/type/query/list',
    method: 'post',
    data
  })
}

/**
 * 产品种类相关接口
 */
export function stapleList(query) {
  return request({
    url: '/v1/product/staple/pageResult',
    method: 'post',
    data: query
  })
}

export function stapleDel(id) {
  return request({
    url: '/v1/product/staple/' + id,
    method: 'delete'
  })
}

export function stapleInsert(data) {
  return request({
    url: '/v1/product/staple/add',
    method: 'post',
    data
  })
}

export function stapleUpdate(data) {
  return request({
    url: '/v1/product/staple/update',
    method: 'put',
    data
  })
}

export function queryStapleList(data) {
  return request({
    url: '/v1/product/staple/query/list',
    method: 'post',
    data
  })
}
