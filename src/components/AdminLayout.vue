<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <aside class="admin-sidebar">
      <div class="sidebar-brand">
        <router-link to="/" class="brand-link">
          <span class="brand-icon">CH</span>
          <span class="brand-text">CreativeHub</span>
        </router-link>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#2C3E50"
        text-color="#bfcbd9"
        active-text-color="#3498DB"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataLine /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/upload">
          <el-icon><Upload /></el-icon>
          <span>上传作品</span>
        </el-menu-item>
        <el-menu-item index="/manage/works">
          <el-icon><Grid /></el-icon>
          <span>作品管理</span>
        </el-menu-item>
        <el-menu-item index="/drafts">
          <el-icon><Document /></el-icon>
          <span>草稿箱</span>
        </el-menu-item>
        <el-menu-item index="/collections">
          <el-icon><StarFilled /></el-icon>
          <span>我的收藏</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <span>个人设置</span>
        </el-menu-item>
      </el-menu>
      <div class="sidebar-footer">
        <router-link to="/" class="back-link">
          <el-icon><ArrowLeft /></el-icon> 返回前台
        </router-link>
      </div>
    </aside>

    <!-- 内容区 -->
    <main class="admin-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  width: 220px;
  background: var(--color-primary);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
}

.sidebar-brand {
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.brand-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
}
.brand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px; height: 28px;
  background: var(--color-secondary);
  border-radius: 4px;
  font-size: 12px; font-weight: 800;
}
.brand-text {
  font-size: 16px; font-weight: 700;
}

.admin-sidebar .el-menu {
  flex: 1;
  border-right: none;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255,255,255,0.1);
}
.back-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgba(255,255,255,0.5);
  font-size: 13px;
}
.back-link:hover { color: #fff; }

/* 内容区 */
.admin-content {
  flex: 1;
  margin-left: 220px;
  padding: var(--spacing-lg);
  background: var(--color-bg);
  min-height: 100vh;
}

@media (max-width: 768px) {
  .admin-sidebar { width: 60px; }
  .admin-sidebar .brand-text,
  .admin-sidebar .el-menu-item span,
  .admin-sidebar .back-link { display: none; }
  .admin-content { margin-left: 60px; }
}
</style>
