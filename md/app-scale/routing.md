# 路由

## 学习目标

- 理解 SPA 路由原理
- 了解 Vue Router 核心概念
- 掌握路由配置基本写法

## 核心概念

```
路由表 →  URL 路径 →  组件映射
  |            |           |
Routes    /user/123    UserView
```

- **RouterLink** — 声明式导航（生成 `<a>` 标签）
- **RouterView** — 路由组件渲染出口
- **动态路由** — `/user/:id` 匹配任意 ID
- **History 模式** — URL 干净无 `#`

## 快速示例

```ts
const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
  { path: '/user/:id', component: UserView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
```

## 深入学习

完整的 5 阶段 Vue Router 教程请访问 `/vue-router`。

## 示例页面

打开 `/routing` 查看路由概览。
