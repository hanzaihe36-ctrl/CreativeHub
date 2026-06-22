<template>
  <div class="page-wrapper">
    <Header />
    <main class="main-content container">
      <section class="topics-hero">
        <h1>话题广场</h1>
        <p>探索感兴趣的话题，发现更多精彩作品</p>
      </section>

      <section v-loading="loading">
        <div class="topic-grid" v-if="tags.length">
          <div
            v-for="tag in tags"
            :key="tag.name"
            class="topic-card"
            @click="$router.push(`/tag/${tag.name}`)"
          >
            <div class="topic-bg" :style="{ background: randomGradient(tag.name) }"></div>
            <div class="topic-body">
              <span class="topic-hash">#{{ tag.name }}</span>
              <span class="topic-count">{{ tag.count }} 个作品</span>
            </div>
          </div>
        </div>
        <el-empty v-if="!loading && tags.length === 0" description="暂无话题" />
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCategoryStore } from '@/stores'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const categoryStore = useCategoryStore()
const tags = ref([])
const loading = ref(false)

const gradients = [
  ['#b8c6db', '#f5f7fa'],
  ['#e8eaf6', '#fce4ec'],
  ['#e0f2f1', '#e8f5e9'],
  ['#f3e5f5', '#e8eaf6'],
  ['#e8f5e9', '#fff8e1'],
  ['#fce4ec', '#e0f2f1'],
  ['#ede7f6', '#e8eaf6'],
  ['#fff3e0', '#f3e5f5'],
]

function randomGradient(name) {
  const idx = name.length % gradients.length
  const [c1, c2] = gradients[idx]
  return `linear-gradient(135deg, ${c1}, ${c2})`
}

onMounted(async () => {
  loading.value = true
  await categoryStore.fetchTags()
  tags.value = categoryStore.tags.slice(0, 30)
  loading.value = false
})
</script>

<style scoped>
.page-wrapper { min-height: 100vh; display: flex; flex-direction: column; }
.main-content { flex: 1; padding-top: calc(var(--header-height) + var(--spacing-xl)); padding-bottom: var(--spacing-xl); }

.topics-hero { text-align: center; padding: 30px 0 40px; }
.topics-hero h1 { font-size: 28px; font-weight: 700; color: var(--color-primary); }
.topics-hero p { font-size: var(--font-size-base); color: var(--color-text-light); margin-top: 6px; }

.topic-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
}

.topic-card {
  position: relative;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}
.topic-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.topic-bg {
  position: absolute;
  inset: 0;
}
.topic-body {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #37474f;
}
.topic-hash {
  font-size: 15px;
  font-weight: 700;
}
.topic-count {
  font-size: 12px;
  opacity: 0.85;
  margin-top: 2px;
}

@media (max-width: 1199px) {
  .topic-grid { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 768px) {
  .topic-grid { grid-template-columns: repeat(3, 1fr); }
  .topic-card { height: 90px; }
  .topic-hash { font-size: 13px; }
}
@media (max-width: 480px) {
  .topic-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
