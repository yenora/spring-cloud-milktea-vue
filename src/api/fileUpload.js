import request from '@/utils/request'

export function deleteFile(data) {
  return request({
    url: '/v1/file/deleteFile',
    method: 'post',
    data
  })
}

export function downloadFile(data) {
  return request({
    url: '/v1/file/downloadFile',
    method: 'post',
    data
  })
}
