# 项目约定 — 详细参考

> 此参考在需要更深入的上下文时按需加载。
> 它包含从实际项目文件中提取的具体代码模式。

---

## 目录结构

```
<project-root>/
├── src/
│   ├── views/                    ← 所有学习演示页面
│   │   ├── HomeView.vue          ← 列出所有演示的主入口
│   │   ├── AboutView.vue
│   │   ├── ApiDemo.vue           ← 单页演示 (PascalCase)
│   │   ├── DeepComponents.vue
│   │   ├── LogicReuse.vue
│   │   ├── BuiltinComponents.vue
│   │   ├── TypeScriptDemo.vue
│   │   ├── basics/               ← 多阶段演示 (kebab-case 目录)
│   │   │   └── index.vue         ← 带有子导航的索引页
│   │   ├── antd/
│   │   │   ├── AntdIndex.vue
│   │   │   ├── Stage1GettingStarted.vue
│   │   │   ├── Stage2CoreComponents.vue
│   │   │   └── ...
│   │   ├── vue-request/
│   │   │   ├── VueRequestIndex.vue
│   │   │   ├── BasicDemo.vue
│   │   │   └── ...
│   │   └── user/
│   │       └── UserCrud.vue
│   ├── router/
│   │   └── index.ts              ← 所有路由定义
│   ├── api/
│   │   ├── request.ts            ← 带拦截器的 axios 实例
│   │   ├── types.ts              ← PageParams, PageResult<T>
│   │   ├── index.ts              ← barrel 重新导出
│   │   └── modules/
│   │       ├── user.ts
│   │       └── employee.ts
│   └── mock/
│       ├── index.ts              ← Vite 插件入口 + 路由注册表
│       ├── types.ts              ← MockRoute 接口
│       ├── users.ts
│       ├── employees.ts
│       └── vue-request-demo.ts
├── md/
│   ├── AntDesignVue/
│   │   ├── stage1-quick-start.md
│   │   └── ...
│   ├── vue-request/
│   ├── vue3/
│   ├── ts/
│   └── skills/
└── vite.config.ts                ← mockPlugin() 注册位置
```

---

## 模式 A: HomeView 卡片注册

文件: `src/views/HomeView.vue`

`<script setup>` 中的 `demos` 数组定义了主页上的每个卡片：

```ts
const demos = [
  {
    path: '/vue-basics',
    title: 'Vue 3 基础',
    desc: '模板语法、响应式、计算属性…',
    color: '#1890ff',
    icon: 'V',
    tags: ['基础'],
  },
  // … 更多条目
]
```

每个对象需要恰好这五个字段。`tags` 数组驱动筛选栏。

---

## 模式 B: 路由注册

文件: `src/router/index.ts`

```ts
import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/topic-name',
      name: 'topic-name',
      component: () => import('../views/TopicName.vue'),
    },
    // … 更多路由
    ...routes, // 自动路由必须在最后
  ],
})

if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router
```

关键规则：

- 始终使用 `() => import('...')` 懒加载以实现代码分割。
- `...routes` 展开（来自 `unplugin-vue-router`）必须是**最后**一个元素。
- 对于多页模块，显式定义每个子路由 — 不要依赖自动路由
  用于演示页面，因为它们需要友好的名称。

---

## 模式 C: Mock 文件模板

文件: `src/mock/<topic>.ts`

```ts
import type { MockRoute } from './types'

// 静态数据可以在模块级别定义
let nextId = 1
const store: any[] = []

// 辅助函数：解析 POST 请求体
function parseBody(req: any): Promise<any> {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk: string) => {
      body += chunk
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch {
        resolve({})
      }
    })
  })
}

const routes: MockRoute[] = [
  // 静态 JSON 响应
  {
    url: '/topic-name/options',
    method: 'GET',
    response: { code: 200, data: [{ label: 'A', value: 'a' }], message: 'ok' },
  },

  // 带查询参数的动态响应
  {
    url: '/topic-name',
    method: 'GET',
    response: (req: any) => {
      const url = new URL(req.url, 'http://localhost')
      const page = Number(url.searchParams.get('page')) || 1
      const total = store.length
      return { code: 200, data: { list: store, total, page, pageSize: 10 }, message: 'ok' }
    },
  },

  // POST 请求（带请求体解析）
  {
    url: '/topic-name',
    method: 'POST',
    response: async (req: any) => {
      const body = await parseBody(req)
      const item = { id: nextId++, ...body }
      store.push(item)
      return { code: 200, data: item, message: '创建成功' }
    },
  },
]

export default routes
```

### 在 `src/mock/index.ts` 中注册

```ts
// 在顶部添加导入
import topicRoutes from './topic-name'

// 展开到 allRoutes
const allRoutes: MockRoute[] = [
  ...usersRoutes,
  ...employeesRoutes,
  ...topicRoutes, // ← 在此添加
]
```

`matchRoute` 函数使用**最长前缀优先**匹配（按 URL 长度降序排序）。
这意味着 `/topic-name/list`（长度 16）会在 `/topic-name`（长度 11）之前匹配，
因此子路由可以正确工作。

---

## 模式 D: API 模块模板

文件: `src/api/modules/<topic>.ts`

```ts
import { get, post, put, del } from '../request'
import type { PageResult } from '../types'

// === 类型定义 ===
export interface Item {
  id: number
  name: string
}

export interface CreateItemParams {
  name: string
}

export interface ItemQuery {
  keyword?: string
  page?: number
  pageSize?: number
}

// === API 函数 ===
export function getItems(params: ItemQuery = {}) {
  return get<PageResult<Item>>('/topic-name', params as Record<string, any>)
}

export function createItem(data: CreateItemParams) {
  return post<Item>('/topic-name', data as Record<string, any>)
}

export function updateItem(id: number, data: Partial<CreateItemParams>) {
  return put<Item>(`/topic-name/${id}`, data as Record<string, any>)
}

export function deleteItem(id: number) {
  return del<void>(`/topic-name/${id}`)
}
```

### 在 `src/api/index.ts` 中重新导出

```ts
export * from './modules/topic-name'
```

### Axios 拦截器期望

`request.ts` 拦截器期望响应格式为 `{ code: 0 | 200, data: …, message: 'ok' }`。
当 `code === 0 || code === 200` 时，它直接返回 `data`（解包）。
对于其他任何 code，它抛出 `BizError(code, message)`。

---

## 模式 E: Markdown 文档

文件: `md/<topic>/<document>.md`

`````markdown
# 标题

## 学习目标

- 目标 1
- 目标 2

## 核心概念

用中文解释，内联代码如 `const x = ref(0)`。

### 代码示例

````vue
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <a-button @click="count++">{{ count }}</a-button>
</template>
\``` ## API 参考 | API | 说明 | 默认值 | |-----|------|--------| | `param1` | … | `'default'` | ## 常见问题 1.
**问题描述**: 解决方案 ## 示例页面 打开 `/topic-name` 查看交互式演示。
````
`````

````

解释用中文，代码标识符用英文。

---

## 模式 F: 需要了解的常见导入

### Vue 文件中（自动导入，禁止手动写）

```
a-* 组件 → 由 unplugin-vue-components 自动注入
```

### 必须手动导入

```ts
import { message, Modal, notification } from 'ant-design-vue'   // 命令式 API
import type { TableColumnsType, FormInstance, TableProps } from 'ant-design-vue'  // 类型
import { SearchOutlined, PlusOutlined, ... } from '@ant-design/icons-vue'  // 图标
import { get, post, put, del } from '@/api'                              // HTTP 辅助函数
```

### 在 h() / customRender 中使用组件

```ts
// ❌ 错误 — unplugin-vue-components 只扫描 <template>
h(Tag, { color: 'red' })
// ✅ 正确
const ATag = resolveComponent('a-tag')
h(ATag, { color: 'red' })
```
````
