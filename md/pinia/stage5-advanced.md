# Stage 5：进阶与最佳实践

## 学习目标

- 掌握 Options Store 语法（适合从 Vuex 迁移）
- 实现状态持久化（localStorage / 插件）
- 理解 Pinia 插件体系
- 动态创建 Store 实例
- 了解常见陷阱与解决方案

## 核心概念

### 持久化方案

```ts
// 方案一：手动 watch + localStorage
watch(
  () => ({ theme: store.theme, lang: store.lang }),
  (val) => localStorage.setItem('settings', JSON.stringify(val)),
  { deep: true },
)

// 方案二：第三方插件 pinia-plugin-persistedstate
import { createPersistedState } from 'pinia-plugin-persistedstate'
pinia.use(createPersistedState())
```

### 自定义插件

```ts
function myPlugin({ store }) {
  // 添加公共属性
  store.apiUrl = 'https://api.example.com'

  // 添加公共方法
  store.resetAll = () => store.$reset()
}

const pinia = createPinia()
pinia.use(myPlugin)
```

### 动态 Store

```ts
function createDynamicStore(id: string) {
  return defineStore(`dynamic-${id}`, () => {
    const count = ref(0)
    function add() { count.value++ }
    return { count, add }
  })()
}
```

## 常见陷阱汇总

| 陷阱 | 错误做法 | 正确做法 |
|------|---------|---------|
| 解构丢失响应式 | `const { count } = store` | `const { count } = storeToRefs(store)` |
| reactive 整体替换 | `state = newObj` | 用 `ref` 包装，或 `Object.assign()` |
| SSR 状态污染 | 单例 store 跨请求共享 | 每次请求重新调用 `useStore()` |
| 循环依赖 | A store 顶层 import B store | 在 getter/action 内部惰性调用 |
| Options Store 箭头函数 | `actions: { fn: () => {} }` | 用普通函数 `actions: { fn() {} }` |

## 示例页面

打开 `/pinia/stage5` 查看 Options Store、持久化、动态 Store 等进阶演示。
