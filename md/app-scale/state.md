# 状态管理

## 学习目标

- 理解为什么需要状态管理
- 了解 Vue 状态管理方案对比
- 掌握 Pinia 基本用法

## 方案对比

| 方案 | 适用场景 |
|------|----------|
| ref/reactive | 组件内部局部状态 |
| Composables | 少数组件共享 |
| provide/inject | 祖先 → 后代传递 |
| Pinia（推荐） | 中大型应用全局状态 |

## Pinia 快速示例

```ts
// Setup Store
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, double, increment }
})

// 组件中使用
const store = useCounterStore()
const { count, double } = storeToRefs(store)
```

## 深入学习

完整的 5 阶段 Pinia 教程请访问 `/pinia`。

## 示例页面

打开 `/state` 查看状态管理概览。
