<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="header-inner">
        <RouterLink to="/" class="header-logo">
          <span class="logo-icon">⚡</span>
          <span class="logo-text">Vue3 Demo</span>
        </RouterLink>
        <nav class="header-nav">
          <RouterLink to="/">首页</RouterLink>
          <RouterLink to="/about">关于</RouterLink>
        </nav>
      </div>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ===== 顶栏 ===== */
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid #f0f0f0;
}

.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  text-decoration: none;
}

.header-logo:hover {
  color: #1a1a1a;
}

.logo-icon {
  font-size: 22px;
}

.logo-text {
  background: linear-gradient(135deg, #3178c6, #52c41a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-nav {
  display: flex;
  gap: 4px;
}

.header-nav a {
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
}

.header-nav a:hover {
  color: #3178c6;
  background: #e8f0fe;
}

.header-nav a.router-link-exact-active {
  color: #3178c6;
  background: #e8f0fe;
}

/* ===== 主内容区 ===== */
.app-main {
  flex: 1;
}

@media (max-width: 640px) {
  .header-inner {
    padding: 0 16px;
  }
}
</style>
