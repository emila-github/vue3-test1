<script setup lang="ts">
import { ref, computed } from 'vue'

// 演示 HMR 状态保持
const counter = ref(0)
const hmrTips = ref([
  '修改 <template> — 页面立即更新',
  '修改 <script> — 逻辑热替换',
  '修改 <style> — 样式即时生效',
  '修改依赖模块 — 自动链式更新',
])

// 展示项目结构
const projectTree = ref(`my-vue-app/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── public/
│   └── favicon.ico
└── src/
    ├── main.ts
    ├── App.vue
    ├── components/
    └── views/`)

// 常用 CLI 命令
const commands = ref([
  { cmd: 'npm create vite@latest', desc: '脚手架创建项目' },
  { cmd: 'pnpm create vite', desc: '使用 pnpm 创建' },
  { cmd: 'pnpm dev', desc: '启动开发服务器' },
  { cmd: 'pnpm build', desc: '生产环境构建' },
  { cmd: 'pnpm preview', desc: '预览构建结果' },
])
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 1：快速上手</h1>
      <p>掌握 Vite 项目初始化、开发服务器、HMR 热更新核心概念。</p>
    </header>

    <!-- 1.1 项目初始化 -->
    <section class="card">
      <h2>创建 Vite 项目</h2>
      <div class="cmd-list">
        <div v-for="c in commands" :key="c.cmd" class="cmd-item">
          <code>{{ c.cmd }}</code>
          <span>{{ c.desc }}</span>
        </div>
      </div>
    </section>

    <!-- 1.2 项目结构 -->
    <section class="card">
      <h2>项目结构</h2>
      <pre class="tree-block">{{ projectTree }}</pre>
    </section>

    <!-- 1.3 vite.config.ts -->
    <section class="card">
      <h2>vite.config.ts 最小配置</h2>
      <pre class="code-block"><code>import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    open: true,       // 自动打开浏览器
  },
  resolve: {
    alias: {
      '@': '/src',    // 路径别名
    },
  },
})</code></pre>
    </section>

    <!-- 1.4 开发服务器 -->
    <section class="card">
      <h2>开发服务器与 HMR</h2>
      <div class="info-grid">
        <div class="info-item">
          <strong>冷启动</strong>
          <span>Vite 预构建依赖用 esbuild，不改源码按需转译</span>
        </div>
        <div class="info-item">
          <strong>HMR 热更新</strong>
          <span>修改模块 → WebSocket 通知 → 浏览器增量更新 → 保留组件状态</span>
        </div>
        <div class="info-item">
          <strong>按需编译</strong>
          <span>只编译浏览器当前请求的模块，不是全量打包</span>
        </div>
        <div class="info-item">
          <strong>源码映射</strong>
          <span>内置 Source Map，方便调试</span>
        </div>
      </div>
    </section>

    <!-- 1.5 HMR 交互演示 -->
    <section class="card">
      <h2>HMR 实战演示：计数器</h2>
      <p class="tip">当前计数 <strong>{{ counter }}</strong> — 修改本文件任意内容保存，观察计数器值是否丢失</p>
      <div class="hmr-demo">
        <a-button type="primary" @click="counter++">+1</a-button>
        <a-button style="margin-left: 8px" @click="counter = 0">清零</a-button>
        <p class="hmr-note">HMR 会保留组件状态，所以 counter 不会归零</p>
      </div>
    </section>

    <!-- 1.6 index.html 入口 -->
    <section class="card">
      <h2>index.html — 与众不同的入口</h2>
      <pre class="code-block"><code>&lt;!DOCTYPE html&gt;
&lt;html lang="zh-CN"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8" /&gt;
    &lt;link rel="icon" href="/favicon.ico" /&gt;
    &lt;title&gt;Vite App&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;div id="app"&gt;&lt;/div&gt;
    &lt;script type="module" src="/src/main.ts"&gt;&lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>
      <div class="highlight-box">
        <p>Vite 把 <code>index.html</code> 放在项目根目录（而不是 public），作为开发入口。</p>
        <p><code>script type="module"</code> 让浏览器以原生 ESM 方式加载，Vite 在服务端做按需转译。</p>
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
.card h2 { margin: 0 0 16px; font-size: 18px; color: #333; }

.cmd-list { display: flex; flex-direction: column; gap: 10px; }
.cmd-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: #fafafa; border-radius: 8px; border: 1px solid #f0f0f0; }
.cmd-item code { font-size: 14px; background: #1a1a1a; color: #52c41a; padding: 4px 12px; border-radius: 4px; white-space: nowrap; }
.cmd-item span { font-size: 13px; color: #999; }

.tree-block { background: #1a1a1a; color: #52c41a; padding: 16px 20px; border-radius: 8px; font-size: 13px; line-height: 1.7; margin: 0; overflow-x: auto; }

.code-block { background: #1a1a1a; color: #e6e6e6; padding: 16px 20px; border-radius: 8px; font-size: 13px; line-height: 1.7; margin: 0; overflow-x: auto; }
.code-block code { font-family: 'Fira Code', 'Consolas', monospace; }

.info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.info-item { display: flex; flex-direction: column; gap: 4px; padding: 12px; background: #fafafa; border-radius: 8px; border: 1px solid #f0f0f0; }
.info-item strong { font-size: 14px; color: #333; }
.info-item span { font-size: 12px; color: #999; line-height: 1.5; }

.tip { color: #666; font-size: 14px; margin-bottom: 12px; }

.hmr-demo { display: flex; align-items: center; gap: 8px; }
.hmr-note { margin: 8px 0 0; font-size: 12px; color: #52c41a; }

.highlight-box { background: #fffbe6; border: 1px solid #ffe58f; border-radius: 8px; padding: 14px; margin-top: 12px; }
.highlight-box p { margin: 4px 0; font-size: 13px; color: #ad6800; }
.highlight-box code { background: #fff1b8; padding: 1px 5px; border-radius: 3px; font-size: 12px; }

@media (max-width: 768px) { .info-grid { grid-template-columns: 1fr; } }
</style>
