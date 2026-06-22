/**
 * 用户相关 API
 */

import request from './request'

/**
 * 登录
 * @param {string} email 邮箱
 * @param {string} password 密码
 */
export function login(email, password) {
  return request.post('/login', { email, password })
}

/**
 * 注册
 * @param {Object} data - { username, email, password }
 */
export function register(data) {
  return request.post('/register', data)
}

/**
 * 获取用户列表
 * @param {Object} params - { keyword }
 */
export function getUsers(params = {}) {
  return request.get('/users', { params })
}

/**
 * 获取用户详情
 * @param {number} id 用户ID
 */
export function getUserDetail(id) {
  return request.get(`/users/${id}`)
}

/**
 * 更新用户信息
 * @param {number} id 用户ID
 * @param {Object} data 更新的字段
 */
export function updateUser(id, data) {
  return request.put(`/users/${id}`, data)
}

/**
 * 获取用户数据统计
 * @param {number} id 用户ID
 */
export function getUserStats(id) {
  return request.get(`/stats/${id}`)
}
