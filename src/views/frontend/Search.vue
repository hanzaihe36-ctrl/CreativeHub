<template>
  <div class="page-wrapper">
    <Header />
    <main class="main-content container">
      <div class="page-header">
        <h1>搜索结果</h1>
        <p v-if="keyword" class="page-desc">关于"{{ keyword }}"的搜索结果</p>
      </div>

      <!-- Tab 切换 -->
      <div class="search-tabs">
        <button :class="['tab-btn', { active: activeTab === 'works' }]" @click="activeTab = 'works'">
          作品 ({{ workTotal }})
        </button>
        <button :class="['tab-btn', { active: activeTab === 'users' }]" @click="activeTab = 'users'">
          用户 ({{ users.length }})
        </button>
      </div>

      <!-- 作品结果 -->
      <div v-if="activeTab === 'works'">
        <WorkList
          :works="works"
          :total="workTotal"
          :loading="loading"
          :hasMore="hasMore"
          :showToolbar="false"
          emptyText="未找到相关作品"
          @loadMore="handleLoadMore"
        />
      </div>

      <!-- 用户结果 -->
      <div v-if="activeTab === 'users'" class="user-results">
        <UserCard
          v-for="user in users"
          :key="user.id"
          :user="user"
          :showFollow="userStore.isLoggedIn"
        />
        <el-empty v-if="!loading && users.length === 0" description="未找到相关用户" />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkStore, useUserStore } from '@/stores'
import { getUsers } from '@/api/user'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import WorkList from '@/components/WorkList.vue'
import UserCard from '@/components/UserCard.vue'

const route = useRoute()
const workStore = useWorkStore()
const userStore = useUserStore()

const activeTab = ref('works')
const keyword = ref('')
const works = ref([])
const workTotal = ref(0)
const users = ref([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(false)

async function search(reset = false) {
  if (reset) page.value = 1
  const q = route.query.q
  if (!q) return
  keyword.value = q
  loading.value = true
  try {
    // 同时搜索作品和用户
    const [workRes, userList] = await Promise.all([
      workStore.fetchWorks({ keyword: q, page: page.value, pageSize: 12 }),
      getUsers({ keyword: q })
    ])
    if (reset) {
      works.value = workRes.items
    } else {
      works.value = [...works.value, ...workRes.items]
    }
    workTotal.value = workRes.total
    hasMore.value = page.value < workRes.totalPages
    users.value = userList

    // 如果作品没结果但用户有，自动切换到用户 Tab
    if (workRes.total === 0 && userList.length > 0) {
      activeTab.value = 'users'
    }
  } finally {
    loading.value = false
  }
}

function handleLoadMore() { page.value++; search(false) }

watch(() => route.query.q, () => search(true))
onMounted(() => search(true))
</script>

<style scoped>
.page-wrapper { min-height: 100vh; display: flex; flex-direction: column; }
.main-content { flex: 1; padding-top: calc(var(--header-height) + var(--spacing-lg)); padding-bottom: var(--spacing-xl); }
.page-header { margin-bottom: var(--spacing-lg); }
.page-header h1 { font-size: 24px; font-weight: 700; }
.page-desc { color: var(--color-text-light); font-size: var(--font-size-base); margin-top: 4px; }

.search-tabs { display: flex; gap: 0; margin-bottom: var(--spacing-lg); border-bottom: 2px solid var(--color-bg); }
.tab-btn { padding: 8px 24px; font-size: var(--font-size-base); color: var(--color-text-light); border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all var(--transition-fast); }
.tab-btn.active { color: var(--color-secondary); border-bottom-color: var(--color-secondary); }

.user-results { display: flex; flex-direction: column; gap: 12px; }
</style>
