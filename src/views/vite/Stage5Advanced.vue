<script setup lang="ts">
import { ref } from 'vue'

const ssrCode = ref(`// vite.config.ts — SSR 配置
export default defineConfig({
  ssr: {
    // 不移除 SSR 专用的 external 依赖
    noExternal: ['vue', 'vue-router'],
  },
})

// 服务端入口 server.js
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'

export async function render() {
  const app = createSSRApp(App)
  return await renderToString(app)
}`)

const libCode = ref(`// vite.config.ts — 库模式
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',     // 入口
      name: 'MyLib',             // UMD 全局变量名
      fileName: 'my-lib',        // 输出文件名
      formats: ['es', 'umd'],    // 模块格式
    },
    rollupOptions: {
      // 外部化依赖
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' }, // UMD 全局映射
      },
    },
  },
})`)

const workerCode = ref(`// 1. 新建 Worker: my.worker.ts
self.onmessage = (e) => {
  const result = heavyCompute(e.data)
  self.postMessage(result)
}

// 2. 主线程使用
const worker = new Worker(
  new URL('./my.worker.ts', import.meta.url),
  { type: 'module' }
)

worker.onmessage = (e) => {
  console.log('计算结果:', e.data)
}

worker.postMessage({ data: [1, 2, 3] })

// 3. 使用 ?worker 导入
import MyWorker from './my.worker?worker'
const w = new MyWorker()`)

const preBundleCode = ref(`// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    // 强制预构建某些依赖
    include: ['lodash-es', 'echarts'],

    // 排除不需要预构建的依赖
    exclude: ['your-local-package'],

    // esbuild 选项
    esbuildOptions: {
      target: 'es2020',
    },
  },
})`)
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 5：进阶特性</h1>
      <p>SSR 服务端渲染、库模式打包、Web Worker 集成、依赖预构建等高级主题。</p>
    </header>

    <!-- 5.1 SSR -->
    <section class="card">
      <h2>SSR（服务端渲染）</h2>
      <p class="desc">Vite 内置 SSR 支持，无需额外配置即可搭建 SSR 应用。通常配合 Nuxt 等框架使用。</p>
      <pre class="code-block"><code>{{ ssrCode }}</code></pre>
    </section>

    <!-- 5.2 库模式 -->
    <section class="card">
      <h2>库模式（Library Mode）</h2>
      <p class="desc">将项目构建为可发布的 npm 包，支持 ESM / UMD 多格式输出。</p>
      <pre class="code-block"><code>{{ libCode }}</code></pre>
    </section>

    <!-- 5.3 Web Worker -->
    <section class="card">
      <h2>Web Worker 集成</h2>
      <p class="desc">Vite 原生支持 Web Worker，通过 <code>?worker</code> 后缀即可导入。</p>
      <pre class="code-block"><code>{{ workerCode }}</code></pre>
    </section>

    <!-- 5.4 依赖预构建 -->
    <section class="card">
      <h2>依赖预构建（Dependency Pre-Bundling）</h2>
      <p class="desc">Vite 用 esbuild 预构建 node_modules 中的 CJS/UMD 依赖，转为 ESM 并合并碎片模块。</p>
      <pre class="code-block"><code>{{ preBundleCode }}</code></pre>
    </section>

    <!-- 5.5 后端集成 -->
    <section class="card">
      <h2>后端集成 / 中间件模式</h2>
      <pre class="code-block"><code>// express + vite 开发中间件
import express from 'express'
import { createServer as createViteServer } from 'vite'

const app = express()
const vite = await createViteServer({
  server: { middlewareMode: true },
})

app.use(vite.middlewares)
app.listen(3000)</code></pre>
    </section>

    <!-- 5.6 最佳实践 -->
    <section class="card">
      <h2>Vite 最佳实践总结</h2>
      <div class="practice-grid">
        <div class="practice-item">
          <strong>✅ 使用 ESM</strong>
          <span>充分利用 Tree Shaking 和原生模块系统</span>
        </div>
        <div class="practice-item">
          <strong>✅ 合理拆分 vendor</strong>
          <span>第三方库单独打包，缓存利用率最大化</span>
        </div>
        <div class="practice-item">
          <strong>✅ 环境变量管理</strong>
          <span>.env 多模式管理，敏感信息不放前端代码</span>
        </div>
        <div class="practice-item">
          <strong>✅ 代理解决跨域</strong>
          <span>开发环境用 proxy，生产环境用 Nginx</span>
        </div>
        <div class="practice-item">
          <strong>✅ 按需引入</strong>
          <span>避免全量导入 UI 库，用 unplugin-vue-components</span>
        </div>
        <div class="practice-item">
          <strong>⚠️ 避免使用 require</strong>
          <span>Vite 基于 ESM，CJS 模块需要预构建</span>
        </div>
        <div class="practice-item">
          <strong>⚠️ 不要直接修改 node_modules</strong>
          <span>使用 patch-package 管理补丁</span>
        </div>
        <div class="practice-item">
          <strong>⚠️ 构建分析</strong>
          <span>定期用 rollup-plugin-visualizer 分析打包体积</span>
        </div>
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
.desc { color: #666; font-size: 14px; margin-bottom: 12px; line-height: 1.6; }
.desc code { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; font-size: 13px; }

.code-block { background: #1a1a1a; color: #e6e6e6; padding: 16px 20px; border-radius: 8px; font-size: 13px; line-height: 1.7; margin: 0; overflow-x: auto; white-space: pre; }
.code-block code { font-family: 'Fira Code', 'Consolas', monospace; }

.practice-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.practice-item { display: flex; flex-direction: column; gap: 4px; padding: 12px; background: #fafafa; border-radius: 8px; border: 1px solid #f0f0f0; }
.practice-item strong { font-size: 14px; color: #333; }
.practice-item span { font-size: 12px; color: #999; line-height: 1.5; }

@media (max-width: 768px) { .practice-grid { grid-template-columns: 1fr; } }
</style>
