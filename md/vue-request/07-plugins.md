# 插件系统

vue-request 提供插件机制，允许在请求生命周期的各个阶段插入自定义逻辑。

## 插件接口

```ts
type PluginImplementType<R, P extends any[]> = {
  (queryInstance: Query<R, P>, config: Options<R, P>): Partial<PluginType<R, P>>
}

type PluginType<R, P extends unknown[]> = {
  onBefore: (params: P) => { isBreak?: Boolean; breakResult?: any } | void
  onQuery: (service: () => Promise<R>) => () => Promise<R>
  onSuccess(data: R, params: P): void
  onError(error: Error, params: P): void
  onAfter(params: P, data: R, error: Error): void
  onCancel(): void
  onMutate(data: R): void
}
```

## 生命周期顺序

```
onBefore → onQuery(包装service) → 请求执行 → onSuccess / onError → onAfter
                                                      ↓
                                                  onCancel (如果取消)
                                                      ↓
                                                  onMutate (修改 data 时)
```

## 使用 definePlugin 创建插件

```ts
import { definePlugin } from 'vue-request'

// 简单日志插件
const loggerPlugin = definePlugin(
  (queryInstance, config) => ({
    onBefore(params) {
      console.log('[Request] 发起请求', params)
    },
    onSuccess(data) {
      console.log('[Request] 请求成功', data)
    },
    onError(error) {
      console.log('[Request] 请求失败', error.message)
    },
    onAfter() {
      console.log('[Request] 请求结束')
    },
  }),
)

// 在 useRequest 中使用
const { data } = useRequest(api, {}, [loggerPlugin])
```

## 自定义加载提示插件示例

```ts
import { definePlugin } from 'vue-request'
import { message } from 'ant-design-vue'

// 请求报错时自动弹出 message
const errorNotifyPlugin = definePlugin(
  () => ({
    onError(error) {
      message.error(error.message || '请求失败')
    },
  })
)

// 所有请求通用的错误提示
const { data } = useRequest(getUserList, {}, [errorNotifyPlugin])
```

---

## 从 v1 迁移到 v2

如果你在老项目中见过 v1 写法，v2 主要变化：

| 变化 | v1 | v2 |
|------|----|----|
| usePagination | `usePagination(service, options)` 参数展开 | `usePagination(service, options)` 参数在第一个数组元素中 |
| pagination 参数 | 分散在 service 参数中 | 集中在 `params[0]` 对象中 |
| useLoadMore | 无 | 新增 |
| 插件 | `onBefore/onQuery/onSuccess/onError/onAfter/onCancel/onMutate` (字符串名) | `definePlugin()` 包装 |

> 本项目使用 v2.0.4，直接按 v2 API 编写即可。
