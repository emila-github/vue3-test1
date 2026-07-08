<script setup lang="ts">
import { ref, computed } from 'vue'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// 模拟大数据量列表
const allItems = ref(Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? '管理员' : i % 3 === 1 ? '编辑' : '访客',
})))

// 当前可视窗口（模拟虚拟滚动，只显示其中一段）
const pageSize = ref(50)
const currentPage = ref(1)
const totalItems = computed(() => allItems.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

const visibleItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return allItems.value.slice(start, start + pageSize.value)
})

const hasPrev = computed(() => currentPage.value > 1)
const hasNext = computed(() => currentPage.value < totalPages.value)

function prevPage() {
  if (hasPrev.value) {
    currentPage.value--
    addLog(`切换到第 ${currentPage.value} 页（共 ${totalPages.value} 页）`)
  }
}

function nextPage() {
  if (hasNext.value) {
    currentPage.value++
    addLog(`切换到第 ${currentPage.value} 页（共 ${totalPages.value} 页）`)
  }
}

// 性能演示
function loadAll() {
  pageSize.value = allItems.value.length
  currentPage.value = 1
  addLog(`⚠️ 加载全部 ${allItems.value.length} 条数据（可能卡顿）`)
}

function resetPage() {
  pageSize.value = 50
  currentPage.value = 1
  addLog('恢复分页模式（每页 50 条）')
}

const virtualScrollCode = `// 虚拟滚动原理
// 只渲染可视区域内的 DOM 节点，而非全量渲染
// 10,000 条数据 → 只渲染 ~50 个 DOM 节点

// 推荐库：
// vue-virtual-scroller — Vue 官方推荐
// vxe-table — 高性能表格
// vueuc/VirtualList — 轻量虚拟列表`

const bundleOptCode = `// vite.config.ts — 代码分割与打包优化
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // 手动分包策略
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-ui': ['ant-design-vue', '@ant-design/icons-vue'],
          'vendor-chart': ['echarts', 'vue-echarts'],
        },
      },
    },
    // 提高警告阈值
    chunkSizeWarningLimit: 500,
  },
})`

const lazyRouteCode = `// 路由懒加载（每个页面独立 chunk）
const routes = [
  {
    path: '/dashboard',
    component: () => import('./views/Dashboard.vue'),  // 按需加载
  },
  {
    path: '/settings',
    component: () => import('./views/Settings.vue'),
  },
]

// 结合 Suspense 做加载态
<template>
  <Suspense>
    <router-view />
    <template #fallback>
      <div class="loading">加载中...</div>
    </template>
  </Suspense>
</template>`
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 5：虚拟滚动与 Bundle 优化</h1>
      <p>大列表渲染性能方案、虚拟滚动原理、代码分割与 Tree Shaking、打包构建优化策略。</p>
    </header>

    <!-- 大列表问题 -->
    <section class="card">
      <h2>大列表的性能问题</h2>
      <p class="intro">
        渲染 10,000 个 DOM 节点会导致页面卡顿。<strong>虚拟滚动</strong>只渲染可视区域内的节点，大幅提升性能。
      </p>
      <pre class="code-block"><code>{{ virtualScrollCode }}</code></pre>
    </section>

    <!-- 交互演示 -->
    <section class="card">
      <h2>交互演示：大列表分页 vs 全量渲染</h2>
      <p class="intro">共 {{ totalItems }} 条数据，当前渲染 {{ visibleItems.length }} 条。</p>
      <div class="demo-area">
        <div class="pagination-controls">
          <button class="btn" :disabled="!hasPrev" @click="prevPage">上一页</button>
          <span class="page-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
          <button class="btn" :disabled="!hasNext" @click="nextPage">下一页</button>
          <button class="btn warn" @click="loadAll">⚠️ 加载全部（{{ allItems.length }} 条）</button>
          <button class="btn reset" @click="resetPage">重置</button>
        </div>

        <div class="bench-display">
          <div class="bench-item">
            <span class="bench-num">{{ visibleItems.length }}</span>
            <span class="bench-label">当前渲染 DOM 节点</span>
          </div>
          <div class="bench-item">
            <span class="bench-num">{{ totalItems }}</span>
            <span class="bench-label">数据总量</span>
          </div>
          <div class="bench-item">
            <span class="bench-num">{{ ((visibleItems.length / totalItems) * 100).toFixed(1) }}%</span>
            <span class="bench-label">渲染比例</span>
          </div>
        </div>

        <div class="data-list">
          <div v-for="item in visibleItems" :key="item.id" class="data-row">
            <span class="data-id">#{{ item.id }}</span>
            <span class="data-name">{{ item.name }}</span>
            <span class="data-email">{{ item.email }}</span>
            <span class="data-role">{{ item.role }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Bundle 优化 -->
    <section class="card">
      <h2>Bundle 优化策略</h2>
      <h3>1. 代码分割（Code Splitting）</h3>
      <pre class="code-block"><code>{{ bundleOptCode }}</code></pre>

      <h3>2. 路由懒加载</h3>
      <p class="intro">
        使用 <code>() =&gt; import(...)</code> 动态导入，Vite 自动按路由拆分 chunk。
      </p>
      <pre class="code-block"><code>{{ lazyRouteCode }}</code></pre>
    </section>

    <!-- 优化清单 -->
    <section class="card">
      <h2>性能优化清单</h2>
      <div class="info-grid">
        <div class="info-item">
          <strong>🖥️ 渲染优化</strong>
          <span>虚拟滚动、v-memo、v-once、合理拆分组件大小</span>
        </div>
        <div class="info-item">
          <strong>📦 Bundle 优化</strong>
          <span>代码分割、路由懒加载、Tree Shaking、manualChunks</span>
        </div>
        <div class="info-item">
          <strong>⚡ 响应式优化</strong>
          <span>shallowRef、computed 缓存、避免深层嵌套 reactive</span>
        </div>
        <div class="info-item">
          <strong>🖼️ 资源优化</strong>
          <span>图片懒加载、WebP 格式、CDN 加速、Gzip 压缩</span>
        </div>
        <div class="info-item">
          <strong>🔍 分析工具</strong>
          <span>rollup-plugin-visualizer、Vue DevTools Performance Tab</span>
        </div>
        <div class="info-item">
          <strong>📊 监控指标</strong>
          <span>FCP、LCP、TTI、CLS — Chrome Lighthouse 审计</span>
        </div>
      </div>
    </section>

    <!-- 日志 -->
    <section class="card" v-if="log.length">
      <h2>操作日志</h2>
      <div class="log-panel">
        <div v-for="(l, i) in log" :key="i">{{ l }}</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page { max-width: 960px; margin: 0 auto; padding: 24px; }
.page-header { text-align: center; margin-bottom: 32px; }
.page-header h1 { font-size: 28px; color: #1a1a1a; margin: 0 0 8px; }
.page-header p { color: #666; font-size: 14px; line-height: 1.6; }
.card { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.card h2 { margin: 0 0 16px; font-size: 18px; color: #333; }
.card h3 { margin: 20px 0 10px; font-size: 15px; color: #555; }
.intro { color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 12px; }
.intro code { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; font-size: 13px; }
.code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.6; margin: 12px 0; }

.demo-area { padding: 16px; background: #fafafa; border-radius: 8px; }
.pagination-controls { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.page-info { font-size: 14px; color: #666; font-weight: 500; min-width: 120px; text-align: center; }
.btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; background: #52c41a; color: #fff; }
.btn:hover { background: #45a418; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn.warn { background: #fa8c16; }
.btn.warn:hover { background: #d97a0f; }
.btn.reset { background: #ff4d4f; }
.btn.reset:hover { background: #d9363e; }

.bench-display { display: flex; gap: 24px; margin-bottom: 16px; padding: 12px; background: #fff; border-radius: 8px; border: 1px solid #f0f0f0; }
.bench-item { text-align: center; flex: 1; }
.bench-num { display: block; font-size: 24px; font-weight: 700; color: #52c41a; }
.bench-label { font-size: 12px; color: #999; }

.data-list { max-height: 300px; overflow-y: auto; background: #fff; border-radius: 6px; border: 1px solid #f0f0f0; }
.data-row { display: flex; gap: 12px; padding: 8px 12px; border-bottom: 1px solid #f5f5f5; font-size: 13px; align-items: center; }
.data-row:hover { background: #fafafa; }
.data-id { color: #999; min-width: 50px; }
.data-name { min-width: 100px; color: #333; font-weight: 500; }
.data-email { color: #666; flex: 1; }
.data-role { color: #1890ff; font-size: 12px; }

.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.info-item { padding: 14px; background: #fafafa; border-radius: 8px; border: 1px solid #f0f0f0; }
.info-item strong { display: block; margin-bottom: 6px; font-size: 14px; color: #333; }
.info-item span { font-size: 12px; color: #999; line-height: 1.5; }

.log-panel { background: #fafafa; border: 1px solid #f0f0f0; border-radius: 8px; padding: 12px; max-height: 200px; overflow-y: auto; font-family: monospace; font-size: 12px; color: #666; }

@media (max-width: 768px) {
  .pagination-controls { flex-direction: column; }
  .bench-display { flex-direction: column; gap: 8px; }
  .data-row { flex-wrap: wrap; }
}
</style>
