/**
 * 用户管理 Store
 */

import { defineStore } from 'pinia'
import { login, register, getUserDetail, getUsers, updateUser, getUserStats } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    users: [],
    isLoggedIn: false,
    userStats: null
  }),

  getters: {
    currentUserId: (state) => state.currentUser?.id || null,

    currentUserName: (state) => state.currentUser?.username || '',

    currentUserAvatar: (state) => state.currentUser?.avatar || ''
  },

  actions: {
    async login(email, password) {
      const user = await login(email, password)
      this.currentUser = user
      this.isLoggedIn = true
      return user
    },

    async register(userData) {
      const user = await register(userData)
      this.currentUser = user
      this.isLoggedIn = true
      return user
    },

    logout() {
      this.currentUser = null
      this.isLoggedIn = false
      this.userStats = null
    },

    async fetchUsers(params = {}) {
      this.users = await getUsers(params)
      return this.users
    },

    async fetchUserDetail(id) {
      const user = await getUserDetail(id)
      return user
    },

    async updateProfile(id, data) {
      const updated = await updateUser(id, data)
      if (this.currentUser?.id === id) {
        this.currentUser = { ...this.currentUser, ...updated }
      }
      return updated
    },

    async fetchStats() {
      if (!this.currentUserId) return null
      this.userStats = await getUserStats(this.currentUserId)
      return this.userStats
    }
  },

  persist: {
    key: 'ch-user-store',
    pick: ['currentUser', 'isLoggedIn']
  }
})
