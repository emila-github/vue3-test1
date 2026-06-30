<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 模拟子导航标签页
const tabs = ref([
  { key: 'profile', label: '个人资料', path: '/vue-router/stage3/profile' },
  { key: 'orders', label: '我的订单', path: '/vue-router/stage3/orders' },
  { key: 'settings', label: '账号设置', path: '/vue-router/stage3/settings' },
])

function goToTab(path: string) {
  router.push(path)
}

// 命名视图演示
const namedViewCode = `{
  path: '/dashboard',
  components: {
    default: DashboardMain,   // 默认视图
    sidebar: DashboardSidebar, // 命名视图
    header: DashboardHeader,   // 命名视图
  },
}

// 模板中
<RouterView />                     ← default
<RouterView name="sidebar" />      ← sidebar
<RouterView name="header" />       ← header`
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 3：嵌套路由与命名视图</h1>
      <p>掌握 children 子路由、嵌套 RouterView、命名视图、重定向与别名。</p>
    </header>

    <!-- 3.1 嵌套路由概念 -->
    <section class="card">
      <h2>3.1 嵌套路由（children）</h2>
      <p>
        当页面有公共布局（如侧边栏 + 主内容区），使用 <code>children</code> 定义子路由。 父组件中放置
        <code>&lt;RouterView /&gt;</code> 作为子路由渲染出口。
      </p>
      <pre class="code-block">
const routes = [
  {
    path: '/user',
    component: UserLayout,     // 父组件，包含公共布局 + &lt;RouterView /&gt;
    children: [
      { path: '', component: UserHome },      // /user
      { path: 'profile', component: Profile }, // /user/profile
      { path: 'orders', component: Orders },   // /user/orders
    ],
  },
]</pre
      >
      <div class="tip-box">
        <strong>关键规则：</strong>
        <ul>
          <li>子路由 <code>path</code> 不需要 <code>/</code> 前缀，会自动拼接父路径</li>
          <li>子路由中 <code>path: ''</code> 代表父路径的默认页面</li>
          <li>子路由可无限嵌套多层</li>
        </ul>
      </div>
    </section>

    <!-- 3.2 嵌套路由演示 -->
    <section class="card">
      <h2>3.2 嵌套路由演示</h2>
      <p>下方是一个模拟用户中心，包含公共顶栏和三个子页面。 注意 URL 变化和面包屑导航。</p>

      <div class="demo-nested">
        <!-- 模拟父组件布局 -->
        <div class="nested-parent">
          <div class="nested-header">
            <strong>👤 用户中心（父组件布局）</strong>
            <span class="nested-breadcrumb"> /user/{{ route.path.split('/').pop() || 'profile' }} </span>
          </div>
          <div class="nested-tabs">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              class="tab-btn"
              :class="{ active: route.path === tab.path }"
              @click="goToTab(tab.path)"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- 子路由渲染区 -->
          <div class="nested-content">
            <div class="child-route-area">
              <RouterView />
            </div>
          </div>
        </div>
      </div>

      <pre class="code-block" style="margin-top: 16px">
// 路由配置（本示例）
{
  path: '/vue-router/stage3',
  component: Stage3Nested,  // ← 父组件（当前页）
  children: [
    {
      path: 'profile',
      component: () => import('./NestedProfile.vue'),
    },
    {
      path: 'orders',
      component: () => import('./NestedOrders.vue'),
    },
    {
      path: 'settings',
      component: () => import('./NestedSettings.vue'),
    },
  ],
}</pre
      >
    </section>

    <!-- 3.3 命名视图 -->
    <section class="card">
      <h2>3.3 命名视图（Named Views）</h2>
      <p>
        同一页面中可以有多个 <code>&lt;RouterView&gt;</code>， 通过 <code>name</code> 属性区分。路由配置中用
        <code>components</code>（复数）替代 <code>component</code>。
      </p>

      <div class="demo-named-view">
        <div class="named-layout">
          <div class="named-header-slot">
            <span>header 命名视图</span>
          </div>
          <div class="named-body">
            <div class="named-sidebar-slot">
              <span>sidebar 命名视图</span>
            </div>
            <div class="named-main-slot">
              <span>default 默认视图</span>
            </div>
          </div>
        </div>
      </div>

      <pre class="code-block">{{ namedViewCode }}</pre>
    </section>

    <!-- 3.4 重定向与别名 -->
    <section class="card">
      <h2>3.4 重定向与别名</h2>
      <div class="two-col">
        <div class="col">
          <h4>重定向 redirect</h4>
          <pre class="code-block mini">
// 字符串路径
{ path: '/old', redirect: '/new' }

// 命名路由
{ path: '/old', redirect: { name: 'home' } }

// 函数（动态判断）
{
  path: '/role/:role',
  redirect: (to) => ({
    path: `/${to.params.role}/dashboard`
  }),
}</pre
          >
        </div>
        <div class="col">
          <h4>别名 alias</h4>
          <pre class="code-block mini">
// 单个别名
{ path: '/', alias: '/home' }

// 多个别名
{ path: '/user', alias: ['/u', '/me'] }

// 带参数的别名
{
  path: '/user/:id',
  alias: '/u/:id'
}</pre
          >
        </div>
      </div>
      <div class="tip-box">
        <strong>redirect vs alias 区别：</strong>
        redirect 会改变 URL；alias 保持原 URL 但渲染同一组件。
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

.code-block.mini {
  font-size: 12px;
  padding: 12px;
}

.tip-box {
  background: #fffbe6;
  border-left: 3px solid #faad14;
  padding: 12px 16px;
  border-radius: 4px;
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

/* 嵌套路由演示 */
.demo-nested {
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  overflow: hidden;
}

.nested-parent {
  background: #fafafa;
}

.nested-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: #1677ff;
  color: #fff;
  font-size: 13px;
}

.nested-breadcrumb {
  font-size: 12px;
  opacity: 0.9;
  font-family: monospace;
}

.nested-tabs {
  display: flex;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 8px;
}

.tab-btn {
  padding: 10px 16px;
  border: none;
  background: none;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-btn.active {
  color: #1677ff;
  border-bottom-color: #1677ff;
}

.tab-btn:hover {
  color: #1677ff;
}

.nested-content {
  padding: 16px;
  min-height: 80px;
}

.child-route-area {
  background: #fff;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  padding: 12px;
  min-height: 60px;
}

/* 命名视图演示 */
.demo-named-view {
  margin: 12px 0;
}

.named-layout {
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  overflow: hidden;
}

.named-header-slot {
  padding: 12px 16px;
  background: #722ed1;
  color: #fff;
  font-size: 12px;
  text-align: center;
}

.named-body {
  display: flex;
}

.named-sidebar-slot {
  width: 120px;
  padding: 20px 12px;
  background: #f9f0ff;
  border-right: 1px solid #efdbff;
  font-size: 12px;
  color: #722ed1;
  text-align: center;
}

.named-main-slot {
  flex: 1;
  padding: 20px;
  background: #fff;
  font-size: 12px;
  color: #999;
  text-align: center;
  min-height: 80px;
}

/* 两栏 */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.two-col h4 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #555;
}

.col {
  background: #fafafa;
  border-radius: 8px;
  padding: 12px;
}

@media (max-width: 640px) {
  .two-col {
    grid-template-columns: 1fr;
  }
}
</style>
