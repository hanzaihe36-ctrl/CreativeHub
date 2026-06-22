<template>
  <div class="page-wrapper">
    <Header />
    <!-- 加载中 -->
    <main class="main-content container" v-if="loading">
      <div class="skeleton-detail">
        <div class="skeleton skeleton-img" style="height:400px"></div>
        <div style="display:flex;gap:24px;margin-top:24px">
          <div style="flex:1"><div class="skeleton" style="height:32px;margin-bottom:12px"></div><div class="skeleton" style="height:16px;width:60%;margin-bottom:8px"></div></div>
          <div style="width:280px"><div class="skeleton" style="height:200px"></div></div>
        </div>
      </div>
    </main>
    <!-- 加载失败 -->
    <main class="main-content container" v-else-if="error">
      <el-result icon="error" title="加载失败" :sub-title="error">
        <template #extra>
          <el-button type="primary" @click="fetchDetail">重新加载</el-button>
          <el-button @click="$router.push('/')">返回首页</el-button>
        </template>
      </el-result>
    </main>
    <!-- 正常内容 -->
    <main class="main-content container" v-else-if="work">
      <!-- 图片轮播 / 视频播放器 -->
      <section class="gallery-section">
        <!-- 视频模式 -->
        <div v-if="work.mediaType === 'video'" class="video-player-wrap">
          <video
            ref="videoPlayer"
            :src="work.videoUrl"
            controls
            class="video-player"
            @error="videoError = true"
            v-if="!videoError"
            preload="metadata"
          >
            您的浏览器不支持视频播放
          </video>
          <div v-if="videoError" class="video-placeholder">
            <el-icon :size="48"><VideoPlay /></el-icon>
            <p>视频文件未上传</p>
            <span>请将视频文件放入 public/videos/works/ 目录</span>
          </div>
        </div>
        <!-- 图片模式 -->
        <template v-else>
          <div class="main-image-wrap">
            <img :src="work.images[currentImage]" :alt="work.title" @click="showViewer = true" />
            <button class="gallery-btn prev" @click="prevImage" v-if="work.images.length > 1">
              <el-icon><ArrowLeft /></el-icon>
            </button>
            <button class="gallery-btn next" @click="nextImage" v-if="work.images.length > 1">
              <el-icon><ArrowRight /></el-icon>
            </button>
          </div>
          <div class="thumb-list" v-if="work.images.length > 1">
            <img
              v-for="(img, i) in work.images"
              :key="i"
              :src="img"
              :class="['thumb', { active: i === currentImage }]"
              @click="currentImage = i"
            />
          </div>
        </template>
      </section>

      <!-- 作品信息 + 创作者卡片 -->
      <div class="detail-grid">
        <section class="work-info">
          <h1 class="work-title">{{ work.title }}</h1>
          <div class="work-meta">
            <span class="meta-item"><el-icon><View /></el-icon> {{ formatCount(work.views) }} 浏览</span>
            <span class="meta-item">{{ formatDate(work.publishTime) }} 发布</span>
          </div>
          <p class="work-desc">{{ work.description }}</p>

          <!-- 标签 -->
          <div class="work-tags" v-if="work.tags?.length">
            <router-link v-for="tag in work.tags" :key="tag" :to="`/tag/${tag}`" class="tag-link">{{ tag }}</router-link>
          </div>

          <!-- 工具 -->
          <div class="work-tools" v-if="work.toolsUsed?.length">
            <span class="label">使用工具：</span>
            <span v-for="tool in work.toolsUsed" :key="tool" class="tool-tag">{{ tool }}</span>
          </div>

          <!-- 互动按钮 -->
          <div class="action-bar">
            <button :class="['action-btn', { active: liked }]" @click="handleLike">
              <el-icon><StarFilled /></el-icon>
              <span>{{ liked ? '已点赞' : '点赞' }} ({{ work.likes }})</span>
            </button>
            <button :class="['action-btn', { active: collected }]" @click="handleCollect">
              <el-icon><FolderChecked /></el-icon>
              <span>{{ collected ? '已收藏' : '收藏' }} ({{ work.collects }})</span>
            </button>
          </div>
        </section>

        <!-- 创作者卡片 -->
        <aside class="author-sidebar">
          <div class="author-card">
            <router-link :to="`/user/${work.authorId}`" class="author-header">
              <el-avatar :size="64" :src="work.authorAvatar" />
              <div>
                <span class="author-name">{{ work.authorName }}</span>
                <span class="author-works">{{ work.authorName }}的作品集</span>
              </div>
            </router-link>
            <button
              v-if="!isSelf"
              :class="['btn-follow-full', { following: isFollowing }]"
              @click="handleFollow"
            >{{ isFollowing ? '已关注' : '+ 关注' }}</button>
            <router-link v-else :to="`/user/${work.authorId}`" class="btn-edit-profile">编辑资料</router-link>
          </div>
        </aside>
      </div>

      <!-- 评论 -->
      <section class="comment-section">
        <CommentList
          :work-id="work.id"
          :comments="comments"
          :total="commentTotal"
          :hasMore="commentHasMore"
          :loading="commentLoading"
          @submit="handleCommentSubmit"
          @loadMore="loadMoreComments"
        />
      </section>

      <!-- 相关推荐 -->
      <section class="related-section" v-if="relatedWorks.length">
        <h2 class="section-title">相关推荐</h2>
        <div class="waterfall-grid">
          <WorkCard v-for="w in relatedWorks" :key="w.id" :work="w" />
        </div>
      </section>

      <!-- 全屏查看 -->
      <div v-if="showViewer" class="image-viewer" @click="showViewer = false">
        <img :src="work.images[currentImage]" />
        <button class="viewer-close"><el-icon><Close /></el-icon></button>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkStore, useUserStore, useInteractionStore } from '@/stores'
import { formatDate, formatCount } from '@/utils/date'
import { ElMessage } from 'element-plus'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import WorkCard from '@/components/WorkCard.vue'
import CommentList from '@/components/CommentList.vue'

const route = useRoute()
const workStore = useWorkStore()
const userStore = useUserStore()
const interactionStore = useInteractionStore()

const work = ref(null)
const loading = ref(true)
const error = ref('')
const currentImage = ref(0)
const showViewer = ref(false)
const videoError = ref(false)
const liked = ref(false)
const collected = ref(false)
const isFollowing = ref(false)
const comments = ref([])
const commentTotal = ref(0)
const commentPage = ref(1)
const commentHasMore = ref(false)
const commentLoading = ref(false)
const relatedWorks = ref([])

const isSelf = computed(() => userStore.currentUserId === work.value?.authorId)

async function fetchDetail() {
  const id = Number(route.params.id)
  if (!id) { error.value = '无效的作品ID'; loading.value = false; return }
  loading.value = true
  error.value = ''
  try {
    work.value = await workStore.fetchWorkDetail(id)
  } catch (e) {
    error.value = e.message || '作品加载失败'
    loading.value = false
    return
  }
  loading.value = false

  // 相关推荐
  relatedWorks.value = workStore.publishedWorks
    .filter(w => w.id !== id && w.categoryId === work.value.categoryId)
    .slice(0, 6)

  // 评论
  await loadComments(true)

  // 互动状态
  if (userStore.isLoggedIn) {
    const uid = userStore.currentUserId
    try {
      const likeRes = await interactionStore.checkLiked(uid, id)
      liked.value = likeRes.liked
    } catch { /* */ }
    try {
      const collectRes = await interactionStore.checkLiked(uid, id)
      // Note: Mock doesn't have separate collect check API, using like pattern
    } catch { /* */ }
    if (work.value && !isSelf.value) {
      try {
        const followRes = await interactionStore.checkFollowed(uid, work.value.authorId)
        isFollowing.value = followRes.followed
      } catch { /* */ }
    }
  }
}

async function loadComments(reset = false) {
  if (reset) commentPage.value = 1
  commentLoading.value = true
  try {
    const res = await interactionStore.fetchComments(work.value.id, commentPage.value)
    if (reset) {
      comments.value = res.items
    } else {
      comments.value = [...comments.value, ...res.items]
    }
    commentTotal.value = res.total
    commentHasMore.value = comments.value.length < res.total
  } finally {
    commentLoading.value = false
  }
}

async function loadMoreComments() {
  commentPage.value++
  await loadComments(false)
}

async function handleCommentSubmit({ content }) {
  await interactionStore.addComment(userStore.currentUserId, work.value.id, content)
  commentTotal.value++
  ElMessage.success('评论成功')
  await loadComments(true)
}

async function handleLike() {
  if (!userStore.isLoggedIn) { ElMessage.warning('请先登录'); return }
  const res = await interactionStore.likeWork(userStore.currentUserId, work.value.id)
  liked.value = res.liked
  work.value.likes = res.count
}

async function handleCollect() {
  if (!userStore.isLoggedIn) { ElMessage.warning('请先登录'); return }
  const res = await interactionStore.collectWork(userStore.currentUserId, work.value.id)
  collected.value = res.collected
  work.value.collects = res.count
}

async function handleFollow() {
  if (!userStore.isLoggedIn) { ElMessage.warning('请先登录'); return }
  const res = await interactionStore.followUser(userStore.currentUserId, work.value.authorId)
  isFollowing.value = res.followed
}

function prevImage() {
  currentImage.value = (currentImage.value - 1 + work.value.images.length) % work.value.images.length
}
function nextImage() {
  currentImage.value = (currentImage.value + 1) % work.value.images.length
}

watch(() => route.params.id, fetchDetail)
onMounted(fetchDetail)
</script>

<style scoped>
.page-wrapper { min-height: 100vh; display: flex; flex-direction: column; }
.main-content { flex: 1; padding-top: calc(var(--header-height) + var(--spacing-lg)); padding-bottom: var(--spacing-xl); }

/* 骨架屏 */
.skeleton-detail { padding-top: calc(var(--header-height) + var(--spacing-lg)); }

/* 图片 / 视频 */
.gallery-section { margin-bottom: var(--spacing-xl); }
.video-player-wrap { border-radius: var(--border-radius); overflow: hidden; background: #000; }
.video-player { width: 100%; max-height: 500px; display: block; }
.video-placeholder {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 300px; color: #fff; gap: 12px;
}
.video-placeholder p { font-size: var(--font-size-md); opacity: 0.7; }
.video-placeholder span { font-size: var(--font-size-sm); opacity: 0.4; }
.main-image-wrap {
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
  background: #eee;
  cursor: zoom-in;
}
.main-image-wrap img { width: 100%; max-height: 500px; object-fit: contain; }
.gallery-btn {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,0.9); color: var(--color-text);
  display: flex; align-items: center; justify-content: center;
  box-shadow: var(--shadow-md);
}
.gallery-btn.prev { left: 12px; }
.gallery-btn.next { right: 12px; }
.thumb-list { display: flex; gap: 8px; margin-top: 8px; overflow-x: auto; }
.thumb { width: 60px; height: 45px; object-fit: cover; border-radius: 4px; cursor: pointer; opacity: 0.6; transition: opacity var(--transition-fast); }
.thumb.active { opacity: 1; border: 2px solid var(--color-secondary); }

/* 详情网格 */
.detail-grid { display: grid; grid-template-columns: 1fr 280px; gap: var(--spacing-xl); margin-bottom: var(--spacing-xl); }
.work-title { font-size: 24px; font-weight: 700; margin-bottom: var(--spacing-sm); }
.work-meta { display: flex; gap: var(--spacing-md); font-size: var(--font-size-sm); color: var(--color-text-light); margin-bottom: var(--spacing-md); }
.meta-item { display: flex; align-items: center; gap: 4px; }
.work-desc { font-size: var(--font-size-base); line-height: 1.8; color: var(--color-text); white-space: pre-wrap; margin-bottom: var(--spacing-md); }
.work-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: var(--spacing-md); }
.tag-link { padding: 4px 12px; background: var(--color-bg); border-radius: 16px; font-size: var(--font-size-sm); color: var(--color-text-light); }
.tag-link:hover { background: var(--color-secondary); color: #fff; }
.work-tools { margin-bottom: var(--spacing-md); font-size: var(--font-size-sm); }
.label { color: var(--color-text-light); }
.tool-tag { display: inline-block; padding: 2px 8px; margin: 2px; background: #e8f4fd; color: var(--color-secondary); border-radius: 4px; font-size: 12px; }

/* 互动 */
.action-bar { display: flex; gap: var(--spacing-md); padding-top: var(--spacing-md); border-top: 1px solid var(--color-bg); }
.action-btn { display: flex; align-items: center; gap: 4px; padding: 8px 20px; border: 1px solid #ddd; border-radius: 20px; font-size: var(--font-size-sm); color: var(--color-text-light); transition: all var(--transition-fast); }
.action-btn:hover { border-color: var(--color-secondary); color: var(--color-secondary); }
.action-btn.active { border-color: var(--color-accent); color: var(--color-accent); background: #fef0f0; }

/* 作者侧栏 */
.author-card { padding: var(--spacing-lg); background: #fff; border-radius: var(--border-radius); box-shadow: var(--shadow-sm); text-align: center; }
.author-header { display: flex; flex-direction: column; align-items: center; gap: var(--spacing-sm); margin-bottom: var(--spacing-md); }
.author-name { font-size: var(--font-size-md); font-weight: 600; color: var(--color-text); }
.author-works { font-size: var(--font-size-sm); color: var(--color-text-light); }
.btn-follow-full { width: 100%; padding: 8px; border: 1px solid var(--color-secondary); border-radius: 20px; color: var(--color-secondary); font-size: var(--font-size-base); transition: all var(--transition-fast); }
.btn-follow-full:hover { background: var(--color-secondary); color: #fff; }
.btn-follow-full.following { border-color: var(--color-text-light); color: var(--color-text-light); }
.btn-edit-profile { display: block; padding: 8px; background: var(--color-bg); border-radius: 20px; font-size: var(--font-size-sm); color: var(--color-text); }

/* 推荐 */
.related-section { margin-top: var(--spacing-xl); }
.section-title { font-size: var(--font-size-lg); font-weight: 700; margin-bottom: var(--spacing-md); }
.waterfall-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }

/* 全屏查看 */
.image-viewer { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 2000; display: flex; align-items: center; justify-content: center; }
.image-viewer img { max-width: 90vw; max-height: 90vh; }
.viewer-close { position: absolute; top: 20px; right: 20px; color: #fff; font-size: 24px; }

@media (max-width: 768px) {
  .detail-grid { grid-template-columns: 1fr; }
}
</style>
