# API 请求指南

## 目录结构

```
src/
  api/
    request.ts          — axios 实例（拦截器 / 通用配置 / 便捷方法）
    types.ts            — 公共类型（分页等）
    index.ts            — 统一导出入口
    modules/            — 按业务拆分的 API 模块
      user.ts           — 用户相关接口
  mock/
    types.ts            — MockRoute 类型定义
    index.ts            — Mock 插件（Vite 中间件 + 路由合并）
    users.ts            — 用户接口 mock 数据
  views/
    ApiDemo.vue         — 请求示例演示页面（路由 /api-demo）
```

```
vite.config.ts          — 注册 mockPlugin，可选启用 proxy
.env                    — 通用环境变量
.env.development        — 开发环境变量
.env.production         — 生产环境变量
md/
  api-guide.md          — 本文档
```

---

## 环境配置

| 文件 | 用途 | `VITE_API_BASE_URL` | `VITE_APP_TITLE` |
|------|------|---------------------|------------------|
| `.env` | 通用默认值 | — | `Vue3 Demo` |
| `.env.development` | 开发环境 | `/api` | `Vue3 Demo (DEV)` |
| `.env.production` | 生产环境 | `https://api.example.com` | `Vue3 Demo` |

开发环境 `baseURL = /api`，请求路径如 `/api/users`。

---

## 快速上手

### 方式一：通用方法（简单场景）

```ts
import { get, post, put, del } from '@/api/request'

// GET
const users = await get('/users', { page: 1, pageSize: 10 })

// POST
await post('/users', { name: '张三', email: 'a@b.com', role: 'editor' })

// PUT
await put('/users/1', { name: '李四' })

// DELETE
await del('/users/1')
```

### 方式二：模块化调用（推荐）

```ts
import { getUsers, createUser, updateUser, deleteUser } from '@/api/modules/user'
import type { User, CreateUserParams } from '@/api/modules/user'

// 分页查询
const { list, total } = await getUsers({ page: 1, pageSize: 10 })

// 创建
const newUser = await createUser({ name: '张三', email: 'a@b.com', role: 'editor' })

// 更新
await updateUser({ id: 1, name: '李四' })

// 删除
await deleteUser(1)
```

---

## 错误处理

```ts
import { BizError } from '@/api/request'

try {
  await get('/users')
} catch (e) {
  if (e instanceof BizError) {
    // 业务异常：code 非 0/200（如 401 / 403 / 500）
    console.log(`业务错误 [${e.code}]: ${e.message}`)
  } else {
    // 网络异常 / HTTP 错误
    console.log('网络错误:', e.message)
  }
}
```

### 统一响应格式

后端 / Mock 均返回如下结构：

```ts
{
  code: 200,          // 业务状态码，0 或 200 表示成功
  data: { ... },      // 实际数据
  message: 'ok',      // 提示信息
}
```

响应拦截器自动判断 `code`：

| code | 行为 |
|------|------|
| `0` 或 `200` | 返回 `data`，调用方直接拿到业务数据 |
| `401` | 预留登录过期处理 |
| `403` | `console.warn` 无权限 |
| 其他 | 抛出 `BizError(code, message)` |

---

## 拦截器

所有能力集中在 `src/api/request.ts` 的 axios 实例中，全站共享。

### 请求拦截器

- 自动追加 `t=Date.now()` 到 `params`（防缓存）
- 预留 token 注入（`config.headers.Authorization`，取消注释即可）

### 响应拦截器

- **成功**：自动解包 `res.data.data`，非 0/200 抛 `BizError`
- **错误**：统一 `console.error` + `Promise.reject`

### 调试日志

开发阶段 axios 拦截器会输出请求/响应日志（浏览器控制台）：

```
[axios] → GET /api/users
[axios] ← GET /api/users | status=200 | body= { code: 200, data: {...}, message: 'ok' }
[axios] ✗ NETWORK | 网络异常
```

---

## 内置 Mock（无后端开发）

### 工作原理

`src/mock/index.ts` 导出一个 `mockPlugin()` Vite 插件，注册在 `vite.config.ts` 中：

```ts
import { mockPlugin } from './src/mock'

export default defineConfig({
  plugins: [
    // ...
    mockPlugin(),   // ★ 拦截 /api/* 返回假数据
  ],
})
```

插件通过 Connect 中间件挂载在 `/api` 路径，收到请求后匹配 `src/mock/` 下各文件的路由定义，命中则直接返回 JSON。

### Mock 路由格式

```ts
// src/mock/users.ts
import type { MockRoute } from './types'

const routes: MockRoute[] = [
  {
    url: '/users',       // ⚠️ 不含 /api 前缀（中间件已挂在 /api 下）
    method: 'GET',
    response: {          // 静态对象 或 async (req) => data
      code: 200,
      data: { list: [...], total: 2 },
      message: 'ok',
    },
  },
  {
    url: '/users',
    method: 'POST',
    response: async (req) => {
      // 可读取请求体后动态返回
      return { code: 200, data: { id: 1 }, message: 'ok' }
    },
  },
]

export default routes
```

**关键约定：**

- `url` **不要**加 `/api` 前缀。中间件挂在 `/api` 下，Connect 会自动截掉前缀，`req.url` 实际为 `/users?t=...`
- `url` 使用 `startsWith` 匹配，所以 `/users` 能匹配 `/users`、`/users/1`、`/users?t=...`
- `response` 可以是静态对象，也可以是一个接收 `(req: IncomingMessage)` 的异步函数

### 新增 Mock

1. 在 `src/mock/` 下新建文件，如 `orders.ts`：

```ts
import type { MockRoute } from './types'

const routes: MockRoute[] = [
  {
    url: '/orders',
    method: 'GET',
    response: { code: 200, data: { list: [], total: 0 }, message: 'ok' },
  },
]

export default routes
```

2. 在 `src/mock/index.ts` 中添加静态 import 并展开到 `allRoutes`：

```ts
import ordersRoutes from './orders'

const allRoutes: MockRoute[] = [
  ...usersRoutes,
  ...ordersRoutes,   // ← 新增
]
```

3. 完成。**无需修改 `vite.config.ts`**。

### 终端调试日志

启动 dev server 后终端会显示：

```
[mock] 插件已加载，共 4 条路由
  GET /users
  POST /users
  PUT /users
  DELETE /users
```

每次命中 Mock 时：

```
[mock] 收到请求: GET /users?t=1718532000000&page=1
[mock] ✅ 已拦截 GET /users?t=1718532000000&page=1
```

未命中则放行：

```
[mock] ❌ 未匹配 GET /other-path，放行
```

---

## 切换到真实后端

1. 删除 `vite.config.ts` 中的 `mockPlugin()` 调用
2. 取消注释 `server.proxy` 配置：

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',   // 改为你的后端地址
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
},
```

3. 重启 dev server

---

## 新增业务模块

1. 在 `src/api/modules/` 下创建文件，如 `order.ts`：

```ts
import { get, post } from '../request'
import type { PageParams, PageResult } from '../types'

// 类型定义
export interface Order {
  id: number
  amount: number
  status: 'pending' | 'paid' | 'shipped'
  createdAt: string
}

// API 方法
export function getOrders(params: Partial<PageParams> = {}) {
  return get<PageResult<Order>>('/orders', params)
}

export function createOrder(data: { amount: number }) {
  return post<Order>('/orders', data)
}
```

2. 在 `src/api/index.ts` 中导出：

```ts
export * from './modules/order'
```

3. 使用：

```ts
import { getOrders } from '@/api'

const { list, total } = await getOrders({ page: 1 })
```

---

## Axios 实例配置

| 参数 | 值 | 说明 |
|------|-----|------|
| `baseURL` | `VITE_API_BASE_URL` 或 `/api` | 可通过环境变量覆盖 |
| `timeout` | 15000 ms | 超时时间 |
| `Content-Type` | `application/json` | 默认 JSON |

如需修改，编辑 `src/api/request.ts` 中 `axios.create()` 的参数。
