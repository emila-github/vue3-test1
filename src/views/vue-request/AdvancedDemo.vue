<script setup lang="ts">
import { ref } from 'vue'
import { useRequest, clearCache } from 'vue-request'
import { get } from '@/api/request'
import { message } from 'ant-design-vue'

// ========== 1. 缓存 + SWR ==========
const cacheCount = ref(0)
const {
  data: cacheData,
  run: runCache,
  loading: cacheLoading,
  refresh: refreshCache,
} = useRequest<{
  version: string
  random: number
}>(() => get('/vr/demo/status'), {
  cacheKey: 'advanced-cache-demo',
  staleTime: 10 * 1000, // 10秒内视为新鲜，挂载时不重复请求（手动 refresh 除外）
  cacheTime: 60 * 1000,
  onSuccess() {
    cacheCount.value++
  },
})

// ========== 2. 轮询 ==========
const pollingEnabled = ref(true)
const { data: pollData, cancel } = useRequest<{
  status: string
  uptime: number
  timestamp: number
  random: string
}>(() => get('/vr/demo/status'), {
  pollingInterval: 2000,
  pollingWhenHidden: false,
  ready: pollingEnabled,
})

// ========== 3. 错误重试 (50% 失败率) ==========
const retryLogs = ref<string[]>([])
const { run: runRetry, loading: retryLoading } = useRequest<{ result: string }>(() => get('/vr/demo/retry'), {
  manual: true,
  errorRetryCount: 3,
  errorRetryInterval: 1000,
  onSuccess(data) {
    retryLogs.value.push(`✅ ${data!.result}`)
  },
  onError(error) {
    retryLogs.value.push(`❌ ${(error as Error).message}`)
  },
})

// ========== 4. 窗口聚焦刷新 ==========
const focusCount = ref(0)
const { data: focusData } = useRequest<{ version: string; random: string }>(() => get('/vr/demo/status'), {
  refreshOnWindowFocus: true,
  refocusTimespan: 3000,
  onSuccess() {
    focusCount.value++
  },
})

// ========== 5. mutate 乐观更新 ==========
const { data: mutateData, mutate } = useRequest<{ version: string; random: string }>(() => get('/vr/demo/status'))

function handleClearCache() {
  clearCache('advanced-cache-demo')
  refreshCache()
}

function handleMutate() {
  mutate({
    version: '99.9.9',
    random: '手动修改',
  })
}
</script>

<template>
  <div class="advanced-demo">
    <a-page-header title="④ 高级特性" @back="() => $router.push('/vue-request')" />

    <!-- 缓存 + SWR -->
    <a-card title="缓存 + SWR" size="small" style="margin-bottom: 16px">
      <a-descriptions size="small" :column="2">
        <a-descriptions-item label="版本">{{ cacheData?.version ?? '-' }}</a-descriptions-item>
        <a-descriptions-item label="随机数">{{ cacheData?.random ?? '-' }}</a-descriptions-item>
        <a-descriptions-item label="请求次数">{{ cacheCount }}</a-descriptions-item>
        <a-descriptions-item label="策略">
          <a-tag color="blue">staleTime: 10s</a-tag>
          <a-tag color="green">cacheTime: 60s</a-tag>
        </a-descriptions-item>
      </a-descriptions>
      <a-space style="margin-top: 8px">
        <a-button size="small" @click="runCache"> runCache</a-button>
        <a-button size="small" @click="handleClearCache">clearCache</a-button>
      </a-space>
      <div class="code-hint">10 秒内多次进入，直接使用缓存不发起请求；10 秒后先返回缓存再后台更新。</div>
    </a-card>

    <!-- 轮询 -->
    <a-card title="轮询 (pollingInterval)" size="small" style="margin-bottom: 16px">
      <a-switch v-model:checked="pollingEnabled" checked-children="开启" un-checked-children="暂停" />
      <a-descriptions size="small" :column="2" style="margin-top: 8px">
        <a-descriptions-item label="状态">{{ pollData?.status ?? '-' }}</a-descriptions-item>
        <a-descriptions-item label="运行时长">{{ pollData?.uptime ?? 0 }}s</a-descriptions-item>
        <a-descriptions-item label="随机数">{{ pollData?.random ?? '-' }}</a-descriptions-item>
        <a-descriptions-item label="时间戳">{{
          pollData?.timestamp ? new Date(pollData.timestamp).toLocaleTimeString() : '-'
        }}</a-descriptions-item>
      </a-descriptions>
      <div class="code-hint">每 2 秒自动轮询，数据实时更新。关闭开关 → <code>ready=false</code> 自动停止。</div>
    </a-card>

    <!-- 错误重试 -->
    <a-card title="错误重试 (50% 失败率)" size="small" style="margin-bottom: 16px">
      <a-space>
        <a-button type="primary" :loading="retryLoading" @click="runRetry()"> 发起请求（自动重试 3 次） </a-button>
        <a-tag>{{
          retryLogs.length ? (retryLogs[retryLogs.length - 1]?.startsWith('✅') ? '成功' : '失败') : '-'
        }}</a-tag>
      </a-space>
      <a-list v-if="retryLogs.length" size="small" style="margin-top: 8px">
        <a-list-item
          v-for="(log, i) in retryLogs"
          :key="i"
          :style="{ color: log.startsWith('✅') ? '#52c41a' : '#ff4d4f' }"
        >
          {{ log }}
        </a-list-item>
      </a-list>
      <div class="code-hint">
        <code>errorRetryCount: 3</code> + <code>errorRetryInterval: 1000</code>，失败后自动重试。
      </div>
    </a-card>

    <!-- 窗口聚焦刷新 -->
    <a-card title="窗口聚焦刷新" size="small" style="margin-bottom: 16px">
      <a-descriptions size="small" :column="2">
        <a-descriptions-item label="随机数">{{ focusData?.random ?? '-' }}</a-descriptions-item>
        <a-descriptions-item label="刷新次数">{{ focusCount }}</a-descriptions-item>
      </a-descriptions>
      <div class="code-hint"><code>refreshOnWindowFocus: true</code> — 切到其他 Tab 后再切回来，数据自动刷新。</div>
    </a-card>

    <!-- mutate 乐观更新 -->
    <a-card title="mutate — 直接修改 data" size="small">
      <a-descriptions size="small" :column="2">
        <a-descriptions-item label="版本号">{{ mutateData?.version ?? '-' }}</a-descriptions-item>
        <a-descriptions-item label="随机数">{{ mutateData?.random ?? '-' }}</a-descriptions-item>
      </a-descriptions>
      <a-button size="small" style="margin-top: 8px" @click="handleMutate"> mutate({ version: '99.9.9' }) </a-button>
      <div class="code-hint">
        调用 <code>mutate(newData)</code> 直接修改 <code>data</code> 值，无需发起请求。常用于乐观更新场景。
      </div>
    </a-card>
  </div>
</template>

<style scoped>
.advanced-demo {
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
