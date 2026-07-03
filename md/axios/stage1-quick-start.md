# Stage 1: Axios 快速上手

## 学习目标

- 掌握 Axios 的安装与基本配置
- 理解 GET / POST / PUT / DELETE 请求的使用方式
- 学会使用 TypeScript 泛型约束请求与响应类型
- 理解统一错误处理机制

## 核心概念

### 1. 安装

```bash
pnpm add axios
```

### 2. 创建实例

```ts
import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})
```

### 3. 基础请求

```ts
// GET
const users = await get<PageResult<User>>('/users', { page: 1 })

// POST
const newUser = await post<User>('/users', { name: '张三', email: 'zhang@example.com' })

// PUT
await put<User>('/users/1', { name: '张三(已更新)' })

// DELETE
await del('/users/1')
```

### 4. TypeScript 泛型

```ts
export function get<T>(url: string, params?: Record<string, any>): Promise<T> {
  return instance.get(url, { params }) as any
}

// 调用时 TypeScript 自动推导返回值类型
const result = await get<{ list: User[] }>('/users')
result.list.forEach(u => console.log(u.name)) // ✅ 有完整的类型提示
```

## 常见陷阱

- **响应未解包**：拦截器没有提取 `res.data`，每次都要写 `.then(res => res.data.data)`
- **错误未分类**：把网络错误和业务异常混在一起处理
- **泛型丢失**：没有给 API 函数加泛型约束，丢失了类型安全

## 示例页面

打开 `/axios/stage1` 查看交互式演示。
