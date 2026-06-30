# Stage 1：权限模型与概念

## 学习目标

- 理解 RBAC 权限模型
- 掌握权限码命名规范
- 了解后端获取权限的标准流程

## RBAC 模型

RBAC（Role-Based Access Control）核心理念：

```
用户 ↔ 角色 ↔ 权限
```

用户不直接绑定权限，而是通过角色间接获得。角色变动时只改角色-权限映射。

## 权限码命名

采用 `类型:模块:操作` 三段式：

| 前缀 | 含义 | 示例 |
|------|------|------|
| `menu:` | 菜单/导航权限 | `menu:user-manage` |
| `btn:` | 按钮操作权限 | `btn:user-delete` |
| `data:` | 数据级权限 | `data:user-view-sensitive` |
| `admin:` | 超级管理员 | `admin:full` |

## 后端获取流程

```
登录成功 → GET /api/permission/user-permissions → 存储权限列表 → UI 指令消费
```

## 示例页面

打开 `/permission/stage1` 查看交互演示。
