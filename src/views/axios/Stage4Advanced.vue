<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import axios from 'axios'

// ==================== Demo 1: 请求重试（指数退避） ====================
const retryLogs = ref<string[]>([])
const retryCount = ref(0)

function addRetryLog(msg: string) {
  retryLogs.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
  if (retryLogs.value.length > 20) retryLogs.value.shift()
}

async function retryRequest(config: Parameters<typeof axios.request>[0], maxRetries = 3, delay = 1000) {
  let lastError: any
  for (let i = 0; i <= maxRetries; i++) {
    try {
      addRetryLog(`🟢 第 ${i + 1} 次尝试...`)
      const res = await axios.request(config)
      addRetryLog(`✅ 第 ${i + 1} 次成功!`)
      retryCount.value = i
      return res
    } catch (err) {
      lastError = err
      if (i < maxRetries) {
        const waitTime = delay * Math.pow(2, i) // 指数退避: 1s, 2s, 4s
        addRetryLog(`⚠️ 第 ${i + 1} 次失败，${waitTime}ms 后重试...`)
        await new Promise((r) => setTimeout(r, waitTime))
      }
    }
  }
  addRetryLog(`❌ 全部 ${maxRetries + 1} 次重试均失败`)
  throw lastError
}

async function doRetryDemo() {
  retryLogs.value = []
  retryCount.value = 0
  try {
    await retryRequest({ url: '/api/axios-demo/retry-test', method: 'GET' }, 3, 1000)
    message.success('重试成功！')
  } catch (err: any) {
    message.error(`重试失败: ${err.message}`)
  }
}

// ==================== Demo 2: 请求去重 ====================
const dedupLogs = ref<string[]>([])
const dedupResult = ref<string>('')

function addDedupLog(msg: string) {
  dedupLogs.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
  if (dedupLogs.value.length > 15) dedupLogs.value.shift()
}

// 简易请求去重器
const pendingMap = new Map<string, Promise<any>>()

async function dedupRequest(url: string, config?: any) {
  const key = `${config?.method || 'GET'}:${url}:${JSON.stringify(config?.params || {})}`
  if (pendingMap.has(key)) {
    addDedupLog(`⚠️ 检测到重复请求: ${key}，复用已有 Promise`)
    return pendingMap.get(key)!
  }
  addDedupLog(`🟢 发起新请求: ${key}`)
  const promise = axios.get(url, config).finally(() => {
    pendingMap.delete(key)
    addDedupLog(`🗑️ 清除缓存: ${key}`)
  })
  pendingMap.set(key, promise)
  return promise
}

async function doDedupDemo() {
  dedupLogs.value = []
  addDedupLog('=== 同时发起 3 个相同请求 ===')
  try {
    const results = await Promise.all([
      dedupRequest('/api/axios-demo/dedup-test'),
      dedupRequest('/api/axios-demo/dedup-test'),
      dedupRequest('/api/axios-demo/dedup-test'),
    ])
    dedupResult.value = `3 个请求完成，仅实际发送 1 次。时间戳: ${results[0].data?.data?.timestamp}`
    message.success('去重成功，仅发送 1 次请求')
  } catch (err: any) {
    dedupResult.value = `错误: ${err.message}`
  }
}

// ==================== Demo 3: 请求缓存 ====================
const cacheLogs = ref<string[]>([])
const cacheResult = ref<string>('')

function addCacheLog(msg: string) {
  cacheLogs.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
  if (cacheLogs.value.length > 15) cacheLogs.value.shift()
}

// 简易请求缓存器
interface CacheEntry {
  data: any
  timestamp: number
  ttl: number
}
const cacheMap = new Map<string, CacheEntry>()

async function cachedRequest(url: string, ttl = 10000) {
  const now = Date.now()
  // 检查缓存是否有效
  if (cacheMap.has(url)) {
    const entry = cacheMap.get(url)!
    if (now - entry.timestamp < entry.ttl) {
      addCacheLog(`💾 命中缓存: ${url} (有效期剩余 ${ttl - (now - entry.timestamp)}ms)`)
      return entry.data
    } else {
      addCacheLog(`⏰ 缓存已过期: ${url}`)
      cacheMap.delete(url)
    }
  }
  addCacheLog(`🌐 发起网络请求: ${url}`)
  const res = await axios.get(url)
  cacheMap.set(url, { data: res, timestamp: now, ttl })
  addCacheLog(`💾 写入缓存: ${url} (TTL=${ttl}ms)`)
  return res
}

async function doCacheDemo() {
  cacheLogs.value = []
  addCacheLog('=== 第 1 次请求 ===')
  await cachedRequest('/api/axios-demo/cache-test', 10000)
  addCacheLog('=== 第 2 次请求（应命中缓存） ===')
  await cachedRequest('/api/axios-demo/cache-test', 10000)
  addCacheLog('=== 第 3 次请求（应命中缓存） ===')
  await cachedRequest('/api/axios-demo/cache-test', 10000)
  cacheResult.value = '3 次请求，仅第 1 次实际发送，后 2 次命中缓存'
  message.success('缓存演示完成')
}

// ==================== Demo 4: 超时处理 ====================
const timeoutLogs = ref<string[]>([])
const timeoutResult = ref<string>('')

function addTimeoutLog(msg: string) {
  timeoutLogs.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
  if (timeoutLogs.value.length > 10) timeoutLogs.value.shift()
}

async function doTimeoutDemo(timeout: number) {
  timeoutLogs.value = []
  addTimeoutLog(`设置超时: ${timeout}ms`)
  const start = Date.now()
  try {
    await axios.get('/api/axios-demo/slow', { timeout })
    const elapsed = Date.now() - start
    addTimeoutLog(`✅ 请求成功，耗时 ${elapsed}ms`)
    timeoutResult.value = `请求成功，耗时 ${elapsed}ms`
  } catch (err: any) {
    const elapsed = Date.now() - start
    if (err.code === 'ECONNABORTED') {
      addTimeoutLog(`⏰ 请求超时！已等待 ${elapsed}ms`)
      timeoutResult.value = `请求超时 (${timeout}ms)，已等待 ${elapsed}ms`
      message.warning('请求超时')
    } else {
      timeoutResult.value = `错误: ${err.message}`
    }
  }
}

// ==================== Demo 5: 并发控制 ====================
const concurrencyLogs = ref<string[]>([])
const concurrencyResult = ref<string>('')

function addConcurrencyLog(msg: string) {
  concurrencyLogs.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
  if (concurrencyLogs.value.length > 15) concurrencyLogs.value.shift()
}

async function doConcurrencyDemo() {
  concurrencyLogs.value = []
  const urls = [1, 2, 3].map((id) => `/api/axios-demo/${id}`)
  addConcurrencyLog(`发起 ${urls.length} 个并发请求...`)
  const start = Date.now()

  try {
    const results = await Promise.all(urls.map((url) => axios.get(url)))
    const elapsed = Date.now() - start
    results.forEach((res) => {
      addConcurrencyLog(`✅ ID=${res.data?.data?.id} ${res.data?.data?.name}`)
    })
    addConcurrencyLog(`全部完成，总耗时 ${elapsed}ms`)
    concurrencyResult.value = `${urls.length} 个请求并发完成，总耗时 ${elapsed}ms`
    message.success('并发请求完成')
  } catch (err: any) {
    addConcurrencyLog(`❌ 失败: ${err.message}`)
    concurrencyResult.value = `失败: ${err.message}`
  }
}

// ==================== 代码展示 ====================
const retryCode = ref(`// 请求重试（指数退避）
async function retryRequest(config, maxRetries = 3, delay = 1000) {
  for (let i = 0; i <= maxRetries; i++) {
    try { return await axios.request(config) }
    catch (err) {
      if (i < maxRetries) {
        await new Promise(r => setTimeout(r, delay * 2**i))
      } else { throw err }
    }
  }
}`)

const dedupCode = ref(`// 请求去重
const pendingMap = new Map<string, Promise<any>>()

function dedupRequest(url, config) {
  const key = \`\${config.method}:\${url}\`
  if (pendingMap.has(key)) return pendingMap.get(key)
  
  const promise = axios(url, config).finally(() => pendingMap.delete(key))
  pendingMap.set(key, promise)
  return promise
}`)
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 4: 高级特性</h1>
      <p>请求重试（指数退避）、请求去重、请求缓存、超时处理、并发控制</p>
    </header>

    <!-- 请求重试 -->
    <section class="card">
      <h2>1. 请求重试 — 指数退避算法</h2>
      <p class="desc">当请求失败时自动重试，间隔时间按指数增长（1s → 2s → 4s）。Mock 接口有 50% 概率返回 500。</p>
      <div class="demo-row">
        <a-button type="primary" @click="doRetryDemo">开始重试演示</a-button>
        <span v-if="retryCount > 0" style="color: #52c41a; font-weight: 600"> 经过 {{ retryCount }} 次重试后成功 </span>
      </div>
      <div class="log-box">
        <div
          v-for="(log, i) in retryLogs"
          :key="i"
          class="log-line"
          :class="{
            'error-log': log.includes('失败'),
            'success-log': log.includes('成功'),
          }"
        >
          {{ log }}
        </div>
        <div v-if="retryLogs.length === 0" class="log-empty">点击按钮开始重试演示</div>
      </div>
    </section>

    <!-- 请求去重 -->
    <section class="card">
      <h2>2. 请求去重 — 同时发起 3 个相同请求，仅发送 1 次</h2>
      <p class="desc">用 Map 缓存进行中的请求 Promise，后续相同请求直接复用同一个 Promise。</p>
      <div class="demo-row">
        <a-button type="primary" @click="doDedupDemo">并发去重演示</a-button>
      </div>
      <div class="log-box">
        <div v-for="(log, i) in dedupLogs" :key="i" class="log-line">{{ log }}</div>
        <div v-if="dedupLogs.length === 0" class="log-empty">点击按钮观察去重效果</div>
      </div>
      <div v-if="dedupResult" class="result-box">{{ dedupResult }}</div>
    </section>

    <!-- 请求缓存 -->
    <section class="card">
      <h2>3. 请求缓存 — TTL 过期机制</h2>
      <p class="desc">缓存请求结果，有效期内直接返回缓存数据（默认 TTL 10s）。</p>
      <div class="demo-row">
        <a-button type="primary" @click="doCacheDemo">缓存命中演示</a-button>
      </div>
      <div class="log-box">
        <div v-for="(log, i) in cacheLogs" :key="i" class="log-line">{{ log }}</div>
        <div v-if="cacheLogs.length === 0" class="log-empty">点击按钮观察缓存命中</div>
      </div>
      <div v-if="cacheResult" class="result-box">{{ cacheResult }}</div>
    </section>

    <!-- 超时处理 -->
    <section class="card">
      <h2>4. 超时处理 — timeout 配置</h2>
      <p class="desc">Mock 慢接口需 3 秒返回。尝试用不同超时时间请求，观察超时行为。</p>
      <div class="demo-row">
        <a-button @click="doTimeoutDemo(500)">超时 500ms（会超时）</a-button>
        <a-button @click="doTimeoutDemo(4000)">超时 4000ms（成功）</a-button>
      </div>
      <div class="log-box" style="max-height: 120px">
        <div v-for="(log, i) in timeoutLogs" :key="i" class="log-line">{{ log }}</div>
        <div v-if="timeoutLogs.length === 0" class="log-empty">选择超时时间发起请求</div>
      </div>
      <div v-if="timeoutResult" class="result-box">{{ timeoutResult }}</div>
    </section>

    <!-- 并发控制 -->
    <section class="card">
      <h2>5. 并发请求 — Promise.all</h2>
      <p class="desc">同时发起多个独立请求，使用 <code>Promise.all</code> 等待全部完成。</p>
      <div class="demo-row">
        <a-button type="primary" @click="doConcurrencyDemo">并发请求 3 个用户</a-button>
      </div>
      <div class="log-box" style="max-height: 160px">
        <div v-for="(log, i) in concurrencyLogs" :key="i" class="log-line">{{ log }}</div>
        <div v-if="concurrencyLogs.length === 0" class="log-empty">点击按钮发起并发请求</div>
      </div>
      <div v-if="concurrencyResult" class="result-box">{{ concurrencyResult }}</div>
    </section>

    <!-- 代码展示 -->
    <section class="card">
      <h2>6. 核心代码参考</h2>
      <div class="code-grid">
        <div>
          <h3>请求重试</h3>
          <div class="code-block">
            <pre>{{ retryCode }}</pre>
          </div>
        </div>
        <div>
          <h3>请求去重</h3>
          <div class="code-block">
            <pre>{{ dedupCode }}</pre>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 28px;
}

.page-header h1 {
  font-size: 26px;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.page-header p {
  color: #888;
  font-size: 14px;
  margin: 0;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card h2 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #333;
}

.card h3 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #555;
}

.desc {
  color: #888;
  font-size: 13px;
  line-height: 1.6;
  margin: 0 0 14px;
}

.desc code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.code-block {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.5;
}

.code-block pre {
  margin: 0;
}

.code-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.demo-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 8px;
}

.log-box {
  background: #1a1a2e;
  border-radius: 8px;
  padding: 12px 16px;
  max-height: 200px;
  overflow-y: auto;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  margin-top: 8px;
}

.log-line {
  color: #a6e3a1;
  padding: 2px 0;
  line-height: 1.6;
}

.error-log {
  color: #f38ba8;
}

.success-log {
  color: #a6e3a1;
  font-weight: 600;
}

.log-empty {
  color: #6c7086;
  font-style: italic;
}

.result-box {
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 10px 14px;
  margin-top: 10px;
  font-size: 13px;
  color: #333;
}

@media (max-width: 768px) {
  .code-grid {
    grid-template-columns: 1fr;
  }
}
</style>
