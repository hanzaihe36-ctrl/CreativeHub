<template>
  <div class="user-card" @click="goProfile">
    <el-avatar :size="56" :src="user.avatar" />
    <div class="user-info">
      <span class="user-nickname">{{ user.username }}</span>
      <span class="user-bio" v-if="user.bio">{{ user.bio }}</span>
      <span class="user-stats">{{ user.worksCount || 0 }} 作品 · {{ user.followersCount || 0 }} 粉丝</span>
    </div>
    <button
      v-if="showFollow && !isSelf"
      :class="['btn-follow', { following: isFollowing }]"
      @click.stop="handleFollow"
    >
      {{ isFollowing ? '已关注' : '关注' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore, useInteractionStore } from '@/stores'
import { ElMessage } from 'element-plus'

const props = defineProps({
  user: { type: Object, required: true },
  showFollow: { type: Boolean, default: false }
})

const router = useRouter()
const userStore = useUserStore()
const interactionStore = useInteractionStore()

const isFollowing = ref(false)

const isSelf = computed(() => userStore.currentUserId === props.user.id)

watch(() => props.user.id, async (newId) => {
  if (newId && userStore.isLoggedIn && !isSelf.value) {
    try {
      const res = await interactionStore.checkFollowed(userStore.currentUserId, newId)
      isFollowing.value = res.followed
    } catch { /* ignore */ }
  }
}, { immediate: true })

function goProfile() {
  router.push(`/user/${props.user.id}`)
}

async function handleFollow() {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }
  try {
    const res = await interactionStore.followUser(userStore.currentUserId, props.user.id)
    isFollowing.value = res.followed
    ElMessage.success(res.followed ? '已关注' : '已取消关注')
  } catch {
    ElMessage.error('操作失败')
  }
}
</script>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: #fff;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: box-shadow var(--transition-fast);
}
.user-card:hover {
  box-shadow: var(--shadow-md);
}

.user-info {
  flex: 1;
  min-width: 0;
}
.user-nickname {
  display: block;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text);
}
.user-bio {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}
.user-stats {
  display: block;
  font-size: 11px;
  color: var(--color-text-light);
  margin-top: 2px;
}

.btn-follow {
  flex-shrink: 0;
  padding: 4px 16px;
  border: 1px solid var(--color-secondary);
  border-radius: 16px;
  color: var(--color-secondary);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}
.btn-follow:hover {
  background: var(--color-secondary);
  color: #fff;
}
.btn-follow.following {
  border-color: var(--color-text-light);
  color: var(--color-text-light);
}
</style>
