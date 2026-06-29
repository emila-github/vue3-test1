# Vue3 学习站点 Skill 使用指南

## 概述

`vue3-learning-station` 是一个**项目级 CodeBuddy Skill**，封装了本项目的全部开发约定。当你在 AI 对话中添加新的学习示例时，AI 会自动加载该 Skill，确保每一步都遵循项目规范。

## Skill 包含的内容

```
.codebuddy/skills/vue3-learning-station/
├── SKILL.md                              ← 核心工作流（必读，6 步骤）
└── references/
    └── project-conventions.md            ← 详细代码模板（按需加载）
```

### SKILL.md — 6 步标准流水线

| 步骤 | 内容 | 涉及文件 |
|------|------|---------|
| Step 0 | 确定范围和 URL 路径 | — |
| Step 1 | 创建视图组件 | `src/views/` |
| Step 2 | 注册到首页卡片 | `src/views/HomeView.vue` |
| Step 3 | 添加路由 | `src/router/index.ts` |
| Step 4 | 设置 Mock 数据（有 API 时） | `src/mock/` + `src/mock/index.ts` |
| Step 5 | 创建 API 模块（有 API 时） | `src/api/modules/` + `src/api/index.ts` |
| Step 6 | 编写文档 | `md/` |
| Step 7 | 验证完整性 | `pnpm dev` + lint |

### references/project-conventions.md — 代码模板

包含从项目中提取的真实代码模式：
- HomeView 卡片注册模板
- Router 注册模板
- Mock 文件模板（静态/动态/带请求体解析）
- API 模块模板（CRUD 全套）
- Markdown 文档模板

---

## 如何使用 Skill

### 方式一：Skill 自动触发（推荐）

在 CodeBuddy 对话中提出需求，Skill 会自动加载。例如：

```
在项目中添加 Pinia 状态管理学习模块，包含 2 个示例页面
```

AI 会：
1. 自动加载 `vue3-learning-station` Skill
2. 按 Skill 中定义的 6 步流水线依次执行
3. 创建 `src/views/pinia/`、修改 `HomeView.vue`、`router/index.ts`
4. 如有 API 需求，自动创建 mock 和 api 文件
5. 在 `md/pinia/` 下生成文档

### 方式二：手动引用 Skill

在对话中使用 `@skill` 引用：

```
@vue3-learning-station 添加一个表单验证学习模块
```

### 方式三：在对话中指定特定步骤

如果只需要 Skill 的某个部分：

```
@vue3-learning-station 只需要检查当前项目的 mock 数据是否完整
```

AI 会加载 Skill 并获得项目的全部约定，然后聚焦于 mock 相关的上下文。

---

## 使用示例

### 示例 1：添加纯前端 Demo（无 API）

**用户输入：**
> 添加一个 Vue 3 动画学习模块，包含 Transition 和 TransitionGroup 两个示例

**AI 执行流程：**

1. **Step 0**: 确定路径 `/animation-demo`
2. **Step 1**: 创建 `src/views/animation/AnimationIndex.vue`
3. **Step 2**: 在 `HomeView.vue` 的 `demos` 数组添加卡片
4. **Step 3**: 在 `router/index.ts` 注册路由
5. **Step 4-5**: 跳过（无 API）
6. **Step 6**: 创建 `md/animation/` 文档
7. **Step 7**: 验证 `pnpm dev`

### 示例 2：添加带 CRUD 的实战 Demo

**用户输入：**
> 添加一个订单管理 CRUD 学习示例

**AI 执行流程：**

1. **Step 1**: 创建 `src/views/order/OrderCrud.vue`
2. **Step 2**: 在 `HomeView.vue` 注册卡片（`tags: ['实战']`）
3. **Step 3**: 注册路由 `/order-crud`
4. **Step 4**: 创建 `src/mock/orders.ts` + 注册到 `src/mock/index.ts`
5. **Step 5**: 创建 `src/api/modules/order.ts` + 在 `src/api/index.ts` 重导出
6. **Step 6**: 创建 `md/order/order-crud.md`
7. **Step 7**: 验证

---

## Skill 安装

此 Skill 是**项目级 Skill**，已内置在项目 `.codebuddy/skills/` 目录下，无需额外安装。克隆项目后即自动生效。

## 目录位置

| 文件 | 路径 |
|------|------|
| Skill 定义 | `.codebuddy/skills/vue3-learning-station/SKILL.md` |
| 详细参考 | `.codebuddy/skills/vue3-learning-station/references/project-conventions.md` |
| 本文档 | `md/skills/vue3-learning-station-skill.md` |

## 项目约定速查

| 操作 | 文件 | 关键规则 |
|------|------|---------|
| 创建页面 | `src/views/` | `<script setup lang="ts">`，不手动 import antd 组件 |
| 首页入口 | `src/views/HomeView.vue` | `demos` 数组追加对象 |
| 路由 | `src/router/index.ts` | 懒加载 `() => import(...)` |
| 模拟数据 | `src/mock/xxx.ts` | 导出 `MockRoute[]`，在 `index.ts` 中 import + spread |
| API | `src/api/modules/xxx.ts` | 定义接口函数，在 `api/index.ts` 中 `export *` |
| 文档 | `md/` | Markdown 格式，中文说明 + 代码示例 |

---

## 常见问题

### Q: Skill 什么时候会自动触发？

当用户描述涉及以下关键词时自动触发：
- "添加学习模块"、"新增 demo"、"创建示例"、"加一个页面"
- 或者明确操作 `src/views/`、`HomeView.vue`、`src/router/index.ts`

### Q: 怎么验证 Skill 是否生效？

看 AI 回复中是否提到 Step 0-7 的标准流程，以及是否正确处理了 HomeView 注册、router、mock、api、md 等文件。

### Q: 如果我手动改了项目，Skill 会知道吗？

Skill 中定义的是**流程规范**，AI 会在执行前先读取当前项目的文件状态，然后再按规范操作。所以手动改过的文件不会被覆盖，AI 只做增量修改。
