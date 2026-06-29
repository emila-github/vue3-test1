<script setup lang="ts">
import { ref } from 'vue'

const packageInfo = ref([
  { tool: 'Vite', version: '^8.0.8', desc: '下一代前端构建工具，开发服务器秒级启动', category: '构建' },
  { tool: 'TypeScript', version: '~6.0.0', desc: '类型安全的 JavaScript 超集', category: '语言' },
  { tool: 'vue-tsc', version: '^3.2.6', desc: 'Vue 3 TypeScript 类型检查工具', category: '类型检查' },
  { tool: 'Vitest', version: '^4.1.4', desc: '基于 Vite 的极速单元测试框架', category: '测试' },
  { tool: 'Playwright', version: '^1.59.1', desc: '跨浏览器端到端测试框架', category: '测试' },
  { tool: 'ESLint', version: '^9.x', desc: 'JavaScript/TypeScript 代码质量检查', category: '代码规范' },
  { tool: 'Prettier', version: '^3.x', desc: '代码格式化工具，统一代码风格', category: '代码规范' },
  { tool: 'unplugin-vue-components', version: '^32.1.0', desc: '组件自动导入，无需手动 import', category: '开发体验' },
])
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>工具链</h1>
      <p>Vue 3 工程化生态：从开发、构建、类型检查到测试的完整工具链。</p>
    </header>

    <!-- 工具链全景 -->
    <section class="card">
      <h2>项目工具链全景</h2>
      <a-table
        :columns="[
          { title: '工具', dataIndex: 'tool', key: 'tool', width: 180 },
          { title: '版本', dataIndex: 'version', key: 'version', width: 100 },
          { title: '类别', dataIndex: 'category', key: 'category', width: 80 },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="packageInfo"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- Vite 核心 -->
    <section class="card">
      <h2>Vite：下一代构建工具</h2>
      <p>
        Vite 利用浏览器原生 ES Module 实现<strong>极速冷启动</strong>和<strong>热模块替换（HMR）</strong>。
        生产构建基于 Rollup，输出高度优化的静态资源。
      </p>

      <div class="info-grid">
        <div class="info-card">
          <h4>开发服务器</h4>
          <pre class="code-block" style="font-size: 12px">pnpm dev

# 启动开发服务器
# 默认 http://localhost:5173
# HMR 热更新（<50ms）</pre>
        </div>
        <div class="info-card">
          <h4>生产构建</h4>
          <pre class="code-block" style="font-size: 12px">pnpm build

# Rollup 打包
# Tree Shaking
# 代码分割
# CSS/JS 压缩</pre>
        </div>
        <div class="info-card">
          <h4>配置文件</h4>
          <pre class="code-block" style="font-size: 12px">// vite.config.ts
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: { alias: { '@': ... } },
  server: { port: 5173 },
})</pre>
        </div>
        <div class="info-card">
          <h4>环境变量</h4>
          <pre class="code-block" style="font-size: 12px">// .env.development
VITE_API_BASE=/api

// .env.production
VITE_API_BASE=https://api.xxx.com

// 使用
import.meta.env.VITE_API_BASE</pre>
        </div>
      </div>
    </section>

    <!-- TypeScript -->
    <section class="card">
      <h2>TypeScript + vue-tsc</h2>
      <p>
        本项目使用 TypeScript 6.x，通过 <code>vue-tsc</code> 进行类型检查。
        <strong>注意</strong>：vue-tsc 仅做类型检查，不参与 Vite 的转译（由 esbuild 负责）。
      </p>
      <pre class="code-block">// tsconfig.app.json — 应用代码配置
{
  "compilerOptions": {
    "strict": true,              // 严格模式
    "jsx": "preserve",           // JSX 保留由 Vite 处理
    "moduleResolution": "bundler", // 模块解析策略
    "paths": { "@/*": ["./src/*"] } // 路径别名
  },
  "include": ["env.d.ts", "src/**/*.vue", "src/**/*.ts"]
}

// 命令
pnpm type-check     # 运行 vue-tsc 类型检查</pre>
    </section>

    <!-- 代码规范 -->
    <section class="card">
      <h2>代码规范：ESLint + Prettier</h2>
      <div class="two-col">
        <div>
          <h4 style="margin-top: 0">ESLint</h4>
          <pre class="code-block" style="font-size: 12px">pnpm lint        # 运行检查
pnpm lint:eslint  # 仅 ESLint
pnpm lint:oxlint  # Oxlint 极速检查

// eslint.config.ts
// Flat Config (ESLint 9+)
export default defineConfig([
  // Vue / TS / 通用规则
])</pre>
        </div>
        <div>
          <h4 style="margin-top: 0">Prettier</h4>
          <pre class="code-block" style="font-size: 12px">pnpm format      # 格式化代码

// 统一风格：
// - 单引号
// - 无分号
// - 2 空格缩进
// - 120 字符行宽</pre>
        </div>
      </div>
      <div class="tip-box">
        <strong>最佳实践：</strong>
        <ul>
          <li>ESLint 负责代码质量（未使用变量、类型错误等）</li>
          <li>Prettier 负责代码风格（引号、缩进、换行等）</li>
          <li>建议配置 Git pre-commit hook（如 lint-staged）</li>
        </ul>
      </div>
    </section>

    <!-- npm scripts -->
    <section class="card">
      <h2>开发工作流</h2>
      <a-table
        :columns="[
          { title: '命令', dataIndex: 'cmd', key: 'cmd', width: 180 },
          { title: '用途', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="[
          { cmd: 'pnpm dev', desc: '启动开发服务器（HMR 热更新）' },
          { cmd: 'pnpm build', desc: '生产构建 → dist/ 目录' },
          { cmd: 'pnpm preview', desc: '预览生产构建结果' },
          { cmd: 'pnpm type-check', desc: '运行 TypeScript 类型检查' },
          { cmd: 'pnpm lint', desc: '代码质量检查（ESLint + Oxlint）' },
          { cmd: 'pnpm format', desc: '代码格式化（Prettier）' },
          { cmd: 'pnpm test:unit', desc: '运行单元测试（Vitest）' },
          { cmd: 'pnpm test:e2e', desc: '运行端到端测试（Playwright）' },
        ]"
        :pagination="false"
        size="small"
      />
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  color: #1a1a1a;
  margin: 0 0 6px;
}

.page-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card h2 {
  margin: 0 0 12px;
  font-size: 18px;
  color: #333;
}

.card p {
  font-size: 14px;
  color: #555;
  line-height: 1.7;
  margin: 0 0 12px;
}

.card p code,
.card li code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
  color: #d63384;
}

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
  margin: 12px 0;
  white-space: pre;
  tab-size: 2;
}

.tip-box {
  background: #fffbe6;
  border-left: 3px solid #faad14;
  padding: 12px 16px;
  border-radius: 4px;
  margin: 12px 0;
  font-size: 13px;
  color: #595959;
}

.tip-box ul {
  margin: 6px 0 0;
  padding-left: 20px;
}

.tip-box li {
  margin-bottom: 4px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
}

.info-card h4 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #333;
}

.two-col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 640px) {
  .info-grid,
  .two-col {
    grid-template-columns: 1fr;
  }
}
</style>
