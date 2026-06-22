<template>
  <div class="work-card" @click="goDetail">
    <!-- 封面图 -->
    <div class="card-cover">
      <!-- 视频封面：用 video 标签显示第一帧 -->
      <video
        v-if="isVideoCover"
        :src="work.coverImage"
        muted
        preload="metadata"
        class="cover-video"
      ></video>
      <!-- 图片封面 -->
      <img v-else :src="work.coverImage" :alt="work.title" loading="lazy" />
      <!-- 视频播放图标 -->
      <div v-if="work.mediaType === 'video'" class="video-badge">
        <el-icon :size="28"><VideoPlay /></el-icon>
      </div>
      <div class="card-overlay">
        <span class="overlay-views"><el-icon><View /></el-icon> {{ formatCount(work.views) }}</span>
        <span class="overlay-likes"><el-icon><StarFilled /></el-icon> {{ formatCount(work.likes) }}</span>
      </div>
    </div>

    <!-- 信息区 -->
    <div class="card-body">
      <h3 class="card-title" :title="work.title">{{ work.title }}</h3>
      <div class="card-tags" v-if="work.tags?.length">
        <span class="tag" v-for="tag in work.tags.slice(0, 3)" :key="tag">{{ tag }}</span>
      </div>
    </div>

    <!-- 作者区 -->
    <div class="card-footer">
      <router-link :to="`/user/${work.authorId}`" class="card-author" @click.stop>
        <el-avatar :size="24" :src="work.authorAvatar" />
        <span>{{ work.authorName }}</span>
      </router-link>
      <span class="card-time">{{ timeAgo(work.publishTime) }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { timeAgo } from '@/utils/date'

const props = defineProps({
  work: { type: Object, required: true }
})

const router = useRouter()

const isVideoCover = computed(() => {
  const url = props.work.coverImage || ''
  return /\.(mp4|webm|mov)($|\?)/i.test(url)
})

function goDetail() {
  router.push(`/work/${props.work.id}`)
}

function formatCount(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n
}
</script>

<style scoped>
.work-card {
  background: #fff;
  border-radius: var(--border-radius);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}
.work-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

/* 封面 */
.card-cover {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #eee;
}
.card-cover img,
.cover-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.work-card:hover .card-cover img,
.work-card:hover .card-cover .cover-video {
  transform: scale(1.05);
}
.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 12px;
  background: linear-gradient(transparent, rgba(0,0,0,0.6));
  display: flex;
  gap: 12px;
  color: #fff;
  font-size: var(--font-size-sm);
  opacity: 0;
  transition: opacity var(--transition-fast);
}
.work-card:hover .card-overlay {
  opacity: 1;
}
.video-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  background: rgba(0,0,0,0.5);
  width: 52px; height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}
.work-card:hover .video-badge {
  background: rgba(231,76,60,0.85);
  transform: translate(-50%, -50%) scale(1.1);
}
.overlay-views,
.overlay-likes {
  display: flex;
  align-items: center;
  gap: 3px;
}

/* 信息 */
.card-body {
  padding: 12px;
}
.card-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.card-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 8px;
}
.tag {
  padding: 1px 8px;
  background: var(--color-bg);
  color: var(--color-text-light);
  border-radius: 4px;
  font-size: 11px;
}

/* 作者 */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px 12px;
}
.card-author {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-sm);
  color: var(--color-text);
}
.card-author:hover {
  color: var(--color-secondary);
}
.card-time {
  font-size: 11px;
  color: var(--color-text-light);
}
</style>
