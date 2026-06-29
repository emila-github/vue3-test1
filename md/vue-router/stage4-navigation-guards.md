# Stage 4：导航守卫

## 学习目标

- 理解导航守卫的执行顺序
- 使用全局守卫实现登录鉴权
- 使用路由独享守卫保护特定页面
- 使用组件内守卫处理离开确认和参数变化

## 守卫执行流程

```
全局 beforeEach
  → 路由独享 beforeEnter
    → 组件内 beforeRouteUpdate / beforeRouteLeave
      → 全局 beforeResolve
        → 导航确认
          → 全局 afterEach
```

## Vue Router 5.x 守卫新规

5.x 中导航守卫**通过返回值控制导航**，不再依赖 `next()` 回调。

```ts
// ✅ 5.x 写法
router.beforeEach((to, from) => {
  if (!isLoggedIn && to.meta.requiresAuth) {
    return '/login'  // 重定向到登录页
  }
  // 不返回 = 放行
})

// ❌ 旧版写法（已废弃）
router.beforeEach((to, from, next) => {
  if (!isLoggedIn) next('/login')
  else next()
})
```

| 返回值 | 效果 |
|--------|------|
| `undefined` / `true` / 无返回值 | 允许导航 |
| `false` | 取消当前导航 |
| 字符串路径（如 `'/login'`） | 重定向到该路径 |
| 路由对象（如 `{ name: 'login' }`） | 重定向到命名路由 |

## 全局守卫

### beforeEach — 全局前置守卫

最常用的守卫，适合登录鉴权、权限检查。

```ts
// src/router/index.ts
import { createRouter } from 'vue-router'

const router = createRouter({ ... })

router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  // 需要登录才能访问
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // 重定向到登录，并记录原目标路径
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

export default router
```

### beforeResolve — 全局解析守卫

在所有组件内守卫和异步路由组件被解析之后调用。

```ts
router.beforeResolve(async (to) => {
  // 适合：全局数据预加载
  if (to.meta.loadData) {
    await fetchGlobalData()
  }
})
```

### afterEach — 全局后置守卫

导航完成后触发，**无法改变导航**，适合埋点、页面标题。

```ts
router.afterEach((to) => {
  document.title = (to.meta.title as string) || '默认标题'
  // 埋点上报
  analytics.pageView(to.fullPath)
})
```

## 路由独享守卫：beforeEnter

只在进入特定路由时触发，定义在路由配置中。

```ts
const routes = [
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from) => {
      // 只在进入 /admin 时检查
      if (!isAdmin()) return '/403'
    },
  },
]
```

beforeEnter 支持数组，按顺序执行：

```ts
beforeEnter: [checkAuth, checkRole, checkSubscription]
```

## 组件内守卫（Composition API）

### onBeforeRouteLeave — 离开当前组件

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const formDirty = ref(false)

onBeforeRouteLeave((to, from) => {
  if (formDirty.value) {
    const answer = confirm('表单未保存，确定离开吗？')
    if (!answer) return false  // 阻止离开
  }
})
</script>
```

### onBeforeRouteUpdate — 路由参数变化

当路由改变但同一个组件被复用时触发（如 `/user/1` → `/user/2`）。

```vue
<script setup lang="ts">
import { onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteUpdate((to, from) => {
  // 参数变化时重新获取数据
  if (to.params.id !== from.params.id) {
    fetchUser(to.params.id)
  }
})
</script>
```

> ⚠️ 注意：Vue Router 5.x 的守卫已移除 Options API 写法（`beforeRouteEnter` 等），统一使用 Composition API 的 `onBeforeRouteLeave` / `onBeforeRouteUpdate`。

## 登录鉴权完整示例

```ts
// router/index.ts
router.beforeEach((to, from) => {
  const auth = useAuthStore()

  // 白名单：不需要登录的页面
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !auth.isLoggedIn) {
    // 保存目标路径，登录后跳回
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  // 已登录用户访问登录页 → 跳转首页
  if (to.path === '/login' && auth.isLoggedIn) {
    return '/'
  }
})
```

### 登录成功后跳回原页面

```ts
// Login.vue
async function handleLogin() {
  await authStore.login(username, password)
  const redirect = route.query.redirect as string
  router.push(redirect || '/')
}
```

## 常见陷阱

1. **在守卫中执行异步操作忘了 await**：守卫支持 async/await，会等待 Promise 完成。
2. **守卫返回 false 与 return 的区别**：`return false` 取消导航；什么都不返回表示放行。
3. **infinite redirect loop**：检查重定向逻辑，确保不会在 `/login` 和 `/login?redirect=/login` 之间死循环。

## 示例页面

打开 `/vue-router/stage4` 查看守卫流程演示、登录鉴权模拟和组件内离开确认。
