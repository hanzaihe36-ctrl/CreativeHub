/**
 * 互动相关 API（点赞、收藏、评论、关注）
 */

import request from './request'

// ---- 点赞 ----
export function toggleLike(userId, workId) {
  return request.post('/likes', { userId, workId })
}

export function checkLiked(userId, workId) {
  return request.get('/likes/check', { params: { userId, workId } })
}

// ---- 收藏 ----
export function toggleCollect(userId, workId) {
  return request.post('/collects', { userId, workId })
}

export function getCollects(userId) {
  return request.get('/collects', { params: { userId } })
}

// ---- 评论 ----
export function getComments(workId, page = 1, pageSize = 10) {
  return request.get('/comments', { params: { workId, page, pageSize } })
}

export function addComment(userId, workId, content) {
  return request.post('/comments', { userId, workId, content })
}

// ---- 关注 ----
export function toggleFollow(followerId, followingId) {
  return request.post('/follows', { followerId, followingId })
}

export function checkFollowed(followerId, followingId) {
  return request.get('/follows/check', { params: { followerId, followingId } })
}

export function getFollowList(userId, type) {
  return request.get('/follows', { params: { userId, type } })
}

// ---- 分类/标签 ----
export function getCategories() {
  return request.get('/categories')
}

export function getTags() {
  return request.get('/tags')
}
