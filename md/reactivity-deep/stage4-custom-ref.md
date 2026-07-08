# Stage 4：customRef 自定义引用

## 学习目标

- 理解 `customRef` 的 `track` 和 `trigger` 机制
- 实现防抖 ref 和节流 ref
- 实现带验证的 ref
- 理解 `ref()` 本质上就是 `customRef` 的封装

## 核心概念

### customRef 基础

`customRef` 让你完全控制 ref 的 get 和 set 行为：

```ts
import { customRef } from 'vue'

function myRef<T>(value: T) {
  return customRef<T>((track, trigger) => ({
    get() {
      track()   // 告诉 Vue：这个 getter 依赖了我
      return value
    },
    set(newVal) {
      value = newVal
      trigger() // 告诉 Vue：我变了，通知依赖更新
    },
  }))
}
```

### 防抖 ref

```ts
function useDebouncedRef<T>(initial: T, delay = 500) {
  let timer: ReturnType<typeof setTimeout> | null = null
  let value = initial

  return customRef<T>((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(val) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        value = val
        trigger() // 只有防抖结束后才触发更新
      }, delay)
    },
  }))
}
```

### 节流 ref

```ts
function useThrottledRef<T>(initial: T, delay = 1000) {
  let value = initial
  let lastTrigger = 0

  return customRef<T>((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(val) {
      const now = Date.now()
      if (now - lastTrigger >= delay) {
        value = val
        lastTrigger = now
        trigger()
      }
    },
  }))
}
```

### 带验证的 ref

```ts
function useValidatedRef(initial: number, validator: (v: number) => boolean) {
  let value = initial

  return customRef<{ value: number; error: string }>((track, trigger) => ({
    get() {
      track()
      return {
        value,
        error: validator(value) ? '' : '值不合法',
      }
    },
    set(obj) {
      if (validator(obj.value)) {
        value = obj.value
      }
      trigger()
    },
  }))
}
```

## API 参考

| 参数 | 说明 |
|------|------|
| `track()` | 在 get 中调用，标记依赖收集 |
| `trigger()` | 在 set 中调用，触发依赖更新 |
| `customRef<T>(factory)` | 工厂函数返回 `{ get, set }` 对象 |

## 常见陷阱

1. **必须调用 track() 和 trigger()**：否则响应式系统无法正常工作
2. **不要在 get 中调用 trigger()**：会导致无限循环
3. **防抖和节流的延迟设置**：延迟过短可能失去优化效果，过长则影响用户体验
4. **customRef 内部值不会自动解包**：与普通 ref 不同

## 示例页面

打开 `/reactivity-deep/stage4` 查看交互式演示。
