# Stage 3：嵌套路由与命名视图

## 学习目标

- 使用 `children` 定义嵌套子路由
- 理解嵌套 `RouterView` 的渲染机制
- 使用命名视图实现多视图布局
- 掌握 `redirect` 和 `alias` 的使用场景

## 嵌套路由（children）

当页面有公共布局（如侧边栏 + 主内容区），子路由在父组件的 `<RouterView>` 中渲染。

```ts
const routes = [
  {
    path: '/user',
    component: UserLayout,  // 父组件：包含导航栏 + <RouterView />
    children: [
      { path: '', component: UserHome },        // /user
      { path: 'profile', component: Profile },   // /user/profile
      { path: 'orders', component: Orders },     // /user/orders
      { path: 'settings', component: Settings }, // /user/settings
    ],
  },
]
```

### 父组件模板

```vue
<template>
  <div class="user-layout">
    <nav>
      <RouterLink to="/user/profile">个人资料</RouterLink>
      <RouterLink to="/user/orders">我的订单</RouterLink>
    </nav>
    <main>
      <!-- 子路由在此渲染 -->
      <RouterView />
    </main>
  </div>
</template>
```

### 关键规则

- 子路由的 `path` **不要**以 `/` 开头（会自动拼接父路径）
- `path: ''` 表示父路径的默认子页面
- 子路由可以无限嵌套多层
- 父路由不需要 `name`，子路由建议命名以便跳转

## 命名视图（Named Views）

同一页面可以有多个 `<RouterView>`，通过 `name` 属性区分。

```ts
const routes = [
  {
    path: '/dashboard',
    // components（复数）替代 component
    components: {
      default: DashboardMain,    // 默认视图
      sidebar: DashboardSidebar, // 命名视图 sidebar
      header: DashboardHeader,   // 命名视图 header
    },
  },
]
```

```vue
<template>
  <div>
    <RouterView name="header" />
    <div class="layout">
      <RouterView name="sidebar" />
      <RouterView />  <!-- default 视图 -->
    </div>
  </div>
</template>
```

### 使用场景

- 经典后台布局：header + sidebar + main
- 弹窗路由：在 modal 命名视图中渲染
- 多面板编辑器：不同面板对应不同视图

## 重定向（redirect）

将用户从一个路径自动跳转到另一个路径。

```ts
// 字符串路径
{ path: '/old-path', redirect: '/new-path' }

// 命名路由
{ path: '/old', redirect: { name: 'home' } }

// 函数：动态判断
{
  path: '/user/:role',
  redirect: (to) => {
    const role = to.params.role
    return role === 'admin' ? '/admin' : '/dashboard'
  },
}

// 相对路径（相对于当前路由）
{ path: '/a', redirect: (to) => 'b' }  // 重定向到 /b
```

## 别名（alias）

让多个 URL 指向同一个组件，URL 保持不变。

```ts
// 单个别名
{ path: '/', component: Home, alias: '/home' }
// 访问 / 和 /home 都渲染 Home

// 多个别名
{ path: '/user', component: User, alias: ['/u', '/me'] }

// 带参数的别名
{ path: '/user/:id', component: UserDetail, alias: '/u/:id' }
```

### redirect vs alias

| | redirect | alias |
|------|----------|-------|
| URL 变化 | 浏览器 URL 会变 | URL 保持原样 |
| 历史记录 | 产生新记录 | 不产生 |
| SEO 影响 | 搜索引擎看到新 URL | 两个 URL 都能访问 |
| 使用场景 | 旧链接迁移、权限跳转 | 多入口访问同一页面 |

## 常见陷阱

1. **子路由 path 以 / 开头**：会被视为根路径，不拼接父路径。
2. **忘记在父组件放置 `<RouterView />`**：子路由无法渲染。
3. **命名视图不匹配**：`name` 属性必须与路由配置中的 key 完全一致。

## 示例页面

打开 `/vue-router/stage3` 查看嵌套路由演示（用户中心的三个子页面切换）和命名视图布局示意。
