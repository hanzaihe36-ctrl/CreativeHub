/**
 * localStorage 封装
 * 提供类型安全的读写操作，自动 JSON 序列化/反序列化
 */

const PREFIX = 'ch_'

export const storage = {
  /**
   * 读取数据
   * @param {string} key
   * @param {*} defaultValue 默认值
   */
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      if (raw === null) return defaultValue
      return JSON.parse(raw)
    } catch {
      return defaultValue
    }
  },

  /**
   * 写入数据
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch (e) {
      console.error(`[storage] 写入 "${key}" 失败:`, e)
    }
  },

  /**
   * 删除数据
   * @param {string} key
   */
  remove(key) {
    localStorage.removeItem(PREFIX + key)
  },

  /**
   * 清空所有 CreativeHub 相关数据
   */
  clear() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX))
    keys.forEach(k => localStorage.removeItem(k))
  },

  /**
   * 获取所有 key
   */
  keys() {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .map(k => k.slice(PREFIX.length))
  }
}
