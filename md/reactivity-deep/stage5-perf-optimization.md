# Stage 5：性能优化与常见陷阱

## 学习目标

- 掌握 `shallowRef + triggerRef` 的优化策略
- 理解 `reactive` 解构丢失响应式的原因和解决方案
- 学会使用 `v-once` 优化静态区域的渲染
- 掌握 `v-memo` 的条件性跳过渲染

## 核心概念

### shallowRef 大数据优化

当处理大量数据（如万条级数组）时，`ref` 的深层代理会带来显著开销：

```ts
// ❌ 深层代理所有元素
const data = ref(generateBigData(10000))

// ✅ 只代理 .value 层级
const data = shallowRef(generateBigData(10000))

// 修改内部元素后手动触发
data.value[0].label = 'updated'
triggerRef(data)
```

**适用场景**：
- 列表数据只需要整体替换或只在提交时收集
- 与服务端 SSR 数据集成的场景
- 第三方库产生的不可变数据结构

### reactive 解构陷阱

```ts
const state = reactive({ name: '张三', age: 25 })

// ❌ 解构后是普通值
const { name, age } = state
setTimeout(() => { state.age = 30 }, 1000)
// age 在解构时已被固定为 25，不会变化

// ✅ 用 toRefs 保持响应式
const { name: n, age: a } = toRefs(state)
// n 和 a 现在是 ref，会自动追踪
```

### v-once — 一次性渲染

```vue
<template>
  <div v-once>
    <!-- 只渲染一次，后续 count 变化不会更新 -->
    <p>初始值: {{ count }}</p>
  </div>
  <p>当前值: {{ count }}</p>
</template>
```

### v-memo — 选择性刷新

```vue
<template>
  <div v-for="item in list" :key="item.id" v-memo="[item.selected]">
    <!-- 只有 item.selected 变化时才重新渲染 -->
    {{ item.name }}
  </div>
</template>
```

## 性能优化速查

| 技术 | 场景 | 收益 |
|------|------|------|
| `shallowRef` | 大数组/大对象 | 跳过深层 Proxy 创建 |
| `shallowReactive` | 深层嵌套但只需顶层响应 | 减少代理层级 |
| `markRaw()` | 第三方实例、不可变数据 | 杜绝不必要的代理 |
| `v-once` | 静态内容区域 | 跳过 diff 和渲染 |
| `v-memo` | 大列表选择性更新 | 按依赖跳过子树 diff |
| `computed` 缓存 | 计算密集型派生 | 依赖不变则直接返回 |
| `toRefs` | reactive 解构 | 保持响应式 |

## 常见陷阱

1. **shallowRef 内部修改不更新**：必须整体替换 `.value` 或调用 `triggerRef()`
2. **reactive 解构后不是 ref**：需要 `toRefs()` 手动转换
3. **markRaw 不可逆**：标记后永远无法再被代理
4. **v-memo 依赖过多**：依赖数组太大反而增大对比成本
5. **过早优化**：先保证正确，在 DevTools Profiler 确认瓶颈后再优化

## 示例页面

打开 `/reactivity-deep/stage5` 查看交互式演示。
