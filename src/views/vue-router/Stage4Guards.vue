<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { message, Modal } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()

// ===== 模拟登录状态 =====
const isLoggedIn = ref(false)
const username = ref('')

function mockLogin() {
  isLoggedIn.value = true
  username.value = 'admin'
  message.success('登录成功！现在可以访问管理后台')
}

function mockLogout() {
  isLoggedIn.value = false
  username.value = ''
  message.info('已退出登录')
}

// ===== 组件内守卫演示 =====
const formDirty = ref(false)
const leaveLog = ref<string[]>([])

// onBeforeRouteLeave：离开当前页面前触发
onBeforeRouteLeave((to, from) => {
  leaveLog.value.unshift(`⏱ ${new Date().toLocaleTimeString()} 离开 → ${String(to.name)}`)
  if (leaveLog.value.length > 8) leaveLog.value.pop()

  if (formDirty.value) {
    Modal.confirm({
      title: '表单未保存',
      content: '你有未保存的更改，确定离开吗？',
      okText: '确定离开',
      cancelText: '留在页面',
      onOk: () => {
        // 返回 true 或不返回 = 允许导航
      },
    })
    return false // 阻止导航，等用户确认
  }
  // 不返回或返回 true：允许导航
})

// onBeforeRouteUpdate：路由参数变化但组件复用时触发
onBeforeRouteUpdate((to, from) => {
  leaveLog.value.unshift(`🔄 ${new Date().toLocaleTimeString()} 参数变化 ${String(from.name)} → ${String(to.name)}`)
  if (leaveLog.value.length > 8) leaveLog.value.pop()
})

// ===== 模拟受保护页面跳转 =====
function goToAdmin() {
  if (!isLoggedIn.value) {
    message.warning('请先登录再访问管理后台')
    return
  }
  router.push('/vue-router/stage4/admin')
}

// 守卫类型对比表格
const guardColumns = [
  { title: '守卫类型', dataIndex: 'type', key: 'type', width: 120 },
  { title: 'API', dataIndex: 'api', key: 'api' },
  { title: '触发时机', dataIndex: 'timing', key: 'timing' },
  { title: '常用场景', dataIndex: 'scene', key: 'scene' },
]
const guardData = [
  {
    type: '全局前置',
    api: 'router.beforeEach',
    timing: '任何导航前',
    scene: '登录鉴权、权限检查',
  },
  {
    type: '全局解析',
    api: 'router.beforeResolve',
    timing: '组件解析后、导航确认前',
    scene: '全局数据预加载',
  },
  {
    type: '全局后置',
    api: 'router.afterEach',
    timing: '导航完成后',
    scene: '页面标题更新、埋点',
  },
  {
    type: '路由独享',
    api: 'beforeEnter',
    timing: '进入该路由前',
    scene: '特定页面权限',
  },
  {
    type: '组件内更新',
    api: 'onBeforeRouteUpdate',
    timing: '路由变化但组件复用',
    scene: 'params 变化时重新获取数据',
  },
  {
    type: '组件内离开',
    api: 'onBeforeRouteLeave',
    timing: '离开当前组件前',
    scene: '表单未保存提示',
  },
]
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 4：导航守卫</h1>
      <p>掌握全局守卫、路由独享守卫、组件内守卫和登录鉴权模拟。</p>
    </header>

    <!-- 4.1 守卫全景图 -->
    <section class="card">
      <h2>4.1 导航守卫全景</h2>
      <p>导航守卫是 Vue Router 提供的**路由拦截机制**，按作用范围分为三个层级。</p>
      <div class="guard-flow">
        <div class="flow-step global">beforeEach<br /><small>全局前置</small></div>
        <span class="flow-arrow">→</span>
        <div class="flow-step route">beforeEnter<br /><small>路由独享</small></div>
        <span class="flow-arrow">→</span>
        <div class="flow-step comp">组件内守卫<br /><small>beforeRouteUpdate / beforeRouteLeave</small></div>
        <span class="flow-arrow">→</span>
        <div class="flow-step global">beforeResolve<br /><small>全局解析</small></div>
        <span class="flow-arrow">→</span>
        <div class="flow-step end">afterEach<br /><small>全局后置</small></div>
      </div>
      <p style="margin-top: 12px">
        ⚠️ Vue Router 5.x 守卫中使用 <strong>返回值</strong> 控制导航（<code>false</code> 取消、 路径字符串/对象
        重定向），不再依赖 <code>next()</code> 回调。
      </p>
    </section>

    <!-- 4.2 全局守卫 -->
    <section class="card">
      <h2>4.2 全局守卫</h2>
      <p>在 <code>createRouter</code> 后通过 <code>router.beforeEach</code> 等注册，对所有路由生效。</p>
      <pre class="code-block">
// ✅ 5.x 推荐：返回值控制
router.beforeEach((to, from) => {
  // 返回 false 取消导航
  if (!isLoggedIn && to.meta.requiresAuth) {
    return '/login'  // 重定向到登录页
  }
  // 不返回或返回 undefined/true：放行
})

// afterEach 没有返回值，无法控制导航
router.afterEach((to, from) => {
  document.title = to.meta.title || '默认标题'
})</pre
      >

      <a-table
        :columns="guardColumns"
        :data-source="guardData"
        :pagination="false"
        size="small"
        style="margin-top: 12px"
      />
    </section>

    <!-- 4.3 登录鉴权模拟 -->
    <section class="card">
      <h2>4.3 登录鉴权模拟</h2>

      <div class="demo-box">
        <div v-if="isLoggedIn" class="auth-status logged-in">
          <span
            >✅ 已登录：<strong>{{ username }}</strong></span
          >
          <a-button size="small" @click="mockLogout">退出登录</a-button>
        </div>
        <div v-else class="auth-status logged-out">
          <span>❌ 未登录</span>
          <a-button type="primary" size="small" @click="mockLogin">模拟登录</a-button>
        </div>

        <div style="margin-top: 12px">
          <a-button :type="isLoggedIn ? 'primary' : 'dashed'" @click="goToAdmin"> 访问管理后台 </a-button>
          <span style="margin-left: 8px; font-size: 12px; color: #999"> （未登录将提示先登录） </span>
        </div>
      </div>

      <pre class="code-block" style="margin-top: 12px">
// src/router/index.ts 中配置全局前置守卫
router.beforeEach((to, from) => {
  const isLoggedIn = useAuthStore().isLoggedIn

  if (to.meta.requiresAuth && !isLoggedIn) {
    // 返回登录路径 → 自动重定向
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  // 返回 true / undefined → 放行
})</pre
      >
    </section>

    <!-- 4.4 组件内守卫 -->
    <section class="card">
      <h2>4.4 组件内守卫（Composition API）</h2>
      <p>在组件中使用 <code>onBeforeRouteLeave</code> 和 <code>onBeforeRouteUpdate</code>。</p>

      <div class="demo-box">
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px">
          <span style="font-size: 13px">模拟表单已修改：</span>
          <a-switch v-model:checked="formDirty" />
          <span v-if="formDirty" style="color: #fa541c; font-size: 12px"> ⚡ 离开此页面将弹出确认提示 </span>
          <span v-else style="color: #52c41a; font-size: 12px"> ✓ 可自由离开 </span>
        </div>
        <a-space>
          <RouterLink to="/">← 返回首页（测试离开守卫）</RouterLink>
        </a-space>
      </div>

      <pre class="code-block">
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteLeave((to, from) => {
  if (formDirty.value) {
    const answer = confirm('未保存，确定离开？')
    if (!answer) return false  // 阻止离开
  }
  // 返回 true / undefined → 允许离开
})

onBeforeRouteUpdate((to, from) => {
  // 参数变化时重新获取数据
  if (to.params.id !== from.params.id) {
    fetchData(to.params.id)
  }
})</pre
      >
    </section>

    <!-- 离开日志 -->
    <section class="card">
      <h2>守卫触发日志</h2>
      <div class="log-panel">
        <div v-for="(log, i) in leaveLog" :key="i" class="log-line">{{ log }}</div>
        <div v-if="leaveLog.length === 0" style="color: #ccc; font-size: 13px">切换子路由或离开页面时记录...</div>
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

/* 守卫流程图 */
.guard-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  margin: 16px 0;
}

.flow-step {
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 12px;
  text-align: center;
  font-weight: 600;
}

.flow-step.global {
  background: #e6f4ff;
  color: #1677ff;
  border: 1px solid #bae0ff;
}

.flow-step.route {
  background: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.flow-step.comp {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.flow-step.end {
  background: #f9f0ff;
  color: #722ed1;
  border: 1px solid #d3adf7;
}

.flow-step small {
  font-weight: 400;
  opacity: 0.8;
  display: block;
  margin-top: 2px;
}

.flow-arrow {
  font-size: 16px;
  color: #bbb;
  font-weight: bold;
}

/* 登录状态 */
.auth-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
}

.logged-in {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
}

.logged-out {
  background: #fff2f0;
  border: 1px solid #ffccc7;
}

.log-panel {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 12px 16px;
  max-height: 200px;
  overflow-y: auto;
}

.log-line {
  font-size: 12px;
  color: #888;
  padding: 4px 0;
  border-bottom: 1px solid #e8e8e8;
  font-family: 'Courier New', monospace;
}
</style>
