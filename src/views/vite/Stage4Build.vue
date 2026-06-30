<script setup lang="ts">
import { ref } from 'vue'

const buildConfig = ref(`// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2015',          // 目标浏览器
    outDir: 'dist',            // 输出目录
    assetsDir: 'assets',       // 资源子目录
    sourcemap: false,          // 是否生成 source map
    minify: 'esbuild',         // 压缩引擎: 'esbuild' | 'terser'

    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-ui': ['ant-design-vue'],
          'vendor-utils': ['axios', 'lodash-es'],
        },
      },
    },

    // chunk 大小警告阈值 (KB)
    chunkSizeWarningLimit: 500,
  },
})`)

const splitCode = ref(`// 方式 1: manualChunks（推荐）
rollupOptions: {
  output: {
    manualChunks: {
      'vue-vendor': ['vue', 'vue-router', 'pinia'],
      'ui-lib': ['ant-design-vue', '@ant-design/icons-vue'],
    },
  },
}

// 方式 2: 动态导入（组件级）
const HeavyComponent = defineAsyncComponent(
  () => import('./HeavyComponent.vue')
)

// 方式 3: 函数式 manualChunks
manualChunks(id) {
  if (id.includes('node_modules/vue')) return 'vue'
  if (id.includes('node_modules/ant-design-vue')) return 'antd'
}`)

const assetConfig = ref(`// 资源处理
build: {
  // 资源内联阈值（小于此大小转为 base64）
  assetsInlineLimit: 4096,     // 4KB

  // CSS 代码分割
  cssCodeSplit: true,          // 默认 true，按 chunk 拆分
  cssMinify: 'esbuild',        // CSS 压缩

  // 清空输出目录
  emptyOutDir: true,
}

// 打包分析
import { visualizer } from 'rollup-plugin-visualizer'

plugins: [
  visualizer({
    filename: 'stats.html',    // 输出分析报告
    open: true,                // 自动打开
    gzipSize: true,
  }),
]`)
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 4：构建与优化</h1>
      <p>生产构建、代码分割、Tree Shaking、打包分析和资源优化策略。</p>
    </header>

    <!-- 4.1 构建命令 -->
    <section class="card">
      <h2>构建命令</h2>
      <div class="cmd-list">
        <div class="cmd-item"><code>pnpm build</code><span>默认生产构建 → dist/</span></div>
        <div class="cmd-item"><code>pnpm build:dev</code><span>development 模式构建</span></div>
        <div class="cmd-item"><code>pnpm preview</code><span>预览构建结果</span></div>
      </div>
    </section>

    <!-- 4.2 build 配置 -->
    <section class="card">
      <h2>build 完整配置</h2>
      <pre class="code-block"><code>{{ buildConfig }}</code></pre>
    </section>

    <!-- 4.3 代码分割 -->
    <section class="card">
      <h2>代码分割策略</h2>
      <div class="info-grid">
        <div class="info-item">
          <strong>vendor 拆分</strong>
          <span>将第三方库单独打包，利用浏览器缓存</span>
        </div>
        <div class="info-item">
          <strong>路由懒加载</strong>
          <span>每个页面独立 chunk，按需加载</span>
        </div>
        <div class="info-item">
          <strong>组件懒加载</strong>
          <span>defineAsyncComponent 加载大组件</span>
        </div>
        <div class="info-item">
          <strong>Tree Shaking</strong>
          <span>移除未使用的代码，需配合 ESM</span>
        </div>
      </div>
      <pre class="code-block mt-12"><code>{{ splitCode }}</code></pre>
    </section>

    <!-- 4.4 资源处理 -->
    <section class="card">
      <h2>资源处理与打包分析</h2>
      <pre class="code-block"><code>{{ assetConfig }}</code></pre>
    </section>

    <!-- 4.5 常见优化 -->
    <section class="card">
      <h2>常见优化清单</h2>
      <a-table
        :columns="[
          { title: '优化项', dataIndex: 'item', key: 'item' },
          { title: '方案', dataIndex: 'solution', key: 'solution' },
          { title: '效果', dataIndex: 'effect', key: 'effect' },
        ]"
        :data-source="[
          { item: '首屏加载慢', solution: '路由懒加载 + vendor 拆分', effect: '首屏 JS 减少 50%+' },
          { item: '构建慢', solution: '升级 Vite/esbuild 版本', effect: '构建时间缩短 30-70%' },
          { item: 'chunk 过大', solution: 'manualChunks 细粒度拆分', effect: '单文件 ≤ 200KB' },
          { item: '重复打包', solution: '检查 dedupe 配置', effect: '避免同一库打包多次' },
          { item: 'CSS 体积大', solution: 'PurgeCSS / UnoCSS 按需', effect: 'CSS 减少 60-80%' },
          { item: '图片多', solution: 'vite-plugin-imagemin 压缩', effect: '图片体积减小 30-50%' },
          { item: '未使用代码', solution: 'Tree Shaking + 纯 ESM', effect: '移除死代码' },
        ]"
        :pagination="false"
        size="small"
      />
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}
.page-header {
  text-align: center;
  margin-bottom: 28px;
}
.page-header h1 {
  font-size: 26px;
  color: #1a1a1a;
  margin: 0 0 6px;
}
.page-header p {
  color: #666;
  font-size: 14px;
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

.cmd-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.cmd-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}
.cmd-item code {
  font-size: 14px;
  background: #1a1a1a;
  color: #52c41a;
  padding: 4px 12px;
  border-radius: 4px;
  white-space: nowrap;
}
.cmd-item span {
  font-size: 13px;
  color: #999;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}
.info-item strong {
  font-size: 14px;
  color: #333;
}
.info-item span {
  font-size: 12px;
  color: #999;
  line-height: 1.5;
}

.code-block {
  background: #1a1a1a;
  color: #e6e6e6;
  padding: 16px 20px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.7;
  margin: 0;
  overflow-x: auto;
  white-space: pre;
}
.code-block code {
  font-family: 'Fira Code', 'Consolas', monospace;
}
.mt-12 {
  margin-top: 12px;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
