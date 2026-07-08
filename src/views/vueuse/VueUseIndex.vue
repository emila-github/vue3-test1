<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: '状态管理工具',
    desc: 'useStorage、useLocalStorage、useSessionStorage、useToggle、useRefHistory',
    path: '/vueuse/stage1',
    icon: '📦',
    color: '#10b981',
  },
  {
    id: 2,
    title: '浏览器 API 工具',
    desc: 'useDark、useEventListener、useMediaQuery、useTitle、useClipboard、useFullscreen',
    path: '/vueuse/stage2',
    icon: '🌐',
    color: '#3b82f6',
  },
  {
    id: 3,
    title: '时序与防抖工具',
    desc: 'useDebounceFn、useThrottleFn、useIntervalFn、useTimeoutFn、useNow',
    path: '/vueuse/stage3',
    icon: '⏱',
    color: '#f59e0b',
  },
  {
    id: 4,
    title: '实战综合示例',
    desc: 'useInfiniteScroll、useNetwork、useOnline、useIdle 等组合实战',
    path: '/vueuse/stage4',
    icon: '🔧',
    color: '#ef4444',
  },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="vueuse-index">
    <header class="page-header">
      <h1>VueUse 工具库学习</h1>
      <p class="subtitle">
        基于 <code>@vueuse/core@^14</code>，覆盖状态管理、浏览器 API、时序控制等 200+ 组合式工具函数。
      </p>
    </header>

    <!-- 核心 API 速览 -->
    <section class="card quick-ref">
      <h2>核心工具分类</h2>
      <div class="api-grid">
        <div class="api-item"><code>State</code><span>响应式状态管理</span></div>
        <div class="api-item"><code>Browser</code><span>浏览器 API 封装</span></div>
        <div class="api-item"><code>Sensors</code><span>DOM 事件监听</span></div>
        <div class="api-item"><code>Network</code><span>网络状态</span></div>
        <div class="api-item"><code>Animation</code><span>动画相关</span></div>
        <div class="api-item"><code>Component</code><span>组件工具</span></div>
        <div class="api-item"><code>Watch</code><span>侦听器增强</span></div>
        <div class="api-item"><code>Time</code><span>时间日期</span></div>
        <div class="api-item"><code>Utilities</code><span>通用工具</span></div>
        <div class="api-item"><code>Math</code><span>数学计算</span></div>
      </div>
    </section>

    <!-- 学习阶段 -->
    <section class="stages">
      <h2>学习阶段（共 4 个）</h2>
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
          <div class="stage-badge" :style="{ background: s.color, color: '#fff' }">
            Stage {{ s.id }}
          </div>
        </div>
      </div>
    </section>

    <!-- 关键特性 -->
    <section class="card">
      <h2>VueUse 核心特性</h2>
      <a-table
        :columns="[
          { title: '特性', dataIndex: 'feature', key: 'feature' },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="[
          { feature: 'Tree Shakable', desc: '按需导入，打包体积最优，未使用的函数不会打包' },
          { feature: 'TypeScript 原生支持', desc: '完整的类型定义和泛型约束，智能提示完美' },
          { feature: 'SSR 友好', desc: '大部分函数兼容服务端渲染环境' },
          { feature: '可选插件', desc: 'VueUse 核心是 @vueuse/core，还有 router、motion、integrations 等按需安装' },
          { feature: 'CDN 可用', desc: '可通过 CDN 直接在浏览器中使用（带 @vueuse/shared）' },
          { feature: '交互式文档', desc: '每个函数都有在线可交互 Demo，官网可直接运行体验' },
        ]"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- 为什么选 VueUse -->
    <section class="card">
      <h2>为什么选择 VueUse？</h2>
      <ul class="why-list">
        <li><strong>官方推荐</strong>：Vue 核心团队成员 Anthony Fu 创建并维护</li>
        <li><strong>开箱即用</strong>：每个函数都是独立的 composable，无额外依赖</li>
        <li><strong>统一 SPI</strong>：所有 API 风格一致，ref / getter / event 参数使用 <code>MaybeRef</code> 模式</li>
        <li><strong>社区活跃</strong>：GitHub 19k+ Stars，NPM 周下载量百万级别</li>
        <li><strong>减少样板代码</strong>：localStorage、防抖、事件监听等不再需要手写</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.vueuse-index {
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

.api-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.api-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.api-item code {
  font-size: 13px;
  color: #10b981;
  font-weight: 500;
}

.api-item span {
  font-size: 12px;
  color: #999;
}

.stages h2 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #333;
}

.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
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
  transition: box-shadow 0.2s, transform 0.2s;
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

.why-list {
  list-style: none;
  padding: 0;
}

.why-list li {
  padding: 6px 0;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}

.why-list code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
}

@media (max-width: 768px) {
  .api-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .stage-grid {
    grid-template-columns: 1fr;
  }
}
</style>
