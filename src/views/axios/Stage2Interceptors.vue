<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import axios from 'axios'
import { get } from '@/api/request'

// ==================== Demo 1: 拦截器观察 ====================
const interceptorLogs = ref<string[]>([])
const reqCount = ref(0)

function addLog(msg: string) {
  interceptorLogs.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
  if (interceptorLogs.value.length > 20) interceptorLogs.value.shift()
}

// 创建新实例来演示拦截器
const demoInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
})
let reqInterceptorId: number
let resInterceptorId: number

function setupInterceptors() {
  reqInterceptorId = demoInstance.interceptors.request.use(
    (config) => {
      addLog(`🔵 请求拦截器: ${config.method?.toUpperCase()} ${config.url}`)
      // 模拟 Token 注入
      addLog(`🔵 Token 自动注入: Bearer xxx...`)
      config.headers = config.headers || {}
      config.headers['Authorization'] = 'Bearer demo-token-12345'
      return config
    },
    (err) => {
      addLog(`🔴 请求拦截器错误: ${err.message}`)
      return Promise.reject(err)
    },
  )

  resInterceptorId = demoInstance.interceptors.response.use(
    (res) => {
      addLog(`🟢 响应拦截器: status=${res.status}, code=${res.data?.code}`)
      return res
    },
    (err) => {
      const status = err?.response?.status || 'NETWORK'
      addLog(`🔴 响应拦截器错误: status=${status}, message=${err.message}`)
      return Promise.reject(err)
    },
  )
  addLog('✅ 拦截器已注册')
}

function removeInterceptors() {
  demoInstance.interceptors.request.eject(reqInterceptorId)
  demoInstance.interceptors.response.eject(resInterceptorId)
  addLog('🗑️ 拦截器已移除')
}

async function doRequestWithInterceptor() {
  reqCount.value++
  try {
    await demoInstance.get(`/axios-demo/list`)
    addLog(`✅ 请求 #${reqCount.value} 完成`)
    message.success('请求成功，查看拦截器日志')
  } catch (err: any) {
    addLog(`❌ 请求 #${reqCount.value} 失败: ${err.message}`)
  }
}

// ==================== Demo 2: Loading 计数器 ====================
const loadingCount = ref(0)
const loadingRequests = ref<{ id: number; url: string; time: string }[]>([])

async function doLoadingDemo() {
  const id = Date.now()
  loadingRequests.value.push({ id, url: '/axios-demo/list', time: new Date().toLocaleTimeString() })
  loadingCount.value++

  try {
    await get('/axios-demo/list')
    message.success(`请求 ${id} 完成`)
  } catch {
    message.error('请求失败')
  } finally {
    loadingCount.value--
    loadingRequests.value = loadingRequests.value.filter((r) => r.id !== id)
  }
}

async function doConcurrentRequests() {
  message.info('发起 3 个并发请求...')
  const ids = [1, 2, 3]
  for (const id of ids) {
    const reqId = Date.now() + id
    loadingRequests.value.push({ id: reqId, url: `/axios-demo/${id}`, time: new Date().toLocaleTimeString() })
    loadingCount.value++
  }
  try {
    await Promise.all(ids.map((id) => get(`/axios-demo/${id}`)))
    message.success('3 个并发请求全部完成')
  } catch {
    message.error('有请求失败')
  } finally {
    loadingCount.value = 0
    loadingRequests.value = []
  }
}

// ==================== Demo 3: 统一错误处理拦截器 ====================
const globalErrorResult = ref<{ caught: number; message: string }[]>([])

// 创建带全局错误捕获的实例
const errorHandlerInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 全局错误计数器
let globalErrorCount = 0

errorHandlerInstance.interceptors.response.use(
  (res) => {
    const code = res.data?.code
    if (code !== 200 && code !== 0) {
      globalErrorCount++
      const errInfo = { caught: globalErrorCount, message: `[拦截器] 业务异常 code=${code}: ${res.data?.message}` }
      globalErrorResult.value.push(errInfo)
      if (globalErrorResult.value.length > 10) globalErrorResult.value.shift()
      return Promise.reject(res.data)
    }
    return res
  },
  (err) => {
    globalErrorCount++
    const errInfo = {
      caught: globalErrorCount,
      message: `[拦截器] 网络异常: ${err?.response?.status || 'NETWORK'} - ${err.message}`,
    }
    globalErrorResult.value.push(errInfo)
    if (globalErrorResult.value.length > 10) globalErrorResult.value.shift()
    return Promise.reject(err)
  },
)

async function doGlobalErrorTest(type: '401' | '403' | '500' | 'timeout') {
  try {
    if (type === 'timeout') {
      await errorHandlerInstance.get('/axios-demo/slow', { timeout: 500 })
    } else {
      await errorHandlerInstance.get(`/axios-demo/error/${type}`)
    }
  } catch {
    // 已被拦截器捕获，这里不处理
  }
}

// ==================== Demo 4: 拦截器代码展示 ====================
const interceptorCode = ref(`// ===== src/api/request.ts 核心代码 =====

import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

// 请求拦截器：统一注入 Token、时间戳
instance.interceptors.request.use((config) => {
  // 自动追加时间戳，防止缓存
  config.params = { ...config.params, t: Date.now() }
  
  // 注入 Token（实际项目从 store 读取）
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`
  }
  
  console.log(\`[\${config.method}] → \${config.url}\`)
  return config
})

// 响应拦截器：统一处理业务错误码
instance.interceptors.response.use(
  (res) => {
    const { code, data, message } = res.data
    if (code === 0 || code === 200) return data  // 成功，只返回 data
    
    // 业务异常统一处理
    if (code === 401) { /* 跳转登录 */ }
    if (code === 403) { /* 提示无权限 */ }
    
    return Promise.reject(new BizError(code, message))
  },
  (err) => {
    // 网络/超时异常
    if (err.code === 'ECONNABORTED') {
      console.error('请求超时')
    }
    return Promise.reject(err)
  }
)`)

// 初始化
setupInterceptors()
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 2: 拦截器与封装</h1>
      <p>请求拦截器、响应拦截器、Token 自动注入、Loading 管理、统一错误处理</p>
    </header>

    <!-- 拦截器实时监控 -->
    <section class="card">
      <h2>1. 拦截器实时监控 — 观察请求/响应拦截过程</h2>
      <p class="desc">下面创建了一个独立的 axios 实例并注册了拦截器。点击按钮发起请求，观察拦截器的执行过程。</p>
      <div class="demo-row">
        <a-button type="primary" @click="doRequestWithInterceptor">发起请求（观察日志）</a-button>
        <a-button @click="removeInterceptors">移除拦截器</a-button>
        <a-button @click="setupInterceptors">重新注册</a-button>
        <span class="counter">已发起: {{ reqCount }} 次</span>
      </div>
      <div class="log-box">
        <div v-for="(log, i) in interceptorLogs" :key="i" class="log-line">{{ log }}</div>
        <div v-if="interceptorLogs.length === 0" class="log-empty">尚未发起请求，点击按钮查看拦截器日志</div>
      </div>
    </section>

    <!-- Loading 管理器 -->
    <section class="card">
      <h2>2. Loading 计数器 — 请求期间显示全局 Loading</h2>
      <p class="desc">
        通过在拦截器中维护一个请求计数（pendingCount），当 count &gt; 0 时显示全局 Loading。 多个并发请求时，只有 count
        归零才隐藏。
      </p>
      <div class="demo-row">
        <a-button type="primary" @click="doLoadingDemo">单次请求</a-button>
        <a-button @click="doConcurrentRequests">3 个并发请求</a-button>
        <a-badge v-if="loadingCount > 0" :count="loadingCount" :number-style="{ backgroundColor: '#f5222d' }">
          <a-tag color="processing">Loading...</a-tag>
        </a-badge>
        <a-tag v-else color="success">空闲</a-tag>
      </div>
      <div v-if="loadingRequests.length" class="request-list">
        <div v-for="req in loadingRequests" :key="req.id" class="req-item">
          <a-spin size="small" />
          <span>{{ req.url }}</span>
          <span style="color: #999; font-size: 12px">{{ req.time }}</span>
        </div>
      </div>
    </section>

    <!-- 全局错误捕获 -->
    <section class="card">
      <h2>3. 拦截器统一错误处理 — 业务码拦截 + 网络异常捕获</h2>
      <p class="desc">
        通过在拦截器中检查 <code>code</code> 字段，统一处理 401/403/500 等业务异常。 组件层无需在每个请求中重复
        try/catch。
      </p>
      <div class="demo-row">
        <a-button @click="doGlobalErrorTest('401')">模拟 401</a-button>
        <a-button @click="doGlobalErrorTest('403')">模拟 403</a-button>
        <a-button @click="doGlobalErrorTest('500')">模拟 500</a-button>
        <a-button danger @click="doGlobalErrorTest('timeout')">模拟超时</a-button>
      </div>
      <div class="log-box" style="max-height: 180px">
        <div v-for="(err, i) in globalErrorResult" :key="i" class="log-line error-log">
          #{{ err.caught }} {{ err.message }}
        </div>
        <div v-if="globalErrorResult.length === 0" class="log-empty">点击按钮触发错误，观察拦截器如何捕获</div>
      </div>
    </section>

    <!-- 代码展示 -->
    <section class="card">
      <h2>4. 完整拦截器代码 — 参照项目 request.ts</h2>
      <div class="code-block">
        <pre>{{ interceptorCode }}</pre>
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
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
}

.code-block pre {
  margin: 0;
  font-size: 13px;
}

.demo-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12px;
}

.counter {
  font-size: 13px;
  color: #999;
  margin-left: 8px;
}

.log-box {
  background: #1a1a2e;
  border-radius: 8px;
  padding: 12px 16px;
  max-height: 220px;
  overflow-y: auto;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
}

.log-line {
  color: #a6e3a1;
  padding: 2px 0;
  line-height: 1.6;
}

.error-log {
  color: #f38ba8;
}

.log-empty {
  color: #6c7086;
  font-style: italic;
}

.request-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.req-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f6f8fa;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
}
</style>
