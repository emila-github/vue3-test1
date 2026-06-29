# Pinia 状态管理学习教程

基于 `pinia@^3.0.4`，Composition API（Setup Store）风格，覆盖从入门到进阶。

## 目录

| 阶段 | 标题 | 路由 |
|------|------|------|
| Stage 1 | Setup Store 快速上手 | `/pinia/stage1` |
| Stage 2 | State 与 Getters | `/pinia/stage2` |
| Stage 3 | Actions 与异步操作 | `/pinia/stage3` |
| Stage 4 | 多 Store 协作 | `/pinia/stage4` |
| Stage 5 | 进阶与最佳实践 | `/pinia/stage5` |

## 核心 API 速查

| API | 说明 |
|-----|------|
| `defineStore(id, setup)` | Setup Store（推荐） |
| `defineStore(id, options)` | Options Store |
| `storeToRefs(store)` | 解构保持响应式 |
| `store.$patch(obj)` | 批量更新 state |
| `store.$patch(fn)` | 函数式批量更新 |
| `store.$reset()` | 重置到初始状态 |
| `store.$subscribe(cb)` | 订阅 state 变化 |
| `store.$onAction(cb)` | 监听 action 调用 |
| `store.$state` | 访问完整 state 对象 |
| `store.$dispose()` | 销毁 store |
