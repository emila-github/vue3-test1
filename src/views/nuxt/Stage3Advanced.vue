<script setup lang="ts">
/**
 * Nuxt 3 / SSR Stage 3: Nuxt 3 进阶实战
 * 演示中间件、插件、模块系统、状态管理、SEO、部署
 */
import { ref } from 'vue'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// 代码示例字符串（避免模板中 HTML 标签冲突）
const middlewareCode = [
  '// middleware/auth.ts — 路由级别的中间件',
  'export default defineNuxtRouteMiddleware((to, from) => {',
  '  const { user } = useUser()',
  '',
  '  // 未登录跳转到登录页',
  '  if (!user.value && to.path !== \'/login\') {',
  '    return navigateTo(\'/login\')',
  '  }',
  '})',
  '',
  '// middleware/log.ts — 全局中间件（文件名添加 .global 后缀）',
  'export default defineNuxtRouteMiddleware((to, from) => {',
  '  console.log(`Navigation: ${from.path} -> ${to.path}`)',
  '})',
  '',
  '// 在页面中使用',
  '// pages/admin.vue',
  '<script setup>',
  'definePageMeta({',
  '  middleware: [\'auth\']  // 单个中间件',
  '  // middleware: [\'auth\', \'admin\']  // 多个中间件按顺序执行',
  '})',
  '</' + 'script>',
].join('\n')

const seoCode = [
  '// pages/about.vue — 页面级 SEO',
  '<script setup>',
  'useHead({',
  '  title: \'关于我们\',',
  '  meta: [',
  '    { name: \'description\', content: \'这是关于页面的描述\' },',
  '    { property: \'og:title\', content: \'关于我们 - My Site\' },',
  '    { property: \'og:image\', content: \'https://example.com/og.png\' },',
  '  ],',
  '  link: [',
  '    { rel: \'canonical\', href: \'https://example.com/about\' },',
  '  ],',
  '  script: [',
  '    { src: \'https://example.com/analytics.js\' },',
  '  ],',
  '})',
  '',
  '// 动态 SEO（结合 API 数据）',
  'const { data: post } = await useFetch(\'/api/post/slug\')',
  'useHead({',
  '  title: post.value?.title,',
  '  meta: [',
  '    { name: \'description\', content: post.value?.excerpt },',
  '    { property: \'og:title\', content: post.value?.title },',
  '    { property: \'og:image\', content: post.value?.coverImage },',
  '  ],',
  '})',
  '</' + 'script>',
  '',
  '// app.vue — 全局默认 SEO',
  'useHead({',
  '  titleTemplate: \'%s - My Nuxt App\',  // 每个页面的 title 都会拼接',
  '})',
].join('\n')
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 3：Nuxt 3 进阶实战</h1>
      <p>掌握中间件与路由守卫、插件注册、模块生态、全局状态管理、SEO 优化及部署方案。</p>
    </header>

    <!-- 3.1 中间件 -->
    <section class="card">
      <h2>3.1 中间件（Middleware）</h2>
      <pre class="code-block">{{ middlewareCode }}</pre>
    </section>

    <!-- 3.2 插件 -->
    <section class="card">
      <h2>3.2 插件（Plugins）</h2>
      <pre class="code-block">{{ `// plugins/ant-design-vue.ts — 注册第三方 UI 库
import Antd from 'ant-design-vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Antd)
})

// plugins/dayjs.ts — 注册全局工具
import dayjs from 'dayjs'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dayjs,  // 注入后可通过 useNuxtApp().$dayjs 访问
    }
  }
})

// 使用注入的工具
const { $dayjs } = useNuxtApp()
console.log($dayjs().format('YYYY-MM-DD'))

// plugins/api.client.ts — 仅客户端执行（添加 .client 后缀）
// plugins/api.server.ts — 仅服务端执行（添加 .server 后缀）` }}</pre>
    </section>

    <!-- 3.3 状态管理 -->
    <section class="card">
      <h2>3.3 状态管理（useState + Pinia）</h2>
      <pre class="code-block">{{ `// ===== Nuxt 内置 useState（适合轻量场景）=====
// composables/useCounter.ts
export function useCounter() {
  // useState 在 SSR 下序列化到客户端，实现跨请求共享
  const count = useState('counter', () => 0)

  const increment = () => count.value++
  const decrement = () => count.value--

  return { count, increment, decrement }
}

// ===== Pinia 集成（适合复杂状态）=====
// 1. pnpm add @pinia/nuxt pinia
// 2. nuxt.config.ts 中添加模块:
//    modules: ['@pinia/nuxt']

// stores/counter.ts
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, double, increment }
})

// pages/index.vue
const store = useCounterStore()  // 自动导入` }}</pre>
    </section>

    <!-- 3.4 SEO 优化 -->
    <section class="card">
      <h2>3.4 SEO 与 Meta 管理</h2>
      <pre class="code-block">{{ seoCode }}</pre>
    </section>

    <!-- 3.5 模块系统 -->
    <section class="card">
      <h2>3.5 Nuxt 模块生态</h2>
      <div class="module-grid">
        <div class="module-item">
          <strong>@nuxt/image</strong>
          <p>图片优化模块：自动压缩、格式转换、懒加载、响应式</p>
          <code>pnpm add @nuxt/image</code>
        </div>
        <div class="module-item">
          <strong>@nuxt/content</strong>
          <p>基于文件的内容管理：Markdown/YAML/CSV → API</p>
          <code>pnpm add @nuxt/content</code>
        </div>
        <div class="module-item">
          <strong>@nuxtjs/i18n</strong>
          <p>国际化模块：多语言路由、翻译、SEO</p>
          <code>pnpm add @nuxtjs/i18n</code>
        </div>
        <div class="module-item">
          <strong>@nuxt/ui</strong>
          <p>基于 Tailwind CSS 的官方 UI 库</p>
          <code>pnpm add @nuxt/ui</code>
        </div>
        <div class="module-item">
          <strong>nuxt-swiper</strong>
          <p>Swiper 轮播组件集成</p>
          <code>pnpm add nuxt-swiper</code>
        </div>
        <div class="module-item">
          <strong>@nuxtjs/color-mode</strong>
          <p>暗黑模式/主题切换</p>
          <code>pnpm add @nuxtjs/color-mode</code>
        </div>
      </div>
    </section>

    <!-- 3.6 部署 -->
    <section class="card">
      <h2>3.6 部署方案</h2>
      <div class="deploy-grid">
        <div class="deploy-card">
          <h3>Node.js 服务器</h3>
          <p>标准 SSR 部署，完全的服务端渲染</p>
          <code>pnpm build && node .output/server/index.mjs</code>
          <span>适用：需要完整 SSR 能力的项目</span>
        </div>
        <div class="deploy-card">
          <h3>静态站点 (SSG)</h3>
          <p>预渲染所有页面为 HTML</p>
          <code>pnpm generate</code>
          <span>适用：内容不常变化的博客、文档</span>
        </div>
        <div class="deploy-card">
          <h3>边缘渲染</h3>
          <p>部署到边缘网络（Cloudflare Workers、Vercel）</p>
          <code>预设：nuxi build --preset=cloudflare-pages</code>
          <span>适用：全球低延迟访问</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page { max-width: 960px; margin: 0 auto; padding: 24px; }
.page-header { text-align: center; margin-bottom: 24px; }
.page-header h1 { font-size: 24px; color: #1a1a1a; margin: 0 0 8px; }
.page-header p { color: #666; font-size: 14px; }
.card { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.card h2 { margin: 0 0 16px; font-size: 18px; color: #333; padding-bottom: 6px; border-bottom: 1px solid #f0f0f0; }
.code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; font-size: 12px; line-height: 1.6; overflow-x: auto; white-space: pre; margin: 0; }

.module-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.module-item { background: #f7f8fa; padding: 14px; border-radius: 8px; border: 1px solid #ebedf0; }
.module-item strong { display: block; font-size: 14px; margin-bottom: 4px; color: #333; }
.module-item p { font-size: 12px; color: #666; margin: 0 0 8px; line-height: 1.5; }
.module-item code { font-size: 11px; background: #e8f5e9; padding: 2px 8px; border-radius: 4px; color: #00a86b; }

.deploy-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.deploy-card { background: #f7f8fa; padding: 16px; border-radius: 8px; border: 1px solid #ebedf0; }
.deploy-card h3 { margin: 0 0 8px; font-size: 14px; color: #333; }
.deploy-card p { font-size: 12px; color: #666; margin: 0 0 8px; line-height: 1.5; }
.deploy-card code { display: block; font-size: 11px; background: #1e1e1e; color: #00dc82; padding: 8px; border-radius: 4px; margin-bottom: 6px; }
.deploy-card span { font-size: 11px; color: #999; }

@media (max-width: 768px) {
  .module-grid { grid-template-columns: 1fr; }
  .deploy-grid { grid-template-columns: 1fr; }
}
</style>
