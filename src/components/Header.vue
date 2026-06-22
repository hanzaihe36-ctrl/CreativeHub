<template>
  <header class="app-header">
    <div class="header-inner container">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <span class="logo-icon">CH</span>
        <span class="logo-text">CreativeHub</span>
      </router-link>

      <!-- 导航菜单（桌面端） -->
      <nav class="nav-menu">
        <router-link to="/" class="nav-item" active-class="active" exact>首页</router-link>
        <router-link to="/topics" class="nav-item" active-class="active">话题广场</router-link>
        <router-link to="/ranking" class="nav-item" active-class="active">排行榜</router-link>
        <router-link to="/about" class="nav-item" active-class="active">关于</router-link>
      </nav>

      <!-- 汉堡菜单按钮（移动端） -->
      <button class="hamburger" @click="mobileMenuOpen = !mobileMenuOpen">
        <el-icon :size="22"><component :is="mobileMenuOpen ? 'Close' : 'Menu'" /></el-icon>
      </button>

      <!-- 搜索框 -->
      <div class="search-box">
        <el-input
          v-model="keyword"
          placeholder="搜索作品或用户..."
          prefix-icon="Search"
          size="default"
          clearable
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        />
      </div>

      <!-- 用户区域 -->
      <div class="user-area">
        <template v-if="userStore.isLoggedIn">
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="user-trigger">
              <el-avatar :size="32" :src="userStore.currentUser?.avatar" />
              <span class="user-name">{{ userStore.currentUser?.username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon> 我的主页
                </el-dropdown-item>
                <el-dropdown-item command="dashboard">
                  <el-icon><DataLine /></el-icon> 创作者中心
                </el-dropdown-item>
                <el-dropdown-item command="upload">
                  <el-icon><Upload /></el-icon> 上传作品
                </el-dropdown-item>
                <el-dropdown-item command="collections">
                  <el-icon><StarFilled /></el-icon> 我的收藏
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon> 退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <router-link to="/login" class="btn-login">登录</router-link>
        </template>
      </div>
    </div>

    <!-- 移动端下拉菜单 -->
    <transition name="slide-down">
      <div v-if="mobileMenuOpen" class="mobile-menu" @click="mobileMenuOpen = false">
        <router-link to="/" class="mobile-nav-item" exact>首页</router-link>
        <router-link to="/topics" class="mobile-nav-item">话题广场</router-link>
        <router-link to="/ranking" class="mobile-nav-item">排行榜</router-link>
        <router-link to="/about" class="mobile-nav-item">关于</router-link>
        <div class="mobile-divider"></div>
        <router-link v-if="!userStore.isLoggedIn" to="/login" class="mobile-nav-item login-link">登录 / 注册</router-link>
        <template v-else>
          <router-link :to="`/user/${userStore.currentUser?.id}`" class="mobile-nav-item">我的主页</router-link>
          <router-link to="/dashboard" class="mobile-nav-item">创作者中心</router-link>
          <a class="mobile-nav-item logout-link" @click="handleLogout">退出登录</a>
        </template>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const keyword = ref('')
const mobileMenuOpen = ref(false)

// 路由变化时关闭移动菜单
watch(() => route.path, () => { mobileMenuOpen.value = false })

function handleSearch() {
  if (keyword.value.trim()) {
    router.push({ path: '/search', query: { q: keyword.value.trim() } })
  }
}

function handleCommand(cmd) {
  switch (cmd) {
    case 'profile':
      router.push(`/user/${userStore.currentUser?.id}`)
      break
    case 'dashboard':
      router.push('/dashboard')
      break
    case 'upload':
      router.push('/upload')
      break
    case 'collections':
      router.push('/collections')
      break
    case 'logout':
      handleLogout()
      break
  }
}

function handleLogout() {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: #fff;
  box-shadow: var(--shadow-sm);
  z-index: 1000;
}

.header-inner {
  display: flex;
  align-items: center;
  height: 100%;
  gap: var(--spacing-md);
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-primary);
  font-weight: 700;
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}
.logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-primary);
  color: #fff;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 800;
}

/* 导航 */
.nav-menu {
  display: flex;
  gap: 4px;
}
.nav-item {
  padding: 6px 16px;
  border-radius: 6px;
  color: var(--color-text);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
}
.nav-item:hover,
.nav-item.active {
  background: var(--color-bg);
  color: var(--color-secondary);
}

/* 搜索 */
.search-box {
  flex: 1;
  max-width: 320px;
}

/* 用户 */
.user-area {
  flex-shrink: 0;
}
.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background var(--transition-fast);
}
.user-trigger:hover {
  background: var(--color-bg);
}
.user-name {
  font-size: var(--font-size-base);
  color: var(--color-text);
}
.btn-login {
  padding: 6px 20px;
  border-radius: 6px;
  background: var(--color-secondary);
  color: #fff;
  font-size: var(--font-size-base);
  transition: opacity var(--transition-fast);
}
.btn-login:hover {
  opacity: 0.85;
  color: #fff;
}

/* 汉堡菜单 */
.hamburger {
  display: none;
  padding: 6px;
  color: var(--color-text);
  border-radius: 6px;
}
.hamburger:hover { background: var(--color-bg); }

/* 移动端菜单 */
.mobile-menu {
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  background: #fff;
  box-shadow: var(--shadow-lg);
  padding: 8px 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
}
.mobile-nav-item {
  padding: 12px 24px;
  font-size: var(--font-size-base);
  color: var(--color-text);
  border-left: 3px solid transparent;
  transition: all var(--transition-fast);
}
.mobile-nav-item:hover,
.mobile-nav-item.router-link-active {
  color: var(--color-secondary);
  background: var(--color-bg);
  border-left-color: var(--color-secondary);
}
.mobile-divider {
  height: 1px;
  background: var(--color-bg);
  margin: 4px 0;
}
.login-link { color: var(--color-secondary); font-weight: 600; }
.logout-link { color: var(--color-accent); cursor: pointer; }

/* 下拉过渡 */
.slide-down-enter-active { transition: all 0.25s ease; }
.slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from,
.slide-down-leave-to { opacity: 0; transform: translateY(-8px); }

@media (max-width: 768px) {
  .nav-menu { display: none; }
  .search-box { max-width: 160px; }
  .user-name { display: none; }
  .hamburger { display: block; }
}
</style>
