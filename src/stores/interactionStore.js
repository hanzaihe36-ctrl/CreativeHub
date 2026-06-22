/**
 * 互动管理 Store（点赞、收藏、评论、关注）
 */

import { defineStore } from 'pinia'
import {
  toggleLike, checkLiked,
  toggleCollect, getCollects,
  getComments, addComment,
  toggleFollow, checkFollowed, getFollowList
} from '@/api/interaction'

export const useInteractionStore = defineStore('interaction', {
  state: () => ({
    likes: [],
    collects: [],
    comments: [],
    follows: [],
    currentComments: []
  }),

  getters: {
    // 判断是否已点赞
    hasLiked: (state) => (userId, workId) => {
      return state.likes.some(l => l.userId === userId && l.workId === workId)
    },

    // 判断是否已收藏
    hasCollected: (state) => (userId, workId) => {
      return state.collects.some(c => c.userId === userId && c.workId === workId)
    },

    // 判断是否已关注
    hasFollowed: (state) => (followerId, followingId) => {
      return state.follows.some(f => f.followerId === followerId && f.followingId === followingId)
    },

    // 当前作品的评论
    currentWorkComments: (state) => {
      return [...state.currentComments].sort((a, b) => b.createTime - a.createTime)
    }
  },

  actions: {
    // ---- 点赞 ----
    async likeWork(userId, workId) {
      const res = await toggleLike(userId, workId)
      if (res.liked) {
        this.likes.push({ userId, workId })
      } else {
        this.likes = this.likes.filter(l => !(l.userId === userId && l.workId === workId))
      }
      return res
    },

    async checkLiked(userId, workId) {
      return await checkLiked(userId, workId)
    },

    // ---- 收藏 ----
    async collectWork(userId, workId) {
      const res = await toggleCollect(userId, workId)
      if (res.collected) {
        this.collects.push({ userId, workId })
      } else {
        this.collects = this.collects.filter(c => !(c.userId === userId && c.workId === workId))
      }
      return res
    },

    async fetchCollects(userId) {
      this.collects = await getCollects(userId)
      return this.collects
    },

    // ---- 评论 ----
    async fetchComments(workId, page = 1) {
      const res = await getComments(workId, page)
      if (page === 1) {
        this.currentComments = res.items
      } else {
        this.currentComments.push(...res.items)
      }
      return res
    },

    async addComment(userId, workId, content) {
      const comment = await addComment(userId, workId, content)
      this.currentComments.unshift(comment)
      return comment
    },

    // ---- 关注 ----
    async followUser(followerId, followingId) {
      const res = await toggleFollow(followerId, followingId)
      if (res.followed) {
        this.follows.push({ followerId, followingId })
      } else {
        this.follows = this.follows.filter(f => !(f.followerId === followerId && f.followingId === followingId))
      }
      return res
    },

    async checkFollowed(followerId, followingId) {
      return await checkFollowed(followerId, followingId)
    },

    async fetchFollowList(userId, type) {
      return await getFollowList(userId, type)
    }
  },

  persist: {
    key: 'ch-interaction-store',
    pick: ['likes', 'collects', 'follows']
  }
})
