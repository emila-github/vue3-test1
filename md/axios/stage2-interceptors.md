# Stage 2: 拦截器与封装

## 学习目标

- 理解请求拦截器和响应拦截器的执行顺序
- 掌握 Token 自动注入的实现方式
- 学会使用拦截器管理全局 Loading
- 掌握统一错误处理的最佳实践

## 核心概念

### 1. 拦截器链

请求拦截(前) → 请求拦截(后) → 发送请求 → 响应拦截(前) → 响应拦截(后)

### 2. 请求拦截器 — Token 注入

```ts
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.params = { ...config.params, t: Date.now() }
  return config
})
```

### 3. 响应拦截器 — 统一错误处理

```ts
instance.interceptors.response.use(
  (res) => {
    const { code, data, message } = res.data
    if (code === 0 || code === 200) return data
    // 业务异常
    if (code === 401) router.push('/login')
    return Promise.reject(new BizError(code, message))
  },
  (err) => {
    if (err.code === 'ECONNABORTED') message.error('请求超时')
    return Promise.reject(err)
  }
)
```

### 4. Loading 计数器

```ts
let pendingCount = 0

// 请求拦截器
pendingCount++
showLoading()

// 响应拦截器
pendingCount--
if (pendingCount === 0) hideLoading()
```

## 常见陷阱

- **拦截器写错时机会导致请求循环**：不要在拦截器中发送同样的请求
- **忘记 return config**：请求拦截器必须返回 config
- **Token 过期保护**：需要处理 401 时的刷新逻辑

## 示例页面

打开 `/axios/stage2` 查看交互式演示。
