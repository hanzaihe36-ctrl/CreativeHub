/**
 * Mock.js 数据模拟层
 *
 * 拦截 axios 请求，返回模拟数据。
 * 数据存储在内存中，页面刷新后会重新初始化（Mock 种子数据）。
 *
 * 图片方案：
 * - Mock 种子数据使用本地生成的 SVG 占位图（离线可用、无需联网）
 * - 用户上传使用 Base64 localStorage（真实上传流程）
 */

import Mock from 'mockjs'

// ==================== 工具函数 ====================
const now = Date.now()
const day = 24 * 60 * 60 * 1000

function id() {
  return now + Math.floor(Math.random() * 100000)
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

function coverUrl(seed, catId, w = 600, h = 400) {
  return placeholderImage(seed, catId, w, h)
}

function avatarUrl(name, hue) {
  return placeholderAvatar(name, hue)
}

// 分类主题配置：每个分类有独特的颜色、图标（emoji）
const CAT_THEME = {
  1: { colors: ['#4A90D9','#357ABD'], emoji: '💻', label: 'UI' },       // UI设计 — 蓝色
  2: { colors: ['#2ECC71','#27AE60'], emoji: '🎨', label: 'Graphic' },    // 平面设计 — 绿色
  3: { colors: ['#A855F7','#7C3AED'], emoji: '✨', label: 'Illustration' },// 插画 — 紫色
  4: { colors: ['#F59E0B','#D97706'], emoji: '📷', label: 'Photo' },      // 摄影 — 琥珀色
  5: { colors: ['#06B6D4','#0891B2'], emoji: '🔮', label: '3D' },         // 3D设计 — 青色
  6: { colors: ['#EF4444','#DC2626'], emoji: '🎬', label: 'Video' }       // 视频剪辑 — 红色
}

function placeholderImage(seed, catId = 1, w = 600, h = 400) {
  const theme = CAT_THEME[catId] || CAT_THEME[1]
  const [c1, c2] = theme.colors
  // 每个作品加微妙变化
  const idx = typeof seed === 'string' ? seed.replace(/\D/g,'').slice(-1) || 0 : seed % 10
  const offset = idx * 15
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${c1}"/>
        <stop offset="100%" style="stop-color:${c2}"/>
      </linearGradient>
      <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="1.5" fill="rgba(255,255,255,0.08)"/>
      </pattern>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <rect width="${w}" height="${h}" fill="url(#dots)"/>
    <text x="${w/2}" y="${h/2 - 20}" text-anchor="middle" font-size="${Math.min(w,h)/7}" opacity="0.9">${theme.emoji}</text>
    <text x="${w/2}" y="${h/2 + 40}" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="${Math.min(w,h)/16}" font-family="Arial" letter-spacing="2">${theme.label}</text>
  </svg>`
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}

// 用户头像：10 个不同的生动颜色
const USER_COLORS = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#98D8C8','#F7DC6F','#BB8FCE','#85C1E9']
function placeholderAvatar(name, hueIdx) {
  const idx = typeof name === 'string' ? (name.charCodeAt(name.length - 1) % 10) : (hueIdx || 0) % 10
  const color = USER_COLORS[idx]
  const initial = String(name).replace(/[^a-zA-Z一-龥]/g, '').slice(0, 1).toUpperCase() || '?'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
    <circle cx="50" cy="50" r="50" fill="${color}"/>
    <text x="50" y="50" text-anchor="middle" dy=".35em" fill="white" font-size="40" font-family="Arial" font-weight="bold">${initial}</text>
  </svg>`
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}

// ==================== 预设分类 ====================
const CATEGORIES = [
  { id: 1, name: 'UI设计', icon: 'Monitor', description: '界面设计、交互设计、用户体验', worksCount: 0 },
  { id: 2, name: '平面设计', icon: 'Picture', description: '海报、品牌、排版设计', worksCount: 0 },
  { id: 3, name: '插画', icon: 'Brush', description: '数字插画、手绘、矢量绘图', worksCount: 0 },
  { id: 4, name: '摄影', icon: 'Camera', description: '风光、人像、街拍摄影', worksCount: 0 },
  { id: 5, name: '3D设计', icon: 'Crop', description: '三维建模、渲染、动画', worksCount: 0 },
  { id: 6, name: '视频剪辑', icon: 'VideoCamera', description: '短片、动画、后期制作', worksCount: 0 }
]

// ==================== 预设用户 ====================
const USERS = [
  {
    id: 1,
    username: '设计师小王',
    email: 'wang@test.com',
    password: '123456',
    avatar: avatarUrl('王', 0),
    bio: 'UI/UX 设计师，热爱创造美好的数字体验',
    skills: ['Figma', 'Sketch', 'Photoshop'],
    website: 'https://dribbble.com/wang',
    worksCount: 0,
    likesCount: 0,
    viewsCount: 0,
    followersCount: 0,
    followingCount: 0,
    createTime: now - 90 * day,
    lastLogin: now - 1 * day
  },
  {
    id: 2,
    username: '插画师小李',
    email: 'li@test.com',
    password: '123456',
    avatar: avatarUrl('李', 1),
    bio: '自由插画师，专注于数字插画和角色设计',
    skills: ['Procreate', 'Illustrator', 'Photoshop'],
    website: 'https://behance.net/li',
    worksCount: 0,
    likesCount: 0,
    viewsCount: 0,
    followersCount: 0,
    followingCount: 0,
    createTime: now - 80 * day,
    lastLogin: now - 2 * day
  },
  {
    id: 3,
    username: '摄影师小张',
    email: 'zhang@test.com',
    password: '123456',
    avatar: avatarUrl('张', 2),
    bio: '风光摄影师，走遍千山万水只为记录最美的瞬间',
    skills: ['Lightroom', 'Photoshop', 'Capture One'],
    website: '',
    worksCount: 0,
    likesCount: 0,
    viewsCount: 0,
    followersCount: 0,
    followingCount: 0,
    createTime: now - 70 * day,
    lastLogin: now - 3 * day
  },
  {
    id: 4,
    username: '三维设计师小陈',
    email: 'chen@test.com',
    password: '123456',
    avatar: avatarUrl('陈', 3),
    bio: '3D 艺术爱好者，Blender 忠实用户',
    skills: ['Blender', 'Maya', 'ZBrush'],
    website: 'https://artstation.com/chen',
    worksCount: 0,
    likesCount: 0,
    viewsCount: 0,
    followersCount: 0,
    followingCount: 0,
    createTime: now - 60 * day,
    lastLogin: now - 1 * day
  },
  {
    id: 5,
    username: '视频达人小刘',
    email: 'liu@test.com',
    password: '123456',
    avatar: avatarUrl('刘', 4),
    bio: '微电影导演，擅长用镜头讲故事',
    skills: ['Premiere', 'After Effects', 'DaVinci'],
    website: 'https://bilibili.com/liu',
    worksCount: 0,
    likesCount: 0,
    viewsCount: 0,
    followersCount: 0,
    followingCount: 0,
    createTime: now - 50 * day,
    lastLogin: now - 4 * day
  },
  {
    id: 6,
    username: '平面设计师小赵',
    email: 'zhao@test.com',
    password: '123456',
    avatar: avatarUrl('赵', 5),
    bio: '品牌设计师，让每一个品牌都有自己的故事',
    skills: ['Illustrator', 'InDesign', 'Photoshop'],
    website: '',
    worksCount: 0,
    likesCount: 0,
    viewsCount: 0,
    followersCount: 0,
    followingCount: 0,
    createTime: now - 45 * day,
    lastLogin: now - 2 * day
  },
  {
    id: 7,
    username: '动效设计师小周',
    email: 'zhou@test.com',
    password: '123456',
    avatar: avatarUrl('周', 6),
    bio: 'Motion Graphics 设计师',
    skills: ['After Effects', 'Cinema 4D', 'Figma'],
    website: '',
    worksCount: 0,
    likesCount: 0,
    viewsCount: 0,
    followersCount: 0,
    followingCount: 0,
    createTime: now - 40 * day,
    lastLogin: now - 1 * day
  },
  {
    id: 8,
    username: '概念艺术家小林',
    email: 'lin@test.com',
    password: '123456',
    avatar: avatarUrl('林', 7),
    bio: '概念设计，用画笔探索世界的可能性',
    skills: ['Photoshop', 'Procreate', 'Krita'],
    website: 'https://artstation.com/lin',
    worksCount: 0,
    likesCount: 0,
    viewsCount: 0,
    followersCount: 0,
    followingCount: 0,
    createTime: now - 35 * day,
    lastLogin: now - 1 * day
  },
  {
    id: 9,
    username: '新锐设计师小吴',
    email: 'wu@test.com',
    password: '123456',
    avatar: avatarUrl('吴', 8),
    bio: '数字媒体技术大三学生，正在努力提升设计能力',
    skills: ['Figma', 'Photoshop'],
    website: '',
    worksCount: 0,
    likesCount: 0,
    viewsCount: 0,
    followersCount: 0,
    followingCount: 0,
    createTime: now - 20 * day,
    lastLogin: now
  },
  {
    id: 10,
    username: '设计爱好者小郑',
    email: 'zheng@test.com',
    password: '123456',
    avatar: avatarUrl('郑', 9),
    bio: '热爱设计，持续学习中',
    skills: ['Figma', 'Canva'],
    website: '',
    worksCount: 0,
    likesCount: 0,
    viewsCount: 0,
    followersCount: 0,
    followingCount: 0,
    createTime: now - 10 * day,
    lastLogin: now
  }
]

// ==================== 预设作品 ====================
const WORK_TITLES = [
  { title: '极简音乐播放器界面设计', catId: 1, tags: ['音乐', '极简', '深色模式'], tools: ['Figma', 'Photoshop'], authorIdx: 0, images: ['10-1.jpg', '10-2.jpg', '10-3.jpg', '10-4.jpg'] },
  { title: '电商 App 首页重设计', catId: 1, tags: ['电商', '移动端', '红色系'], tools: ['Figma', 'Sketch'], authorIdx: 1, images: ['4.jpg'] },
  { title: '智能家居控制面板 UI', catId: 1, tags: ['智能家居', '科技', '暗色'], tools: ['Figma'], authorIdx: 2, images: ['8-1.jpg', '8-2.jpg', '8-3.jpg'] },
  { title: '在线教育平台界面', catId: 1, tags: ['教育', '蓝色系', 'Web'], tools: ['Sketch', 'Figma'], authorIdx: 3, images: ['3.jpg'] },
  { title: '春日花语系列海报', catId: 2, tags: ['春天', '花卉', '清新'], tools: ['Photoshop', 'Illustrator'], authorIdx: 4, images: ['13-1.jpg', '13-2.jpg', '13-3.jpg', '13-4.jpg'] },
  { title: '咖啡品牌视觉设计', catId: 2, tags: ['品牌', '咖啡', '复古'], tools: ['Illustrator', 'Photoshop'], authorIdx: 5, images: ['12-1.jpg', '12-2.jpg', '12-3.jpg'] },
  { title: '音乐节宣传海报', catId: 2, tags: ['音乐节', '潮流', '撞色'], tools: ['Photoshop'], authorIdx: 6, images: ['11-1.jpg', '11-2.jpg', '11-3.jpg'] },
  { title: '城市漫步系列插画', catId: 3, tags: ['城市', '生活', '温暖'], tools: ['Procreate', 'Illustrator'], authorIdx: 7, images: ['9-1.jpg', '9-2.jpg', '9-3.jpg'] },
  { title: '中国风十二生肖插画', catId: 3, tags: ['国风', '传统文化', '十二生肖'], tools: ['Procreate', 'Photoshop'], authorIdx: 8, images: ['0-1.jpg','0-2.jpg','0-3.jpg','0-4.jpg','0-5.jpg','0-6.jpg','0-7.jpg','0-8.jpg','0-9.jpg','0-10.jpg','0-11.jpg','0-12.jpg'] },
  { title: '科幻角色概念设计', catId: 3, tags: ['科幻', '角色', '赛博朋克'], tools: ['Procreate'], images: ['15-1.jpg', '15-2.jpg', '15-3.jpg'] },
  { title: '森林小精灵绘本插画', catId: 3, tags: ['绘本', '童话', '可爱'], tools: ['Procreate'], authorIdx: 0, images: ['14-1.jpg', '14-2.jpg', '14-3.jpg', '14-4.jpg', '14-5.jpg'] },
  { title: '城市夜景街拍', catId: 4, tags: ['夜景', '城市', '霓虹'], tools: ['Lightroom', 'Photoshop'], authorIdx: 1, images: ['16-1.jpg', '16-2.jpg', '16-3.jpg'] },
  { title: '山川湖海风光摄影', catId: 4, tags: ['风光', '自然', '旅行'], tools: ['Lightroom'], authorIdx: 2, images: ['7-1.jpg', '7-2.jpg', '7-3.jpg', '7-4.jpg', '7-5.jpg'] },
  { title: '人物情绪写真', catId: 4, tags: ['人像', '情绪', '胶片'], tools: ['Capture One', 'Photoshop'], authorIdx: 3, images: ['2-1.jpg', '2-2.jpg', '2-3.jpg'] },
  { title: '赛博朋克城市 3D 场景', catId: 5, tags: ['赛博朋克', '科幻', '城市'], tools: ['Blender', 'Substance'], authorIdx: 4, images: ['6-1.jpg', '6-2.jpg', '6-3.jpg'] },
  { title: '家具产品渲染', catId: 5, tags: ['产品', '家具', '极简'], tools: ['Blender', 'Cycles'], authorIdx: 5, images: ['1-1.jpg', '1-2.jpg', '1-3.jpg'] },
  { title: '卡通角色 3D 建模', catId: 5, tags: ['卡通', '角色', '可爱'], tools: ['Blender', 'ZBrush'], authorIdx: 6, images: ['5-1.jpg', '5-2.jpg', '5-3.jpg'] },
  { title: '日落延时摄影', catId: 4, tags: ['延时', '日落', '黄昏'], tools: ['Lightroom', 'Premiere'], authorIdx: 3, videoFile: '1-1.mp4' },
  { title: '玄武湖晚霞延时', catId: 4, tags: ['延时', '玄武湖', '晚霞', '南京'], tools: ['Lightroom', 'After Effects'], authorIdx: 3, videoFile: '1-2.mp4' },
  { title: '重庆朝天门夜景延时摄影', catId: 4, tags: ['延时', '重庆', '夜景', '朝天门'], tools: ['Premiere', 'Lightroom'], authorIdx: 3, videoFile: '1-3.mp4' },
  { title: '体育品牌 App 动效设计', catId: 1, tags: ['体育', '动效', 'App'], tools: ['Figma', 'After Effects'], authorIdx: 0, videoFile: '2-1.mp4' },
  { title: '环保公益海报设计', catId: 2, tags: ['环保', '公益', '绿色'], tools: ['Photoshop'], authorIdx: 1, images: ['4-1.jpg', '4-2.jpg', '4-3.jpg'] },
  { title: '赛博国风插画合集', catId: 3, tags: ['赛博朋克', '国风', '融合'], tools: ['Procreate', 'Photoshop'], authorIdx: 2, images: ['3-1.jpg', '3-2.jpg', '3-3.jpg'] },
  { title: '琶洲CBD延时摄影', catId: 4, tags: ['延时', '琶洲', 'CBD', '城市'], tools: ['Premiere', 'Lightroom'], authorIdx: 3, videoFile: '1-4.mp4' }
]

function createWork(meta, index) {
  const author = USERS[meta.authorIdx !== undefined ? meta.authorIdx : (index % USERS.length)]
  const cat = CATEGORIES.find(c => c.id === meta.catId)
  const createdAt = now - (24 - index) * 3 * day
  const views = randInt(200, 5000)
  const likes = randInt(20, 300)
  const collects = randInt(5, 150)
  const comments = randInt(0, 30)
  const isVideo = !!meta.videoFile

  // 统计作者数据
  author.worksCount++
  author.viewsCount += views
  author.likesCount += likes
  cat.worksCount++

  return {
    id: id() + index,
    title: meta.title,
    description: `这是作品《${meta.title}》的详细描述。本作品创作于${new Date(createdAt).getFullYear()}年，运用了多种设计技法，力求在视觉传达与用户体验之间取得平衡。创作过程中参考了国内外优秀设计案例，并融入了个人独特的审美风格。`,
    categoryId: meta.catId,
    categoryName: cat.name,
    tags: meta.tags,
    mediaType: isVideo ? 'video' : 'image',
    images: meta.images
      ? meta.images.map(f => `/images/works/${f}`)
      : isVideo
        ? [coverUrl(`work${index}a`, meta.catId), coverUrl(`work${index}b`, meta.catId, 600, 800)]
        : [
            coverUrl(`work${index}a`, meta.catId),
            coverUrl(`work${index}b`, meta.catId, 600, 800),
            coverUrl(`work${index}c`, meta.catId, 800, 600)
          ],
    coverImage: meta.images
      ? `/images/works/${meta.images[0]}`
      : isVideo ? `/videos/works/${meta.videoFile}` : coverUrl(`work${index}a`, meta.catId),
    videoUrl: isVideo ? `/videos/works/${meta.videoFile}` : null,
    toolsUsed: meta.tools,
    authorId: author.id,
    authorName: author.username,
    authorAvatar: author.avatar,
    views,
    likes,
    collects,
    comments,
    status: 'published',
    createTime: createdAt,
    updateTime: createdAt,
    publishTime: createdAt
  }
}

const WORKS = WORK_TITLES.map(createWork)

// ==================== 预设评论 ====================
const COMMENTS = []
for (let i = 0; i < 10; i++) {
  const work = pick(WORKS)
  const user = pick(USERS.filter(u => u.id !== work.authorId))
  COMMENTS.push({
    id: id() + 1000 + i,
    workId: work.id,
    userId: user.id,
    userName: user.username,
    userAvatar: user.avatar,
    content: pick([
      '太棒了！配色非常舒服',
      '这个设计很有创意，学到了',
      '细节处理得很到位，点赞',
      '能分享一下设计思路吗？',
      '色调好美！收藏了',
      '大神级别！向您学习',
      '这个动效做得太流畅了',
      '布局干净利落，很专业',
      '灵感来源是什么呀？',
      '风格好独特，已关注'
    ]),
    createTime: now - randInt(1, 30) * day
  })
}

// ==================== 预设互动数据 ====================
let LIKES = []
let COLLECTS = []
let FOLLOWS = []

// 随机生成一些互动数据
for (let i = 0; i < 50; i++) {
  const user = pick(USERS)
  const work = pick(WORKS)
  if (!LIKES.find(l => l.userId === user.id && l.workId === work.id)) {
    LIKES.push({ userId: user.id, workId: work.id, createTime: now - randInt(1, 30) * day })
  }
}
for (let i = 0; i < 20; i++) {
  const user = pick(USERS)
  const work = pick(WORKS)
  if (!COLLECTS.find(c => c.userId === user.id && c.workId === work.id)) {
    COLLECTS.push({ userId: user.id, workId: work.id, createTime: now - randInt(1, 30) * day })
  }
}
// 随机关注关系
for (let i = 0; i < 30; i++) {
  const follower = pick(USERS)
  const following = pick(USERS.filter(u => u.id !== follower.id))
  if (!FOLLOWS.find(f => f.followerId === follower.id && f.followingId === following.id)) {
    FOLLOWS.push({ followerId: follower.id, followingId: following.id, createTime: now - randInt(1, 60) * day })
  }
}
// 更新关注/粉丝数
FOLLOWS.forEach(f => {
  const follower = USERS.find(u => u.id === f.followerId)
  const following = USERS.find(u => u.id === f.followingId)
  if (follower) follower.followingCount++
  if (following) following.followersCount++
})

// ==================== 注册 Mock 拦截 ====================
Mock.setup({ timeout: '200-500' })

// ---- 作品 API ----
// 获取作品列表（支持排序、筛选、分页）
Mock.mock(/\/api\/works(\?.*)?$/, 'get', (options) => {
  const url = new URL('http://localhost' + options.url)
  const sort = url.searchParams.get('sort') || 'latest'
  const categoryId = url.searchParams.get('categoryId')
  const tag = url.searchParams.get('tag')
  const keyword = url.searchParams.get('keyword')
  const authorId = url.searchParams.get('authorId')
  const status = url.searchParams.get('status')
  const page = parseInt(url.searchParams.get('page')) || 1
  const pageSize = parseInt(url.searchParams.get('pageSize')) || 12

  let list = [...WORKS]

  // 筛选
  if (categoryId) list = list.filter(w => w.categoryId === parseInt(categoryId))
  if (tag) list = list.filter(w => w.tags.some(t => t.includes(decodeURIComponent(tag))))
  if (keyword) {
    const kw = decodeURIComponent(keyword).toLowerCase()
    list = list.filter(w => w.title.toLowerCase().includes(kw) || w.description.toLowerCase().includes(kw))
  }
  if (authorId) list = list.filter(w => w.authorId === parseInt(authorId))
  if (status) list = list.filter(w => w.status === status)

  // 排序
  switch (sort) {
    case 'latest': list.sort((a, b) => b.publishTime - a.publishTime); break
    case 'hot': list.sort((a, b) => b.views - a.views); break
    case 'popular': list.sort((a, b) => b.likes - a.likes); break
  }

  const total = list.length
  const start = (page - 1) * pageSize
  const items = list.slice(start, start + pageSize)

  return { code: 0, data: { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) } }
})

// 获取作品详情
Mock.mock(/\/api\/works\/\d+/, 'get', (options) => {
  const workId = parseInt(options.url.match(/\/api\/works\/(\d+)/)[1])
  const work = WORKS.find(w => w.id === workId)
  if (!work) return { code: 404, message: '作品不存在' }
  // 浏览量 +1
  work.views++
  const author = USERS.find(u => u.id === work.authorId)
  if (author) author.viewsCount++
  return { code: 0, data: work }
})

// 创建作品
Mock.mock('/api/works', 'post', (options) => {
  const body = JSON.parse(options.body)
  const author = USERS.find(u => u.id === body.authorId)
  const cat = CATEGORIES.find(c => c.id === body.categoryId)
  const newWork = {
    id: id(),
    ...body,
    categoryName: cat ? cat.name : '',
    authorName: author ? author.username : '',
    authorAvatar: author ? author.avatar : '',
    views: 0, likes: 0, collects: 0, comments: 0,
    createTime: now,
    updateTime: now,
    publishTime: body.status === 'published' ? now : 0
  }
  WORKS.unshift(newWork)
  if (author) author.worksCount++
  if (cat) cat.worksCount++
  return { code: 0, data: newWork }
})

// 更新作品
Mock.mock(/\/api\/works\/\d+/, 'put', (options) => {
  const workId = parseInt(options.url.match(/\/api\/works\/(\d+)/)[1])
  const body = JSON.parse(options.body)
  const index = WORKS.findIndex(w => w.id === workId)
  if (index === -1) return { code: 404, message: '作品不存在' }

  // 如果分类变更，更新旧分类计数
  if (body.categoryId && body.categoryId !== WORKS[index].categoryId) {
    const oldCat = CATEGORIES.find(c => c.id === WORKS[index].categoryId)
    const newCat = CATEGORIES.find(c => c.id === body.categoryId)
    if (oldCat && oldCat.worksCount > 0) oldCat.worksCount--
    if (newCat) newCat.worksCount++
  }

  WORKS[index] = { ...WORKS[index], ...body, updateTime: now }
  if (body.status === 'published' && !WORKS[index].publishTime) {
    WORKS[index].publishTime = now
  }
  return { code: 0, data: WORKS[index] }
})

// 删除作品
Mock.mock(/\/api\/works\/\d+/, 'delete', (options) => {
  const workId = parseInt(options.url.match(/\/api\/works\/(\d+)/)[1])
  const index = WORKS.findIndex(w => w.id === workId)
  if (index === -1) return { code: 404, message: '作品不存在' }
  const work = WORKS[index]
  const author = USERS.find(u => u.id === work.authorId)
  const cat = CATEGORIES.find(c => c.id === work.categoryId)
  if (author && author.worksCount > 0) author.worksCount--
  if (cat && cat.worksCount > 0) cat.worksCount--
  // 级联删除相关互动
  LIKES = LIKES.filter(l => l.workId !== workId)
  COLLECTS = COLLECTS.filter(c => c.workId !== workId)
  COMMENTS.filter(c => c.workId !== workId).forEach(() => {}) // 不删评论，保留
  WORKS.splice(index, 1)
  return { code: 0, message: '删除成功' }
})

// ---- 分类 API ----
Mock.mock('/api/categories', 'get', () => {
  return { code: 0, data: CATEGORIES }
})

// ---- 标签 API ----
Mock.mock('/api/tags', 'get', () => {
  const tagMap = {}
  WORKS.filter(w => w.status === 'published').forEach(w => {
    w.tags.forEach(t => {
      tagMap[t] = (tagMap[t] || 0) + 1
    })
  })
  const tags = Object.entries(tagMap).map(([name, count]) => ({ name, count }))
  tags.sort((a, b) => b.count - a.count)
  return { code: 0, data: tags }
})

// ---- 用户 API ----
// 获取用户列表
Mock.mock(/\/api\/users(\?.*)?$/, 'get', (options) => {
  const url = new URL('http://localhost' + options.url)
  const keyword = url.searchParams.get('keyword')
  let list = [...USERS]
  if (keyword) {
    const kw = decodeURIComponent(keyword).toLowerCase()
    list = list.filter(u => u.username.toLowerCase().includes(kw))
  }
  return { code: 0, data: list.map(u => ({ ...u, password: undefined })) }
})

// 获取用户详情
Mock.mock(/\/api\/users\/\d+/, 'get', (options) => {
  const userId = parseInt(options.url.match(/\/api\/users\/(\d+)/)[1])
  const user = USERS.find(u => u.id === userId)
  if (!user) return { code: 404, message: '用户不存在' }
  return { code: 0, data: { ...user, password: undefined } }
})

// 更新用户
Mock.mock(/\/api\/users\/\d+/, 'put', (options) => {
  const userId = parseInt(options.url.match(/\/api\/users\/(\d+)/)[1])
  const body = JSON.parse(options.body)
  const index = USERS.findIndex(u => u.id === userId)
  if (index === -1) return { code: 404, message: '用户不存在' }
  USERS[index] = { ...USERS[index], ...body }
  // 同步用户名到作品
  if (body.username) {
    WORKS.filter(w => w.authorId === userId).forEach(w => w.authorName = body.username)
    COMMENTS.filter(c => c.userId === userId).forEach(c => c.userName = body.username)
  }
  return { code: 0, data: { ...USERS[index], password: undefined } }
})

// 登录
Mock.mock('/api/login', 'post', (options) => {
  const { email, password } = JSON.parse(options.body)
  const user = USERS.find(u => u.email === email && u.password === password)
  if (!user) return { code: 401, message: '邮箱或密码错误' }
  user.lastLogin = now
  return { code: 0, data: { ...user, password: undefined } }
})

// 注册
Mock.mock('/api/register', 'post', (options) => {
  const body = JSON.parse(options.body)
  if (USERS.find(u => u.email === body.email)) {
    return { code: 400, message: '该邮箱已被注册' }
  }
  if (USERS.find(u => u.username === body.username)) {
    return { code: 400, message: '该用户名已被使用' }
  }
  const newUser = {
    id: id(),
    username: body.username,
    email: body.email,
    password: body.password,
    avatar: avatarUrl(body.username, USERS.length % 10),
    bio: '',
    skills: [],
    website: '',
    worksCount: 0, likesCount: 0, viewsCount: 0,
    followersCount: 0, followingCount: 0,
    createTime: now,
    lastLogin: now
  }
  USERS.push(newUser)
  return { code: 0, data: { ...newUser, password: undefined } }
})

// ---- 互动 API ----
// 点赞
Mock.mock('/api/likes', 'post', (options) => {
  const { userId, workId } = JSON.parse(options.body)
  const idx = LIKES.findIndex(l => l.userId === userId && l.workId === workId)
  if (idx >= 0) {
    LIKES.splice(idx, 1)
    const work = WORKS.find(w => w.id === workId)
    if (work && work.likes > 0) work.likes--
    return { code: 0, data: { liked: false, count: work ? work.likes : 0 } }
  }
  LIKES.push({ userId, workId, createTime: now })
  const work = WORKS.find(w => w.id === workId)
  if (work) work.likes++
  return { code: 0, data: { liked: true, count: work ? work.likes : 0 } }
})

// 获取点赞状态
Mock.mock(/\/api\/likes\/check/, 'get', (options) => {
  const url = new URL('http://localhost' + options.url)
  const userId = parseInt(url.searchParams.get('userId'))
  const workId = parseInt(url.searchParams.get('workId'))
  const liked = LIKES.some(l => l.userId === userId && l.workId === workId)
  return { code: 0, data: { liked } }
})

// 收藏
Mock.mock('/api/collects', 'post', (options) => {
  const { userId, workId } = JSON.parse(options.body)
  const idx = COLLECTS.findIndex(c => c.userId === userId && c.workId === workId)
  if (idx >= 0) {
    COLLECTS.splice(idx, 1)
    const work = WORKS.find(w => w.id === workId)
    if (work && work.collects > 0) work.collects--
    return { code: 0, data: { collected: false, count: work ? work.collects : 0 } }
  }
  COLLECTS.push({ userId, workId, createTime: now })
  const work = WORKS.find(w => w.id === workId)
  if (work) work.collects++
  return { code: 0, data: { collected: true, count: work ? work.collects : 0 } }
})

// 获取收藏列表
Mock.mock(/\/api\/collects/, 'get', (options) => {
  const url = new URL('http://localhost' + options.url)
  const userId = parseInt(url.searchParams.get('userId'))
  const userCollects = COLLECTS.filter(c => c.userId === userId)
  const works = userCollects.map(c => WORKS.find(w => w.id === c.workId)).filter(Boolean)
  return { code: 0, data: works }
})

// 评论列表
Mock.mock(/\/api\/comments/, 'get', (options) => {
  const url = new URL('http://localhost' + options.url)
  const workId = parseInt(url.searchParams.get('workId'))
  const page = parseInt(url.searchParams.get('page')) || 1
  const pageSize = parseInt(url.searchParams.get('pageSize')) || 10
  let list = COMMENTS.filter(c => c.workId === workId)
  list.sort((a, b) => b.createTime - a.createTime)
  const total = list.length
  const start = (page - 1) * pageSize
  return { code: 0, data: { items: list.slice(start, start + pageSize), total } }
})

// 发表评论
Mock.mock('/api/comments', 'post', (options) => {
  const body = JSON.parse(options.body)
  const user = USERS.find(u => u.id === body.userId)
  const newComment = {
    id: id(),
    workId: body.workId,
    userId: body.userId,
    userName: user ? user.username : '',
    userAvatar: user ? user.avatar : '',
    content: body.content,
    createTime: now
  }
  COMMENTS.unshift(newComment)
  const work = WORKS.find(w => w.id === body.workId)
  if (work) work.comments = (work.comments || 0) + 1
  return { code: 0, data: newComment }
})

// 关注
Mock.mock('/api/follows', 'post', (options) => {
  const { followerId, followingId } = JSON.parse(options.body)
  const idx = FOLLOWS.findIndex(f => f.followerId === followerId && f.followingId === followingId)
  if (idx >= 0) {
    FOLLOWS.splice(idx, 1)
    const follower = USERS.find(u => u.id === followerId)
    const following = USERS.find(u => u.id === followingId)
    if (follower && follower.followingCount > 0) follower.followingCount--
    if (following && following.followersCount > 0) following.followersCount--
    return { code: 0, data: { followed: false } }
  }
  FOLLOWS.push({ followerId, followingId, createTime: now })
  const follower = USERS.find(u => u.id === followerId)
  const following = USERS.find(u => u.id === followingId)
  if (follower) follower.followingCount++
  if (following) following.followersCount++
  return { code: 0, data: { followed: true } }
})

// 获取关注状态
Mock.mock(/\/api\/follows\/check/, 'get', (options) => {
  const url = new URL('http://localhost' + options.url)
  const followerId = parseInt(url.searchParams.get('followerId'))
  const followingId = parseInt(url.searchParams.get('followingId'))
  const followed = FOLLOWS.some(f => f.followerId === followerId && f.followingId === followingId)
  return { code: 0, data: { followed } }
})

// 获取关注/粉丝列表
Mock.mock(/\/api\/follows/, 'get', (options) => {
  const url = new URL('http://localhost' + options.url)
  const type = url.searchParams.get('type') // 'following' | 'followers'
  const userId = parseInt(url.searchParams.get('userId'))
  let userList
  if (type === 'following') {
    const followingIds = FOLLOWS.filter(f => f.followerId === userId).map(f => f.followingId)
    userList = USERS.filter(u => followingIds.includes(u.id)).map(u => ({ ...u, password: undefined }))
  } else {
    const followerIds = FOLLOWS.filter(f => f.followingId === userId).map(f => f.followerId)
    userList = USERS.filter(u => followerIds.includes(u.id)).map(u => ({ ...u, password: undefined }))
  }
  return { code: 0, data: userList }
})

// ---- 统计 API ----
Mock.mock(/\/api\/stats\/\d+/, 'get', (options) => {
  const userId = parseInt(options.url.match(/\/api\/stats\/(\d+)/)[1])
  const userWorks = WORKS.filter(w => w.authorId === userId)
  const totalViews = userWorks.reduce((sum, w) => sum + w.views, 0)
  const totalLikes = userWorks.reduce((sum, w) => sum + w.likes, 0)
  const totalCollects = userWorks.reduce((sum, w) => sum + w.collects, 0)
  const totalComments = userWorks.reduce((sum, w) => sum + w.comments, 0)
  const draftCount = userWorks.filter(w => w.status === 'draft').length

  // 近 7 天每日浏览数据（模拟）
  const dailyViews = []
  for (let i = 6; i >= 0; i--) {
    dailyViews.push({
      date: new Date(now - i * day).toISOString().slice(0, 10),
      views: randInt(10, 100)
    })
  }

  // 分类分布
  const categoryDist = CATEGORIES.map(cat => ({
    name: cat.name,
    value: userWorks.filter(w => w.categoryId === cat.id).length
  })).filter(c => c.value > 0)

  // 最新评论（该用户作品收到的评论）
  const userWorkIds = userWorks.map(w => w.id)
  const recentComments = COMMENTS
    .filter(c => userWorkIds.includes(c.workId))
    .sort((a, b) => b.createTime - a.createTime)
    .slice(0, 5)
    .map(c => {
      const work = WORKS.find(w => w.id === c.workId)
      return { ...c, workTitle: work ? work.title : '' }
    })

  return { code: 0, data: { totalViews, totalLikes, totalCollects, totalComments, draftCount, dailyViews, categoryDist, recentComments, worksCount: userWorks.length } }
})

console.log('[Mock] 数据已初始化：', WORKS.length, '个作品，', USERS.length, '个用户，', CATEGORIES.length, '个分类')
console.log('[Mock] 测试账号：wang@test.com / 123456')
