# Stage 2：指令控制 — 菜单与按钮

## 学习目标

- 掌握 v-permission 自定义指令
- 对比三种权限控制方式
- 实现菜单 + 按钮的全方位权限控制

## v-permission 指令

```ts
const vPermission = {
  mounted(el: HTMLElement, binding: { value: string | string[] }) {
    const perms = Array.isArray(binding.value) ? binding.value : [binding.value]
    if (!perms.some(p => userPermissions.includes(p))) {
      el.style.display = 'none'
    }
  },
}
```

支持单权限字符串或多权限数组（OR 逻辑）。

## 三种控制方式对比

| 方式 | DOM | 适用场景 |
|------|-----|----------|
| `v-permission` 指令 | 存在但隐藏 | 按钮数量多、布局固定 |
| `v-if` 条件 | 不存在 | 组件级、大区块 |
| `:disabled` 禁用 | 存在可见 | 提示用户该功能存在 |

## 最佳实践

- 菜单权限：用数据过滤（有权限的才渲染）
- 按钮权限：用 `v-permission` 指令
- 高风险操作：用 `v-if` 彻底移除

## 示例页面

打开 `/permission/stage2` 查看交互演示。
