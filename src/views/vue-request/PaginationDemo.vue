<script setup lang="ts">
import { reactive, ref } from 'vue'
import { usePagination } from 'vue-request'
import { get } from '@/api/request'
import { message } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue'

interface UserItem {
  id: number
  name: string
  email: string
  status: string
  role: string
}

interface PageResult {
  list: UserItem[]
  total: number
  current: number
  pageSize: number
}

const searchForm = reactive({ keyword: '' })

const {
  data,
  loading,
  current,
  pageSize,
  total,
  changeCurrent,
  changePageSize,
  refresh,
} = usePagination<PageResult>(
  ({ current, pageSize }) =>
    get('/vr/demo/user-list', {
      page: current,
      pageSize,
      keyword: searchForm.keyword,
    }),
  {
    defaultParams: [{ current: 1, pageSize: 10 }],
    debounceInterval: 200,
    onError: (err) => message.error((err as Error).message),
  },
)

function handleTableChange(pag: TablePaginationConfig) {
  if (pag.pageSize !== pageSize.value) {
    changePageSize(pag.pageSize!)
  } else {
    changeCurrent(pag.current!)
  }
}

function handleSearch() {
  changeCurrent(1)
  refresh()
}

function handleReset() {
  searchForm.keyword = ''
  handleSearch()
}

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '角色', dataIndex: 'role', key: 'role' },
  { title: '状态', dataIndex: 'status', key: 'status' },
]
</script>

<template>
  <div class="pagination-demo">
    <a-page-header title="② 分页 (usePagination)" @back="() => $router.push('/vue-request')" />

    <a-card size="small" style="margin-bottom:16px">
      <a-form layout="inline" :model="searchForm">
        <a-form-item label="搜索">
          <a-input
            v-model:value="searchForm.keyword"
            placeholder="姓名/邮箱"
            allow-clear
            style="width:200px"
            @press-enter="handleSearch"
          />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">搜索</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card size="small">
      <a-table
        :columns="columns"
        :data-source="data?.list ?? []"
        :loading="loading"
        row-key="id"
        size="small"
        :pagination="{
          current,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (t: number) => `共 ${t} 条`,
          pageSizeOptions: ['5', '10', '20'],
        }"
        @change="handleTableChange"
      />

      <div class="code-hint">
        <p><b>usePagination</b> 自动管理 <code>current</code> / <code>pageSize</code> / <code>total</code>。</p>
        <p>切换 pageSize 时自动重置到第 1 页。搜索时调用 <code>changeCurrent(1) + refresh()</code> 回到首页。</p>
        <p>继承 <code>useRequest</code> 全部 options（如 onError、debounceInterval）。</p>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
.pagination-demo {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 16px 40px;
}

.code-hint {
  margin-top: 12px;
  padding: 10px 14px;
  background: #f6f8fa;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  line-height: 1.7;
}

.code-hint p {
  margin: 0;
}

.code-hint code {
  background: #e8e8e8;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
  color: #d63384;
}
</style>
