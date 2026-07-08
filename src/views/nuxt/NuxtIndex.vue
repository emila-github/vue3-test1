<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: 'SSR 基础概念与原理',
    desc: 'CSR vs SSR vs SSG、同构渲染原理、Vue SSR API (@vue/server-renderer)、hydration 过程',
    path: '/nuxt/stage1',
    icon: '🔄',
    color: '#00dc82',
  },
  {
    id: 2,
    title: 'Nuxt 3 核心特性',
    desc: '项目结构、自动导入、路由约定（文件系统路由）、数据获取（useFetch/useAsyncData）、服务端 API',
    path: '/nuxt/stage2',
    icon: '⚡',
    color: '#00c58e',
  },
  {
    id: 3,
    title: 'Nuxt 3 进阶实战',
    desc: '中间件与插件、模块系统、状态管理、SEO 优化、部署方案（Node/静态/边缘）',
    path: '/nuxt/stage3',
    icon: '🚀',
    color: '#108775',
  },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="nuxt-index">
    <header class="page-header">
      <h1>Nuxt 3 / SSR 学习</h1>
      <p class="subtitle">
        Vue 3 的元框架，集 SSR、SSG、文件路由、自动导入于一体，覆盖从开发到部署的完整解决方案。
      </p>
    </header>

    <!-- 核心概念速览 -->
    <section class="card quick-ref">
      <h2>核心概念速览</h2>
      <div class="api-grid">
        <div class="api-item"><code>SSR</code><span>服务端渲染</span></div>
        <div class="api-item"><code>SSG</code><span>静态站点生成</span></div>
        <div class="api-item"><code>CSR</code><span>客户端渲染</span></div>
        <div class="api-item"><code>ISR</code><span>增量静态再生</span></div>
        <div class="api-item"><code>Hydration</code><span>水合激活</span></div>
        <div class="api-item"><code>useFetch</code><span>数据获取</span></div>
        <div class="api-item"><code>useAsyncData</code><span>异步数据</span></div>
        <div class="api-item"><code>pages/</code><span>文件路由</span></div>
        <div class="api-item"><code>server/</code><span>服务端 API</span></div>
        <div class="api-item"><code>composables/</code><span>自动导入</span></div>
        <div class="api-item"><code>middleware/</code><span>中间件</span></div>
        <div class="api-item"><code>plugins/</code><span>插件</span></div>
        <div class="api-item"><code>modules/</code><span>模块系统</span></div>
        <div class="api-item"><code>Nitro</code><span>服务端引擎</span></div>
        <div class="api-item"><code>app.vue</code><span>入口组件</span></div>
      </div>
    </section>

    <!-- 学习阶段 -->
    <section class="stages">
      <h2>学习阶段（共 3 个）</h2>
      <div class="stage-grid">
        <div
          v-for="s in stages"
          :key="s.id"
          class="stage-card"
          :style="{ borderTopColor: s.color }"
          @click="navigateTo(s.path)"
        >
          <span class="stage-icon">{{ s.icon }}</span>
          <h3>{{ s.title }}</h3>
          <p class="stage-desc">{{ s.desc }}</p>
          <div class="stage-badge" :style="{ background: s.color, color: '#fff' }">
            Stage {{ s.id }}
          </div>
        </div>
      </div>
    </section>

    <!-- 渲染模式对比 -->
    <section class="card">
      <h2>渲染模式对比</h2>
      <div class="compare-table">
        <div class="compare-header">
          <span>维度</span><span>CSR (SPA)</span><span>SSR</span><span>SSG</span>
        </div>
        <div class="compare-row"><span>首屏速度</span><span>慢</span><span>快</span><span>最快</span></div>
        <div class="compare-row"><span>SEO</span><span>差</span><span>好</span><span>最好</span></div>
        <div class="compare-row"><span>服务器负载</span><span>无</span><span>高</span><span>无</span></div>
        <div class="compare-row"><span>实时性</span><span>实时</span><span>实时</span><span>构建时</span></div>
        <div class="compare-row"><span>适用场景</span><span>后台系统</span><span>C端/内容站</span><span>博客/文档</span></div>
      </div>
    </section>

    <!-- Nuxt 3 目录结构 -->
    <section class="card">
      <h2>Nuxt 3 典型目录结构</h2>
      <pre class="tree-block">
nuxt-app/
├── pages/          # 文件系统路由（自动生成路由）
│   ├── index.vue   # → /
│   ├── about.vue   # → /about
│   └── posts/
│       └── [id].vue # → /posts/:id
├── components/     # 自动导入的组件
├── composables/    # 自动导入的组合式函数
├── server/         # Nitro 服务端 API
│   └── api/
│       └── hello.ts # → /api/hello
├── middleware/     # 路由中间件
├── plugins/        # 插件（Vue 插件、第三方库注册）
├── public/         # 静态资源（直接映射到根路径）
├── assets/         # 需要构建处理的资源（CSS、图片等）
├── layouts/        # 页面布局
├── nuxt.config.ts  # Nuxt 配置文件
└── app.vue         # 应用入口（可选）</pre>
    </section>
  </div>
</template>

<style scoped>
.nuxt-index {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}
.page-header h1 { font-size: 28px; color: #1a1a1a; margin: 0 0 8px; }
.subtitle { color: #666; font-size: 14px; }
.subtitle code { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; font-size: 13px; }

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.card h2 { margin: 0 0 16px; font-size: 18px; color: #333; }

.api-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.api-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}
.api-item code { font-size: 13px; color: #00dc82; font-weight: 500; }
.api-item span { font-size: 12px; color: #999; }

.stages h2 { margin: 0 0 16px; font-size: 18px; color: #333; }
.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stage-card {
  position: relative;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-top: 3px solid;
  border-radius: 10px;
  padding: 20px 16px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
}
.stage-card:hover { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); transform: translateY(-2px); }
.stage-icon { font-size: 28px; }
.stage-card h3 { margin: 10px 0 6px; font-size: 15px; color: #333; }
.stage-desc { font-size: 12px; color: #999; line-height: 1.5; margin: 0; }
.stage-badge { position: absolute; top: 10px; right: 10px; font-size: 11px; padding: 2px 8px; border-radius: 10px; }

.compare-table {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
}
.compare-header, .compare-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.5fr 1.5fr;
  padding: 10px 16px;
  font-size: 13px;
}
.compare-header { background: #f5f7fa; font-weight: 600; color: #333; }
.compare-row { border-top: 1px solid #ebeef5; color: #666; }

.tree-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 20px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
  margin: 0;
}

@media (max-width: 768px) {
  .api-grid { grid-template-columns: repeat(3, 1fr); }
  .stage-grid { grid-template-columns: 1fr; }
  .compare-header, .compare-row { grid-template-columns: 1fr 1fr 1fr 1fr; font-size: 11px; }
}
</style>
