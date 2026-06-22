import { createRouter, createWebHistory } from 'vue-router'

// ==================== 前台路由 ====================
const frontendRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/frontend/Home.vue'),
    meta: { title: 'CreativeHub - 创意作品展示' }
  },
  {
    path: '/work/:id',
    name: 'WorkDetail',
    component: () => import('@/views/frontend/WorkDetail.vue'),
    meta: { title: '作品详情' }
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: () => import('@/views/frontend/Category.vue'),
    meta: { title: '分类浏览' }
  },
  {
    path: '/tag/:name',
    name: 'Tag',
    component: () => import('@/views/frontend/Tag.vue'),
    meta: { title: '标签筛选' }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/frontend/Search.vue'),
    meta: { title: '搜索' }
  },
  {
    path: '/user/:id',
    name: 'UserProfile',
    component: () => import('@/views/frontend/UserProfile.vue'),
    meta: { title: '用户主页' }
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: () => import('@/views/frontend/Ranking.vue'),
    meta: { title: '排行榜' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/frontend/About.vue'),
    meta: { title: '关于我们' }
  }
]

// ==================== 后台路由 ====================
const backendRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/backend/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/backend/Dashboard.vue'),
    meta: { title: '仪表盘', requiresAuth: true }
  },
  {
    path: '/manage/works',
    name: 'WorkManage',
    component: () => import('@/views/backend/WorkManage.vue'),
    meta: { title: '作品管理', requiresAuth: true }
  },
  {
    path: '/upload',
    name: 'WorkUpload',
    component: () => import('@/views/backend/WorkUpload.vue'),
    meta: { title: '上传作品', requiresAuth: true }
  },
  {
    path: '/edit/:id',
    name: 'WorkEdit',
    component: () => import('@/views/backend/WorkEdit.vue'),
    meta: { title: '编辑作品', requiresAuth: true }
  },
  {
    path: '/drafts',
    name: 'Draft',
    component: () => import('@/views/backend/Draft.vue'),
    meta: { title: '草稿箱', requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/backend/Settings.vue'),
    meta: { title: '个人设置', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...frontendRoutes,
    ...backendRoutes,
    // 404
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/frontend/Home.vue'), // 暂指首页
      meta: { title: '页面未找到' }
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

// ==================== 路由守卫 ====================
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || 'CreativeHub'

  // 需要登录的路由
  if (to.meta.requiresAuth) {
    // 从 Pinia persist 的 localStorage key 读取登录状态
    const stored = localStorage.getItem('ch-user-store')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.isLoggedIn) {
          next()
          return
        }
      } catch {
        // 解析失败
      }
    }
    next('/login')
    return
  }

  next()
})

export default router
