<template>
  <footer class="app-footer">
    <div class="footer-inner container">
      <div class="footer-brand">
        <span class="footer-logo">CreativeHub</span>
        <p>创意作品展示与社区交流平台</p>
      </div>
      <div class="footer-links">
        <router-link to="/about">关于我们</router-link>
        <router-link to="/ranking">排行榜</router-link>
        <a href="https://github.com" target="_blank">GitHub</a>
      </div>
      <div class="footer-copy">
        &copy; {{ year }} CreativeHub. 华中师范大学 人工智能教育学部
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.app-footer {
  background: var(--color-primary);
  color: #fff;
  padding: var(--spacing-xl) 0 var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.footer-brand {
  text-align: center;
}
.footer-logo {
  font-size: var(--font-size-lg);
  font-weight: 700;
}
.footer-brand p {
  font-size: var(--font-size-sm);
  opacity: 0.7;
  margin-top: 4px;
}

.footer-links {
  display: flex;
  gap: var(--spacing-lg);
}
.footer-links a {
  color: rgba(255,255,255,0.7);
  font-size: var(--font-size-base);
  transition: color var(--transition-fast);
}
.footer-links a:hover {
  color: #fff;
}

.footer-copy {
  font-size: var(--font-size-sm);
  opacity: 0.5;
}
</style>
