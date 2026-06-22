<template>
  <div class="page-wrapper">
    <Header />
    <main class="main-content container">
      <div class="page-header">
        <h1>排行榜</h1>
        <p class="page-desc">发现最受欢迎的作品和创作者</p>
      </div>

      <!-- Tab -->
      <div class="ranking-tabs">
        <button :class="['tab-btn', { active: tab === 'works' }]" @click="tab = 'works'">热门作品</button>
        <button :class="['tab-btn', { active: tab === 'creators' }]" @click="tab = 'creators'">人气创作者</button>
      </div>

      <!-- 热门作品 -->
      <div v-if="tab === 'works'">
        <div class="ranking-grid">
          <div v-for="(work, i) in hotWorks" :key="work.id" class="ranking-item">
            <span class="rank-badge" :class="'rank-' + (i + 1)">{{ i + 1 }}</span>
            <WorkCard :work="work" />
          </div>
        </div>
      </div>

      <!-- 人气创作者 -->
      <div v-if="tab === 'creators'" class="creator-list">
        <div v-for="(user, i) in topCreators" :key="user.id" class="creator-item">
          <span class="rank-badge" :class="'rank-' + (i + 1)">{{ i + 1 }}</span>
          <UserCard :user="user" :showFollow="userStore.isLoggedIn" />
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWorkStore, useUserStore } from '@/stores'
import { getUsers } from '@/api/user'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import WorkCard from '@/components/WorkCard.vue'
import UserCard from '@/components/UserCard.vue'

const workStore = useWorkStore()
const userStore = useUserStore()

const tab = ref('works')
const topCreators = ref([])

const hotWorks = computed(() => workStore.hotWorks)

onMounted(async () => {
  // 加载热门作品
  if (!workStore.publishedWorks.length) {
    await workStore.fetchWorks({ sort: 'hot', page: 1, pageSize: 12 })
  }
  // 加载用户并按粉丝数排序
  const users = await getUsers()
  topCreators.value = [...users].sort((a, b) => (b.followersCount || 0) - (a.followersCount || 0)).slice(0, 10)
})
</script>

<style scoped>
.page-wrapper { min-height: 100vh; display: flex; flex-direction: column; }
.main-content { flex: 1; padding-top: calc(var(--header-height) + var(--spacing-lg)); padding-bottom: var(--spacing-xl); }
.page-header { margin-bottom: var(--spacing-lg); }
.page-header h1 { font-size: 24px; font-weight: 700; }
.page-desc { color: var(--color-text-light); font-size: var(--font-size-base); margin-top: 4px; }

.ranking-tabs { display: flex; gap: 0; margin-bottom: var(--spacing-lg); border-bottom: 2px solid var(--color-bg); }
.tab-btn { padding: 8px 24px; font-size: var(--font-size-base); color: var(--color-text-light); border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all var(--transition-fast); }
.tab-btn.active { color: var(--color-secondary); border-bottom-color: var(--color-secondary); }

.ranking-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
.ranking-item { position: relative; }
.rank-badge {
  position: absolute; top: -8px; left: -8px; z-index: 10;
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: #fff; background: var(--color-text-light);
}
.rank-badge.rank-1 { background: #f59e0b; }
.rank-badge.rank-2 { background: #94a3b8; }
.rank-badge.rank-3 { background: #d97706; }

.creator-list { display: flex; flex-direction: column; gap: 12px; }
.creator-item { position: relative; }
</style>
