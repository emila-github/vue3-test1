<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()

// 记录导航历史（纯前端演示）
const historyLog = ref<string[]>([])

function goToAbout() {
  router.push('/about')
  historyLog.value.push(`push('/about') → 跳转到关于页面`)
}

function goBack() {
  router.back()
  historyLog.value.push('back() → 返回上一页')
}

function goForward() {
  router.forward()
  historyLog.value.push('forward() → 前进到下一页')
}

function replaceHome() {
  router.replace({ path: '/vue-router/stage1', query: { from: 'replace' } })
  historyLog.value.push('replace() → 替换当前历史记录')
}

function pushWithQuery() {
  router.push({ path: '/vue-router/stage1', query: { tab: 'demo', ts: Date.now() } })
  historyLog.value.push(`push({ query: { tab: 'demo' } }) → 带查询参数跳转`)
}

function goByName() {
  router.push({ name: 'vue-router-stage1', query: { via: 'name' } })
  historyLog.value.push(`push({ name: 'vue-router-stage1' }) → 命名路由跳转`)
}

function clearLog() {
  historyLog.value = []
  message.success('日志已清除')
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 1：快速上手</h1>
      <p>掌握路由器创建、路由配置、RouterLink / RouterView 和编程式导航。</p>
    </header>

    <!-- 1.1 创建路由实例 -->
    <section class="card">
      <h2>1.1 创建路由实例</h2>
      <p>
        Vue Router 5.x 使用 <code>createRouter</code> 创建实例，通过
        <code>createWebHistory</code>（HTML5 模式）或
        <code>createWebHashHistory</code>（Hash 模式）指定历史模式。
      </p>
      <pre class="code-block">
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 路由配置...
  ],
})

export default router</pre>
      <div class="tip-box">
        <strong>两种模式对比：</strong>
        <ul>
          <li><code>createWebHistory</code> — URL 干净无 #，需服务器配置 SPA 回退</li>
          <li><code>createWebHashHistory</code> — URL 带 #，无需服务器配置，适合静态部署</li>
        </ul>
      </div>
    </section>

    <!-- 1.2 RouterLink 和 RouterView -->
    <section class="card">
      <h2>1.2 RouterLink 和 RouterView</h2>
      <p>
        <code>RouterLink</code> 生成 &lt;a&gt; 标签实现声明式导航，
        <code>RouterView</code> 作为路由组件的渲染出口。
      </p>

      <div class="demo-box">
        <h4>声明式导航（点击下方链接）：</h4>
        <a-space>
          <RouterLink to="/" class="demo-link">首页</RouterLink>
          <RouterLink to="/about" class="demo-link">关于</RouterLink>
          <RouterLink to="/vue-router/stage1?tab=hello" class="demo-link">
            本页（带 query）
          </RouterLink>
        </a-space>
      </div>

      <pre class="code-block">
&lt;template&gt;
  &lt;nav&gt;
    &lt;RouterLink to="/"&gt;首页&lt;/RouterLink&gt;
    &lt;RouterLink to="/about"&gt;关于&lt;/RouterLink&gt;
  &lt;/nav&gt;

  &lt;!-- 路由组件在此渲染 --&gt;
  &lt;RouterView /&gt;
&lt;/template&gt;</pre>
    </section>

    <!-- 1.3 编程式导航 -->
    <section class="card">
      <h2>1.3 编程式导航：useRouter()</h2>
      <p>
        在 Composition API 中通过 <code>useRouter()</code> 获取路由实例，
        使用 <code>push</code>、<code>replace</code>、<code>back</code>、<code>forward</code> 进行编程式导航。
      </p>

      <div class="demo-box">
        <h4>编程式导航演示：</h4>
        <a-space wrap>
          <a-button type="primary" @click="goToAbout">push('/about')</a-button>
          <a-button @click="pushWithQuery">push + query</a-button>
          <a-button @click="goByName">命名路由跳转</a-button>
          <a-button type="dashed" @click="replaceHome">replace()</a-button>
          <a-button @click="goBack">back()</a-button>
          <a-button @click="goForward">forward()</a-button>
        </a-space>
      </div>

      <pre class="code-block">
import { useRouter } from 'vue-router'

const router = useRouter()

// 字符串路径
router.push('/about')

// 路径 + query
router.push({ path: '/about', query: { tab: 'info' } })

// 命名路由
router.push({ name: 'about', params: { id: '123' } })

// 替换当前历史记录（不可后退）
router.replace('/about')

// 历史栈导航
router.back()     // 后退一步
router.forward()  // 前进一步
router.go(-2)     // 后退两步</pre>
    </section>

    <!-- 1.4 useRoute() -->
    <section class="card">
      <h2>1.4 响应式路由信息：useRoute()</h2>
      <p>
        <code>useRoute()</code> 返回当前路由的响应式引用，包含 <code>path</code>、<code>params</code>、
        <code>query</code>、<code>name</code>、<code>meta</code> 等属性。
      </p>
      <pre class="code-block">
import { useRoute } from 'vue-router'

const route = useRoute()

// 响应式地访问路由信息
console.log(route.path)       // 当前路径
console.log(route.params.id)  // 路径参数
console.log(route.query.tab)  // 查询参数
console.log(route.name)       // 路由名称
console.log(route.meta)       // 路由元信息</pre>
      <div class="tip-box">
        <strong>当前路由信息：</strong>
        <ul>
          <li>路径 path：<code>{{ route.path }}</code></li>
          <li>名称 name：<code>{{ route.name }}</code></li>
          <li>查询 query：<code>{{ JSON.stringify(route.query) }}</code></li>
          <li>参数 params：<code>{{ JSON.stringify(route.params) }}</code></li>
        </ul>
      </div>
    </section>

    <!-- 导航历史日志 -->
    <section class="card">
      <h2>导航日志</h2>
      <div v-if="historyLog.length === 0" style="color: #999; font-size: 13px;">
        点击上方按钮记录导航操作...
      </div>
      <div v-else>
        <div v-for="(log, i) in historyLog" :key="i" class="log-item">
          <span class="log-num">{{ i + 1 }}</span>
          <span>{{ log }}</span>
        </div>
        <a-button size="small" danger @click="clearLog" style="margin-top: 8px">
          清除日志
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

.demo-box {
  background: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
}

.demo-box h4 {
  margin: 0 0 10px;
  font-size: 13px;
  color: #999;
  font-weight: 400;
}

.demo-link {
  color: #1677ff;
  text-decoration: none;
  padding: 4px 12px;
  background: #e6f4ff;
  border-radius: 4px;
  font-size: 13px;
  transition: background 0.2s;
}

.demo-link:hover {
  background: #bae0ff;
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

.log-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
  color: #555;
}

.log-num {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e6f4ff;
  color: #1677ff;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
}
</style>
