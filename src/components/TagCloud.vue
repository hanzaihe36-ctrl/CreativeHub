<template>
  <div class="tag-cloud">
    <h2 class="section-title" v-if="showTitle">热门标签</h2>
    <div class="tags-wrap">
      <span
        v-for="tag in tags"
        :key="tag.name"
        class="tag-item"
        :style="{ fontSize: getSize(tag.count) + 'px' }"
        @click="$router.push(`/tag/${tag.name}`)"
      >{{ tag.name }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCategoryStore } from '@/stores'

defineProps({
  showTitle: { type: Boolean, default: true }
})

const categoryStore = useCategoryStore()

onMounted(() => {
  categoryStore.fetchTags()
})

const tags = computed(() => categoryStore.tags)

function getSize(count) {
  const list = categoryStore.tags
  if (!list.length) return 14
  const max = Math.max(...list.map(t => t.count))
  const min = Math.min(...list.map(t => t.count))
  const range = max - min || 1
  return 12 + ((count - min) / range) * 12
}
</script>

<style scoped>
.section-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
}
.tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: var(--spacing-md);
  background: #fff;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}
.tag-item {
  cursor: pointer;
  color: var(--color-text-light);
  padding: 2px 4px;
  border-radius: 4px;
  transition: all var(--transition-fast);
}
.tag-item:hover {
  color: var(--color-secondary);
  background: var(--color-bg);
}
</style>
