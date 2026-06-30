# Stage 4：多权限组合逻辑

## 学习目标

- 掌握 hasAny / hasAll / hasNone 三种判断逻辑
- 理解 OR / AND / NONE 的适用场景
- 实现多权限灵活组合

## 三种判断逻辑

### hasAny() — OR 逻辑

```ts
function hasAny(...perms: string[]): boolean {
  return perms.some(p => userPermissions.includes(p))
}
```

任意一个权限满足即可通过。适用：多角色入口、宽泛授权。

### hasAll() — AND 逻辑

```ts
function hasAll(...perms: string[]): boolean {
  return perms.every(p => userPermissions.includes(p))
}
```

全部权限满足才通过。适用：敏感操作、高危功能。

### hasNone() — NONE 逻辑

```ts
function hasNone(...perms: string[]): boolean {
  return perms.every(p => !userPermissions.includes(p))
}
```

全部不满足才通过。适用：排除特定角色。

## 典型场景

| 场景 | 逻辑 | 示例 |
|------|------|------|
| 管理入口 | OR | `hasAny('menu:admin', 'admin:full')` |
| 敏感操作 | AND | `hasAll('btn:create', 'btn:edit', 'btn:delete')` |
| 排除权限 | NONE | `hasNone('menu:admin', 'admin:full')` |
| 导出功能 | OR | `hasAny('btn:user-export', 'data:report-view-all')` |

## 示例页面

打开 `/permission/stage4` 查看交互演示。
