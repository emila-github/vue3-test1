# 高级特性

## 1. 缓存 / SWR（Stale While Revalidate）

SWR 策略：先从缓存返回旧数据（快速渲染），同时在后台发起新请求更新数据。

```ts
const { data } = useRequest(getUserInfo, {
  cacheKey: 'user-info',     // 设置缓存键
  cacheTime: 5 * 60 * 1000,  // 缓存 5 分钟（默认）
  staleTime: 30 * 1000,      // 30 秒内视为新鲜，不发请求
})
```

| 选项 | 默认值 | 说明 |
|------|--------|------|
| `cacheKey` | — | 缓存唯一标识。不设置则不启用缓存 |
| `cacheTime` | 300000 (5分钟) | 缓存数据存活时间，超时后清除 |
| `staleTime` | 0 | 保鲜时间。在此时间内直接使用缓存，不发请求 |

**清除缓存**：

```ts
import { clearCache } from 'vue-request'

clearCache()           // 清除所有缓存
clearCache('user-info') // 清除指定缓存
```

## 2. 轮询

```ts
const { data, cancel } = useRequest(getStatus, {
  pollingInterval: 3000,          // 每 3 秒轮询
  pollingWhenHidden: false,       // 页面隐藏时停止（默认）
  pollingWhenOffline: false,      // 离线时停止（默认）
})

// 满足条件后停止轮询
watch(data, (val) => {
  if (val?.status === 'done') cancel()
})
```

## 3. 窗口聚焦刷新

```ts
useRequest(getUserInfo, {
  refreshOnWindowFocus: true,  // 窗口重新聚焦时自动刷新
  refocusTimespan: 5000,       // 两次聚焦重连最小间隔 5 秒
})
```

适用场景：多窗口数据同步、电脑从休眠恢复后刷新。

## 4. 错误重试

```ts
useRequest(api, {
  errorRetryCount: 3,          // 最多重试 3 次
  errorRetryInterval: 2000,    // 每次重试间隔 2 秒
})
```

当请求失败时，vue-request 会自动按配置进行重试。

## 5. 防抖（Debounce）

```ts
useRequest(searchApi, {
  debounceInterval: 500,       // 500ms 防抖
  debounceOptions: {
    leading: false,            // 是否立即执行第一次
    trailing: true,            // 是否在延迟结束后执行
    maxWait: 3000,             // 最大等待时间
  },
})
```

适用场景：搜索输入框实时搜索。

## 6. 节流（Throttle）

```ts
useRequest(saveDraft, {
  throttleInterval: 1000,      // 1 秒内最多执行一次
  throttleOptions: {
    leading: true,             // 是否立即执行第一次
    trailing: true,            // 是否在周期结束后执行
  },
})
```

适用场景：滚动加载、表单自动保存。

## 7. Loading 体验优化

```ts
useRequest(api, {
  loadingDelay: 300,   // 300ms 后才显示 loading，避免闪烁
  loadingKeep: 500,    // loading 最少保持 500ms，防止一闪而过
})
```

## 8. 全局配置

通过 `setGlobalOptions` 设置所有 `useRequest` / `usePagination` / `useLoadMore` 的默认值：

```ts
// main.ts 或 应用入口
import { setGlobalOptions } from 'vue-request'

setGlobalOptions({
  manual: false,
  errorRetryCount: 2,
  errorRetryInterval: 1000,
  loadingDelay: 200,
  debounceInterval: 300,
})
```

这样所有请求都会自动应用这些默认配置，无需每个地方重复设置。

## 9. 取消请求

```ts
const { cancel, loading } = useRequest(api)

// 场景：路由离开时取消
import { onBeforeRouteLeave } from 'vue-router'
onBeforeRouteLeave(() => cancel())
```

## 10. refreshDepsAction

当依赖变化触发刷新时，可以执行自定义操作：

```ts
useRequest(api, {
  refreshDeps: [someRef],
  refreshDepsAction: () => {
    console.log('由于依赖变化，正在重新请求...')
  },
})
```
