<script setup lang="ts">
import { ref } from 'vue'

const envVars = ref([
  { name: 'VITE_APP_TITLE', desc: '应用标题', example: 'My Vue App' },
  { name: 'VITE_API_BASE', desc: '接口基础地址', example: 'https://api.example.com' },
  { name: 'VITE_APP_KEY', desc: '应用密钥', example: 'abc-123-xyz' },
  { name: 'BASE_URL', desc: '公共基础路径', example: '/' },
  { name: 'MODE', desc: '当前模式', example: 'development' },
  { name: 'DEV', desc: '是否开发环境', example: 'true' },
  { name: 'PROD', desc: '是否生产环境', example: 'false' },
])

const proxyConfig = ref(`// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\\/api/, ''),
    },
    '/upload': {
      target: 'http://file-server:8080',
      changeOrigin: true,
    },
  },
}`)
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 2：配置与环境</h1>
      <p>掌握环境变量、多模式配置、路径别名、CSS 预处理和开发代理。</p>
    </header>

    <!-- 2.1 环境变量 -->
    <section class="card">
      <h2>环境变量（.env 文件）</h2>
      <p class="desc">只有 <code>VITE_</code> 前缀的变量会暴露给客户端代码。在 <code>import.meta.env</code> 上访问。</p>

      <h3>文件优先级（由低到高）</h3>
      <pre class="code-block"><code>.env                  # 所有模式共用
.env.local            # 本地覆盖（gitignore）
.env.development      # 开发模式
.env.production       # 生产模式</code></pre>

      <h3>环境变量示例</h3>
      <a-table
        :columns="[
          { title: '变量名', dataIndex: 'name', key: 'name' },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
          { title: '示例值', dataIndex: 'example', key: 'example' },
        ]"
        :data-source="envVars"
        :pagination="false"
        size="small"
        class="mt-12"
      />

      <h3>使用方式</h3>
      <pre class="code-block"><code>// .env 文件
VITE_APP_TITLE=我的应用
VITE_API_BASE=https://api.example.com

// 代码中访问
console.log(import.meta.env.VITE_APP_TITLE)  // "我的应用"
console.log(import.meta.env.VITE_API_BASE)   // "https://api.example.com"
console.log(import.meta.env.MODE)            // "development"
console.log(import.meta.env.DEV)             // true
console.log(import.meta.env.PROD)            // false</code></pre>
    </section>

    <!-- 2.2 多模式配置 -->
    <section class="card">
      <h2>多模式与自定义模式</h2>
      <pre class="code-block"><code>// package.json
"scripts": {
  "dev": "vite",
  "dev:mock": "vite --mode mock",
  "dev:prod": "vite --mode production",
  "build:dev": "vite build --mode development",
  "build:prod": "vite build --mode production",
}

// .env.mock
VITE_API_BASE=/mock   // 使用 mock 数据的模式</code></pre>
    </section>

    <!-- 2.3 路径别名 -->
    <section class="card">
      <h2>路径别名（resolve.alias）</h2>
      <div class="two-col">
        <div>
          <h3>vite.config.ts</h3>
          <pre class="code-block"><code>import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(
        new URL('./src', import.meta.url)
      ),
      '@components': fileURLToPath(
        new URL('./src/components', import.meta.url)
      ),
    },
  },
})</code></pre>
        </div>
        <div>
          <h3>使用别名</h3>
          <pre class="code-block"><code>// 之前：相对路径地狱
import Btn from '../../components/Btn.vue'

// 之后：清爽的别名
import Btn from '@components/Btn.vue'</code></pre>
        </div>
      </div>

      <div class="highlight-box">
        <p>还需在 <code>tsconfig.json</code> 中同步配置 <code>paths</code>，让 TypeScript 也能识别别名。</p>
      </div>
    </section>

    <!-- 2.4 CSS -->
    <section class="card">
      <h2>CSS 预处理与 Modules</h2>
      <pre class="code-block"><code>// vite.config.ts — 全局 SCSS 变量
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables" as *;`,
      },
    },
    modules: {
      localsConvention: 'camelCaseOnly',  // 类名转驼峰
    },
    devSourcemap: true,
  },
})</code></pre>
    </section>

    <!-- 2.5 开发代理 -->
    <section class="card">
      <h2>开发代理（server.proxy）</h2>
      <pre class="code-block"><code>{{ proxyConfig }}</code></pre>
      <div class="highlight-box">
        <p>开发环境前端在 <code>:5173</code>，后端 API 在 <code>:3000</code>。配置代理解决跨域，无需后端配 CORS。</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page { max-width: 960px; margin: 0 auto; padding: 24px; }
.page-header { text-align: center; margin-bottom: 28px; }
.page-header h1 { font-size: 26px; color: #1a1a1a; margin: 0 0 6px; }
.page-header p { color: #666; font-size: 14px; }

.card { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.card h2 { margin: 0 0 12px; font-size: 18px; color: #333; }
.card h3 { margin: 16px 0 8px; font-size: 15px; color: #555; }
.desc { color: #666; font-size: 14px; margin-bottom: 12px; }
.desc code { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; font-size: 13px; }

.code-block { background: #1a1a1a; color: #e6e6e6; padding: 16px 20px; border-radius: 8px; font-size: 13px; line-height: 1.7; margin: 0; overflow-x: auto; white-space: pre; }
.code-block code { font-family: 'Fira Code', 'Consolas', monospace; }

.mt-12 { margin-top: 12px; }

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 768px) { .two-col { grid-template-columns: 1fr; } }

.highlight-box { background: #fffbe6; border: 1px solid #ffe58f; border-radius: 8px; padding: 14px; margin-top: 12px; }
.highlight-box p { margin: 4px 0; font-size: 13px; color: #ad6800; }
.highlight-box code { background: #fff1b8; padding: 1px 5px; border-radius: 3px; font-size: 12px; }
</style>
