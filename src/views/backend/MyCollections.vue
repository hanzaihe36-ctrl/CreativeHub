<template>
  <AdminLayout>
    <div class="collections-page">
      <h1 class="page-title">我的收藏</h1>

      <div v-loading="loading">
        <div class="waterfall-grid" v-if="works.length">
          <div v-for="work in works" :key="work.id" class="collect-item">
            <WorkCard :work="work" />
            <el-button class="uncollect-btn" type="danger" plain size="small" @click.stop="handleUncollect(work)">
              <el-icon><StarFilled /></el-icon> 取消收藏
            </el-button>
          </div>
        </div>
        <el-empty v-if="!loading && works.length === 0" description="还没有收藏任何作品">
          <el-button type="primary" @click="$router.push('/')">去发现作品</el-button>
        </el-empty>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useInteractionStore, useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import AdminLayout from '@/components/AdminLayout.vue'
import WorkCard from '@/components/WorkCard.vue'

const interactionStore = useInteractionStore()
const userStore = useUserStore()

const works = ref([])
const loading = ref(false)

async function fetchCollections() {
  if (!userStore.currentUserId) return
  loading.value = true
  try {
    works.value = await interactionStore.fetchCollects(userStore.currentUserId)
  } finally {
    loading.value = false
  }
}

async function handleUncollect(work) {
  try {
    await interactionStore.collectWork(userStore.currentUserId, work.id)
    works.value = works.value.filter(w => w.id !== work.id)
    ElMessage.success('已取消收藏')
  } catch { ElMessage.error('操作失败') }
}

onMounted(fetchCollections)
</script>

<style scoped>
.page-title { font-size: 22px; font-weight: 700; margin-bottom: 24px; }
.waterfall-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}
.collect-item { position: relative; }
.uncollect-btn {
  margin-top: 8px;
  width: 100%;
}
</style>
