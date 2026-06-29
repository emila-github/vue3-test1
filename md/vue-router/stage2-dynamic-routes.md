# Stage 2：动态路由与参数

## 学习目标

- 使用 `:paramName` 定义路径参数
- 区分 params 和 query 的使用场景
- 通过 `props` 将参数传递给组件
- 使用 `watch` 和 `onBeforeRouteUpdate` 侦听路由变化

## 路径参数：params

在路由路径中使用 `:paramName` 定义动态段。多个参数用多个冒号前缀。

```ts
const routes = [
  { path: '/product/:id', name: 'product', component: ProductDetail },
  // 多段参数
  { path: '/user/:userId/post/:postId', component: PostDetail },
  // 可选参数（正则）
  { path: '/category/:name(.*)?' },
]
```

### 跳转到带参数的路由

```ts
router.push({ name: 'product', params: { id: '123' } })
```

### 组件内获取

```ts
const route = useRoute()
console.log(route.params.id)  // '123'
```

## 查询参数：query

query 是 URL `?` 后的键值对，完全可选，适合搜索筛选场景。

```ts
// 跳转时带 query
router.push({ path: '/search', query: { keyword: 'vue', sort: 'price' } })
// 结果 URL: /search?keyword=vue&sort=price

// 组件内获取
const route = useRoute()
console.log(route.query.keyword)  // 'vue'
```

### query 与 params 的区别

| 维度 | params | query |
|------|--------|-------|
| URL 形式 | `/user/:id` → `/user/123` | `/search?q=vue&page=1` |
| 是否必填 | 路由定义时占位，通常必填 | 完全可选 |
| 访问方式 | `route.params.id` | `route.query.q` |
| 命名路由传参 | `{ name: 'user', params: { id } }` | `{ name: 'search', query: { q } }` |
| 路径传参 | 必须用 name，path 无效 | path 和 name 均可 |
| 刷新持久化 | 是（在 URL 路径中） | 是（在 URL 查询串中） |

## Props 传参

在路由配置中开启 `props: true`，参数会自动作为组件的 props 传入。

```ts
// 路由配置
{ path: '/product/:id', component: ProductDetail, props: true }

// 组件内直接声明 props
const props = defineProps<{ id: string }>()
console.log(props.id)  // 直接访问，无需 useRoute()
```

### props 的三种模式

```ts
// 1. 布尔模式：params 全部作为 props
{ path: '/user/:id', props: true }

// 2. 对象模式：静态 props
{ path: '/promo', props: { newsletter: true } }

// 3. 函数模式：自定义映射
{ path: '/search', props: (route) => ({ query: route.query.q }) }
```

## 响应路由参数变化

当从 `/product/1` 导航到 `/product/2` 时，**同一个组件实例被复用**，不会重新创建。

### 方式 1：watch

```ts
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => route.params.id,
  (newId) => {
    fetchProduct(newId)
  }
)
```

### 方式 2：onBeforeRouteUpdate（推荐）

```ts
import { onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteUpdate((to) => {
  // 在新路由解析前触发
  fetchProduct(to.params.id)
})
```

## 常见陷阱

1. **params 变化时组件不会重新挂载**：必须手动侦听参数变化并重新获取数据。
2. **命名路由 + params 是唯一有效组合**：`router.push({ path: '/user', params: { id: 1 } })` 中 params 会被忽略。
3. **query 值是字符串或字符串数组**：`route.query.page` 是 `string` 而非 `number`，需要手动转换。

## 示例页面

打开 `/vue-router/stage2` 查看交互式演示：产品列表（params 跳转详情）、搜索筛选（query 传参）、路由变化日志。
