# usePagination — 分页

## 签名

```ts
function usePagination<R, P extends unknown[] = any>(
  service: Service<R, P>,
  options?: PaginationOptions<R, P>
): PaginationQueryResult<R, P>
```

## 与 useRequest 的关系

`usePagination` 是 `useRequest` 的扩展，除了继承所有 `useRequest` 的 options 和返回值外，额外提供分页状态管理。

## 类型定义

```ts
interface PaginationType {
  currentKey: string    // 当前页码字段名，默认 'current'
  pageSizeKey: string   // 每页条数字段名，默认 'pageSize'
  totalKey: string      // 总条数字段名，默认 'total'
  totalPageKey: string  // 总页数字段名，默认 'totalPage'
}

interface PaginationOptions<R, P extends unknown[]>
  extends Options<R, P> {
  pagination?: Partial<PaginationType> // 自定义字段映射
}
```

## 额外返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| `current` | `WritableComputedRef<number>` | 当前页码 |
| `pageSize` | `WritableComputedRef<number>` | 每页条数 |
| `total` | `ComputedRef<number>` | 总条数 |
| `totalPage` | `ComputedRef<number>` | 总页数 |
| `changeCurrent` | `(current: number) => void` | 修改页码 |
| `changePageSize` | `(pageSize: number) => void` | 修改每页条数 |
| `changePagination` | `(current: number, pageSize: number) => void` | 同时修改页码和每页条数 |

> 同时继承 `useRequest` 全部返回值：`data`, `loading`, `error`, `run`, `refresh`, `cancel`, `mutate` 等。

## 基础示例

### 与 Ant Design Vue Table 结合

```vue
<script setup lang="ts">
import { usePagination } from 'vue-request'
import { getEmployeeList, type Employee } from '@/api/employee'
import { message } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue'

const {
  data,
  loading,
  current,
  pageSize,
  total,
  changeCurrent,
  changePageSize,
} = usePagination(
  (params) => getEmployeeList({ page: params.current, size: params.pageSize }),
  {
    defaultParams: [{ current: 1, pageSize: 10 }],
    // 可根据实际 API 返回结构调整：
    // pagination: { currentKey: 'page', pageSizeKey: 'size' },
    onError: (err) => message.error(err.message),
  }
)

// 处理 Table onChange
function handleTableChange(pag: TablePaginationConfig) {
  changePagination(pag.current!, pag.pageSize!)
}
</script>

<template>
  <a-table
    :data-source="data?.list ?? []"
    :loading="loading"
    :pagination="{
      current,
      pageSize,
      total,
      showSizeChanger: true,
      showTotal: (t) => `共 ${t} 条`,
    }"
    @change="handleTableChange"
  >
    <!-- columns -->
  </a-table>
</template>
```

### 自定义 pagination 字段映射

当后端接口不是标准的 `current / pageSize / total` 时：

```ts
// 后端返回: { page: 1, size: 10, totalCount: 100, totalPages: 10 }
usePagination(getList, {
  pagination: {
    currentKey: 'page',    // 前端页码 → 后端 page
    pageSizeKey: 'size',   // 前端每页条数 → 后端 size
    totalKey: 'totalCount',// 后端总条数字段 → 前端 total
    totalPageKey: 'totalPages',
  },
})
```

## 完整场景示例

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import { usePagination } from 'vue-request'
import { getEmployees } from '@/api/employee'

const filters = reactive({ keyword: '', department: '' })

const {
  data,
  loading,
  current,
  pageSize,
  total,
  refresh,
} = usePagination(
  () => getEmployees({
    page: current.value,
    size: pageSize.value,
    ...filters, // 合并筛选条件
  }),
  {
    defaultParams: [{ current: 1, pageSize: 10 }],
  }
)

function handleSearch() {
  current.value = 1 // 搜索时回到第一页
  refresh()
}
</script>
```

## 注意事项

1. `service` 的参数顺序：`(params: P)` 中 `params` 的第一个元素是分页参数对象（包含 `current` 和 `pageSize`），第二个是额外的业务参数。
2. `usePagination` 会自动管理分页状态，无需手动维护 `current` 和 `pageSize`。
3. 切换 `pageSize` 时，会自动重置 `current` 为 1。
