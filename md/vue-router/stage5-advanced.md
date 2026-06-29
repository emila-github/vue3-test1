# Stage 5：进阶特性

## 学习目标

- 使用 `meta` 存储路由元信息
- 配置 `scrollBehavior` 控制滚动行为
- 理解懒加载与代码分割
- 实现路由过渡动画
- 掌握动态路由 `addRoute` / `removeRoute`

## 路由元信息（meta）

`meta` 是路由配置中的自定义字段，可存储任意数据。

```ts
const routes = [
  {
    path: '/admin',
    component: Admin,
    meta: {
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      title: '管理后台',
      icon: 'SettingOutlined',
      keepAlive: true,
    },
  },
]
```

### 在守卫中使用

```ts
router.beforeEach((to) => {
  // 权限检查
  if (to.meta.requiresAuth && !isLoggedIn) return '/login'
  // 角色检查
  if (to.meta.roles && !to.meta.roles.includes(userRole)) return '/403'
})
```

### 在组件中使用

```ts
const route = useRoute()
console.log(route.meta.title)  // '管理后台'
```

### 典型用途

| meta 字段 | 用途 |
|-----------|------|
| `requiresAuth` | 标记需要登录 |
| `roles` | 角色权限控制 |
| `title` | 动态页面标题 |
| `keepAlive` | 控制是否缓存组件 |
| `icon` | 侧边栏图标 |
| `transition` | 指定过渡动画名称 |
| `breadcrumb` | 面包屑导航文本 |

## 滚动行为（scrollBehavior）

控制导航后页面的滚动位置。

```ts
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 1. 浏览器前进/后退 → 恢复滚动位置
    if (savedPosition) return savedPosition

    // 2. 有 hash 锚点 → 滚动到元素
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }

    // 3. 始终滚到顶部
    return { top: 0 }
  },
})
```

### 延迟滚动（等待页面渲染）

```ts
scrollBehavior(to, from, savedPosition) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ top: 0 }), 300)
  })
}
```

## 懒加载与代码分割

使用动态 `import()` 按路由拆分代码，减小首屏体积。

```ts
// ❌ 同步导入：所有页面打包在一起
import HomeView from '../views/HomeView.vue'

// ✅ 懒加载：按路由拆分为独立 chunk
const AboutView = () => import('../views/AboutView.vue')

// ✅ 命名 chunk（方便调试和分组）
const Stage1 = () => import(
  /* webpackChunkName: "vue-router-demo" */
  '../views/vue-router/Stage1Basic.vue'
)
```

### 打包策略建议

- **首页**：同步导入（首屏必需）
- **其他页面**：全部懒加载
- **同一模块**：共用 `webpackChunkName` 合并打包
- **大型依赖**：单独分包（如编辑器、图表库）

## 路由过渡动画

使用 Vue 的 `<Transition>` 配合 `RouterView` 的插槽实现页面切换动画。

```vue
<template>
  <RouterView v-slot="{ Component, route }">
    <Transition :name="route.meta.transition || 'fade'" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>
```

### `mode="out-in"` 的含义

- `out-in`：旧组件先离开，新组件再进入（推荐）
- `in-out`：新组件先进入，旧组件再离开
- 默认：同时进行

## 动态路由

运行时动态添加、删除路由，适合权限管理场景。

### addRoute

```ts
// 添加顶级路由
router.addRoute({
  path: '/new-page',
  name: 'new-page',
  component: () => import('../views/NewPage.vue'),
})

// 添加子路由（第二个参数是父路由 name）
router.addRoute('admin', {
  path: 'settings',
  component: () => import('../views/admin/Settings.vue'),
})
```

### removeRoute

```ts
// 按名称删除
router.removeRoute('new-page')
```

### 常用方法

```ts
// 检查路由是否存在
router.hasRoute('admin')  // boolean

// 获取所有路由记录
const allRoutes = router.getRoutes()
```

### 典型场景：动态菜单

```ts
// 登录后根据用户权限动态添加路由
async function buildRoutes(userPermissions: string[]) {
  const dynamicRoutes = await generateRoutes(userPermissions)

  for (const route of dynamicRoutes) {
    router.addRoute(route)
  }
}
```

## 导航故障处理

`router.push()` 返回 Promise，可以用 try/catch 捕获导航失败。

```ts
import {
  isNavigationFailure,
  NavigationFailureType,
} from 'vue-router'

try {
  await router.push('/admin')
} catch (failure) {
  if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
    // 被守卫 return false 拦截
    console.log('导航被拦截')
  } else if (isNavigationFailure(failure, NavigationFailureType.cancelled)) {
    // 新的导航替代了本次导航（用户快速连续点击）
    console.log('导航被取消')
  } else if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
    // 导航到当前所在的路由
    console.log('重复导航')
  }
}
```

### NavigationFailureType

| 类型 | 说明 |
|------|------|
| `aborted` | 守卫返回 `false` 中断 |
| `cancelled` | 被新的导航替代 |
| `duplicated` | 导航到当前所在页面 |

## 常见陷阱

1. **动态添加路由后需要手动跳转**：`addRoute` 不会自动导航到新路由。
2. **removeRoute 后路由表不会自动更新**：已渲染的组件不受影响。
3. **scrollBehavior 只在 HTML5 History 模式下生效**：Hash 模式浏览器不支持。

## 示例页面

打开 `/vue-router/stage5` 查看滚动行为、动态路由添加、导航故障处理的交互式演示。
