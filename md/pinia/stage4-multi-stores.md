# Stage 4：多 Store 协作

## 学习目标

- 在 Store 的 action/getter 中引用其他 Store
- 理解 Store 间互相引用的安全时机
- 使用 `$subscribe` 订阅 state 变化

## 核心概念

### Store 间互相引用

```ts
import { useUserStore } from './userStore'

export const useOrderStore = defineStore('order', () => {
  // ✅ 在 setup 函数内调用 — Pinia 内部处理了实例共享
  const userStore = useUserStore()

  const canEdit = computed(() => userStore.role === 'admin')

  function placeOrder() {
    if (!userStore.loggedIn) throw new Error('请先登录')
    // ...
  }

  return { canEdit, placeOrder }
})
```

### 避免循环依赖

```ts
// 如果 A Store 和 B Store 互相引用：
// 方案：在 getter/action 内部惰性调用
function getSharedData() {
  const otherStore = useOtherStore()  // 惰性调用
  return otherStore.someData
}
```

### $subscribe 订阅

```ts
store.$subscribe((mutation, state) => {
  // mutation.type     — 'direct' | 'patch object' | 'patch function'
  // mutation.storeId  — store 名称
  // mutation.events   — 变更事件数组
  // state              — 变更后的 state

  console.log(`store 变化，当前数据:`, state)
})

// 停止订阅
const unsubscribe = store.$subscribe(...)
// unsubscribe()
```

## 常见陷阱

- **不要在文件顶层调用 useXxxStore()**：应在 setup 函数内或 action/getter 内部
- **循环依赖**：把相互引用的一方放在函数体内惰性加载
- **$subscribe 的 callback 在 store 变更后触发**：不能用于阻止变更

## 示例页面

打开 `/pinia/stage4` 查看用户 Store + 订单 Store 协作演示。
