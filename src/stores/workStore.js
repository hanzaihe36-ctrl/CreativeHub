/**
 * 作品管理 Store
 */

import { defineStore } from 'pinia'
import { getWorks, getWorkDetail, createWork, updateWork, deleteWork } from '@/api/work'

export const useWorkStore = defineStore('work', {
  state: () => ({
    works: [],
    currentWork: null,
    total: 0,
    loading: false
  }),

  getters: {
    // 已发布的作品
    publishedWorks: (state) => state.works.filter(w => w.status === 'published'),

    // 草稿
    draftWorks: (state) => state.works.filter(w => w.status === 'draft'),

    // 按分类筛选
    worksByCategory: (state) => (categoryId) => {
      return state.publishedWorks.filter(w => w.categoryId === categoryId)
    },

    // 按作者筛选
    worksByAuthor: (state) => (authorId) => {
      return state.publishedWorks.filter(w => w.authorId === authorId)
    },

    // 热门作品（按浏览量）
    hotWorks: (state) => {
      return [...state.publishedWorks].sort((a, b) => b.views - a.views).slice(0, 12)
    }
  },

  actions: {
    async fetchWorks(params = {}) {
      this.loading = true
      try {
        const res = await getWorks(params)
        this.works = res.items
        this.total = res.total
        return res
      } finally {
        this.loading = false
      }
    },

    async fetchWorkDetail(id) {
      const work = await getWorkDetail(id)
      this.currentWork = work
      return work
    },

    async createWork(data) {
      const work = await createWork(data)
      this.works.unshift(work)
      return work
    },

    async updateWork(id, data) {
      const updated = await updateWork(id, data)
      const idx = this.works.findIndex(w => w.id === id)
      if (idx !== -1) this.works[idx] = updated
      if (this.currentWork?.id === id) this.currentWork = updated
      return updated
    },

    async deleteWork(id) {
      await deleteWork(id)
      this.works = this.works.filter(w => w.id !== id)
      if (this.currentWork?.id === id) this.currentWork = null
    }
  },

  persist: {
    key: 'ch-work-store',
    pick: ['works']
  }
})
