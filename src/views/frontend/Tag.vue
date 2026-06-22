<template>
  <div class="page-wrapper">
    <Header />
    <main class="main-content container">
      <div class="page-header">
        <h1># {{ tagName }}</h1>
        <p class="page-desc">包含标签"{{ tagName }}"的作品</p>
      </div>
      <WorkList
        :works="works"
        :total="total"
        :loading="loading"
        :hasMore="hasMore"
        :emptyText="'暂无包含「' + tagName + '」标签的作品'"
        @sortChange="handleSortChange"
        @loadMore="handleLoadMore"
      />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkStore } from '@/stores'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import WorkList from '@/components/WorkList.vue'

const route = useRoute()
const workStore = useWorkStore()

const works = ref([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const sort = ref('latest')
const hasMore = ref(false)

const tagName = ref('')

async function loadWorks(reset = false) {
  if (reset) page.value = 1
  const name = route.params.name
  if (!name) return
  tagName.value = name
  loading.value = true
  try {
    const res = await workStore.fetchWorks({ tag: name, sort: sort.value, page: page.value, pageSize: 12 })
    if (reset) works.value = res.items
    else works.value = [...works.value, ...res.items]
    total.value = res.total
    hasMore.value = page.value < res.totalPages
  } finally {
    loading.value = false
  }
}

function handleSortChange(newSort) { sort.value = newSort; loadWorks(true) }
function handleLoadMore() { page.value++; loadWorks(false) }

onMounted(() => loadWorks(true))
watch(() => route.params.name, () => loadWorks(true))
</script>

<style scoped>
.page-wrapper { min-height: 100vh; display: flex; flex-direction: column; }
.main-content { flex: 1; padding-top: calc(var(--header-height) + var(--spacing-lg)); padding-bottom: var(--spacing-xl); }
.page-header { margin-bottom: var(--spacing-lg); }
.page-header h1 { font-size: 24px; font-weight: 700; }
.page-desc { color: var(--color-text-light); font-size: var(--font-size-base); margin-top: 4px; }
</style>
