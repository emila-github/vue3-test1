# 完整场景示例

以下示例均基于本项目的技术栈：Vue 3 + TypeScript + Ant Design Vue + Axios。

## 场景一：员工列表（分页 + 搜索 + 刷新）

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { usePagination } from 'vue-request'
import { getEmployeeList } from '@/api/employee'
import { message } from 'ant-design-vue'
import type { Employee, PaginatedResult } from '@/types'

const searchForm = reactive({ keyword: '', department: '' })

const {
  data,
  loading,
  current,
  pageSize,
  total,
  changeCurrent,
  changePageSize,
  refresh,
} = usePagination(
  () => getEmployeeList({
    page: current.value,
    size: pageSize.value,
    ...searchForm,
  }),
  {
    defaultParams: [{ current: 1, pageSize: 10 }],
    debounceInterval: 300, // 防止快速点击分页
    errorRetryCount: 2,
    onError: (err) => message.error(`加载失败: ${err.message}`),
  }
)

function handleSearch() {
  changeCurrent(1) // 搜索回到第一页
  refresh()
}

function handleReset() {
  searchForm.keyword = ''
  searchForm.department = ''
  handleSearch()
}

function handleTableChange(pag: { current: number; pageSize: number }) {
  if (pag.pageSize !== pageSize.value) {
    changePageSize(pag.pageSize)
  } else {
    changeCurrent(pag.current)
  }
}
</script>

<template>
  <a-card title="员工管理">
    <a-form layout="inline" :model="searchForm">
      <a-form-item label="关键词">
        <a-input v-model:value="searchForm.keyword" placeholder="姓名/工号" />
      </a-form-item>
      <a-form-item label="部门">
        <a-select v-model:value="searchForm.department" style="width: 160px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="tech">技术部</a-select-option>
          <a-select-option value="product">产品部</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>

    <a-table
      :data-source="data?.list ?? []"
      :loading="loading"
      row-key="id"
      :pagination="{
        current,
        pageSize,
        total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (t) => `共 ${t} 条`,
      }"
      @change="handleTableChange"
    >
      <a-table-column title="工号" data-index="employeeNo" />
      <a-table-column title="姓名" data-index="name" />
      <a-table-column title="部门" data-index="orgPath" />
    </a-table>
  </a-card>
</template>
```

## 场景二：用户详情（条件请求 + 依赖刷新）

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import { getUserDetail } from '@/api/user'

const props = defineProps<{ userId: number }>()

const {
  data: user,
  loading,
  error,
} = useRequest(
  () => getUserDetail(props.userId),
  {
    ready: () => props.userId > 0, // userId 有效时才请求
    refreshDeps: [() => props.userId], // userId 变化自动刷新
    cacheKey: `user-${props.userId}`,   // 每个用户缓存独立
    staleTime: 30 * 1000,              // 30 秒内不重复请求
  }
)
</script>

<template>
  <a-spin :spinning="loading">
    <a-result v-if="error" status="error" :title="error.message" />
    <a-descriptions v-else-if="user" :column="1">
      <a-descriptions-item label="姓名">{{ user.name }}</a-descriptions-item>
      <a-descriptions-item label="年龄">{{ user.age }}</a-descriptions-item>
    </a-descriptions>
  </a-spin>
</template>
```

## 场景三：表单提交（manual + loading）

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import { useRequest } from 'vue-request'
import { createEmployee } from '@/api/employee'
import { message } from 'ant-design-vue'

const form = reactive({ name: '', age: 0, department: '' })

const { run, loading } = useRequest(createEmployee, {
  manual: true,
  onSuccess: () => {
    message.success('创建成功')
    // 重置表单 / 关闭弹窗 等
  },
  onError: (err) => message.error(err.message),
})

function handleSubmit() {
  run(form) // 传入参数
}
</script>

<template>
  <a-form :model="form" @finish="handleSubmit">
    <a-form-item name="name" label="姓名">
      <a-input v-model:value="form.name" />
    </a-form-item>
    <a-button type="primary" html-type="submit" :loading="loading">
      保存
    </a-button>
  </a-form>
</template>
```

## 场景四：实时搜索（防抖 + ready）

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRequest } from 'vue-request'
import { searchUsers } from '@/api/user'

const keyword = ref('')

const { data, loading } = useRequest(
  () => searchUsers(keyword.value),
  {
    ready: computed(() => keyword.value.trim().length >= 2),
    debounceInterval: 500, // 500ms 防抖
    cacheKey: 'user-search',
    staleTime: 10 * 1000,
  }
)

const options = computed(() =>
  (data.value ?? []).map(u => ({ label: u.name, value: u.id }))
)
</script>

<template>
  <a-select
    v-model:value="keyword"
    :options="options"
    :loading="loading"
    show-search
    mode="multiple"
    placeholder="输入至少 2 个字符搜索"
  />
</template>
```

## 场景五：数据看板轮询

```vue
<script setup lang="ts">
import { useRequest } from 'vue-request'
import { getDashboardStats } from '@/api/dashboard'

const { data } = useRequest(getDashboardStats, {
  pollingInterval: 10000,          // 10 秒轮询
  pollingWhenHidden: false,        // 页面隐藏时停止
  errorRetryCount: 3,
})
</script>

<template>
  <a-row :gutter="16">
    <a-col :span="6">
      <a-statistic title="今日订单" :value="data?.todayOrders ?? 0" />
    </a-col>
    <a-col :span="6">
      <a-statistic title="在线用户" :value="data?.onlineUsers ?? 0" />
    </a-col>
  </a-row>
</template>
```

## 场景六：无限滚动文章列表

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useLoadMore } from 'vue-request'
import { useIntersectionObserver } from '@vueuse/core'
import { getArticles } from '@/api/article'

const sentinel = ref<HTMLDivElement>()

const {
  dataList,
  loadingMore,
  noMore,
  loadMore,
  refresh,
} = useLoadMore(
  (lastData) => {
    const page = lastData?.page ?? 0
    return getArticles({ page: page + 1, size: 10 })
  },
  {
    isNoMore: (d) => {
      if (!d) return false
      return d.currentPage >= d.totalPages
    },
    throttleInterval: 1000, // 防止频繁触发
  }
)

useIntersectionObserver(sentinel, ([entry]) => {
  if (entry.isIntersecting && !loadingMore.value && !noMore.value) {
    loadMore()
  }
})
</script>

<template>
  <a-list :data-source="dataList">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta :title="item.title" :description="item.summary" />
      </a-list-item>
    </template>
  </a-list>

  <div ref="sentinel" style="text-align: center; padding: 16px">
    <a-spin v-if="loadingMore" size="small" />
    <span v-else-if="noMore">— 没有更多了 —</span>
  </div>
</template>
```
