# useRequest — 核心 API

## 签名

```ts
function useRequest<R, P extends unknown[] = any>(
  service: Service<R, P>,
  options?: Options<R, P>,
  plugins?: PluginImplementType<R, P>[]
): QueryResult<R, P>
```

## service

`service` 是一个返回 Promise 的异步函数。通常是你封装好的 axios 请求：

```ts
import axios from 'axios'
const getUser = (id: number) => axios.get(`/api/user/${id}`).then(r => r.data)

const { data } = useRequest(() => getUser(1))
// 或带参数：
const { data, run } = useRequest((id: number) => getUser(id), { manual: true })
run(1) // 手动触发
```

## 返回值 QueryResult

| 属性 | 类型 | 说明 |
|------|------|------|
| `data` | `Ref<R \| undefined>` | 请求返回的数据 |
| `loading` | `Ref<boolean>` | 是否正在请求 |
| `error` | `Ref<Error \| undefined>` | 请求错误信息 |
| `params` | `Ref<P>` | 最近一次请求的参数 |
| `run` | `(...args: P) => void` | 手动触发请求（不返回 Promise） |
| `runAsync` | `(...args: P) => Promise<R>` | 手动触发请求（返回 Promise） |
| `refresh` | `() => void` | 使用上次参数重新请求 |
| `refreshAsync` | `() => Promise<R>` | 使用上次参数重新请求（返回 Promise） |
| `cancel` | `() => void` | 取消当前请求 |
| `mutate` | `Mutate<R>` | 直接修改 data（支持函数式更新） |

## Options 全部配置项

```ts
interface Options<R, P extends unknown[]> {
  // ========== 手动触发 ==========
  manual?: boolean                    // true 时不自动请求，需手动调用 run()
  ready?: Ref<boolean> | (() => boolean) // ready 为 true 时才发起请求

  // ========== 默认值 ==========
  defaultParams?: P                   // 默认请求参数
  initialData?: R                     // 初始 data 值

  // ========== Loading 优化 ==========
  loadingDelay?: number | Ref<number> // loading 延迟显示（ms），避免闪烁
  loadingKeep?: number | Ref<number>  // loading 最少保持时间（ms）

  // ========== 缓存（SWR） ==========
  cacheKey?: string | ((params?: P) => string) // 缓存键
  cacheTime?: number                  // 缓存存活时间（ms），默认 5 分钟
  staleTime?: number                  // 缓存新鲜时间（ms），默认 0
  getCache?: (cacheKey: string) => CacheData   // 自定义获取缓存
  setCache?: (cacheKey: string, data: CacheData) => void // 自定义设置缓存

  // ========== 轮询 ==========
  pollingInterval?: number | Ref<number>  // 轮询间隔（ms）
  pollingWhenHidden?: boolean             // 页面隐藏时是否继续轮询
  pollingWhenOffline?: boolean            // 离线时是否继续轮询

  // ========== 窗口聚焦 ==========
  refreshOnWindowFocus?: boolean | Ref<boolean> // 窗口聚焦时自动重新请求
  refocusTimespan?: number | Ref<number>       // 两次聚焦重连最小间隔

  // ========== 防抖 & 节流 ==========
  debounceInterval?: number | Ref<number>  // 防抖间隔
  debounceOptions?: { leading?: boolean; trailing?: boolean; maxWait?: number }
  throttleInterval?: number | Ref<number>  // 节流间隔
  throttleOptions?: { leading?: boolean; trailing?: boolean }

  // ========== 错误重试 ==========
  errorRetryCount?: number | Ref<number>    // 错误重试次数
  errorRetryInterval?: number | Ref<number> // 错误重试间隔（ms）

  // ========== 依赖刷新 ==========
  refreshDeps?: WatchSource | WatchSource[]  // 依赖变化时自动刷新
  refreshDepsAction?: () => void             // 依赖变化后的回调

  // ========== 生命周期回调 ==========
  onBefore?: (params: P) => void
  onSuccess?: (data: R, params: P) => void
  onError?: (error: Error, params: P) => void
  onAfter?: (params: P) => void
}
```

## 常用场景示例

### 1. 手动触发（表单提交）

```ts
const { run, loading } = useRequest(submitForm, { manual: true })

function handleSubmit() {
  run(formData.value)
}
```

### 2. 条件请求（ready）

```ts
const keyword = ref('')
const { data } = useRequest(
  () => searchApi(keyword.value),
  {
    ready: computed(() => keyword.value.length >= 2), // 关键词>=2字才请求
  }
)
```

### 3. 依赖刷新

```ts
const userId = ref(1)
const { data } = useRequest(
  () => getUser(userId.value),
  { refreshDeps: [userId] } // userId 变化自动重新请求
)
```

### 4. 生命周期回调

```ts
useRequest(api, {
  onBefore: (params) => console.log('请求前', params),
  onSuccess: (data, params) => message.success('加载成功'),
  onError: (error, params) => message.error(error.message),
  onAfter: (params) => console.log('请求结束'),
})
```

### 5. mutate 乐观更新

```ts
const { data, mutate } = useRequest(getUserList)

// 直接设置
mutate([{ id: 1, name: '新用户' }])

// 函数式更新
mutate(oldData => oldData.filter(item => item.id !== deletedId))
```
