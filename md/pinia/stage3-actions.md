# Stage 3：Actions 与异步操作

## 学习目标

- 定义同步和异步 actions
- 理解 action 可以直接修改 state（无需 mutations）
- 使用 `$onAction` 监听 action 调用
- 掌握 `after` 和 `onError` 钩子

## 核心概念

### 同步 Action

```ts
function addTodo(title: string) {
  items.value.push({ id: nextId++, title, done: false })
}
```

### 异步 Action

```ts
// 模拟 API 请求
async function fetchTodos() {
  const res = await fetch('/api/todos')
  items.value = await res.json()
}

// action 可以有返回值
async function createTodo(title: string) {
  const res = await fetch('/api/todos', { method: 'POST', body: JSON.stringify({ title }) })
  const newTodo = await res.json()
  items.value.push(newTodo)
  return newTodo.id
}
```

### $onAction 监听

```ts
const unsubscribe = store.$onAction(({ name, store, args, after, onError }) => {
  console.log(`Action "${name}" 开始，参数:`, args)

  after((result) => {
    console.log(`Action "${name}" 完成，返回:`, result)
  })

  onError((error) => {
    console.error(`Action "${name}" 出错:`, error)
  })
})

// 停止监听
unsubscribe()
```

## 常见陷阱

- **不需要 mutations**：Pinia 的 action 可以直接修改 state
- **异步错误会传播**：调用方可以 try/catch 捕获
- **Options Store 中 action 用普通函数**：箭头函数会丢失 `this`

## 示例页面

打开 `/pinia/stage3` 查看待办事项 Action + `$onAction` 演示。
