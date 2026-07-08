<script setup lang="ts">
/**
 * Nuxt 3 / SSR Stage 1: SSR 基础概念与原理
 * 理解服务端渲染的原理、CSR vs SSR vs SSG 对比、Vue SSR API
 */
import { ref } from 'vue'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// 代码示例字符串
const ssrCode = `// Vue SSR 基本用法（@vue/server-renderer）
import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'

const app = createSSRApp({
  data: () => ({ count: 1 }),
  template: '<button @click="count++">{{ count }}</button>',
})

// 将应用渲染为 HTML 字符串
const html = await renderToString(app)
// → '<button>1</button>'

// 客户端 hydrate
import { createSSRApp } from 'vue'
const clientApp = createSSRApp({ ... })
clientApp.mount('#app', true) // 第二个参数 true 表示 hydrate`
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 1：SSR 基础概念与原理</h1>
      <p>理解客户端渲染 (CSR)、服务端渲染 (SSR)、静态站点生成 (SSG) 的区别与适用场景。</p>
    </header>

    <!-- 1.1 CSR vs SSR -->
    <section class="card">
      <h2>1.1 渲染模式对比</h2>
      <div class="compare-table">
        <div class="compare-header">
          <span>维度</span><span>CSR (SPA)</span><span>SSR</span><span>SSG</span>
        </div>
        <div class="compare-row"><span>原理</span><span>浏览器下载 JS 包后渲染</span><span>服务端生成 HTML + 水合</span><span>构建时预渲染成 HTML</span></div>
        <div class="compare-row"><span>首屏速度</span><span class="bad">慢（白屏时间长）</span><span class="good">快</span><span class="good">最快</span></div>
        <div class="compare-row"><span>SEO</span><span class="bad">差（爬虫不可见）</span><span class="good">好</span><span class="good">最好</span></div>
        <div class="compare-row"><span>服务器压力</span><span class="good">无（纯静态）</span><span class="bad">高（每次请求渲染）</span><span class="good">无（CDN 分发）</span></div>
        <div class="compare-row"><span>内容实时性</span><span class="good">实时</span><span class="good">实时</span><span class="bad">构建时</span></div>
        <div class="compare-row"><span>TTFB</span><span>快（CDN 缓存）</span><span>慢（服务端计算）</span><span>最快</span></div>
        <div class="compare-row"><span>典型场景</span><span>后台管理系统</span><span>C端/内容/电商</span><span>博客/文档/官网</span></div>
      </div>
    </section>

    <!-- 1.2 同构渲染原理 -->
    <section class="card">
      <h2>1.2 同构渲染原理</h2>
      <div class="flow-diagram">
        <div class="flow-step">
          <div class="flow-number">1</div>
          <div class="flow-content">
            <strong>服务端渲染</strong>
            <p>Node.js 调用 <code>renderToString()</code> 将 Vue 组件渲染为 HTML 字符串</p>
          </div>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="flow-step">
          <div class="flow-number">2</div>
          <div class="flow-content">
            <strong>发送 HTML 到浏览器</strong>
            <p>服务端将完整 HTML 返回（包含首屏内容），浏览器立即渲染</p>
          </div>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="flow-step">
          <div class="flow-number">3</div>
          <div class="flow-content">
            <strong>Hydration（水合）</strong>
            <p>浏览器加载 JS bundle，Vue 接管已有 DOM，绑定事件和响应式</p>
          </div>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="flow-step">
          <div class="flow-number">4</div>
          <div class="flow-content">
            <strong>客户端接管</strong>
            <p>后续导航变为 SPA 模式（客户端路由），无需再次 SSR</p>
          </div>
        </div>
      </div>
      <pre class="code-block">{{ ssrCode }}</pre>
    </section>

    <!-- 1.3 SSR 的优势与挑战 -->
    <section class="card">
      <h2>1.3 SSR 的优势与挑战</h2>
      <div class="pros-cons">
        <div class="pros">
          <h3>优势</h3>
          <ul>
            <li><strong>更好的 SEO</strong>：搜索引擎能直接抓取完整内容</li>
            <li><strong>更快的首屏</strong>：用户立即看到内容，减少白屏</li>
            <li><strong>更好的社交分享</strong>：OG 标签动态生成</li>
            <li><strong>更低的首字节时间感知</strong></li>
          </ul>
        </div>
        <div class="cons">
          <h3>挑战</h3>
          <ul>
            <li><strong>服务器负载</strong>：每次请求需要服务端渲染</li>
            <li><strong>开发复杂度</strong>：需要处理服务端/客户端差异</li>
            <li><strong>Node.js 依赖</strong>：必须用 Node.js 运行服务端</li>
            <li><strong>Browser API 限制</strong>：SSR 时无法访问 window/document</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 1.4 渲染模式选择 -->
    <section class="card">
      <h2>1.4 如何选择渲染模式？</h2>
      <div class="decision-tree">
        <div class="tree-item"><strong>需要 SEO？</strong> → 是 → 考虑 SSR 或 SSG</div>
        <div class="tree-item"><strong>内容频繁更新？</strong> → 是 → 选择 SSR</div>
        <div class="tree-item"><strong>内容较少变化？</strong> → 是 → 选择 SSG（博客、文档站）</div>
        <div class="tree-item"><strong>纯 SPA 应用？</strong> → 是 → CSR + 预渲染关键页（后台系统）</div>
      </div>
      <p class="note">Nuxt 3 最大的优势：可以在同一项目中混合使用 CSR/SSR/SSG，甚至逐页指定渲染模式。</p>
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
.code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; font-size: 12px; line-height: 1.6; overflow-x: auto; white-space: pre; margin: 16px 0 0; }

.compare-table { border: 1px solid #ebeef5; border-radius: 8px; overflow: hidden; }
.compare-header, .compare-row { display: grid; grid-template-columns: 1fr 1.5fr 1.5fr 1.5fr; padding: 10px 16px; font-size: 13px; }
.compare-header { background: #f5f7fa; font-weight: 600; color: #333; }
.compare-row { border-top: 1px solid #ebeef5; color: #666; }
.good { color: #67c23a; font-weight: 500; }
.bad { color: #f56c6c; }

.flow-diagram { margin-bottom: 8px; }
.flow-step { display: flex; gap: 14px; align-items: flex-start; padding: 14px; background: #f5f7fa; border-radius: 8px; margin-bottom: 8px; }
.flow-number { width: 28px; height: 28px; border-radius: 50%; background: #00dc82; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; flex-shrink: 0; }
.flow-content strong { display: block; margin-bottom: 4px; font-size: 14px; }
.flow-content p { margin: 0; font-size: 13px; color: #666; }
.flow-content code { background: #e8f5e9; padding: 1px 6px; border-radius: 3px; font-size: 12px; color: #00a86b; }
.flow-arrow { text-align: center; color: #ccc; font-size: 18px; padding: 2px 0; }

.pros-cons { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.pros, .cons { background: #fafafa; padding: 16px; border-radius: 8px; }
.pros h3 { color: #67c23a; margin: 0 0 8px; font-size: 15px; }
.cons h3 { color: #f56c6c; margin: 0 0 8px; font-size: 15px; }
.pros ul, .cons ul { padding: 0 0 0 18px; }
.pros li, .cons li { font-size: 13px; color: #666; padding: 4px 0; line-height: 1.5; }

.decision-tree { padding: 0; }
.tree-item { padding: 8px 0; font-size: 14px; color: #555; border-bottom: 1px dashed #f0f0f0; }

@media (max-width: 768px) {
  .compare-header, .compare-row { grid-template-columns: 1fr 1fr 1fr 1fr; font-size: 11px; }
  .pros-cons { grid-template-columns: 1fr; }
}
</style>
