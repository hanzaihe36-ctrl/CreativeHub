<template>
  <div class="work-list-section">
    <!-- 排序栏 -->
    <div class="list-toolbar" v-if="showToolbar">
      <span class="result-count" v-if="total !== null">共 {{ total }} 件作品</span>
      <div class="sort-options">
        <button
          v-for="opt in sortOptions"
          :key="opt.value"
          :class="['sort-btn', { active: currentSort === opt.value }]"
          @click="changeSort(opt.value)"
        >{{ opt.label }}</button>
      </div>
    </div>

    <!-- 瀑布流网格 -->
    <div class="waterfall-grid">
      <WorkCard v-for="work in works" :key="work.id" :work="work" />
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && works.length === 0" class="empty-state">
      <el-empty description="暂无作品">
        <template v-if="emptyText">{{ emptyText }}</template>
      </el-empty>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="loading-state">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <p>加载中...</p>
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore && !loading" class="load-more">
      <button class="btn-load-more" @click="$emit('loadMore')">
        加载更多作品
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import WorkCard from './WorkCard.vue'

defineProps({
  works: { type: Array, default: () => [] },
  total: { type: Number, default: null },
  loading: { type: Boolean, default: false },
  hasMore: { type: Boolean, default: false },
  showToolbar: { type: Boolean, default: true },
  emptyText: { type: String, default: '' }
})

const emit = defineEmits(['sortChange', 'loadMore'])

const sortOptions = [
  { label: '最新', value: 'latest' },
  { label: '最热', value: 'hot' },
  { label: '推荐', value: 'popular' }
]
const currentSort = ref('latest')

function changeSort(value) {
  currentSort.value = value
  emit('sortChange', value)
}
</script>

<style scoped>
.list-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}
.result-count {
  font-size: var(--font-size-base);
  color: var(--color-text-light);
}
.sort-options {
  display: flex;
  gap: 4px;
  background: var(--color-bg);
  border-radius: 6px;
  padding: 3px;
}
.sort-btn {
  padding: 4px 16px;
  border-radius: 4px;
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  transition: all var(--transition-fast);
}
.sort-btn.active {
  background: #fff;
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

/* 瀑布流 */
.waterfall-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.empty-state,
.loading-state {
  padding: 80px 0;
  text-align: center;
}
.loading-icon {
  font-size: 32px;
  color: var(--color-secondary);
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.load-more {
  text-align: center;
  padding: var(--spacing-xl) 0;
}
.btn-load-more {
  padding: 10px 40px;
  border: 1px solid var(--color-secondary);
  border-radius: 24px;
  color: var(--color-secondary);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
}
.btn-load-more:hover {
  background: var(--color-secondary);
  color: #fff;
}

@media (max-width: 768px) {
  .waterfall-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .list-toolbar {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}
</style>
