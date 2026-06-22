<template>
  <div class="page-wrapper">
    <Header />
    <main class="main-content container">
      <!-- 分类快捷入口 -->
      <section class="section">
        <CategoryNav />
      </section>

      <!-- 作品展示区 -->
      <section class="section">
        <WorkList
          :works="works"
          :total="total"
          :loading="loading"
          :hasMore="hasMore"
          @sortChange="handleSortChange"
          @loadMore="handleLoadMore"
        />
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useWorkStore } from '@/stores'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import CategoryNav from '@/components/CategoryNav.vue'
import WorkList from '@/components/WorkList.vue'

const workStore = useWorkStore()

const works = ref([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const sort = ref('latest')
const hasMore = ref(true)

async function loadWorks(reset = false) {
  if (reset) page.value = 1
  loading.value = true
  try {
    const res = await workStore.fetchWorks({ sort: sort.value, page: page.value, pageSize: 12 })
    if (reset) {
      works.value = res.items
    } else {
      works.value = [...works.value, ...res.items]
    }
    total.value = res.total
    hasMore.value = page.value < res.totalPages
  } finally {
    loading.value = false
  }
}

function handleSortChange(newSort) {
  sort.value = newSort
  loadWorks(true)
}

function handleLoadMore() {
  page.value++
  loadWorks(false)
}

onMounted(() => loadWorks(true))
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
  padding-top: calc(var(--header-height) + var(--spacing-lg));
  padding-bottom: var(--spacing-xl);
}
.section {
  margin-bottom: var(--spacing-xl);
}
</style>
