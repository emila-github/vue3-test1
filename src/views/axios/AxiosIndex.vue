<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: '快速上手',
    desc: '安装 axios、基础 GET/POST/PUT/DELETE、TypeScript 泛型、错误处理',
    path: '/axios/stage1',
    icon: '🚀',
    color: '#5a67d8',
  },
  {
    id: 2,
    title: '拦截器与封装',
    desc: '请求/响应拦截器、Token 自动注入、Loading 管理、统一错误处理',
    path: '/axios/stage2',
    icon: '🔧',
    color: '#38b2ac',
  },
  {
    id: 3,
    title: '取消请求与上传下载',
    desc: 'AbortController 取消请求、FormData 文件上传、Blob 流式下载与进度监控',
    path: '/axios/stage3',
    icon: '📤',
    color: '#ed8936',
  },
  {
    id: 4,
    title: '高级特性',
    desc: '请求重试（指数退避）、请求去重、请求缓存、超时与并发控制',
    path: '/axios/stage4',
    icon: '🌟',
    color: '#e53e3e',
  },
  {
    id: 5,
    title: '实战：生产级封装',
    desc: '从零封装 request.ts、参照项目现有架构、最佳实践与工程化思维',
    path: '/axios/stage5',
    icon: '🏭',
    color: '#805ad5',
  },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="axios-index">
    <header class="page-header">
      <h1>📡 Axios 学习教程</h1>
      <p class="subtitle">
        基于 <code>axios@^1.7</code>，从基础请求到生产级封装，5 阶段系统学习 Axios 在 Vue 3 + TypeScript
        项目中的最佳实践。
      </p>
    </header>

    <!-- 核心概念速览 -->
    <section class="card quick-ref">
      <h2>Axios 核心概念</h2>
      <div class="concept-grid">
        <div class="concept-item">
          <strong>Promise API</strong>
          <span>基于 Promise，支持 async/await，告别回调地狱</span>
        </div>
        <div class="concept-item">
          <strong>拦截器</strong>
          <span>请求/响应拦截，统一处理 Token、错误、Loading</span>
        </div>
        <div class="concept-item">
          <strong>请求取消</strong>
          <span>AbortController 原生支持，避免重复请求与内存泄漏</span>
        </div>
        <div class="concept-item">
          <strong>TypeScript</strong>
          <span>完善的类型定义，泛型约束请求与响应数据</span>
        </div>
        <div class="concept-item">
          <strong>实例化</strong>
          <span>create() 创建独立实例，多后端地址轻松管理</span>
        </div>
        <div class="concept-item">
          <strong>拦截器链</strong>
          <span>请求拦截(前) → 请求拦截(后) → 响应拦截(前) → 响应拦截(后)</span>
        </div>
      </div>
    </section>

    <!-- 学习阶段 -->
    <section class="stages">
      <h2>学习阶段（共 5 个）</h2>
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
          <div class="stage-badge" :style="{ background: s.color, color: '#fff' }">Stage {{ s.id }}</div>
        </div>
      </div>
    </section>

    <!-- 架构概览 -->
    <section class="card">
      <h2>项目中的 Axios 架构</h2>
      <div class="arch-flow">
        <div class="arch-step">
          <div class="arch-box" style="border-color: #5a67d8; background: #f0f0ff">
            <strong>.vue 组件</strong>
            <span>调用 API 函数</span>
          </div>
        </div>
        <span class="arch-arrow">→</span>
        <div class="arch-step">
          <div class="arch-box" style="border-color: #38b2ac; background: #e6fffa">
            <strong>api/modules/</strong>
            <span>业务 API 封装</span>
          </div>
        </div>
        <span class="arch-arrow">→</span>
        <div class="arch-step">
          <div class="arch-box" style="border-color: #ed8936; background: #fffaf0">
            <strong>request.ts</strong>
            <span>axios 实例 + 拦截器</span>
          </div>
        </div>
        <span class="arch-arrow">→</span>
        <div class="arch-step">
          <div class="arch-box" style="border-color: #e53e3e; background: #fff5f5">
            <strong>Mock / Server</strong>
            <span>数据层</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Axios vs Fetch vs VueRequest -->
    <section class="card">
      <h2>Axios vs Fetch vs VueRequest</h2>
      <a-table
        :columns="[
          { title: '对比维度', dataIndex: 'dim', key: 'dim' },
          { title: 'Axios', dataIndex: 'axios', key: 'axios' },
          { title: 'Fetch', dataIndex: 'fetch', key: 'fetch' },
          { title: 'VueRequest', dataIndex: 'vr', key: 'vr' },
        ]"
        :data-source="[
          { dim: '拦截器', axios: '✅ 内置', fetch: '❌ 无', vr: '✅ 基于 Axios' },
          { dim: '取消请求', axios: '✅ AbortController', fetch: '✅ AbortController', vr: '✅ 自动管理' },
          { dim: '超时设置', axios: '✅ timeout 配置', fetch: '❌ 需手动实现', vr: '✅ 内置' },
          { dim: '请求进度', axios: '✅ onUploadProgress', fetch: '⚠️ 有限支持', vr: '⚠️ 有限支持' },
          { dim: '自动 JSON 解析', axios: '✅ 自动', fetch: '❌ 需 response.json()', vr: '✅ 自动' },
          { dim: 'TypeScript', axios: '✅ 完善', fetch: '✅ 内建类型', vr: '✅ 完善泛型' },
          { dim: '错误处理', axios: '✅ 状态码自动 reject', fetch: '⚠️ 不 reject 4xx/5xx', vr: '✅ 内置错误处理' },
          { dim: '请求去重/缓存', axios: '❌ 需手动实现', fetch: '❌ 需手动实现', vr: '✅ 内置' },
        ]"
        :pagination="false"
        size="small"
      />
    </section>
  </div>
</template>

<style scoped>
.axios-index {
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
}

.subtitle code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
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

/* 核心概念 */
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

/* 阶段卡片 */
.stages h2 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #333;
}

.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
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

/* 架构流 */
.arch-flow {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.arch-step {
  flex-shrink: 0;
}

.arch-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 20px;
  border: 2px solid;
  border-radius: 10px;
  min-width: 130px;
  text-align: center;
}

.arch-box strong {
  font-size: 14px;
  color: #333;
}

.arch-box span {
  font-size: 12px;
  color: #999;
}

.arch-arrow {
  font-size: 24px;
  color: #ccc;
  font-weight: 700;
}

/* 响应式 */
@media (max-width: 768px) {
  .concept-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .stage-grid {
    grid-template-columns: 1fr;
  }
  .arch-flow {
    flex-direction: column;
  }
  .arch-arrow {
    transform: rotate(90deg);
  }
}
</style>
