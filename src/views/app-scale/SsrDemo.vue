<script setup lang="ts">
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>服务端渲染 (SSR)</h1>
      <p>服务端渲染在服务器将 Vue 组件渲染为 HTML 字符串，提升首屏加载速度和 SEO。</p>
    </header>

    <!-- SSR vs CSR -->
    <section class="card">
      <h2>SSR 解决的问题</h2>
      <div class="compare-grid">
        <div class="compare-box">
          <h4>🌐 CSR（客户端渲染）</h4>
          <ul>
            <li>白屏时间长（等 JS 加载执行）</li>
            <li>SEO 不友好（爬虫看不到内容）</li>
            <li>首屏 FCP/LCP 指标差</li>
            <li>适合后台管理系统</li>
          </ul>
        </div>
        <div class="compare-box highlight">
          <h4>⚡ SSR（服务端渲染）</h4>
          <ul>
            <li>首屏直接返回完整 HTML</li>
            <li>SEO 友好（爬虫可抓取内容）</li>
            <li>更好的 FCP/LCP 性能</li>
            <li>适合内容型/电商网站</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- SSR 工作流程 -->
    <section class="card">
      <h2>SSR 工作流程</h2>
      <div class="ssr-flow">
        <div class="flow-box">
          <span class="flow-label">1. 请求</span>
          <p>浏览器请求 URL</p>
        </div>
        <span class="flow-arrow">→</span>
        <div class="flow-box">
          <span class="flow-label">2. 服务端渲染</span>
          <p>Node.js 执行 Vue 组件<br/>生成 HTML 字符串</p>
        </div>
        <span class="flow-arrow">→</span>
        <div class="flow-box">
          <span class="flow-label">3. 返回 HTML</span>
          <p>完整 HTML + 内联状态数据</p>
        </div>
        <span class="flow-arrow">→</span>
        <div class="flow-box">
          <span class="flow-label">4. 水合 Hydration</span>
          <p>客户端 JS 接管<br/>变成交互式 SPA</p>
        </div>
      </div>
      <div class="tip-box" style="margin-top: 16px">
        <strong>关键概念 — Hydration（水合）：</strong>
        服务端返回的 HTML 是静态的，客户端 JS 加载后通过 <code>createSSRApp()</code> 在已有 DOM 上"激活" Vue，
        使其变为可交互的 SPA。这个过程称为 Hydration。
      </div>
    </section>

    <!-- Vue SSR API -->
    <section class="card">
      <h2>Vue 3 SSR 核心 API</h2>
      <pre class="code-block">// server.js — 服务端入口
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'

async function render(url) {
  const app = createSSRApp(App)
  // 设置路由、Pinia 等
  const html = await renderToString(app)
  return html
}</pre>
      <div class="two-col">
        <div>
          <h4>服务端 API</h4>
          <pre class="code-block" style="font-size: 12px">import { renderToString } from 'vue/server-renderer'
import { renderToWebStream } from 'vue/server-renderer'

// 完整 HTML 字符串
const html = await renderToString(app)

// 流式渲染（更快首字节）
const stream = renderToWebStream(app)</pre>
        </div>
        <div>
          <h4>客户端 API</h4>
          <pre class="code-block" style="font-size: 12px">import { createSSRApp } from 'vue'

// 客户端水合
const app = createSSRApp(App)
app.mount('#app') // 激活已有 DOM</pre>
        </div>
      </div>
    </section>

    <!-- Nuxt -->
    <section class="card">
      <h2>Nuxt：Vue 全栈框架</h2>
      <p>
        如果不想手动配置 SSR，<a href="https://nuxt.com" target="_blank" style="color: #00dc82">Nuxt</a> 是 Vue 官方推荐的全栈框架，
        内置 SSR、SSG、文件路由、自动导入等。
      </p>
      <div class="nuxt-grid">
        <div class="nuxt-item">
          <strong>SSR / SSG / CSR</strong>
          <span>三种渲染模式自由切换</span>
        </div>
        <div class="nuxt-item">
          <strong>文件路由</strong>
          <span>pages/ 目录自动生成路由</span>
        </div>
        <div class="nuxt-item">
          <strong>自动导入</strong>
          <span>组件/Composables 无需手动 import</span>
        </div>
        <div class="nuxt-item">
          <strong>服务端 API</strong>
          <span>server/ 目录写 Node.js API</span>
        </div>
        <div class="nuxt-item">
          <strong>模块生态</strong>
          <span>Pinia、Tailwind、i18n 等模块</span>
        </div>
        <div class="nuxt-item">
          <strong>零配置</strong>
          <span>开箱即用，专注业务代码</span>
        </div>
      </div>
    </section>

    <!-- SSG / 静态站点生成 -->
    <section class="card">
      <h2>SSR 的延伸：SSG（静态站点生成）</h2>
      <p>
        <strong>SSG (Static Site Generation)</strong> 在构建时将页面预渲染为静态 HTML，
        适合博客、文档站等内容不频繁变化的场景。
      </p>
      <a-table
        :columns="[
          { title: '模式', dataIndex: 'mode', key: 'mode', width: 80 },
          { title: '渲染时机', dataIndex: 'when', key: 'when' },
          { title: '适用场景', dataIndex: 'scene', key: 'scene' },
          { title: 'SEO', dataIndex: 'seo', key: 'seo', width: 60 },
        ]"
        :data-source="[
          { mode: 'CSR', when: '浏览器端', scene: '后台管理、内部工具', seo: '❌' },
          { mode: 'SSR', when: '每次请求时', scene: '电商、社交、内容平台', seo: '✅' },
          { mode: 'SSG', when: '构建时', scene: '博客、文档站、营销页', seo: '✅' },
        ]"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- SSR 注意事项 -->
    <section class="card">
      <h2>SSR 开发注意事项</h2>
      <div class="caution-grid">
        <div class="caution-item">
          <h4>⚠ 避免服务端特有 API</h4>
          <p><code>window</code>、<code>document</code>、<code>localStorage</code> 在 Node.js 中不可用，需在 <code>onMounted</code> 中访问</p>
        </div>
        <div class="caution-item">
          <h4>⚠ 状态污染</h4>
          <p>每个请求必须创建独立的 app 实例和 Store，避免跨请求共享状态</p>
        </div>
        <div class="caution-item">
          <h4>⚠ 水合不匹配</h4>
          <p>服务端和客户端渲染结果必须一致，否则出现 Hydration Mismatch 警告</p>
        </div>
        <div class="caution-item">
          <h4>⚠ 第三方库兼容</h4>
          <p>某些库依赖浏览器 API，需要做 SSR 兼容处理或使用 ClientOnly 包裹</p>
        </div>
      </div>
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
  font-size: 13px;
  color: #595959;
}

.compare-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.compare-box {
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
}

.compare-box.highlight {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
}

.compare-box h4 {
  margin: 0 0 10px;
  font-size: 14px;
}

.compare-box ul {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: #555;
}

.compare-box li {
  margin-bottom: 4px;
}

.ssr-flow {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.flow-box {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 14px;
  text-align: center;
  min-width: 110px;
}

.flow-label {
  font-weight: 700;
  font-size: 12px;
  color: #1677ff;
  background: #e6f4ff;
  padding: 2px 8px;
  border-radius: 10px;
}

.flow-box p {
  font-size: 12px;
  color: #666;
  margin: 8px 0 0;
  line-height: 1.5;
}

.flow-arrow {
  font-size: 18px;
  color: #ccc;
  margin-top: 14px;
}

.two-col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 12px;
}

.two-col h4 {
  margin: 0 0 8px;
  font-size: 13px;
  color: #333;
}

.nuxt-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 12px;
}

.nuxt-item {
  background: #f0faf0;
  border: 1px solid #d4f0d4;
  border-radius: 8px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nuxt-item strong {
  font-size: 13px;
  color: #00a854;
}

.nuxt-item span {
  font-size: 12px;
  color: #888;
}

.caution-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.caution-item {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  padding: 14px;
}

.caution-item h4 {
  margin: 0 0 6px;
  font-size: 13px;
  color: #333;
}

.caution-item p {
  font-size: 12px;
  color: #888;
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 640px) {
  .compare-grid,
  .two-col,
  .nuxt-grid,
  .caution-grid {
    grid-template-columns: 1fr;
  }
  .ssr-flow {
    flex-direction: column;
    align-items: center;
  }
  .flow-arrow {
    transform: rotate(90deg);
  }
}
</style>
