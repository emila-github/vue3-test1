<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()

// ===== 路由元信息示例 =====
const metaCode = `// 路由配置
{ path: '/admin', component: Admin, meta: { requiresAuth: true, roles: ['admin'] } }

// 守卫中访问
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn) {
    return '/login'
  }
})

// 组件中访问
const route = useRoute()
console.log(route.meta.requiresAuth)  // true`

// ===== 滚动行为 =====
const scrollCode = `const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 有保存位置（浏览器前进/后退）→ 恢复
    if (savedPosition) return savedPosition

    // 带 hash → 滚动到锚点
    if (to.hash) return { el: to.hash, behavior: 'smooth' }

    // 始终滚到顶部
    return { top: 0 }
  },
})`

// ===== 懒加载 =====
const lazyCode = `// ❌ 同步导入：所有页面打包在一起
import HomeView from '../views/HomeView.vue'

// ✅ 懒加载：按路由拆包，访问时才下载
const HomeView = () => import('../views/HomeView.vue')

// 命名 chunk（方便调试）
const Admin = () => import(
  /* webpackChunkName: "admin" */
  '../views/Admin.vue'
)

// 分组打包（相同 chunkName 合并）
const Stage1 = () => import(
  /* webpackChunkName: "vue-router-demo" */
  '../views/vue-router/Stage1.vue'
)`

// ===== 动态添加路由 =====
const dynamicRoutes = ref<string[]>([])

function addDynamicRoute() {
  const name = `dynamic-${Date.now()}`
  const path = `/dynamic/${dynamicRoutes.value.length + 1}`
  router.addRoute({
    path,
    name,
    component: () => import('./DynamicPage.vue'),
  })
  dynamicRoutes.value.push(path)
  message.success(`已动态添加路由: ${path}`)
}

function addNestedDynamic() {
  router.addRoute('vue-router-stage5', {
    path: `nested-${Date.now()}`,
    component: () => import('./DynamicPage.vue'),
  })
  message.success('已动态添加子路由到当前页面')
}

function goToDynamic(i: number) {
  const path = dynamicRoutes.value[i]
  if (path) router.push(path)
}

// ===== 导航结果处理 =====
async function demoNavigationFailure() {
  try {
    await router.push('/non-existent-page')
  } catch (failure: any) {
    message.info(`导航失败（预期行为）: ${failure.message || '路由不存在'}`)
  }
}

function demoRedirect() {
  router.push('/vue-router/stage5?from=demo')
  message.info('重定向演示：注意 URL 变化')
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 5：进阶特性</h1>
      <p>掌握路由元信息、滚动行为、懒加载、过渡动画和动态路由。</p>
    </header>

    <!-- 5.1 路由元信息 -->
    <section class="card">
      <h2>5.1 路由元信息（meta）</h2>
      <p><code>meta</code> 是路由配置中的自定义数据字段，常用于存储权限、标题、图标等附加信息。</p>
      <pre class="code-block">{{ metaCode }}</pre>
    </section>

    <!-- 5.2 滚动行为 -->
    <section class="card">
      <h2>5.2 滚动行为（scrollBehavior）</h2>
      <p>控制导航后页面的滚动位置，支持平滑滚动和锚点定位。</p>
      <pre class="code-block">{{ scrollCode }}</pre>
    </section>

    <!-- 5.3 懒加载与代码分割 -->
    <section class="card">
      <h2>5.3 懒加载与代码分割</h2>
      <p>使用动态 <code>import()</code> 实现按路由拆分代码，减少首屏加载体积。</p>
      <pre class="code-block">{{ lazyCode }}</pre>
      <div class="tip-box">
        <strong>最佳实践：</strong>
        <ul>
          <li>所有页面路由都使用懒加载（首页除外）</li>
          <li>使用 <code>/* webpackChunkName */</code> 或 <code>/* vite */</code> 注释命名 chunk</li>
          <li>相关页面用同一 chunkName 合并打包</li>
        </ul>
      </div>
    </section>

    <!-- 5.4 过渡动画 -->
    <section class="card">
      <h2>5.4 路由过渡动画</h2>
      <p>使用 Vue 的 <code>&lt;Transition&gt;</code> 包裹 <code>&lt;RouterView&gt;</code> 实现页面切换动画。</p>
      <pre class="code-block">
&lt;RouterView v-slot="{{ '{' }} Component, route {{ '}' }}"&gt;
  &lt;Transition :name="route.meta.transition || 'fade'"&gt;
    &lt;component :is="Component" /&gt;
  &lt;/Transition&gt;
&lt;/RouterView&gt;

// CSS
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}</pre
      >
    </section>

    <!-- 5.5 动态路由 -->
    <section class="card">
      <h2>5.5 动态路由（addRoute / removeRoute）</h2>
      <p>运行时动态添加或删除路由，适合权限管理场景（不同角色看到不同菜单）。</p>

      <div class="demo-box">
        <h4>动态路由演示：</h4>
        <a-space>
          <a-button @click="addDynamicRoute">添加根路由</a-button>
          <a-button @click="addNestedDynamic">添加子路由</a-button>
          <a-button v-for="(p, i) in dynamicRoutes" :key="p" size="small" @click="goToDynamic(i)">
            访问 {{ p }}
          </a-button>
        </a-space>
        <div v-if="dynamicRoutes.length > 0" style="margin-top: 8px; font-size: 13px; color: #52c41a">
          已添加 {{ dynamicRoutes.length }} 个动态路由
        </div>
      </div>

      <pre class="code-block" style="margin-top: 12px">
// 添加顶级路由
router.addRoute({ path: '/new-page', component: NewPage })

// 添加子路由（第二个参数是父路由 name）
router.addRoute('parent-name', {
  path: 'child',
  component: ChildPage,
})

// 删除路由
router.removeRoute('route-name')

// 检查路由是否存在
router.hasRoute('route-name')  // boolean

// 获取所有路由
router.getRoutes()  // RouteRecordNormalized[]</pre
      >
    </section>

    <!-- 5.6 导航故障处理 -->
    <section class="card">
      <h2>5.6 导航故障处理</h2>
      <p><code>router.push</code> 返回 Promise，可以用 try/catch 捕获导航失败。</p>

      <div class="demo-box">
        <a-space>
          <a-button danger @click="demoNavigationFailure">触发导航失败</a-button>
          <a-button @click="demoRedirect">试试重定向</a-button>
        </a-space>
      </div>

      <pre class="code-block" style="margin-top: 12px">
import { isNavigationFailure, NavigationFailureType } from 'vue-router'

try {
  await router.push('/admin')
} catch (failure) {
  if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
    // 被守卫拦截，可忽略
  } else if (isNavigationFailure(failure, NavigationFailureType.cancelled)) {
    // 新的导航替代了本次导航
  } else {
    // 其他错误
  }
}</pre
      >
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
</style>
