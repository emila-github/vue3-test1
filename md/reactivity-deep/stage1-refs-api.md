# Stage 1：ref / reactive API 家族

## 学习目标

- 掌握 `ref` 与 `reactive` 的核心区别和使用场景
- 理解 `shallowRef` / `shallowReactive` 的浅层响应式原理
- 学会用 `toRef` / `toRefs` 保持解构后的响应式
- 能够使用 `isRef` / `isReactive` / `isProxy` 做类型检测
- 了解 `toRaw` / `markRaw` 如何脱离代理

## 核心概念

### ref vs reactive

```ts
import { ref, reactive } from 'vue'

// ref：包装任意值为响应式，通过 .value 访问
const count = ref(0)
count.value++ // 触发更新

// reactive：深层代理对象，直接访问属性
const user = reactive({ name: '张三', age: 25 })
user.age++ // 触发更新
```

| 特性 | ref | reactive |
|------|-----|----------|
| 适用类型 | 任意值（基本类型 + 对象） | 仅对象/数组 |
| 访问方式 | `.value` | 直接属性访问 |
| 深层代理 | 是（对象时） | 是 |
| 解构响应式 | 保持（顶层 ref） | 丢失（需 toRefs） |
| 模板自动解包 | 是（顶层 ref） | 否 |

### shallowRef — 浅层 ref

```ts
const data = shallowRef({ items: [] })

// ❌ 不触发更新
data.value.items.push('new')

// ✅ 触发更新
data.value = { items: ['new'] }
triggerRef(data) // 或手动触发
```

### toRef / toRefs — 保持响应式的解构

```ts
const state = reactive({ name: '张三', age: 25 })

// ❌ 丢失响应式
const { name, age } = state

// ✅ 保持响应式
const { name: nameRef, age: ageRef } = toRefs(state)
// 或单独
const ageOnly = toRef(state, 'age')
```

### markRaw — 标记永不代理

```ts
import { markRaw, reactive, isReactive } from 'vue'

const heavyObj = markRaw({ nested: '大数据' })
const wrapper = reactive({ data: heavyObj })

isReactive(wrapper)        // true
isReactive(wrapper.data)   // false — 未被代理
```

## API 参考

| API | 签名 | 说明 |
|-----|------|------|
| `ref(value)` | `Ref<T>` | 创建响应式引用 |
| `reactive(obj)` | `T` | 深层响应式代理 |
| `readonly(obj)` | `DeepReadonly<T>` | 只读代理 |
| `shallowRef(v)` | `Ref<T>` | 浅层 ref |
| `shallowReactive(o)` | `T` | 浅层 reactive |
| `toRef(obj, key)` | `Ref<T[K]>` | 创建指向属性的 ref |
| `toRefs(obj)` | `{ [K]: Ref<T[K]> }` | 转为 ref 集合 |
| `unref(v)` | `T` | 解包 ref 取值 |
| `isRef(v)` | `boolean` | 判断是否为 ref |
| `isReactive(v)` | `boolean` | 判断是否为 reactive 代理 |
| `isProxy(v)` | `boolean` | 判断是否为 reactive 或 readonly 代理 |
| `isReadonly(v)` | `boolean` | 判断是否为 readonly 代理 |
| `toRaw(obj)` | `T` | 获取 Proxy 原始对象 |
| `markRaw(obj)` | `T` | 标记永不代理 |
| `triggerRef(ref)` | `void` | 手动触发 shallowRef 更新 |

## 常见陷阱

1. **reactive 解构丢失响应式**：解构 `reactive` 对象得到的是普通值，必须用 `toRefs()`
2. **ref 对象在模板中自动解包**：顶层 ref 在 template 中不需要 `.value`，但插值表达式中的 ref 对象需要
3. **shallowRef 内部修改不触发更新**：修改 `shallowRef.value.xxx` 不触发，只能整体替换或 `triggerRef`
4. **markRaw 后不可逆**：`markRaw` 是永久的，无法重新代理
5. **reactive 的基本类型局限**：`reactive()` 只能用于对象/数组，基本类型必须用 `ref()`

## 示例页面

打开 `/reactivity-deep/stage1` 查看交互式演示。
