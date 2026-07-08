# Stage 2：computed & watch 深入

## 学习目标

- 掌握只读和可写 `computed` 的使用场景
- 深入理解 `watch` 的各种选项：deep、immediate、flush
- 理解 `watchEffect` 的自动追踪机制
- 能够区分 `watch` 和 `watchEffect` 的适用场景

## 核心概念

### computed — 可写计算属性

```ts
const firstName = ref('张')
const lastName = ref('三')

const fullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (val: string) => {
    const [first, last] = val.split(' ')
    firstName.value = first
    lastName.value = last
  },
})

fullName.value = '李 四' // 同时更新 firstName 和 lastName
```

### watch 选项

```ts
// deep: 深层侦听
watch(state, (newVal) => {
  console.log('深层变化', newVal)
}, { deep: true })

// immediate: 立即执行
watch(source, (val) => {
  console.log('immediate', val)
}, { immediate: true })

// flush: 控制回调时机
watch(source, callback, { flush: 'pre' })  // 默认，DOM 更新前
watch(source, callback, { flush: 'post' }) // DOM 更新后
watch(source, callback, { flush: 'sync' }) // 同步执行
```

### watchEffect — 自动追踪

```ts
const count = ref(0)
const doubled = ref(0)

// 自动追踪 count，无需手动指定
watchEffect(() => {
  doubled.value = count.value * 2
  console.log(`count 变为 ${count.value}`)
})
```

### watch vs watchEffect

| 特性 | watch | watchEffect |
|------|-------|-------------|
| 追踪方式 | 手动指定数据源 | 自动追踪回调中的依赖 |
| 新旧值 | ✅ 提供 | ❌ 不提供 |
| 立即执行 | 需 `immediate: true` | ✅ 默认立即执行 |
| 停止方法 | 调用返回的 `stop()` | 调用返回的 `stop()` |
| 适用场景 | 需要新旧值对比、懒执行 | 不关心具体变化的副作用 |

### flush 时机详解

```ts
import { watch, watchEffect } from 'vue'

// pre（默认）：DOM 更新前执行
watch(source, cb, { flush: 'pre' })

// post：DOM 更新后执行
watch(source, cb, { flush: 'post' })
// 等同于 watchPostEffect(() => { ... })

// sync：同步执行（谨慎使用）
watch(source, cb, { flush: 'sync' })
// 等同于 watchSyncEffect(() => { ... })
```

## API 参考

| API | 说明 |
|-----|------|
| `computed(getter)` | 只读计算属性 |
| `computed({ get, set })` | 可写计算属性 |
| `watch(source, cb, opts?)` | 侦听器 |
| `watchEffect(fn, opts?)` | 自动追踪副作用 |
| `watchPostEffect(fn)` | DOM 更新后执行的 watchEffect |
| `watchSyncEffect(fn)` | 同步执行的 watchEffect |

## 常见陷阱

1. **computed 不能有副作用**：不要在 computed getter 中修改状态或发起请求
2. **watch reactive 属性要用 getter**：`watch(() => obj.prop, cb)` 而不是 `watch(obj.prop, cb)`
3. **watchEffect 首次执行就收集依赖**：回调中所有访问的响应式数据都会被追踪
4. **deep 选项的性能**：大对象的 deep watch 开销大，应避免不必要的深层侦听
5. **flush: 'sync' 慎用**：可能导致多次不必要的重新渲染

## 示例页面

打开 `/reactivity-deep/stage2` 查看交互式演示。
