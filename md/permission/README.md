# 🛡️ 权限控制学习教程

涵盖 RBAC 模型、后端获取权限、指令控制（菜单/按钮/组件）、数据级权限、多权限组合逻辑，5 阶段系统学习。

## 学习路线

| 阶段 | 主题 | 内容 |
|------|------|------|
| Stage 1 | 权限模型与概念 | RBAC 模型、权限码设计、后端获取权限流程 |
| Stage 2 | 指令控制：菜单与按钮 | v-permission 指令、三种控制方式对比 |
| Stage 3 | 数据权限控制 | 行级过滤、字段脱敏、前后端方案对比 |
| Stage 4 | 多权限组合逻辑 | hasAny / hasAll / hasNone 三种判断逻辑 |
| Stage 5 | 完整权限实战 | 模拟后台：角色切换 → 菜单/按钮/数据联动 |

## 本项目依赖

本模块不需要额外依赖，使用 Vue 3 内置的自定义指令 + `api/request.ts` 的 HTTP 请求。

## 权限码设计规范

```
类型:模块:操作

menu:user-manage     → 菜单权限
btn:user-create      → 按钮权限
data:user-view-xxx   → 数据权限
admin:full           → 超级权限
```

## 核心 API

| API | 说明 |
|-----|------|
| `hasAny(p1, p2, ...)` | OR 逻辑：任一权限满足 |
| `hasAll(p1, p2, ...)` | AND 逻辑：全部权限满足 |
| `hasNone(p1, p2, ...)` | NONE 逻辑：全部不满足 |
| `v-permission` | 自定义指令：控制 DOM 显隐 |
