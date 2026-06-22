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

      <!-- 图表区 -->
      <el-row :gutter="20" class="chart-row">
        <el-col :span="14">
          <div class="panel">
            <h2>浏览趋势（近7天）</h2>
            <div ref="lineChartRef" class="chart-box"></div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="panel">
            <h2>分类分布</h2>
            <div ref="pieChartRef" class="chart-box"></div>
          </div>
        </el-col>
      </el-row>

      <!-- 最新评论 + 快捷操作 -->
      <el-row :gutter="20" class="action-row">
        <el-col :span="14">
          <div class="panel">
            <h2>最新评论</h2>
            <div class="comment-list" v-if="stats?.recentComments?.length">
              <div class="comment-item" v-for="c in stats.recentComments" :key="c.id">
                <el-avatar :size="28" :src="c.userAvatar" />
                <div class="comment-body">
                  <div class="comment-header">
                    <strong>{{ c.userName }}</strong>
                    <span class="comment-work">评论了 <router-link :to="`/work/${c.workId}`">{{ c.workTitle }}</router-link></span>
                  </div>
                  <p class="comment-text">{{ c.content }}</p>
                </div>
                <span class="comment-time">{{ timeAgo(c.createTime) }}</span>
              </div>
            </div>
            <el-empty v-else description="暂无评论" :image-size="40" />
          </div>
        </el-col>
        <el-col :span="10">
          <div class="panel">
            <h2>快捷操作</h2>
            <div class="quick-actions">
              <el-button type="primary" @click="$router.push('/upload')">
                <el-icon><Upload /></el-icon> 上传新作品
              </el-button>
              <el-button @click="$router.push('/drafts')">
                <el-icon><Document /></el-icon> 查看草稿箱
              </el-button>
              <el-button @click="$router.push('/manage/works')">
                <el-icon><Grid /></el-icon> 作品管理
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useUserStore } from '@/stores'
import { formatCount, timeAgo } from '@/utils/date'
import * as echarts from 'echarts'
import AdminLayout from '@/components/AdminLayout.vue'

const userStore = useUserStore()
const stats = ref(null)
const lineChartRef = ref(null)
const pieChartRef = ref(null)

const statCards = ref([
  { icon: 'Picture', label: '作品总数', value: 0, color: '#3498DB' },
  { icon: 'View', label: '总浏览量', value: 0, color: '#27AE60' },
  { icon: 'StarFilled', label: '总获赞', value: 0, color: '#E74C3C' },
  { icon: 'UserFilled', label: '粉丝数', value: 0, color: '#F39C12' }
])

async function initCharts() {
  if (!stats.value || !lineChartRef.value || !pieChartRef.value) return

  // 折线图 - 浏览趋势
  const lineChart = echarts.init(lineChartRef.value)
  lineChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      data: stats.value.dailyViews.map(d => d.date.slice(5)),
      axisLine: { lineStyle: { color: '#ccc' } }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [{
      data: stats.value.dailyViews.map(d => d.views),
      type: 'line',
      smooth: true,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(52,152,219,0.3)' },
          { offset: 1, color: 'rgba(52,152,219,0)' }
        ])
      },
      lineStyle: { color: '#3498DB', width: 2 },
      itemStyle: { color: '#3498DB' }
    }]
  })

  // 饼图 - 分类分布
  const pieChart = echarts.init(pieChartRef.value)
  const dist = stats.value.categoryDist || []
  if (dist.length) {
    pieChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [{
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['50%', '55%'],
        data: dist,
        label: { formatter: '{b}\n{d}%', fontSize: 11 },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' }
        }
      }]
    })
  } else {
    pieChart.setOption({
      title: { text: '暂无数据', left: 'center', top: 'center', textStyle: { color: '#ccc', fontSize: 14 } }
    })
  }

  // 响应式
  window.addEventListener('resize', () => { lineChart.resize(); pieChart.resize() })
}

onMounted(async () => {
  const s = await userStore.fetchStats()
  if (s) {
    stats.value = s
    statCards.value[0].value = s.worksCount || 0
    statCards.value[1].value = formatCount(s.totalViews)
    statCards.value[2].value = formatCount(s.totalLikes)
    statCards.value[3].value = userStore.currentUser?.followersCount || 0
    await nextTick()
    initCharts()
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

.chart-row { margin-bottom: 20px; }
.chart-box { width: 100%; height: 280px; }
.panel { padding: 20px; background: #fff; border-radius: 8px; box-shadow: var(--shadow-sm); }
.panel h2 { font-size: var(--font-size-md); font-weight: 600; margin-bottom: 12px; }

.action-row { margin-top: 0; }
.quick-actions { display: flex; flex-direction: column; gap: 10px; }

.comment-list { display: flex; flex-direction: column; }
.comment-item {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 10px 0; border-bottom: 1px solid var(--color-bg);
}
.comment-item:last-child { border-bottom: none; }
.comment-body { flex: 1; min-width: 0; }
.comment-header { font-size: var(--font-size-sm); }
.comment-header strong { color: var(--color-text); }
.comment-work { color: var(--color-text-light); margin-left: 4px; }
.comment-work a { color: var(--color-secondary); }
.comment-text { font-size: var(--font-size-sm); color: var(--color-text-light); margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.comment-time { font-size: 11px; color: var(--color-text-light); white-space: nowrap; }
</style>
