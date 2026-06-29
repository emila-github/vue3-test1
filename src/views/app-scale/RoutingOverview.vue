<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToVueRouter() {
  router.push('/vue-router')
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>路由</h1>
      <p>客户端路由是 SPA 的核心，Vue 官方提供 <code>vue-router</code> 实现页面无刷新切换。</p>
    </header>

    <!-- SPA 路由概念 -->
    <section class="card">
      <h2>为什么需要客户端路由？</h2>
      <p>
        传统多页面应用（MPA）每次导航都需要重新加载整个页面。SPA 通过客户端路由
        实现<strong>页面内容动态切换而不刷新浏览器</strong>，提供接近原生应用的流畅体验。
      </p>
      <div class="concept-compare">
        <div class="concept-box bad">
          <h4>❌ MPA（多页面）</h4>
          <ul>
            <li>每次点击加载整页</li>
            <li>白屏时间长</li>
            <li>状态丢失</li>
            <li>带宽消耗大</li>
          </ul>
        </div>
        <div class="concept-box good">
          <h4>✅ SPA + 路由</h4>
          <ul>
            <li>页面内容动态替换</li>
            <li>无白屏闪烁</li>
            <li>状态保持</li>
            <li>按需加载</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 路由原理 -->
    <section class="card">
      <h2>Vue Router 核心概念</h2>

      <div class="core-grid">
        <div class="core-item">
          <span class="core-num">1</span>
          <div>
            <strong>路由表 (Routes)</strong>
            <p>定义 URL 路径到组件的映射关系</p>
          </div>
        </div>
        <div class="core-item">
          <span class="core-num">2</span>
          <div>
            <strong>RouterView</strong>
            <p>路由组件的渲染出口，匹配到的组件在此显示</p>
          </div>
        </div>
        <div class="core-item">
          <span class="core-num">3</span>
          <div>
            <strong>RouterLink</strong>
            <p>声明式导航链接，生成 &lt;a&gt; 标签</p>
          </div>
        </div>
        <div class="core-item">
          <span class="core-num">4</span>
          <div>
            <strong>History 模式</strong>
            <p>URL 干净无 # 号（需服务器配合）</p>
          </div>
        </div>
      </div>

      <pre class="code-block">// 路由配置示例
const routes = [
  { path: '/',         component: HomeView },
  { path: '/about',    component: AboutView },
  { path: '/user/:id', component: UserView },  // 动态路由
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})</pre>
    </section>

    <!-- 5.x 关键特性 -->
    <section class="card">
      <h2>Vue Router 5.x 关键特性</h2>
      <a-table
        :columns="[
          { title: '特性', dataIndex: 'feature', key: 'feature' },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="[
          { feature: 'Composition API', desc: 'useRouter() / useRoute() 替代 this.$router' },
          { feature: '导航守卫返回值', desc: '返回 false / 路径字符串替代 next() 回调' },
          { feature: '动态路由', desc: '路径参数 :id、查询参数 ?key=val' },
          { feature: '嵌套路由', desc: 'children 子路由 + 嵌套 RouterView' },
          { feature: '导航守卫', desc: '全局/路由级/组件级 三层守卫' },
          { feature: '懒加载', desc: '动态 import() 实现路由级代码分割' },
          { feature: '路由元信息', desc: 'meta 字段存储权限、标题等附加信息' },
          { feature: '类型安全', desc: '配合 unplugin-vue-router 实现类型推导' },
        ]"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- 链接到详细教程 -->
    <section class="card cta-card">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px">
        <div>
          <h2 style="margin: 0 0 4px">深入学习 Vue Router</h2>
          <p style="margin: 0; color: #888">5 阶段完整教程：快速上手 → 动态路由 → 嵌套路由 → 导航守卫 → 进阶特性</p>
        </div>
        <a-button type="primary" size="large" @click="goToVueRouter">
          进入 Vue Router 教程 →
        </a-button>
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

.page-header p code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
  color: #d63384;
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

.concept-compare {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.concept-box {
  border-radius: 8px;
  padding: 16px;
}

.concept-box.bad {
  background: #fff1f0;
  border: 1px solid #ffa39e;
}

.concept-box.good {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
}

.concept-box h4 {
  margin: 0 0 8px;
  font-size: 14px;
}

.concept-box ul {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: #555;
}

.concept-box li {
  margin-bottom: 4px;
}

.core-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.core-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.core-num {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e6f4ff;
  color: #1677ff;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 700;
}

.core-item strong {
  font-size: 14px;
  color: #333;
}

.core-item p {
  font-size: 12px;
  color: #999;
  margin: 2px 0 0;
}

.cta-card {
  border: 2px solid #e6f4ff;
  background: #fafcff;
}

@media (max-width: 640px) {
  .concept-compare,
  .core-grid {
    grid-template-columns: 1fr;
  }
}
</style>
