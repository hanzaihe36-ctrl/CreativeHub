<template>
  <div class="page-wrapper">
    <Header />
    <main class="main-content container">
      <div class="page-header">
        <button class="back-btn" @click="$router.back()"><el-icon><ArrowLeft /></el-icon> 返回</button>
        <h1>{{ title }}</h1>
      </div>

      <div class="tabs">
        <button :class="{ active: tab === 'following' }" @click="switchTab('following')">
          关注 ({{ following.length }})
        </button>
        <button :class="{ active: tab === 'followers' }" @click="switchTab('followers')">
          粉丝 ({{ followers.length }})
        </button>
      </div>

      <div class="user-list" v-loading="loading">
        <UserCard
          v-for="user in list"
          :key="user.id"
          :user="user"
          :showFollow="true"
        />
        <el-empty v-if="!loading && list.length === 0" :description="emptyText" />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useInteractionStore } from '@/stores'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import UserCard from '@/components/UserCard.vue'

const route = useRoute()
const interactionStore = useInteractionStore()

const tab = ref(route.query.tab || 'following')
const following = ref([])
const followers = ref([])
const loading = ref(false)

const title = computed(() => {
  const userId = route.params.id
  return userId ? '关注与粉丝' : '关注与粉丝'
})

const list = computed(() => tab.value === 'following' ? following.value : followers.value)
const emptyText = computed(() => tab.value === 'following' ? '还没有关注任何人' : '还没有粉丝')

async function fetchData() {
  const userId = Number(route.params.id)
  if (!userId) return
  loading.value = true
  try {
    const [fing, fers] = await Promise.all([
      interactionStore.fetchFollowList(userId, 'following'),
      interactionStore.fetchFollowList(userId, 'followers')
    ])
    following.value = fing
    followers.value = fers
  } finally {
    loading.value = false
  }
}

function switchTab(t) { tab.value = t }

watch(() => route.params.id, fetchData)
onMounted(fetchData)
</script>

<style scoped>
.page-wrapper { min-height: 100vh; display: flex; flex-direction: column; }
.main-content { flex: 1; padding-top: calc(var(--header-height) + var(--spacing-lg)); padding-bottom: var(--spacing-xl); }
.page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.page-header h1 { font-size: 22px; font-weight: 700; }
.back-btn { display: flex; align-items: center; gap: 4px; font-size: var(--font-size-base); color: var(--color-text-light); }
.back-btn:hover { color: var(--color-secondary); }
.tabs { display: flex; gap: 0; margin-bottom: 20px; border-bottom: 2px solid var(--color-bg); }
.tabs button { padding: 8px 24px; font-size: var(--font-size-base); color: var(--color-text-light); border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all var(--transition-fast); }
.tabs button.active { color: var(--color-secondary); border-bottom-color: var(--color-secondary); font-weight: 600; }
.user-list { display: flex; flex-direction: column; gap: 12px; }
</style>
