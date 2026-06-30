<script setup lang="ts">
import { ref } from 'vue'

const officialPlugins = ref([
  { name: '@vitejs/plugin-vue', desc: 'Vue 3 SFC 支持' },
  { name: '@vitejs/plugin-react', desc: 'React JSX/TSX 支持' },
  { name: '@vitejs/plugin-vue-jsx', desc: 'Vue JSX/TSX 支持' },
  { name: '@vitejs/plugin-legacy', desc: '传统浏览器兼容' },
])

const communityPlugins = ref([
  { name: 'unplugin-vue-components', desc: '组件自动按需导入' },
  { name: 'unplugin-auto-import', desc: 'API 自动导入（ref, computed...）' },
  { name: 'vite-plugin-vue-devtools', desc: 'Vue DevTools Vite 集成' },
  { name: 'vite-plugin-compression', desc: 'Gzip/Brotli 压缩' },
  { name: 'vite-plugin-pages', desc: '文件系统路由' },
  { name: 'vite-plugin-inspect', desc: '检查 Vite 插件中间态' },
])

const customPluginCode = ref(`// vite-plugin-my-analyzer.ts
import type { Plugin } from 'vite'

export default function myAnalyzer(): Plugin {
  let startTime: number

  return {
    name: 'my-analyzer',

    // 构建开始
    buildStart() {
      startTime = Date.now()
      console.log('🔨 构建开始...')
    },

    // 解析模块 ID
    resolveId(id) {
      if (id === 'virtual:my-module') {
        return '\\0virtual:my-module'
      }
    },

    // 加载虚拟模块内容
    load(id) {
      if (id === '\\0virtual:my-module') {
        return \`export default "Hello from virtual module!"\`
      }
    },

    // 转换代码
    transform(code, id) {
      if (id.endsWith('.vue')) {
        console.log(\`📦 转换: \${id}\`)
      }
    },

    // 构建完成
    closeBundle() {
      const time = Date.now() - startTime
      console.log(\`✅ 构建完成，耗时 \${time}ms\`)
    },
  }
}`)

const hookOrder = ref(`// Vite 插件执行顺序
export default defineConfig({
  plugins: [
    {
      ...pluginA,
      enforce: 'pre',    // 最先执行
    },
    pluginB,              // 默认顺序
    {
      ...pluginC,
      enforce: 'post',   // 最后执行
    },
  ],
})`)
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 3：插件系统</h1>
      <p>理解 Vite 插件架构，熟悉官方/社区插件，学会编写自定义插件。</p>
    </header>

    <!-- 3.1 插件概览 -->
    <section class="card">
      <h2>插件架构</h2>
      <div class="info-grid">
        <div class="info-item">
          <strong>兼容 Rollup</strong>
          <span>Vite 插件 API 扩展自 Rollup 插件接口，大部分 Rollup 插件可直接使用</span>
        </div>
        <div class="info-item">
          <strong>Vite 专属钩子</strong>
          <span>config、configResolved、configureServer、transformIndexHtml 等 Vite 专有钩子</span>
        </div>
        <div class="info-item">
          <strong>执行顺序</strong>
          <span>enforce: 'pre' → 默认 → 'post'，控制插件执行先后</span>
        </div>
        <div class="info-item">
          <strong>虚拟模块</strong>
          <span>通过 resolveId + load 钩子创建不存在的虚拟模块</span>
        </div>
      </div>
    </section>

    <!-- 3.2 官方插件 -->
    <section class="card">
      <h2>官方插件</h2>
      <a-table
        :columns="[
          { title: '插件', dataIndex: 'name', key: 'name' },
          { title: '用途', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="officialPlugins"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- 3.3 社区插件 -->
    <section class="card">
      <h2>常用社区插件</h2>
      <a-table
        :columns="[
          { title: '插件', dataIndex: 'name', key: 'name' },
          { title: '用途', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="communityPlugins"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- 3.4 自定义插件 -->
    <section class="card">
      <h2>自定义插件开发</h2>
      <h3>完整示例：构建分析器</h3>
      <pre class="code-block"><code>{{ customPluginCode }}</code></pre>
    </section>

    <!-- 3.5 执行顺序 -->
    <section class="card">
      <h2>插件执行顺序（enforce）</h2>
      <pre class="code-block"><code>{{ hookOrder }}</code></pre>
    </section>

    <!-- 3.6 当前项目插件 -->
    <section class="card">
      <h2>本项目使用的 Vite 插件</h2>
      <pre class="code-block"><code>// vite.config.ts
export default defineConfig({
  plugins: [
    vue(),                     // Vue 3 SFC
    vueJsx(),                  // Vue JSX
    vueDevTools(),             // DevTools
    Components({              // Ant Design Vue 自动导入
      resolvers: [/* ... */],
    }),
  ],
})</code></pre>
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
.card h3 {
  margin: 16px 0 8px;
  font-size: 15px;
  color: #555;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
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

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
