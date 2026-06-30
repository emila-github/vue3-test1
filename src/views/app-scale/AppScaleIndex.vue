<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: '单文件组件 (SFC)',
    desc: '.vue 文件结构、script setup、scoped CSS、CSS Modules、v-bind in CSS',
    path: '/app-scale/sfc',
    icon: '📄',
    color: '#42b883',
  },
  {
    id: 2,
    title: '工具链',
    desc: 'Vite 构建、TypeScript、vue-tsc、ESLint、Prettier、开发工作流',
    path: '/app-scale/toolchain',
    icon: '⚙',
    color: '#646cff',
  },
  {
    id: 3,
    title: '路由',
    desc: 'SPA 路由原理、Vue Router 5.x 概览 → 链接到 5 阶段完整教程',
    path: '/app-scale/routing',
    icon: '🔀',
    color: '#e74c3c',
  },
  {
    id: 4,
    title: '状态管理',
    desc: '状态管理方案对比、Pinia 3.x 概览 → 链接到 5 阶段完整教程',
    path: '/app-scale/state',
    icon: '📦',
    color: '#ffd700',
  },
  {
    id: 5,
    title: '测试',
    desc: 'Vitest 单元测试、Vue Test Utils 组件测试、Playwright E2E 测试',
    path: '/app-scale/testing',
    icon: '🧪',
    color: '#fa541c',
  },
  {
    id: 6,
    title: '服务端渲染 (SSR)',
    desc: 'SSR 原理、renderToString、Hydration 水合、Nuxt 框架、SSG',
    path: '/app-scale/ssr',
    icon: '🌐',
    color: '#00a854',
  },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="app-scale-index">
    <header class="page-header">
      <h1>📐 应用规模化</h1>
      <p class="subtitle">
        Vue 3 项目从开发到部署的全链路体系：SFC 编写、工程化工具链、路由与状态管理、自动化测试、服务端渲染。
      </p>
    </header>

    <!-- 核心概念概览 -->
    <section class="card quick-ref">
      <h2>核心概念概览</h2>
      <div class="concept-grid">
        <div class="concept-item">
          <strong>SFC</strong>
          <span>组件即文件，模板/逻辑/样式一体</span>
        </div>
        <div class="concept-item">
          <strong>Vite</strong>
          <span>下一代前端构建工具，极速 HMR</span>
        </div>
        <div class="concept-item">
          <strong>Router</strong>
          <span>SPA 页面导航，路由守卫控制</span>
        </div>
        <div class="concept-item">
          <strong>Pinia</strong>
          <span>轻量级状态管理，TypeScript 原生</span>
        </div>
        <div class="concept-item">
          <strong>Vitest</strong>
          <span>基于 Vite 的极速单元测试框架</span>
        </div>
        <div class="concept-item">
          <strong>SSR</strong>
          <span>服务端渲染，SEO 友好，首屏加速</span>
        </div>
      </div>
    </section>

    <!-- 主题卡片 -->
    <section class="stages">
      <h2>六大主题</h2>
      <div class="stage-grid">
        <div
          v-for="s in stages"
          :key="s.id"
          class="stage-card"
          :style="{ borderTopColor: s.color }"
          @click="navigateTo(s.path)"
        >
          <span class="stage-icon">{{ s.icon }}</span>
          <h3>{{ s.title }}</h3>
          <p class="stage-desc">{{ s.desc }}</p>
          <div class="stage-badge" :style="{ background: s.color, color: s.color === '#ffd700' ? '#333' : '#fff' }">
            主题 {{ s.id }}
          </div>
        </div>
      </div>
    </section>

    <!-- 相关教程链接 -->
    <section class="card">
      <h2>深入教程</h2>
      <div class="link-grid">
        <a href="/vue-router" class="link-card">
          <span class="link-icon">🗺</span>
          <div>
            <strong>Vue Router 5.x 完整教程</strong>
            <p>快速上手、动态路由、嵌套路由、导航守卫、进阶特性 — 5 阶段学习</p>
          </div>
          <span class="link-arrow">→</span>
        </a>
        <a href="/pinia" class="link-card">
          <span class="link-icon">🍍</span>
          <div>
            <strong>Pinia 状态管理 v3 完整教程</strong>
            <p>Setup Store、State/Getter/Action、多 Store 协作、持久化 — 5 阶段学习</p>
          </div>
          <span class="link-arrow">→</span>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.app-scale-index {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.subtitle {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card h2 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #333;
}

/* 核心概念概览 */
.concept-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.concept-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.concept-item strong {
  font-size: 14px;
  color: #333;
}

.concept-item span {
  font-size: 12px;
  color: #999;
}

/* 主题卡片 */
.stages h2 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #333;
}

.stage-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stage-card {
  position: relative;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-top: 3px solid;
  border-radius: 10px;
  padding: 20px 16px;
  cursor: pointer;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}

.stage-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.stage-icon {
  font-size: 28px;
}

.stage-card h3 {
  margin: 10px 0 6px;
  font-size: 15px;
  color: #333;
}

.stage-desc {
  font-size: 12px;
  color: #999;
  line-height: 1.5;
  margin: 0;
}

.stage-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

/* 深入教程链接 */
.link-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: #fafafa;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
  text-decoration: none;
  color: #333;
  transition: all 0.2s;
}

.link-card:hover {
  border-color: #d9d9d9;
  background: #f5f5f5;
}

.link-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.link-card strong {
  display: block;
  font-size: 14px;
  margin-bottom: 2px;
}

.link-card p {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.link-arrow {
  margin-left: auto;
  font-size: 18px;
  color: #bbb;
  transition:
    transform 0.2s,
    color 0.2s;
}

.link-card:hover .link-arrow {
  transform: translateX(4px);
  color: #666;
}

/* 响应式 */
@media (max-width: 768px) {
  .concept-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stage-grid {
    grid-template-columns: 1fr;
  }
}
</style>
