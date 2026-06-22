/**
 * 作品相关 API
 */

import request from './request'

/**
 * 获取作品列表
 * @param {Object} params - { sort, categoryId, tag, keyword, authorId, status, page, pageSize }
 */
export function getWorks(params = {}) {
  return request.get('/works', { params })
}

/**
 * 获取作品详情
 * @param {number} id 作品ID
 */
export function getWorkDetail(id) {
  return request.get(`/works/${id}`)
}

/**
 * 创建作品
 * @param {Object} data 作品数据
 */
export function createWork(data) {
  return request.post('/works', data)
}

/**
 * 更新作品
 * @param {number} id 作品ID
 * @param {Object} data 更新的字段
 */
export function updateWork(id, data) {
  return request.put(`/works/${id}`, data)
}

/**
 * 删除作品
 * @param {number} id 作品ID
 */
export function deleteWork(id) {
  return request.delete(`/works/${id}`)
}
