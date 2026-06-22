<template>
  <div class="comment-list">
    <h3 class="comment-title">评论 ({{ total || 0 }})</h3>

    <!-- 评论输入 -->
    <div class="comment-input" v-if="userStore.isLoggedIn">
      <el-avatar :size="32" :src="userStore.currentUser?.avatar" />
      <div class="input-area">
        <el-input
          v-model="content"
          type="textarea"
          :rows="2"
          placeholder="写下你的评论..."
          maxlength="200"
          show-word-limit
        />
        <button class="btn-submit" :disabled="!content.trim() || submitting" @click="handleSubmit">
          {{ submitting ? '发送中...' : '发表评论' }}
        </button>
      </div>
    </div>
    <div class="comment-login-hint" v-else>
      <router-link to="/login">登录</router-link> 后参与评论
    </div>

    <!-- 评论列表 -->
    <div class="comment-items" v-if="comments.length">
      <div class="comment-item" v-for="c in comments" :key="c.id">
        <el-avatar :size="32" :src="c.userAvatar" />
        <div class="comment-body">
          <div class="comment-header">
            <router-link :to="`/user/${c.userId}`" class="comment-user">{{ c.userName }}</router-link>
            <span class="comment-time">{{ timeAgo(c.createTime) }}</span>
          </div>
          <p class="comment-text">{{ c.content }}</p>
        </div>
      </div>

      <!-- 加载更多 -->
      <div class="comment-more" v-if="hasMore">
        <button @click="$emit('loadMore')">加载更多评论</button>
      </div>
    </div>

    <!-- 无评论 -->
    <div class="comment-empty" v-if="!loading && comments.length === 0">
      <p>暂无评论，来说两句吧</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore, useInteractionStore } from '@/stores'
import { timeAgo } from '@/utils/date'
import { ElMessage } from 'element-plus'

const props = defineProps({
  workId: { type: Number, required: true },
  comments: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
  hasMore: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['submit', 'loadMore'])

const userStore = useUserStore()
const content = ref('')
const submitting = ref(false)

async function handleSubmit() {
  if (!content.value.trim()) return
  submitting.value = true
  try {
    await userStore.currentUserId  // wait for hydration
    emit('submit', { content: content.value.trim() })
    content.value = ''
  } catch {
    ElMessage.error('评论失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.comment-list {
  padding: var(--spacing-lg) 0;
}
.comment-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

.comment-input {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}
.input-area {
  flex: 1;
}
.btn-submit {
  margin-top: 8px;
  padding: 6px 20px;
  background: var(--color-secondary);
  color: #fff;
  border-radius: 6px;
  font-size: var(--font-size-sm);
}
.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.comment-login-hint {
  padding: var(--spacing-md);
  background: var(--color-bg);
  border-radius: var(--border-radius);
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-lg);
}

.comment-item {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-bg);
}
.comment-body {
  flex: 1;
  min-width: 0;
}
.comment-header {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  margin-bottom: 4px;
}
.comment-user {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text);
}
.comment-time {
  font-size: 11px;
  color: var(--color-text-light);
}
.comment-text {
  font-size: var(--font-size-base);
  color: var(--color-text);
  line-height: 1.5;
  word-break: break-all;
}

.comment-more {
  text-align: center;
  padding: var(--spacing-md);
}
.comment-more button {
  font-size: var(--font-size-sm);
  color: var(--color-secondary);
}

.comment-empty {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-light);
}
</style>
