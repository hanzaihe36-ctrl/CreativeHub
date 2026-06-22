/**
 * 日期格式化工具
 */

/**
 * 格式化时间戳为 YYYY-MM-DD
 * @param {number} timestamp 毫秒时间戳
 */
export function formatDate(timestamp) {
  const d = new Date(timestamp)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * 格式化时间戳为 YYYY-MM-DD HH:mm
 * @param {number} timestamp 毫秒时间戳
 */
export function formatDateTime(timestamp) {
  const d = new Date(timestamp)
  const date = formatDate(timestamp)
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${date} ${h}:${min}`
}

/**
 * 相对时间（刚刚、5分钟前、1小时前、3天前...）
 * @param {number} timestamp 毫秒时间戳
 */
export function timeAgo(timestamp) {
  const now = Date.now()
  const diff = now - timestamp

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const month = 30 * day
  const year = 365 * day

  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`
  if (diff < day) return `${Math.floor(diff / hour)}小时前`
  if (diff < month) return `${Math.floor(diff / day)}天前`
  if (diff < year) return `${Math.floor(diff / month)}个月前`
  return formatDate(timestamp)
}

/**
 * 格式化数字（1.2k, 3.5w）
 * @param {number} n
 */
export function formatCount(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n || 0)
}

/**
 * 生成本周、本月的时间范围
 */
export function getTimeRange(range) {
  const now = new Date()
  let start
  switch (range) {
    case 'week':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
      break
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case 'year':
      start = new Date(now.getFullYear(), 0, 1)
      break
    default:
      start = new Date(0)
  }
  return { start: start.getTime(), end: now.getTime() }
}
