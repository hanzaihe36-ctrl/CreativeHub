<template>
  <div class="category-nav">
    <h2 class="section-title" v-if="showTitle">探索分类</h2>
    <div class="category-grid">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="category-item"
        @click="goCategory(cat.id)"
      >
        <div class="cat-icon">
          <el-icon :size="24"><component :is="cat.icon" /></el-icon>
        </div>
        <span class="cat-name">{{ cat.name }}</span>
        <span class="cat-count">{{ cat.worksCount || 0 }} 作品</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '@/stores'

const props = defineProps({
  showTitle: { type: Boolean, default: true }
})

const router = useRouter()
const categoryStore = useCategoryStore()

onMounted(() => {
  categoryStore.fetchCategories()
})

const categories = computed(() => categoryStore.categories)

function goCategory(id) {
  router.push(`/category/${id}`)
}
</script>

<style scoped>
.section-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}
.category-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}
.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: var(--spacing-md) 8px;
  background: #fff;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}
.category-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  color: var(--color-secondary);
}
.cat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--color-bg);
  color: var(--color-secondary);
  transition: background var(--transition-fast);
}
.category-item:hover .cat-icon {
  background: var(--color-secondary);
  color: #fff;
}
.cat-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
}
.cat-count {
  font-size: 11px;
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
}
</style>
