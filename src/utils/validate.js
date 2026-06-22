/**
 * 表单验证工具
 */

/**
 * 验证邮箱格式
 */
export function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * 验证用户名（3-20字符，字母数字下划线中文）
 */
export function isUsername(name) {
  return name && name.length >= 3 && name.length <= 20
}

/**
 * 验证密码（至少6位）
 */
export function isPassword(pwd) {
  return pwd && pwd.length >= 6
}

/**
 * 验证作品标题（3-50字符）
 */
export function isValidTitle(title) {
  return title && title.length >= 3 && title.length <= 50
}

/**
 * 验证作品描述（10-500字符）
 */
export function isValidDescription(desc) {
  return desc && desc.length >= 10 && desc.length <= 500
}

/**
 * 验证 URL 格式
 */
export function isURL(url) {
  if (!url) return true // 可选字段
  return /^https?:\/\/.+/.test(url)
}

/**
 * 获取字段验证规则（Element Plus 格式）
 */
export const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为 3-20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少为 6 位', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '请输入作品标题', trigger: 'blur' },
    { min: 3, max: 50, message: '标题长度为 3-50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入作品描述', trigger: 'blur' },
    { min: 10, max: 500, message: '描述长度为 10-500 个字符', trigger: 'blur' }
  ]
}
