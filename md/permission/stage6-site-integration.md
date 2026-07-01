# Stage 6：站点级权限整合

## 学习目标

- 将权限控制应用到**整个站点**的各个层面
- 创建全局 `usePermission` Composable 实现权限状态共享
- 为 HomeView 首页示例卡片添加**菜单级权限控制**
- 理解路由守卫、全局指令、数据防线的整合方式

## 核心概念

### 权限整合架构

```
用户登录 / 切换角色
       │
       ▼
usePermission.loadPermissions(role)  ← 全局单例
       │
       ├──→ HomeView 卡片过滤        (computed + hasAny)
       ├──→ 路由守卫 beforeEach      (router.beforeEach)
       ├──→ 全局 v-permission 指令   (app.directive)
       ├──→ 侧边栏菜单过滤           (getMenusByRole)
       └──→ 数据请求防线             (后端行级+字段级)
```

### 全局 Composable 单例

```ts
// src/composables/usePermission.ts
import { ref } from 'vue'
import { getUserPermissions } from '@/api/modules/permission'

// 模块级变量 = 全局单例，所有组件共享
const currentRole = ref('admin')
const permissions = ref<string[]>([])

export function usePermission() {
  async function setRole(role: string) {
    const data = await getUserPermissions(role)
    permissions.value = data.permissions
    currentRole.value = role
  }

  function hasAny(...perms: string[]) {
    return perms.some((p) => permissions.value.includes(p))
  }

  return { currentRole, permissions, setRole, hasAny }
}
```

### HomeView 权限卡片

```ts
// 每个卡片绑定 requiredPermissions
const demos = [
  {
    path: '/vue-basics',
    title: 'Vue 3 基础',
    requiredPermissions: ['demo:vue-basics'], // ← 权限绑定
  },
  // ...
]

// 按权限过滤
const permittedDemos = computed(() =>
  demos.filter((d) => hasAny(...d.requiredPermissions)),
)
```

### 角色权限分配策略

| 角色 | 可见模块数 | 说明 |
|------|-----------|------|
| admin | 16/16 | 所有模块 |
| manager | 15/16 | 无 demo:user-crud → 看不到「用户管理 CRUD」 |
| editor | 13/16 | 无 user-crud、app-scale、vite... |
| viewer | 3/16 | 仅「Vue 3 基础」「权限控制」「TypeScript」 |

## 集成关键点

### 1. 全局权限状态

`usePermission` 使用模块级变量，调用 `setRole()` 后所有引用的组件同步更新。

### 2. 首页卡片（菜单级）

每个卡片配置 `requiredPermissions` 数组，`computed` 中通过 `hasAny()` 过滤。

### 3. 路由守卫

```ts
router.beforeEach((to, from, next) => {
  const { hasAny } = usePermission()
  if (to.meta.requiredPermissions && !hasAny(...to.meta.requiredPermissions)) {
    next('/403')
  } else {
    next()
  }
})
```

### 4. 全局指令

在 `main.ts` 中注册全局 `v-permission` 指令，任意页面直接使用。

### 5. 菜单从后端获取

侧边栏菜单通过 `getMenusByRole(role)` 从后端获取已过滤的结果。

### 6. 服务端防线

前端权限仅做 UI 控制，后端必须复验权限进行数据过滤和脱敏。

## 示例页面

打开 `/permission/stage6` 查看站点级权限整合的完整演示。

返回首页 `/` 可看到右上角角色切换器，切换角色后卡片动态变化。
