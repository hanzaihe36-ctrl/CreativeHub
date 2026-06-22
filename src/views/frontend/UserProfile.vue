<template>
  <div class="page-wrapper">
    <Header />
    <main class="main-content container" v-if="profile">
      <!-- 用户信息卡片 -->
      <section class="profile-card">
        <div class="profile-header">
          <el-avatar :size="80" :src="profile.avatar" />
          <div class="profile-info">
            <h1 class="profile-name">{{ profile.username }}</h1>
            <p class="profile-bio" v-if="profile.bio">{{ profile.bio }}</p>
            <div class="profile-skills" v-if="profile.skills?.length">
              <span class="skill-tag" v-for="s in profile.skills" :key="s">{{ s }}</span>
            </div>
            <a v-if="profile.website" :href="profile.website" target="_blank" class="profile-website">
              <el-icon><Link /></el-icon> {{ profile.website }}
            </a>
          </div>
          <div class="profile-actions" v-if="!isSelf">
            <button :class="['btn-follow-lg', { following: isFollowing }]" @click="handleFollow">
              {{ isFollowing ? '已关注' : '+ 关注' }}
            </button>
          </div>
          <div class="profile-actions" v-else>
            <router-link to="/settings" class="btn-edit">编辑资料</router-link>
          </div>
        </div>

        <!-- 统计数据 -->
        <div class="profile-stats">
          <div class="stat-item">
            <span class="stat-value">{{ profile.worksCount || 0 }}</span>
            <span class="stat-label">作品</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ formatCount(profile.viewsCount) }}</span>
            <span class="stat-label">浏览</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ formatCount(profile.likesCount) }}</span>
            <span class="stat-label">获赞</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ profile.followersCount || 0 }}</span>
            <span class="stat-label">粉丝</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ profile.followingCount || 0 }}</span>
            <span class="stat-label">关注</span>
          </div>
        </div>
      </section>

      <!-- 作品展示 -->
      <section class="profile-works">
        <h2 class="section-title">{{ isSelf ? '我的' : 'TA的' }}作品 ({{ works.length }})</h2>
        <div class="waterfall-grid" v-if="works.length">
          <WorkCard v-for="w in works" :key="w.id" :work="w" />
        </div>
        <el-empty v-else :description="isSelf ? '你还没有发布作品' : 'TA还没有发布作品'" />
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore, useWorkStore, useInteractionStore } from '@/stores'
import { getUserDetail } from '@/api/user'
import { ElMessage } from 'element-plus'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import WorkCard from '@/components/WorkCard.vue'

const route = useRoute()
const userStore = useUserStore()
const workStore = useWorkStore()
const interactionStore = useInteractionStore()

const profile = ref(null)
const works = ref([])
const isFollowing = ref(false)

const isSelf = computed(() => userStore.currentUserId === profile.value?.id)

function formatCount(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n || 0
}

async function fetchProfile() {
  const uid = Number(route.params.id)
  if (!uid) return
  profile.value = await getUserDetail(uid)
  // 获取该用户作品
  const res = await workStore.fetchWorks({ authorId: uid, sort: 'latest', page: 1, pageSize: 100 })
  works.value = res.items
  // 关注状态
  if (userStore.isLoggedIn && !isSelf.value) {
    try {
      const followRes = await interactionStore.checkFollowed(userStore.currentUserId, uid)
      isFollowing.value = followRes.followed
    } catch { /* */ }
  }
}

async function handleFollow() {
  if (!userStore.isLoggedIn) { ElMessage.warning('请先登录'); return }
  const res = await interactionStore.followUser(userStore.currentUserId, profile.value.id)
  isFollowing.value = res.followed
  profile.value.followersCount += res.followed ? 1 : -1
}

watch(() => route.params.id, fetchProfile)
onMounted(fetchProfile)
</script>

<style scoped>
.page-wrapper { min-height: 100vh; display: flex; flex-direction: column; }
.main-content { flex: 1; padding-top: calc(var(--header-height) + var(--spacing-lg)); padding-bottom: var(--spacing-xl); }

/* 用户卡片 */
.profile-card { background: #fff; border-radius: var(--border-radius); padding: var(--spacing-xl); box-shadow: var(--shadow-sm); margin-bottom: var(--spacing-xl); }
.profile-header { display: flex; gap: var(--spacing-lg); align-items: flex-start; }
.profile-info { flex: 1; }
.profile-name { font-size: 22px; font-weight: 700; }
.profile-bio { font-size: var(--font-size-base); color: var(--color-text-light); margin-top: 4px; }
.profile-skills { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
.skill-tag { padding: 2px 10px; background: var(--color-bg); border-radius: 12px; font-size: 12px; color: var(--color-text-light); }
.profile-website { display: inline-flex; align-items: center; gap: 4px; font-size: var(--font-size-sm); margin-top: 8px; }

.btn-follow-lg { padding: 8px 28px; border: 1px solid var(--color-secondary); border-radius: 20px; color: var(--color-secondary); font-size: var(--font-size-base); transition: all var(--transition-fast); white-space: nowrap; }
.btn-follow-lg:hover { background: var(--color-secondary); color: #fff; }
.btn-follow-lg.following { border-color: var(--color-text-light); color: var(--color-text-light); }
.btn-edit { padding: 8px 28px; border: 1px solid #ddd; border-radius: 20px; font-size: var(--font-size-base); color: var(--color-text); white-space: nowrap; }

/* 统计 */
.profile-stats { display: flex; gap: var(--spacing-xl); margin-top: var(--spacing-lg); padding-top: var(--spacing-lg); border-top: 1px solid var(--color-bg); }
.stat-item { text-align: center; flex: 1; }
.stat-value { display: block; font-size: 20px; font-weight: 700; color: var(--color-text); }
.stat-label { font-size: var(--font-size-sm); color: var(--color-text-light); }

/* 作品 */
.profile-works { margin-top: var(--spacing-xl); }
.section-title { font-size: var(--font-size-lg); font-weight: 700; margin-bottom: var(--spacing-md); }
.waterfall-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }

@media (max-width: 768px) {
  .profile-header { flex-direction: column; align-items: center; text-align: center; }
  .profile-stats { gap: var(--spacing-md); flex-wrap: wrap; }
  .stat-item { flex: none; min-width: 60px; }
}
</style>
