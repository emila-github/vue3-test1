<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

// 返回顶部
const showBackTop = ref(false)

function handleScroll() {
  showBackTop.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
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
          <RouterLink to="/antd">Antd</RouterLink>
        </nav>
      </div>
    </header>
    <main class="app-main">
      <RouterView />
    </main>

    <!-- 返回顶部 -->
    <Transition name="back-top-fade">
      <button v-if="showBackTop" class="back-top-btn" title="返回顶部" @click="scrollToTop">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M10 18a.75.75 0 0 1-.75-.75V5.612L5.78 9.08a.75.75 0 0 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.47-3.47v11.64A.75.75 0 0 1 10 18Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </Transition>
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

/* ===== 返回顶部按钮 ===== */
.back-top-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 200;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  background: #fff;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.25s;
}

.back-top-btn:hover {
  color: #3178c6;
  border-color: #3178c6;
  box-shadow: 0 4px 16px rgba(49, 120, 198, 0.2);
  transform: translateY(-2px);
}

.back-top-btn:active {
  transform: translateY(0);
}

/* 过渡动画 */
.back-top-fade-enter-active {
  transition: all 0.3s ease-out;
}
.back-top-fade-leave-active {
  transition: all 0.2s ease-in;
}
.back-top-fade-enter-from,
.back-top-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (max-width: 640px) {
  .back-top-btn {
    bottom: 24px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
}
</style>
