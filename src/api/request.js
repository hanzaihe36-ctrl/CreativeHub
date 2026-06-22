/**
 * axios 实例封装
 * 请求/响应拦截器 + 统一错误处理
 */

import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 可从 localStorage 获取 token（预留）
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    // Mock.js 直接返回 { code, data, message }
    if (res.code !== 0) {
      console.warn(`[API] ${response.config.url} 返回错误:`, res.message)
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res.data
  },
  error => {
    console.error('[API] 请求失败:', error.message)
    return Promise.reject(error)
  }
)

export default request
