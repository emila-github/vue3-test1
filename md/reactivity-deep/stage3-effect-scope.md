# Stage 3：effectScope 作用域管理

## 学习目标

- 理解 `effectScope` 的设计意图和使用场景
- 掌握 `onScopeDispose` 的清理回调机制
- 使用 `getCurrentScope` 检测当前作用域
- 区分 detached 和继承模式的子 scope

## 核心概念

### 为什么需要 effectScope？

在没有 effectScope 时，每个 `watch` / `watchEffect` / `computed` 创建后都需要手动调用 `stop()` 清理：

```ts
const stop1 = watch(source1, cb1)
const stop2 = watchEffect(cb2)
const stop3 = watch(source3, cb3)

// 清理时需要逐个调用
onUnmounted(() => {
  stop1()
  stop2()
  stop3()
})
```

使用 effectScope 可以将多个副作用归入一个作用域：

```ts
const scope = effectScope()

scope.run(() => {
  watch(source1, cb1)
  watchEffect(cb2)
  watch(source3, cb3)
})

// 一键清理所有副作用
onUnmounted(() => scope.stop())
```

### 基础用法

```ts
import { effectScope, onScopeDispose } from 'vue'

const scope = effectScope()

scope.run(() => {
  const timer = setInterval(() => { /* ... */ }, 1000)

  // 注册清理回调，在 scope.stop() 时自动执行
  onScopeDispose(() => {
    clearInterval(timer)
  })
})

// 停止 scope，触发所有 onScopeDispose 回调
scope.stop()
```

### 在组合式函数中使用

```ts
function useInterval(fn: () => void, delay: number) {
  const scope = effectScope()

  scope.run(() => {
    const id = setInterval(fn, delay)
    onScopeDispose(() => clearInterval(id))
  })

  return { stop: () => scope.stop() }
}

// 使用
const { stop } = useInterval(() => console.log('tick'), 1000)
// 组件卸载时
onUnmounted(stop)
```

### detached 子 scope

```ts
const parent = effectScope()

parent.run(() => {
  // 默认子 scope 继承父生命周期
  const child1 = effectScope()
  child1.run(() => { /* 随 parent.stop() 停止 */ })

  // detached = true：独立生命周期
  const child2 = effectScope(true)
  child2.run(() => { /* 不随 parent 停止 */ })
})

parent.stop() // child1 停止，child2 继续运行
```

## API 参考

| API | 说明 |
|-----|------|
| `effectScope(detached?)` | 创建作用域，`detached=true` 独立于父 |
| `scope.run(fn)` | 在作用域内运行副作用函数 |
| `scope.stop()` | 停止作用域，清理所有副作用 |
| `onScopeDispose(fn)` | 注册清理回调 |
| `getCurrentScope()` | 获取当前 effectScope（无则 undefined） |

## 常见陷阱

1. **忘记 stop**：创建 scope 后必须在合适的时机调用 `stop()`，否则内存泄漏
2. **detached 子 scope 不随父停止**：需要单独管理 detached scope 的生命周期
3. **onScopeDispose 时机**：只在 `scope.stop()` 时触发，不是组件卸载时触发（除非在 `onUnmounted` 中调用 `stop()`）

## 示例页面

打开 `/reactivity-deep/stage3` 查看交互式演示。
