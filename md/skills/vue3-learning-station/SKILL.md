---
name: vue3-learning-station
description: >
  Vue 3 学习站点项目约定技能 - 用于添加新的学习示例或修改现有示例。
  强制执行完整工作流：在 src/views/ 创建视图组件、在 HomeView.vue 注册卡片、
  在 src/router/ 添加路由、在 src/mock/ 设置模拟数据（需要 API 时）、
  在 src/api/modules/ 创建 API 模块（需要 API 时）、在 md/ 编写文档。
  任何涉及添加或修改学习模块的任务都必须加载此技能。
license: MIT
metadata:
  version: '1.0.1'
  author: 'Vue 3 Learning Team'
  category: 'Vue Development'
  tags: ['Vue3', 'TypeScript', 'Composition API', '学习平台', '项目约定']
---

# Vue 3 Learning Station 项目约定技能

此技能定义了向 Vue 3 学习站点添加新学习示例或主题的强制性工作流。
必须按规定顺序执行每一步；仅当某一步明显不适用时才能跳过
（例如，没有 API 调用的演示不需要 mock 或 api 模块）。

---

## Step 0: 确定范围（必需，在其他步骤之前）

在编写任何代码之前，确定主题名称及其 URL 路径前缀。

- **主题名称**: 简短的 kebab-case 标识符（例如 `pinia-demo`、`vue-use`、`form-validation`）
- **URL 基础**: 确定这是单页演示 (`/topic-name`) 还是需要子目录的多页模块
  (`/topic-name`、`/topic-name/stage1` 等)

完整的文件树模式请参阅参考文件 `references/project-conventions.md`。

---

## Step 1: 创建视图组件（必需）

使用 `<script setup lang="ts">` 创建 Vue 3 文件（仅使用 Composition API，禁用 Options API）。

### 单页演示

```
src/views/TopicName.vue
```

文件名使用 PascalCase，与路由组件命名约定一致。

### 多页模块（例如阶段式学习）

```
src/views/topic-name/
  ├── TopicIndex.vue       → route: /topic-name          (概览页)
  ├── Stage1Basic.vue      → route: /topic-name/stage1
  ├── Stage2Advanced.vue   → route: /topic-name/stage2
  └── ...
```

组件规则：

- 每个 `.vue` 文件都必须使用 `<script setup lang="ts">`
- Ant Design Vue 组件由 `unplugin-vue-components` 自动导入 →
  **禁止** 在 `<script>` 中写 `import { Button } from 'ant-design-vue'`
- 在 `h()` 渲染函数中使用 `resolveComponent('a-tag')`（不能直接使用组件引用）
  因为插件只扫描 `<template>`，不扫描 `<script>`
- 命令式 API（`message`、`Modal.confirm`、`notification`）必须手动导入：
  `import { message, Modal } from 'ant-design-vue'`
- 类型导入是允许的：`import type { TableColumnsType } from 'ant-design-vue'`

---

## Step 2: 在 HomeView.vue 注册（必需）

打开 `src/views/HomeView.vue`，在 `demos` 数组（`<script setup>` 中的 `const` 数组）中添加新条目：

```ts
{
  path: '/topic-name',          // 必须匹配路由路径
  title: 'Topic Display Name',  // 卡片显示名称
  desc: '简短描述（一行，概述演示内容）',
  color: '#52c41a',             // 强调色（十六进制，从现有调色板中选择）
  icon: '⚡',                   // 单个 emoji 或短文本（≤2 字符）
  tags: ['实战'],              // 一个或多个标签：'基础', '核心', '进阶', '实战', '库', 'Antd'
},
```

标签参考：
| 标签 | 含义 |
|------|------|
| `基础` | 基础知识，适合初学者 |
| `核心` | 框架核心概念 |
| `进阶` | 进阶主题 |
| `实战` | 真实案例 / CRUD |
| `库` | 第三方库 |
| `Antd` | Ant Design Vue 相关 |

---

## Step 3: 添加路由（必需）

打开 `src/router/index.ts`，按照现有模式添加新路由条目。

### 单页

```ts
{
  path: '/topic-name',
  name: 'topic-name',
  component: () => import('../views/TopicName.vue'),
},
```

### 多页（使用现有的 `...routes` 自动导入模式）

```ts
// 父路由
{
  path: '/topic-name',
  name: 'topic-name',
  component: () => import('../views/topic-name/TopicIndex.vue'),
},
// 子阶段路由
{
  path: '/topic-name/stage1',
  name: 'topic-name-stage1',
  component: () => import('../views/topic-name/Stage1Basic.vue'),
},
```

始终使用 **懒加载** (`() => import(...)`)，以便 Vite 可以对每个演示页面进行代码分割。
将新路由块放在相关路由附近，并将 `...routes` 展开保留在末尾
（用于 `unplugin-vue-router` 生成的自动路由）。

---

## Step 4: Set Up Mock Data (do ONLY when demo needs API calls)

Skip this step entirely if the demo does not make any HTTP request.

### 4a. Create the mock file

Create `src/mock/<topic-name>.ts`. The file must export a default array of `MockRoute` objects:

```ts
import type { MockRoute } from './types'

const routes: MockRoute[] = [
  {
    url: '/topic-name/list',
    method: 'GET',
    response: (req) => {
      // dynamic response logic
      return { code: 200, data: { list: [...], total: 10 }, message: 'ok' }
    },
  },
  {
    url: '/topic-name',
    method: 'POST',
    response: async (req) => {
      // parse body ��
      return { code: 200, data: newItem, message: '�����ɹ�' }
    },
  },
]

export default routes
```

Rules:

- Every response MUST wrap in `{ code: 200, data: ��, message: 'ok' }` to match the
  project's axios interceptor expectation (`code === 0 || code === 200`).
- Use function-response for routes that need query params or dynamic data.
- Use static-response for simple dictionary/dropdown endpoints.
- Route URLs should be unique; the `matchRoute` function uses longest-prefix matching,
  so `/topic-name/list` is correctly matched before `/topic-name`.

### 4b. Register the mock file

In `src/mock/index.ts`:

1. Add a static import at the top:
   ```ts
   import topicNameRoutes from './topic-name'
   ```
2. Spread it into `allRoutes`:
   ```ts
   const allRoutes: MockRoute[] = [
     ...usersRoutes,
     ...employeesRoutes,
     ...topicNameRoutes, // �� add here
   ]
   ```

---

## Step 5: 创建 API 模块（仅当演示需要 API 调用时执行）

如果跳过了 Step 4，则跳过此步骤。

### 5a. 创建 API 模块文件

创建 `src/api/modules/<topic-name>.ts`：

```ts
import { get, post, put, del } from '../request'
import type { PageResult } from '../types'

// 1) 定义 TypeScript 接口
export interface Item {
  id: number
  name: string
  // ...
}

export interface ItemQueryParams {
  keyword?: string
  page?: number
  pageSize?: number
}

// 2) 导出 API 函数（名称以动词开头：getXxx, createXxx 等）
export function getItems(params: ItemQueryParams = {}) {
  return get<PageResult<Item>>('/topic-name/list', params as Record<string, any>)
}

export function createItem(data: Partial<Item>) {
  return post<Item>('/topic-name', data as Record<string, any>)
}

export function updateItem(id: number, data: Partial<Item>) {
  return put<Item>(`/topic-name/${id}`, data as Record<string, any>)
}

export function deleteItem(id: number) {
  return del<void>(`/topic-name/${id}`)
}
```

### 5b. 在 API 桶文件中重新导出

在 `src/api/index.ts` 中添加：

```ts
export * from './modules/topic-name'
```

---

## Step 6: 编写文档（必需）

在 `md/` 目录中创建 Markdown 文件。

### 文件位置

```
md/<topic-name>/<stage>.md     → 每个学习阶段一个文档
```

示例：`md/antd/stage1-quick-start.md`

### 文档结构

每个文档文件必须包含：

```markdown
# <阶段标题>

## 学习目标

- 目标 1
- 目标 2

## 核心概念

用简单中文解释关键思想，附带简短代码片段。

## API / 配置参考

用于参考的表格或代码块。

## 常见陷阱

需要注意的事项列表。

## 示例页面

打开 `/<route-path>` 查看交互式演示。
```

保持代码片段独立且可直接复制粘贴。使用带 `vue`、`ts` 或 `bash` 语言标签的三重反引号块。

---

## Step 7: Verify the Pipeline (required)

Run through this checklist before declaring the task done:

- [ ] `pnpm dev` starts without errors.
- [ ] The new card appears on `http://localhost:5173/` (HomeView).
- [ ] Clicking the card navigates to the new page.
- [ ] (If applicable) API calls in the page return mock data correctly.
- [ ] No `Component is not defined` or `Cannot access before initialization` errors in the console.
- [ ] `read_lints` shows zero new errors on all modified files.

---

## Reference: Quick File Map

| What           | Where                                                          |
| -------------- | -------------------------------------------------------------- |
| View component | `src/views/<TopicName>.vue` or `src/views/<topic>/`            |
| HomeView card  | `src/views/HomeView.vue` �� `demos` array                      |
| Router entry   | `src/router/index.ts`                                          |
| Mock data      | `src/mock/<topic>.ts` + register in `src/mock/index.ts`        |
| API functions  | `src/api/modules/<topic>.ts` + re-export in `src/api/index.ts` |
| Documentation  | `md/<topic>/<document>.md`                                     |
