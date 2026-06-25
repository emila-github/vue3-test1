# useLoadMore — 加载更多

## 签名

```ts
function useLoadMore<R extends DataType>(
  service: LoadMoreService<R>,
  options?: LoadMoreBaseOptions<R>
): LoadMoreQueryResult<R>
```

## 与 usePagination 的区别

| | usePagination | useLoadMore |
|------|:---:|:---:|
| 场景 | 表格分页（上一页/下一页） | 无限滚动 / 加载更多 |
| 数据形态 | 每次请求替换上一页数据 | 每次请求的数据追加到列表末尾 |
| UI 模式 | Pagination 组件 | "加载更多" 按钮 / 滚动到底部触发 |

## 类型定义

```ts
type DataType = {
  list: any[]
  [key: string]: any
}

type LoadMoreService<R extends DataType> = (data?: R) => Promise<R>

type LoadMoreBaseOptions<R> = {
  ready?: Ref<boolean> | (() => boolean)
  manual?: boolean
  refreshDeps?: WatchSource | WatchSource[]
  refreshDepsAction?: () => void
  debounceInterval?: number
  debounceOptions?: DebounceOptions
  throttleInterval?: number
  throttleOptions?: ThrottleOptions
  errorRetryCount?: number
  errorRetryInterval?: number
  isNoMore?: (data?: R) => boolean   // 判断是否还有更多数据
  onBefore?: () => void
  onAfter?: () => void
  onSuccess?: (data: R) => void
  onError?: (error: Error) => void
}
```

## 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| `data` | `Ref<R \| undefined>` | 每次请求的原始返回数据 |
| `dataList` | `ComputedRef<R['list']>` | 合并后的列表数据（所有页累加） |
| `loading` | `Ref<boolean>` | 是否首次加载中 |
| `loadingMore` | `Ref<boolean>` | 是否正在加载下一页 |
| `noMore` | `ComputedRef<boolean>` | 是否没有更多数据 |
| `error` | `Ref<Error \| undefined>` | 错误信息 |
| `loadMore` | `() => void` | 加载下一页 |
| `loadMoreAsync` | `() => Promise<R>` | 加载下一页（返回 Promise） |
| `refresh` | `() => void` | 重置并重新加载第一页 |
| `refreshAsync` | `() => Promise<R>` | 同上（返回 Promise） |
| `cancel` | `() => void` | 取消当前请求 |
| `mutate` | `Mutate<R>` | 修改数据 |

## 基础示例

```vue
<script setup lang="ts">
import { useLoadMore } from 'vue-request'
import { getArticles } from '@/api/article'

const {
  dataList,
  loading,
  loadingMore,
  noMore,
  loadMore,
  refresh,
} = useLoadMore(
  // service: 接收上次返回的 data，返回下一页数据
  (lastData) => {
    const page = lastData?.page ?? 0
    return getArticles({ page: page + 1, size: 20 })
  },
  {
    // 判断是否没有更多数据
    isNoMore: (data) => data && data.page >= data.totalPages,
  }
)
</script>

<template>
  <div>
    <div v-for="item in dataList" :key="item.id">
      {{ item.title }}
    </div>

    <div v-if="loading" class="loading">首次加载中...</div>

    <div v-else-if="noMore" class="end">— 没有更多了 —</div>

    <a-button
      v-else
      :loading="loadingMore"
      @click="loadMore"
    >
      加载更多
    </a-button>
  </div>
</template>
```

### 无限滚动（滚动到底部自动加载）

```vue
<script setup lang="ts">
import { useLoadMore } from 'vue-request'
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'

const {
  dataList,
  loadingMore,
  noMore,
  loadMore,
} = useLoadMore(
  (lastData) => {
    const page = lastData?.page ?? 0
    return getFeeds({ page: page + 1, size: 10 })
  },
  { isNoMore: (d) => d && d?.page >= d?.totalPages }
)

// 监听底部元素，滚动到可见时自动加载
const sentinel = ref<HTMLElement>()
useIntersectionObserver(sentinel, ([entry]) => {
  if (entry.isIntersecting && !loadingMore.value && !noMore.value) {
    loadMore()
  }
})
</script>

<template>
  <div class="feed-list">
    <div v-for="item in dataList" :key="item.id" class="feed-item">
      {{ item.content }}
    </div>
    <div ref="sentinel" class="sentinel">
      {{ loadingMore ? '加载中...' : noMore ? '— 没有更多了 —' : '' }}
    </div>
  </div>
</template>
```

## 注意事项

1. `dataList` 是计算属性，会将所有请求的 list 合并为一个数组。
2. `service` 接收的参数是上次返回的完整 `data` 对象（首屏请求时 `lastData` 为 `undefined`）。
3. `isNoMore` 用来告诉库何时停止加载，需根据实际 API 返回结构编写判断逻辑。
4. 调用 `refresh()` 会清空已加载的数据，重新从第一页开始。
