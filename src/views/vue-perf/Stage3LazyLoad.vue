<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineAsyncComponent, h } from 'vue'

// ===== defineAsyncComponent 演示 =====
const asyncLoadState = ref<'idle' | 'loading' | 'loaded' | 'error'>('idle')
const asyncLoadError = ref('')

const AsyncGreeting = defineAsyncComponent({
  loader: () =>
    new Promise<{ default: ReturnType<typeof import('vue')['defineComponent']> }>((resolve) => {
      setTimeout(() => {
        resolve({
          default: {
            setup() {
              return () => h('div', { style: 'padding: 12px; background: #e6f7ff; border-radius: 8px;' }, [
                h('strong', '异步组件加载成功!'),
                h('p', { style: 'margin: 4px 0; font-size: 13px; color: #666;' }, '这是一个通过 defineAsyncComponent 动态加载的组件。'),
              ])
            },
          },
        })
      }, 1500)
    }),
  loadingComponent: h('div', { class: 'loading-placeholder' }, '加载中...'),
  delay: 200,
  timeout: 5000,
  errorComponent: h('div', { style: 'padding: 12px; background: #fff2f0; border-radius: 8px; color: #ff4d4f;' }, '组件加载失败'),
  onError(error, retry, fail, attempts) {
    asyncLoadError.value = `加载失败（第 ${attempts} 次尝试）`
  },
})

const showAsyncComp = ref(false)
const isLoadingAsync = ref(false)

function loadAsyncComponent() {
  showAsyncComp.value = true
  isLoadingAsync.value = true
  asyncLoadState.value = 'loading'
  setTimeout(() => {
    isLoadingAsync.value = false
    asyncLoadState.value = 'loaded'
  }, 1600)
}

// ===== IntersectionObserver 演示 =====
const observedItems = ref(
  Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `延迟加载区块 #${i + 1}`,
    visible: false,
  })),
)

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = Number((entry.target as HTMLElement).dataset.observeId)
          const item = observedItems.value.find((i) => i.id === id)
          if (item) {
            item.visible = true
            observer?.unobserve(entry.target)
          }
        }
      })
    },
    { rootMargin: '50px', threshold: 0.1 },
  )
})

onUnmounted(() => {
  observer?.disconnect()
})

function observeElement(el: HTMLElement | null, id: number) {
  if (el && observer) {
    el.dataset.observeId = String(id)
    observer.observe(el)
  }
}

const visibleCount = computed(() => observedItems.value.filter((i) => i.visible).length)

// ===== 路由懒加载演示 =====
const routeImportStats = ref({
  totalRoutes: 0,
  lazyRoutes: 0,
})

onMounted(() => {
  // 演示路由懒加载的统计（模拟数据）
  routeImportStats.value = {
    totalRoutes: 25,
    lazyRoutes: 22,
  }
})

// ===== 代码示例 =====
const codeDefineAsync = [
  'import { defineAsyncComponent } from ' + "'vue'",
  '',
  'const AsyncModal = defineAsyncComponent({',
  '  // 加载函数',
  '  loader: () => import(' + "'./HeavyModal.vue'" + ')',
  '',
  '  // 加载中显示的组件',
  '  loadingComponent: LoadingSpinner,',
  '  delay: 200, // 200ms 后才显示 loading（避免闪烁）',
  '',
  '  // 加载失败显示的组件',
  '  errorComponent: ErrorDisplay,',
  '  timeout: 10000, // 10s 超时',
  '',
  '  // 重试逻辑',
  '  onError(error, retry, fail, attempts) {',
  '    if (attempts <= 3) retry()',
  '    else fail()',
  '  },',
  '})',
].join('\n')

const codeRouteLazy = [
  '// router/index.ts — 路由懒加载',
  'const routes = [',
  '  {',
  '    path: ' + "'/dashboard'",
  '    // 静态导入 → 打入主 bundle',
  "    component: () => import" + "('@/views/Dashboard.vue')",
  '  },',
  '  {',
  '    path: ' + "'/settings'",
  '    // 带 webpack 魔法注释',
  "    component: () => import" + "(" + "'/* webpackChunkName: \"settings\" */ '@" + "/views/Settings.vue')",
  '  },',
  ']',
  '',
  '// Vite 自动代码分割，无需额外配置',
].join('\n')

const codeSuspense = [
  '<!-- Suspense 管理异步组件加载状态 -->',
  '<Suspense>',
  '  <!-- 异步依赖加载完成后显示 -->',
  '  <template #default>',
  '    <AsyncDashboard />',
  '  </template>',
  '',
  '  <!-- 加载中显示的占位内容 -->',
  '  <template #fallback>',
  '    <LoadingSkeleton />',
  '  </template>',
  '</Suspense>',
  '',
  '// 支持嵌套 Suspense 和 onErrorCaptured 捕获错误',
].join('\n')

const codeIntersection = [
  '// composables/useIntersectionObserver.ts',
  'import { ref, onMounted, onUnmounted } from ' + "'vue'",
  '',
  'export function useLazyLoad() {',
  '  const isVisible = ref(false)',
  '  const targetRef = ref<HTMLElement | null>(null)',
  '  let observer: IntersectionObserver | null = null',
  '',
  '  onMounted(() => {',
  '    observer = new IntersectionObserver(',
  '      ([entry]) => {',
  '        if (entry.isIntersecting) {',
  '          isVisible.value = true',
  '          observer?.disconnect()',
  '        }',
  '      },',
  '      { rootMargin: ' + "'100px'" + ', threshold: 0 },',
  '    )',
  '    if (targetRef.value) observer.observe(targetRef.value)',
  '  })',
  '',
  '  onUnmounted(() => observer?.disconnect())',
  '  return { isVisible, targetRef }',
  '}',
].join('\n')

</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 3：懒加载与异步组件</h1>
      <p>defineAsyncComponent、路由懒加载、Suspense、IntersectionObserver — 按需加载，减小首屏体积</p>
    </header>

    <!-- 概念对比 -->
    <section class="card">
      <h2>为什么需要懒加载？</h2>
      <div class="compare-grid">
        <div class="compare-col bad">
          <h4>全部同步加载</h4>
          <p>所有组件打包进一个巨大的 bundle，首屏需要下载全部代码。首屏时间长，用户等待久。</p>
        </div>
        <div class="compare-col good">
          <h4>懒加载策略</h4>
          <p>代码按需拆分，首屏只加载核心代码。其余模块在需要时才加载，大幅减少初始 bundle 体积。</p>
        </div>
      </div>
    </section>

    <!-- defineAsyncComponent 演示 -->
    <section class="card">
      <h2>defineAsyncComponent 演示</h2>
      <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
        点击按钮模拟异步加载组件（延迟 1.5s），展示 loading 状态和加载完成状态。
      </p>
      <div class="demo-area">
        <button class="btn" @click="loadAsyncComponent" :disabled="showAsyncComp">
          {{ showAsyncComp ? '已加载' : '加载异步组件' }}
        </button>
        <span v-if="isLoadingAsync" style="margin-left: 12px; color: #fa8c16; font-size: 13px;">⏳ 加载中...</span>
        <div style="margin-top: 12px;">
          <AsyncGreeting v-if="showAsyncComp" />
          <div v-if="asyncLoadError" class="result-box" style="border-color: #ff4d4f; background: #fff2f0;">
            {{ asyncLoadError }}
          </div>
        </div>
      </div>
    </section>

    <!-- 路由懒加载统计 -->
    <section class="card">
      <h2>路由懒加载策略</h2>
      <div class="demo-area">
        <div class="info-grid">
          <div class="info-item">
            <strong>总路由数</strong>
            <span>{{ routeImportStats.totalRoutes }} 条</span>
          </div>
          <div class="info-item">
            <strong>懒加载路由</strong>
            <span>{{ routeImportStats.lazyRoutes }} 条（{{ (routeImportStats.lazyRoutes / Math.max(routeImportStats.totalRoutes, 1) * 100).toFixed(0) }}%）</span>
          </div>
        </div>
        <p style="font-size: 13px; color: #888; margin-top: 12px;">
          使用 <code>component: () =&gt; import(...)</code> 语法的路由会在首次访问时才下载对应 chunk，避免一次性加载所有页面代码。
        </p>
      </div>
    </section>

    <!-- IntersectionObserver 演示 -->
    <section class="card">
      <h2>IntersectionObserver 组件级懒加载</h2>
      <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
        滚动页面观察下方区块。区块进入视口时变为"已加载"状态。已加载：{{ visibleCount }} / {{ observedItems.length }}
      </p>
      <div class="demo-area observe-container">
        <div
          v-for="item in observedItems"
          :key="item.id"
          :ref="(el) => observeElement(el as HTMLElement | null, item.id)"
          class="observe-item"
          :class="{ loaded: item.visible }"
        >
          <strong>{{ item.title }}</strong>
          <span v-if="item.visible" style="color: #52c41a;">已加载</span>
          <span v-else style="color: #bbb;">等待进入视口...</span>
        </div>
      </div>
    </section>

    <!-- 使用场景 -->
    <section class="card">
      <h2>适用场景</h2>
      <div class="info-grid">
        <div class="info-item">
          <strong>大型弹窗/抽屉</strong>
          <span>仅在用户触发时才加载对应组件，避免首屏 bundle 包含不必要的代码</span>
        </div>
        <div class="info-item">
          <strong>图表/编辑器等重型组件</strong>
          <span>ECharts、Monaco Editor 等库体积大，按需加载显著减小首屏</span>
        </div>
        <div class="info-item">
          <strong>长页面中的非首屏模块</strong>
          <span>IntersectionObserver 实现"滚到哪加载到哪"，减少首屏请求数</span>
        </div>
        <div class="info-item">
          <strong>条件渲染的重组件</strong>
          <span>v-if 控制的组件使用 defineAsyncComponent 延迟加载</span>
        </div>
      </div>
    </section>

    <!-- 代码示例 -->
    <section class="card">
      <h2>代码示例</h2>
      <h3>defineAsyncComponent 完整配置</h3>
      <pre class="code-block"><code>{{ codeDefineAsync }}</code></pre>

      <h3>路由懒加载</h3>
      <pre class="code-block"><code>{{ codeRouteLazy }}</code></pre>

      <h3>Suspense + 异步组件</h3>
      <pre class="code-block"><code>{{ codeSuspense }}</code></pre>

      <h3>IntersectionObserver 懒加载 Composable</h3>
      <pre class="code-block"><code>{{ codeIntersection }}</code></pre>
    </section>
  </div>
</template>

<style scoped>
.stage-page { max-width: 960px; margin: 0 auto; padding: 24px; }
.page-header { text-align: center; margin-bottom: 32px; }
.page-header h1 { font-size: 28px; color: #1a1a1a; margin: 0 0 8px; }
.page-header p { color: #666; font-size: 14px; }
.card { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.card h2 { margin: 0 0 16px; font-size: 18px; color: #333; }
.card h3 { margin: 16px 0 8px; font-size: 15px; color: #555; }
.code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.6; margin: 12px 0; }
.code-block code { font-family: 'Fira Code', 'Consolas', monospace; }
.demo-area { padding: 16px; background: #fafafa; border-radius: 8px; margin: 12px 0; }
.btn { padding: 8px 16px; background: #52c41a; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; margin-right: 8px; }
.btn:hover { background: #45a418; }
.btn:disabled { background: #bbb; cursor: not-allowed; }
.result-box { padding: 12px; background: #f5f5f5; border-left: 3px solid #52c41a; border-radius: 4px; margin-top: 12px; font-family: monospace; font-size: 13px; white-space: pre-wrap; }
.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.info-item { padding: 12px; background: #fafafa; border-radius: 6px; border: 1px solid #f0f0f0; }
.info-item strong { display: block; margin-bottom: 4px; color: #333; font-size: 14px; }
.info-item span { font-size: 12px; color: #999; }
.info-item code { background: #e8e8e8; padding: 2px 6px; border-radius: 3px; font-size: 13px; }
.compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.compare-col { padding: 16px; border-radius: 8px; }
.compare-col.bad { background: #fff2f0; border: 1px solid #ffccc7; }
.compare-col.good { background: #f6ffed; border: 1px solid #b7eb8f; }
.compare-col h4 { margin: 0 0 8px; font-size: 14px; }
.compare-col p { font-size: 13px; color: #666; line-height: 1.6; }
.loading-placeholder { padding: 12px; background: #fffbe6; border-radius: 8px; color: #fa8c16; font-size: 13px; }
.observe-container { max-height: 400px; overflow-y: auto; }
.observe-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: #fff; border: 1px solid #f0f0f0; border-radius: 8px; margin-bottom: 8px; transition: all 0.3s; }
.observe-item.loaded { background: #f6ffed; border-color: #b7eb8f; }
.observe-item strong { font-size: 14px; }
.observe-item span { font-size: 12px; }
@media (max-width: 640px) {
  .compare-grid { grid-template-columns: 1fr; }
}
</style>
