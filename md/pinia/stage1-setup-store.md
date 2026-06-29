# Stage 1：Setup Store 快速上手

## 学习目标

- 使用 `defineStore` 创建第一个 Pinia Store
- 理解 Setup Store 与 Options Store 的区别
- 掌握 `storeToRefs` 解构保持响应式
- 在 `main.ts` 中全局注册 Pinia

## 核心概念

### defineStore 两种语法

```ts
// Setup Store（推荐）— Composition API 风格
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, double, increment }
})

// Options Store — 类 Vuex 风格
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: { double: (state) => state.count * 2 },
  actions: { increment() { this.count++ } },
})
```

### 在组件中使用

```ts
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()
const { count, double } = storeToRefs(store)  // ✅ 保持响应式
const { increment } = store                   // action 可直接解构
```

### 全局注册

```ts
// main.ts
import { createPinia } from 'pinia'
app.use(createPinia())
```

## 常见陷阱

- **解构丢失响应式**：必须用 `storeToRefs()` 包装
- **命名约定**：Store 文件用 `useXxxStore`（如 `useCounterStore`）
- **Setup Store 必须 return**：只暴露 return 的属性和方法
- **Options Store 的 `this`**：在 actions/getters 中通过 `this` 访问

## 示例页面

打开 `/pinia/stage1` 查看交互式演示。
