# Stage 1：快速上手

## 学习目标

- 使用 `createRouter` 创建路由实例
- 理解 `createWebHistory` vs `createWebHashHistory`
- 使用 `RouterLink` 声明式导航和 `RouterView` 渲染出口
- 掌握 `useRouter()` 编程式导航和 `useRoute()` 获取路由信息

## 创建路由实例

Vue Router 5.x 通过 `createRouter` 创建实例，第一个参数是配置对象。

```ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
  ],
})

export default router
```

### 两种 History 模式

| 模式 | API | URL 示例 | 服务器要求 |
|------|-----|---------|-----------|
| HTML5 History | `createWebHistory()` | `/about` | 需配置 SPA 回退 |
| Hash | `createWebHashHistory()` | `/#/about` | 无需配置 |

> 本项目使用 `createWebHistory`，Vite dev server 内置 SPA 回退。

## RouterLink 声明式导航

`RouterLink` 渲染为 `<a>` 标签，是声明式导航的主要方式。

```vue
<template>
  <nav>
    <RouterLink to="/">首页</RouterLink>
    <RouterLink to="/about">关于</RouterLink>
    <!-- 带 query 参数 -->
    <RouterLink :to="{ path: '/search', query: { q: 'vue' } }">搜索</RouterLink>
    <!-- 命名路由 -->
    <RouterLink :to="{ name: 'about' }">关于（命名）</RouterLink>
  </nav>
  <!-- 路由组件在此渲染 -->
  <RouterView />
</template>
```

## 编程式导航：useRouter()

在 Composition API 中通过 `useRouter()` 获取路由实例。

```ts
import { useRouter } from 'vue-router'

const router = useRouter()

// 字符串路径
router.push('/about')

// 路径对象 + query
router.push({ path: '/search', query: { q: 'vue' } })

// 命名路由 + params
router.push({ name: 'product', params: { id: '123' } })

// 替换当前历史（不可后退）
router.replace('/about')

// 历史栈导航
router.back()      // 后退
router.forward()   // 前进
router.go(-2)      // 后退两步
```

### push vs replace

- `push`：向历史栈添加一条记录，用户可点击"后退"回到上一页
- `replace`：替换当前历史记录，用户无法后退

## 响应式路由信息：useRoute()

`useRoute()` 返回当前路由的响应式引用，包含所有路由信息。

```ts
import { useRoute } from 'vue-router'

const route = useRoute()

route.path       // 当前路径：'/about'
route.params     // 路径参数：{ id: '123' }
route.query      // 查询参数：{ q: 'vue' }
route.name       // 路由名称：'about'
route.meta       // 路由元信息
route.fullPath   // 完整路径（含 query 和 hash）
route.hash       // hash 片段
```

## 常见陷阱

1. **不要在 `setup` 外使用 `useRouter`/`useRoute`**：它们必须在 `setup()` 或 `<script setup>` 中调用。
2. **`route` 是响应式的**：用 `watch(() => route.query.q, ...)` 监听变化，不要直接解构 `const { query } = route`。
3. **命名路由跳转必须给全 params**：`{ name: 'product', params: { id: '1' } }` 中 `id` 不能省略。

## 示例页面

打开 `/vue-router/stage1` 查看交互式演示：路由创建、RouterLink、编程式导航、导航日志。
