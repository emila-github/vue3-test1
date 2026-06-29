# Project Conventions — Detailed Reference

> This reference is loaded on-demand when deeper context is needed.
> It contains concrete code patterns extracted from the actual project files.

---

## Directory Layout

```
E:\picc-pdfc\vue3-test1\
├── src/
│   ├── views/                    ← all learning demo pages
│   │   ├── HomeView.vue          ← main entry that lists all demos
│   │   ├── AboutView.vue
│   │   ├── ApiDemo.vue           ← single-page demos (PascalCase)
│   │   ├── DeepComponents.vue
│   │   ├── LogicReuse.vue
│   │   ├── BuiltinComponents.vue
│   │   ├── TypeScriptDemo.vue
│   │   ├── basics/               ← multi-stage demos (kebab-case dir)
│   │   │   └── index.vue         ← index page with sub-navigation
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
│   │   └── index.ts              ← all route definitions
│   ├── api/
│   │   ├── request.ts            ← axios instance with interceptors
│   │   ├── types.ts              ← PageParams, PageResult<T>
│   │   ├── index.ts              ← barrel re-exports
│   │   └── modules/
│   │       ├── user.ts
│   │       └── employee.ts
│   └── mock/
│       ├── index.ts              ← Vite plugin entry + route registry
│       ├── types.ts              ← MockRoute interface
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
└── vite.config.ts                ← mockPlugin() registered here
```

---

## Pattern A: HomeView Card Registration

File: `src/views/HomeView.vue`

The `demos` array in `<script setup>` defines every card on the home page:

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
  // … more entries
]
```

Each object requires exactly these five fields. The `tags` array drives the filter bar.

---

## Pattern B: Router Registration

File: `src/router/index.ts`

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
    // … more routes
    ...routes,   // auto-routes must be LAST
  ],
})

if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router
```

Key rules:
- Always lazy-import with `() => import('...')` for code splitting.
- The `...routes` spread (from `unplugin-vue-router`) must be the **last** element.
- For multi-page modules, define each child route explicitly — do NOT rely on auto-routes
  for demo pages because they need friendly names.

---

## Pattern C: Mock File Template

File: `src/mock/<topic>.ts`

```ts
import type { MockRoute } from './types'

// Static data is fine at module level
let nextId = 1
const store: any[] = []

// Helper to parse POST body
function parseBody(req: any): Promise<any> {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk: string) => { body += chunk })
    req.on('end', () => {
      try { resolve(JSON.parse(body)) } catch { resolve({}) }
    })
  })
}

const routes: MockRoute[] = [
  // Static JSON response
  { url: '/topic-name/options', method: 'GET',
    response: { code: 200, data: [{ label: 'A', value: 'a' }], message: 'ok' } },

  // Dynamic response with query params
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

  // POST with body parsing
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

### Register in `src/mock/index.ts`

```ts
// Add import at top
import topicRoutes from './topic-name'

// Spread into allRoutes
const allRoutes: MockRoute[] = [
  ...usersRoutes,
  ...employeesRoutes,
  ...topicRoutes,        // ← ADD HERE
]
```

The `matchRoute` function uses **longest-prefix-first** matching (`candidates.sort` by URL
length descending). This means `/topic-name/list` (length 16) is matched before
`/topic-name` (length 11), so sub-routes work correctly.

---

## Pattern D: API Module Template

File: `src/api/modules/<topic>.ts`

```ts
import { get, post, put, del } from '../request'
import type { PageResult } from '../types'

// === Type definitions ===
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

// === API functions ===
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

### Re-export in `src/api/index.ts`

```ts
export * from './modules/topic-name'
```

### Axios interceptor expectation

The `request.ts` interceptor expects `{ code: 0 | 200, data: …, message: 'ok' }`.
On `code === 0 || code === 200`, it returns `data` directly (unwrapped).
On any other code, it throws `BizError(code, message)`.

---

## Pattern E: Markdown Documentation

File: `md/<topic>/<document>.md`

```markdown
# Title

## 学习目标

- Target 1
- Target 2

## 核心概念

Explanation in Chinese, with inline code like `const x = ref(0)`.

### Code Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <a-button @click="count++">{{ count }}</a-button>
</template>
\```

## API 参考

| API | 说明 | 默认值 |
|-----|------|--------|
| `param1` | … | `'default'` |

## 常见问题

1. **问题描述**: 解决方案

## 示例页面

打开 `/topic-name` 查看交互式演示。
```

Use Chinese for explanations, English for code identifiers.

---

## Pattern F: Common Imports to Know

### In Vue files (auto-imported, do NOT write)
```
a-* components → auto-injected by unplugin-vue-components
```

### Must import manually
```ts
import { message, Modal, notification } from 'ant-design-vue'   // command-style APIs
import type { TableColumnsType, FormInstance, TableProps } from 'ant-design-vue'  // types
import { SearchOutlined, PlusOutlined, ... } from '@ant-design/icons-vue'  // icons
import { get, post, put, del } from '@/api'                              // HTTP helpers
```

### Using components in h() / customRender
```ts
// ❌ WRONG — unplugin-vue-components only scans <template>
h(Tag, { color: 'red' })
// ✅ CORRECT
const ATag = resolveComponent('a-tag')
h(ATag, { color: 'red' })
```
