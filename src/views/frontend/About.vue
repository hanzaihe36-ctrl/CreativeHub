<template>
  <div class="page-wrapper">
    <Header />
    <main class="main-content container">
      <section class="about-hero">
        <h1>关于 CreativeHub</h1>
        <p>一个专为创意工作者打造的展示与交流平台</p>
      </section>

      <section class="about-section">
        <h2>我们的愿景</h2>
        <p>CreativeHub 旨在为数字媒体、视觉设计等相关专业的学生提供一个集中展示个人作品、相互学习交流的平台。我们相信每一个创意都值得被看见，每一位创作者都应该拥有自己的作品集。</p>
      </section>

      <section class="about-section">
        <h2>平台功能</h2>
        <div class="feature-grid">
          <div class="feature-item">
            <div class="feature-icon"><el-icon :size="28"><Picture /></el-icon></div>
            <h3>精美展示</h3>
            <p>瀑布流布局、多图轮播，让你的作品以最佳方式呈现</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon"><el-icon :size="28"><Upload /></el-icon></div>
            <h3>便捷管理</h3>
            <p>分类标签、草稿箱、数据统计，轻松管理你的创作</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon"><el-icon :size="28"><ChatDotRound /></el-icon></div>
            <h3>社区互动</h3>
            <p>点赞、评论、收藏、关注，与同行互动获取反馈</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon"><el-icon :size="28"><Search /></el-icon></div>
            <h3>灵感发现</h3>
            <p>按分类、标签、关键词搜索，浏览优秀作品获取灵感</p>
          </div>
        </div>
      </section>

      <section class="about-section">
        <h2>技术栈</h2>
        <div class="tech-list">
          <span class="tech-tag">Vue 3.4</span>
          <span class="tech-tag">Vite 5</span>
          <span class="tech-tag">Vue Router 4</span>
          <span class="tech-tag">Pinia 2</span>
          <span class="tech-tag">Element Plus</span>
          <span class="tech-tag">axios</span>
          <span class="tech-tag">Mock.js</span>
        </div>
      </section>

      <section class="about-section">
        <h2>项目信息</h2>
        <p>本项目为华中师范大学《Web 程序设计》课程设计作业。</p>
        <div class="project-links">
          <a :href="repoUrl" target="_blank" class="project-link">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub 仓库
          </a>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const repoUrl = 'https://github.com/hanzaihe36-ctrl/CreativeHub'
</script>

<style scoped>
.page-wrapper { min-height: 100vh; display: flex; flex-direction: column; }
.main-content { flex: 1; padding-top: calc(var(--header-height) + var(--spacing-xl)); padding-bottom: var(--spacing-xl); }

.about-hero { text-align: center; padding: var(--spacing-xl) 0; }
.about-hero h1 { font-size: 32px; font-weight: 700; color: var(--color-primary); }
.about-hero p { font-size: var(--font-size-md); color: var(--color-text-light); margin-top: 8px; }

.about-section { margin-top: var(--spacing-xl); }
.about-section h2 { font-size: var(--font-size-lg); font-weight: 700; margin-bottom: var(--spacing-md); padding-bottom: var(--spacing-sm); border-bottom: 2px solid var(--color-primary); }
.about-section > p { font-size: var(--font-size-base); line-height: 1.8; color: var(--color-text); }

.feature-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-md); }
.feature-item { text-align: center; padding: var(--spacing-lg); background: #fff; border-radius: var(--border-radius); box-shadow: var(--shadow-sm); }
.feature-icon { width: 56px; height: 56px; margin: 0 auto var(--spacing-sm); display: flex; align-items: center; justify-content: center; border-radius: 14px; background: var(--color-bg); color: var(--color-secondary); }
.feature-item h3 { font-size: var(--font-size-md); font-weight: 600; margin-bottom: 4px; }
.feature-item p { font-size: var(--font-size-sm); color: var(--color-text-light); }

.tech-list { display: flex; flex-wrap: wrap; gap: 10px; }
.tech-tag { padding: 6px 16px; background: var(--color-primary); color: #fff; border-radius: 20px; font-size: var(--font-size-sm); }

.project-links { margin-top: 12px; }
.project-link {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 24px;
  background: #24292e; color: #fff;
  border-radius: 8px; font-size: var(--font-size-base); font-weight: 500;
  transition: opacity var(--transition-fast);
}
.project-link:hover { opacity: 0.85; color: #fff; }

@media (max-width: 768px) {
  .feature-grid { grid-template-columns: repeat(2, 1fr); }
  .about-hero h1 { font-size: 24px; }
}
</style>
