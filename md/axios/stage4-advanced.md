# Stage 4: 高级特性

## 学习目标

- 掌握指数退避算法实现请求重试
- 理解请求去重（deduplication）的实现
- 学会使用 TTL 缓存机制
- 掌握超时处理与并发控制

## 核心概念

### 1. 请求重试（指数退避）

```ts
async function retryRequest(config, maxRetries = 3, delay = 1000) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await axios.request(config)
    } catch (err) {
      if (i < maxRetries) {
        // 指数退避: 1s → 2s → 4s
        await new Promise(r => setTimeout(r, delay * 2 ** i))
      } else {
        throw err
      }
    }
  }
}
```

### 2. 请求去重

```ts
const pendingMap = new Map<string, Promise<any>>()

function dedupRequest(url: string, config: any) {
  const key = `${config.method}:${url}:${JSON.stringify(config.params)}`
  if (pendingMap.has(key)) return pendingMap.get(key)!

  const promise = axios(url, config).finally(() => pendingMap.delete(key))
  pendingMap.set(key, promise)
  return promise
}
```

### 3. 请求缓存（TTL）

```ts
const cacheMap = new Map<string, { data: any; timestamp: number; ttl: number }>()

async function cachedRequest(url: string, ttl = 10000) {
  if (cacheMap.has(url)) {
    const entry = cacheMap.get(url)!
    if (Date.now() - entry.timestamp < ttl) return entry.data
    cacheMap.delete(url)
  }
  const res = await axios.get(url)
  cacheMap.set(url, { data: res, timestamp: Date.now(), ttl })
  return res
}
```

### 4. 并发控制

```ts
// Promise.all — 全部成功才成功
const [user, orders] = await Promise.all([
  axios.get('/api/user/1'),
  axios.get('/api/orders'),
])

// Promise.allSettled — 全部完成后再处理
const results = await Promise.allSettled(urls.map(url => axios.get(url)))
```

## 常见陷阱

- **重试次数过多**：建议最大 3 次，避免服务端压力
- **缓存键设计**：需要同时考虑 method、url、params、data
- **并发过多**：浏览器一般限制同时 6 个连接

## 示例页面

打开 `/axios/stage4` 查看交互式演示。
