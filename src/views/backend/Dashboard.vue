<template>
  <AdminLayout>
    <div class="dashboard-page">
      <h1 class="page-title">仪表盘</h1>

      <!-- 统计卡片 -->
      <el-row :gutter="20" class="stats-row">
        <el-col :xs="12" :sm="6" v-for="card in statCards" :key="card.label">
          <div class="stat-card" :style="{ borderTopColor: card.color }">
            <div class="stat-icon"><el-icon :size="20"><component :is="card.icon" /></el-icon></div>
            <div class="stat-body">
              <span class="stat-value">{{ card.value }}</span>
              <span class="stat-label">{{ card.label }}</span>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 快捷操作 -->
      <el-row :gutter="20" class="action-row">
        <el-col :span="12">
          <div class="panel">
            <h2>快捷操作</h2>
            <div class="quick-actions">
              <el-button type="primary" @click="$router.push('/upload')">
                <el-icon><Upload /></el-icon> 上传新作品
              </el-button>
              <el-button @click="$router.push('/drafts')">
                <el-icon><Document /></el-icon> 查看草稿箱
              </el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="panel">
            <h2>最新动态</h2>
            <div class="activity-list" v-if="stats">
              <p>作品总数：<strong>{{ stats.worksCount }}</strong></p>
              <p>草稿数量：<strong>{{ stats.draftCount }}</strong></p>
              <p>总浏览量：<strong>{{ formatCount(stats.totalViews) }}</strong></p>
              <p>总获赞：<strong>{{ formatCount(stats.totalLikes) }}</strong></p>
            </div>
            <el-empty v-else description="暂无数据" :image-size="60" />
          </div>
        </el-col>
      </el-row>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { formatCount } from '@/utils/date'
import AdminLayout from '@/components/AdminLayout.vue'

const userStore = useUserStore()
const stats = ref(null)

const statCards = ref([
  { icon: 'Picture', label: '作品总数', value: 0, color: '#3498DB' },
  { icon: 'View', label: '总浏览量', value: 0, color: '#27AE60' },
  { icon: 'StarFilled', label: '总获赞', value: 0, color: '#E74C3C' },
  { icon: 'UserFilled', label: '粉丝数', value: 0, color: '#F39C12' }
])

onMounted(async () => {
  const s = await userStore.fetchStats()
  if (s) {
    stats.value = s
    statCards.value[0].value = s.worksCount || 0
    statCards.value[1].value = formatCount(s.totalViews)
    statCards.value[2].value = formatCount(s.totalLikes)
    statCards.value[3].value = userStore.currentUser?.followersCount || 0
  }
})
</script>

<style scoped>
.page-title { font-size: 22px; font-weight: 700; margin-bottom: 24px; color: var(--color-text); }
.stats-row { margin-bottom: 20px; }
.stat-card {
  display: flex; align-items: center; gap: 12px;
  padding: 20px; background: #fff; border-radius: 8px;
  box-shadow: var(--shadow-sm); border-top: 3px solid;
  margin-bottom: 16px;
}
.stat-icon { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 10px; background: var(--color-bg); color: var(--color-secondary); }
.stat-value { font-size: 24px; font-weight: 700; display: block; }
.stat-label { font-size: var(--font-size-sm); color: var(--color-text-light); }

.panel { padding: 20px; background: #fff; border-radius: 8px; box-shadow: var(--shadow-sm); }
.panel h2 { font-size: var(--font-size-md); font-weight: 600; margin-bottom: 16px; }
.quick-actions { display: flex; flex-direction: column; gap: 10px; }
.activity-list p { padding: 6px 0; font-size: var(--font-size-base); color: var(--color-text); }
</style>
