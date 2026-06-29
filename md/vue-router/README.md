# Vue Router 5.x 学习总览

## 版本信息

| 项目 | 版本 |
|------|------|
| vue-router | `^5.0.4` |
| Vue | `^3.5.x` |
| 路由模式 | HTML5 History (`createWebHistory`) |

## Vue Router 5.x 核心变化

相比 Vue Router 3.x（Vue 2 时代）和 4.0（Vue 3 早期），5.x 的关键特性：

| 特性 | 说明 |
|------|------|
| **Composition API** | `useRouter()` / `useRoute()` 替代 Options API 的 `this.$router` / `this.$route` |
| **守卫返回值控制** | 用 `return false` / `return '/path'` 替代 `next()` 回调 |
| **RouterView 插槽** | `v-slot="{ Component, route }"` 实现灵活过渡和 KeepAlive |
| **动态路由增强** | `addRoute(parentName, route)` 支持子路由动态添加 |
| **类型推断** | 配合 `unplugin-vue-router` 实现类型安全路由 |
| **导航故障** | `isNavigationFailure()` 精细区分导航失败原因 |

## 学习路线（5 个阶段）

```
Stage 1: 快速上手         → 创建路由实例、RouterLink、RouterView、编程式导航
Stage 2: 动态路由与参数   → params、query、props 传参、路由变化侦听
Stage 3: 嵌套路由与命名视图 → children、嵌套 RouterView、命名视图、redirect/alias
Stage 4: 导航守卫          → 全局守卫、路由独享守卫、组件内守卫、登录鉴权
Stage 5: 进阶特性          → meta、滚动行为、懒加载、过渡动画、动态路由
```

## 示例页面

打开 `/vue-router` 查看交互式总览，点击各阶段卡片进入详细学习页面。

## 核心 API 速查

### 创建路由

```ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [...],
})
```

### 组合式 API

```ts
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()  // 路由实例（push、replace、go...）
const route = useRoute()    // 当前路由信息（响应式）
```

### 导航守卫

```ts
// 全局
router.beforeEach((to, from) => { /* return false | path */ })
router.afterEach((to, from) => { /* 无返回值 */ })

// 组件内
onBeforeRouteLeave((to, from) => { /* 离开确认 */ })
onBeforeRouteUpdate((to, from) => { /* 参数变化 */ })
```
