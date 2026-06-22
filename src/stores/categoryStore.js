/**
 * 分类和标签管理 Store
 */

import { defineStore } from 'pinia'
import { getCategories, getTags } from '@/api/interaction'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    tags: [],
    loading: false
  }),

  getters: {
    // 按 ID 获取分类名
    categoryNameById: (state) => (id) => {
      const cat = state.categories.find(c => c.id === id)
      return cat ? cat.name : '未分类'
    },

    // 热门标签（Top 20）
    hotTags: (state) => {
      return [...state.tags].sort((a, b) => b.count - a.count).slice(0, 20)
    }
  },

  actions: {
    async fetchCategories() {
      this.categories = await getCategories()
      return this.categories
    },

    async fetchTags() {
      this.tags = await getTags()
      return this.tags
    }
  }
})
