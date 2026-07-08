<script setup lang="ts">
/**
 * Nuxt 3 / SSR Stage 2: Nuxt 3 核心特性
 * 演示项目结构、自动导入、路由约定、数据获取、服务端 API
 */
import { ref } from 'vue'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// 代码示例字符串（避免模板中 HTML 标签冲突）
const initCode = `# 创建 Nuxt 3 项目
npx nuxi@latest init my-nuxt-app

# 选择配置
# - Package manager: pnpm
# - UI framework: None（或选择需要的组件库）
# - Modules: 按需选择

cd my-nuxt-app
pnpm dev

# 目录结构（初始化后的最小结构）
my-nuxt-app/
├── app.vue          # 入口组件
├── nuxt.config.ts   # 配置文件
├── package.json
└── tsconfig.json`

const autoImportCode = [
  '// composables/useUser.ts — 无需手动 import，全局可用',
  'export function useUser() {',
  '  const user = useState(\'user\', () => ({',
  '    name: \'Guest\',',
  '    role: \'viewer\'',
  '  }))',
  '  return { user }',
  '}',
  '',
  '// pages/index.vue — 直接使用，无需 import',
  '<script setup>',
  'const { user } = useUser()  // 自动导入',
  'const route = useRoute()    // Vue Router 自动导入',
  'const router = useRouter()',
  '</' + 'script>',
  '',
  '// Nuxt 3 默认自动导入的 Vue API：',
  '// ref, reactive, computed, watch, onMounted, ...',
  '// 无需 import { ref } from \'vue\'',
].join('\n')

const routeCode = [
  '// pages/posts/[id].vue',
  '<script setup>',
  '// 获取动态路由参数',
  'const route = useRoute()',
  'const { id } = route.params   // /posts/123 → id = "123"',
  '',
  '// $fetch 是 Nuxt 内置的 HTTP 客户端',
  'const { data: post } = await useFetch(`/api/posts/${id}`)',
  '</' + 'script>',
  '',
  '<template>',
  '  <div>',
  '    <h1>{{ post?.title }}</h1>',
  '    <p>{{ post?.content }}</p>',
  '  </div>',
  '</template>',
].join('\n')

const fetchCode = `// ===== useFetch（推荐，最常用）=====
// 自动处理 SSR + CSR，首次服务端获取，后续客户端导航
const { data, pending, error, refresh } = await useFetch('/api/users')

// ===== useAsyncData（更灵活）=====
// 适合需要自定义数据获取逻辑的场景
const { data, pending, error } = await useAsyncData('users', () => {
  return $fetch('/api/users', {
    headers: { Authorization: \`Bearer \${token}\` }
  })
})

// ===== 关键配置 =====
const { data } = await useFetch('/api/posts', {
  lazy: true,          // 懒加载：不阻塞页面导航
  server: true,        // 是否在服务端获取（默认 true）
  pick: ['title'],     // 只取需要的字段，减少传输
  transform: (data) => data.map(p => ({ ...p, fullTitle: '[Nuxt] ' + p.title })),
  watch: [page],       // 监听 page 变化，自动重新获取
})

// ===== $fetch（Nuxt 内置 HTTP 客户端）=====
// 服务端直接调用，客户端发 HTTP 请求
const result = await $fetch('/api/hello', { method: 'POST', body: { name: 'Nuxt' } })`

const apiCode = `// server/api/hello.ts — 自动映射为 /api/hello
export default defineEventHandler((event) => {
  return {
    message: 'Hello from Nuxt 3 API!',
    timestamp: Date.now(),
  }
})

// server/api/users/[id].ts — 动态路由 /api/users/:id
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)   // URL query 参数
  const body = await readBody(event)  // POST body

  // 访问数据库、调用外部 API...
  return { id, name: 'User ' + id, ...query }
})

// server/api/posts.ts — 支持多种 HTTP 方法
export default defineEventHandler(async (event) => {
  const method = event.method
  if (method === 'GET') {
    return await getPosts()
  } else if (method === 'POST') {
    const body = await readBody(event)
    return await createPost(body)
  }
})`
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 2：Nuxt 3 核心特性</h1>
      <p>掌握 Nuxt 3 项目结构、自动导入机制、文件系统路由、数据获取 API、服务端路由等核心特性。</p>
    </header>

    <!-- 2.1 项目初始化 -->
    <section class="card">
      <h2>2.1 创建 Nuxt 3 项目</h2>
      <pre class="code-block">{{ initCode }}</pre>
    </section>

    <!-- 2.2 自动导入 -->
    <section class="card">
      <h2>2.2 自动导入（Auto-import）</h2>
      <p class="note">Nuxt 3 自动导入 <code>composables/</code>、<code>components/</code>、<code>utils/</code> 目录下的模块，无需手动 import。</p>
      <pre class="code-block">{{ autoImportCode }}</pre>
    </section>

    <!-- 2.3 文件系统路由 -->
    <section class="card">
      <h2>2.3 文件系统路由（File-based Routing）</h2>
      <div class="route-mapping">
        <div class="route-header"><span>文件路径</span><span>生成的路由</span></div>
        <div class="route-row"><code>pages/index.vue</code><span>/</span></div>
        <div class="route-row"><code>pages/about.vue</code><span>/about</span></div>
        <div class="route-row"><code>pages/posts/index.vue</code><span>/posts</span></div>
        <div class="route-row"><code>pages/posts/[id].vue</code><span>/posts/:id</span></div>
        <div class="route-row"><code>pages/user-[group]/[id].vue</code><span>/user-:group/:id</span></div>
        <div class="route-row"><code>pages/[...slug].vue</code><span>/:slug(.*)* （全匹配）</span></div>
        <div class="route-row"><code>pages/parent.vue + pages/parent/child.vue</code><span>嵌套路由</span></div>
      </div>
      <pre class="code-block">{{ routeCode }}</pre>
    </section>

    <!-- 2.4 数据获取 -->
    <section class="card">
      <h2>2.4 数据获取：useFetch vs useAsyncData</h2>
      <pre class="code-block">{{ fetchCode }}</pre>
    </section>

    <!-- 2.5 服务端 API -->
    <section class="card">
      <h2>2.5 服务端 API（Server Routes）</h2>
      <pre class="code-block">{{ apiCode }}</pre>
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
.note { font-size: 13px; color: #999; margin: 8px 0; }
.note code { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; font-size: 12px; }
.code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; font-size: 12px; line-height: 1.6; overflow-x: auto; white-space: pre; margin: 12px 0 0; }

.route-mapping { border: 1px solid #ebeef5; border-radius: 8px; overflow: hidden; margin-bottom: 16px; }
.route-header, .route-row { display: grid; grid-template-columns: 1fr 1fr; padding: 10px 16px; font-size: 13px; }
.route-header { background: #f5f7fa; font-weight: 600; color: #333; }
.route-row { border-top: 1px solid #ebeef5; color: #666; }
.route-row code { color: #00dc82; }
</style>
