<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRequest } from 'vue-request'
import { get } from '@/api/request'

interface UserInfo {
  id: number
  name: string
  version: string
  author: string
  desc: string
}

// ========== 1. 自动请求 ==========
const { data, loading, error, refresh } = useRequest<UserInfo>(() => get('/vr/demo/user'))

// ========== 2. 手动触发 ==========
const manualData = ref<string>('')
const { run, loading: manualLoading } = useRequest<string>(
  (msg: string) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(`收到: ${msg} — ${new Date().toLocaleTimeString()}`), 600)
    })
  },
  { manual: true },
)

function handleRun() {
  run('Hello VueRequest!')
}

// ========== 3. 条件请求(ready) ==========
const keyword = ref('')
const searchResult = ref<any[]>([])
const { data: searchData, loading: searchLoading } = useRequest<any[]>(
  () => get('/vr/demo/search', { q: keyword.value }),
  {
    ready: computed(() => keyword.value.trim().length >= 2),
    refreshDeps: [keyword],
    debounceInterval: 400,
    onSuccess(data) {
      searchResult.value = data as any[]
    },
  },
)

// ========== 4. 生命周期 ==========
const logs = ref<string[]>([])
const { data: user2, run: loadUserById } = useRequest<any>((id: number) => get('/vr/demo/user'), {
  manual: true,
  onBefore(params) {
    logs.value.push(`[onBefore] 准备请求，参数: ${JSON.stringify(params)}`)
  },
  onSuccess(data, params) {
    logs.value.push(`[onSuccess] 请求成功，参数: ${JSON.stringify(params)}`)
  },
  onError(error, params) {
    logs.value.push(`[onError] ${(error as Error).message}`)
  },
  onAfter() {
    logs.value.push(`[onAfter] 请求结束`)
  },
})
</script>

<template>
  <div class="basic-demo">
    <a-page-header title="① 基础用法" @back="() => $router.push('/vue-request')" />

    <!-- 1. 自动请求 -->
    <a-card title="自动请求 (默认行为)" size="small" style="margin-bottom: 16px">
      <a-spin :spinning="loading">
        <a-alert v-if="error" type="error" :message="error.message" />
        <a-descriptions v-else-if="data" size="small" :column="2">
          <a-descriptions-item label="名称">{{ data.name }}</a-descriptions-item>
          <a-descriptions-item label="版本">{{ data.version }}</a-descriptions-item>
          <a-descriptions-item label="作者">{{ data.author }}</a-descriptions-item>
          <a-descriptions-item label="描述">{{ data.desc }}</a-descriptions-item>
        </a-descriptions>
      </a-spin>
      <a-button size="small" style="margin-top: 8px" @click="refresh()">刷新数据</a-button>
      <div class="code-hint">
        组件挂载时自动发起请求。所有状态 <code>data</code> / <code>loading</code> / <code>error</code> 均为响应式 Ref。
      </div>
    </a-card>

    <!-- 2. 手动触发 -->
    <a-card title="手动触发 (manual: true)" size="small" style="margin-bottom: 16px">
      <a-space direction="vertical" style="width: 100%">
        <a-button type="primary" :loading="manualLoading" @click="handleRun"> run('Hello VueRequest!') </a-button>
        <a-alert v-if="manualData" type="success" :message="manualData" />
      </a-space>
      <div class="code-hint">
        设置 <code>manual: true</code> 后不会自动请求，需手动调用 <code>run()</code> 或 <code>runAsync()</code>。
      </div>
    </a-card>

    <!-- 3. 条件请求 + 防抖搜索 -->
    <a-card title="条件请求 + 防抖搜索 (ready + debounceInterval)" size="small" style="margin-bottom: 16px">
      <a-input v-model:value="keyword" placeholder="输入至少 2 个字符搜索用户 (如 '用户1')" allow-clear />
      <a-spin :spinning="searchLoading" style="margin-top: 8px">
        <a-list v-if="searchResult.length" size="small" :data-source="searchResult" style="margin-top: 8px">
          <template #renderItem="{ item }">
            <a-list-item> {{ item.name }} — {{ item.email }} — {{ item.role }} </a-list-item>
          </template>
        </a-list>
        <a-empty v-else-if="keyword.length >= 2 && !searchLoading" description="无匹配结果" />
      </a-spin>
      <div class="code-hint">
        <code>ready</code> 控制请求条件（关键词 ≥ 2），<code>refreshDeps: [keyword]</code> 监听变化，<code
          >debounceInterval: 400</code
        >
        防抖。
      </div>
    </a-card>

    <!-- 4. 生命周期回调 -->
    <a-card title="生命周期回调 (onBefore → onSuccess/onError → onAfter)" size="small">
      <a-space>
        <a-button @click="loadUserById(1)">请求 ID=1</a-button>
        <a-button @click="loadUserById(2)">请求 ID=2</a-button>
      </a-space>
      <a-list size="small" style="margin-top: 8px">
        <a-list-item v-for="(log, i) in logs" :key="i">{{ log }}</a-list-item>
      </a-list>
    </a-card>
  </div>
</template>

<style scoped>
.basic-demo {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 16px 40px;
}

.code-hint {
  margin-top: 8px;
  padding: 8px 12px;
  background: #f6f8fa;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  line-height: 1.6;
}

.code-hint code {
  background: #e8e8e8;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
  color: #d63384;
}
</style>
