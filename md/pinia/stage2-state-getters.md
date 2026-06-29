# Stage 2：State 与 Getters

## 学习目标

- 使用 `ref`/`reactive` 定义 state
- 使用 `computed` 定义 getter
- 掌握 `$patch`（对象/函数式）批量更新
- 使用 `$reset` 重置状态

## 核心概念

### State 定义

```ts
// 推荐：统一使用 ref
const count = ref(0)
const items = ref([...])
const user = ref({ name: 'Alice' })

// 也可以用 reactive（但不推荐，因为不能整体替换）
const config = reactive({ theme: 'dark' })
```

### Getter 定义

```ts
// 基础 getter
const total = computed(() => items.value.reduce((s, i) => s + i.price, 0))

// 引用其他 Store 的 getter
const cartStore = useCartStore()
const mergedItems = computed(() => [...items.value, ...cartStore.items.value])

// 带参数的 getter（返回函数）
function findById(id: number) {
  return computed(() => items.value.find(i => i.id === id))
}
```

### State 更新策略对比

| 方式 | 语法 | 场景 |
|------|------|------|
| 直接修改 | `store.count++` | 单个字段 |
| $patch 对象 | `store.$patch({ a: 1, b: 2 })` | 批量修改 |
| $patch 函数 | `store.$patch(s => { ... })` | 复杂逻辑 |
| $reset | `store.$reset()` | 恢复初始值 |
| 替换 $state | `store.$state = newObj` | 整体替换 |

## 常见陷阱

- **reactive 不能整体替换**：`state = newObj` 无效，用 `Object.assign(state, newObj)`
- **$patch 函数中修改的是 proxy**：可以直接 `state.items.push(...)`
- **Options Store 的 $reset 自动支持**：Setup Store 需手动实现

## 示例页面

打开 `/pinia/stage2` 查看购物车 State/Getters 交互式演示。
