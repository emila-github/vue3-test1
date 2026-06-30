<script setup lang="ts">
import { ref } from 'vue'
import { get, post, put, del, BizError } from '@/api/request'
import type { AxiosRequestConfig } from 'axios'

const env = import.meta.env

// ==================== 请求示例数据 ====================
const loading = ref(false)
const result = ref('')
const error = ref('')

// ---- GET 请求 ----
async function demoGet() {
  loading.value = true
  error.value = ''
  result.value = ''
  try {
    const data = await get('/users', { page: 1, pageSize: 10 })
    result.value = JSON.stringify(data, null, 2)
  } catch (e: any) {
    error.value = e instanceof BizError ? `业务错误 [${e.code}]: ${e.message}` : e.message
  } finally {
    loading.value = false
  }
}

// ---- POST 请求 ----
async function demoPost() {
  loading.value = true
  error.value = ''
  result.value = ''
  try {
    const data = await post('/users', {
      name: '张三',
      email: 'zhangsan@example.com',
      role: 'editor',
    })
    result.value = JSON.stringify(data, null, 2)
  } catch (e: any) {
    error.value = e instanceof BizError ? `业务错误 [${e.code}]: ${e.message}` : e.message
  } finally {
    loading.value = false
  }
}

// ---- PUT 请求 ----
async function demoPut() {
  loading.value = true
  error.value = ''
  result.value = ''
  try {
    const data = await put('/users/1', { name: '李四' })
    result.value = JSON.stringify(data, null, 2)
  } catch (e: any) {
    error.value = e instanceof BizError ? `业务错误 [${e.code}]: ${e.message}` : e.message
  } finally {
    loading.value = false
  }
}

// ---- DELETE 请求 ----
async function demoDelete() {
  loading.value = true
  error.value = ''
  result.value = ''
  try {
    await del('/users/1')
    result.value = '删除成功'
  } catch (e: any) {
    error.value = e instanceof BizError ? `业务错误 [${e.code}]: ${e.message}` : e.message
  } finally {
    loading.value = false
  }
}

// ---- 模块化调用 ----
async function demoModuleGet() {
  loading.value = true
  error.value = ''
  result.value = ''
  try {
    const { getUsers } = await import('@/api/modules/user')
    const data = await getUsers({ page: 1, pageSize: 5 })
    result.value = JSON.stringify(data, null, 2)
  } catch (e: any) {
    error.value = e instanceof BizError ? `业务错误 [${e.code}]: ${e.message}` : e.message
  } finally {
    loading.value = false
  }
}

// ==================== 带 config 的便捷方法示例 ====================

// ---- GET + 自定义 headers ----
async function demoGetWithHeaders() {
  loading.value = true
  error.value = ''
  result.value = ''
  try {
    const config: AxiosRequestConfig = {
      headers: { 'X-Custom-Header': 'demo-value', Authorization: 'Bearer mock-token' },
    }
    const data = await get('/users', { page: 1, pageSize: 5 }, config)
    result.value = JSON.stringify(data, null, 2)
  } catch (e: any) {
    error.value = e instanceof BizError ? `业务错误 [${e.code}]: ${e.message}` : e.message
  } finally {
    loading.value = false
  }
}

// ---- POST + timeout 配置 ----
async function demoPostWithTimeout() {
  loading.value = true
  error.value = ''
  result.value = ''
  try {
    const config: AxiosRequestConfig = {
      timeout: 5000,
    }
    const data = await post('/users', { name: '王五', email: 'wangwu@example.com', role: 'viewer' }, config)
    result.value = JSON.stringify(data, null, 2)
  } catch (e: any) {
    error.value = e instanceof BizError ? `业务错误 [${e.code}]: ${e.message}` : e.message
  } finally {
    loading.value = false
  }
}

// ---- GET + 取消请求（AbortController） ----
const abortController = ref<AbortController | null>(null)

async function demoCancelRequest() {
  loading.value = true
  error.value = ''
  result.value = ''
  try {
    abortController.value = new AbortController()
    setTimeout(() => {
      abortController.value?.abort()
    }, 100) // 100ms 后取消
    const config: AxiosRequestConfig = {
      signal: abortController.value.signal,
    }
    await get('/users', { page: 1 }, config)
  } catch (e: any) {
    if (e?.code === 'ERR_CANCELED' || e?.message === 'canceled') {
      error.value = '请求已被取消 (AbortController)'
    } else {
      error.value = e instanceof BizError ? `业务错误 [${e.code}]: ${e.message}` : e.message
    }
  } finally {
    loading.value = false
    abortController.value = null
  }
}

// ---- GET + responseType ----
async function demoResponseType() {
  loading.value = true
  error.value = ''
  result.value = ''
  try {
    const config: AxiosRequestConfig = {
      responseType: 'json',
      validateStatus: (status) => status < 500,
    }
    const data = await get('/users', { page: 1, pageSize: 3 }, config)
    result.value = 'responseType=json | validateStatus<500\n' + JSON.stringify(data, null, 2)
  } catch (e: any) {
    error.value = e instanceof BizError ? `业务错误 [${e.code}]: ${e.message}` : e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="api-demo">
    <h1>📡 API 请求示例</h1>

    <!-- 环境信息 -->
    <div class="env-badge">
      当前环境：<strong>{{ env.VITE_APP_TITLE }}</strong> &nbsp;|&nbsp; API 地址：<code>{{
        env.VITE_API_BASE_URL
      }}</code>
    </div>

    <!-- 通用方法 -->
    <section class="demo-section">
      <h2>1. 通用方法（直接调用）</h2>
      <p class="desc">使用 <code>get / post / put / del</code> 便捷方法，自动追加 <code>t</code> 时间戳。</p>
      <div class="btn-group">
        <button class="demo-btn get" @click="demoGet">GET 请求</button>
        <button class="demo-btn post" @click="demoPost">POST 请求</button>
        <button class="demo-btn put" @click="demoPut">PUT 请求</button>
        <button class="demo-btn delete" @click="demoDelete">DELETE 请求</button>
      </div>
    </section>

    <!-- 模块化调用 -->
    <section class="demo-section">
      <h2>2. 模块化调用</h2>
      <p class="desc">按业务拆分 API 模块 <code>src/api/modules/user.ts</code>，类型安全、可复用。</p>
      <div class="btn-group">
        <button class="demo-btn get" @click="demoModuleGet">getUsers() 模块调用</button>
      </div>
    </section>

    <!-- 带 config 调用 -->
    <section class="demo-section">
      <h2>3. 带 config 的便捷方法</h2>
      <p class="desc">
        第三个参数传入 <code>AxiosRequestConfig</code>，支持自定义 headers、timeout、signal、responseType 等。
      </p>
      <div class="btn-group">
        <button class="demo-btn config" @click="demoGetWithHeaders">GET + 自定义 Headers</button>
        <button class="demo-btn config" @click="demoPostWithTimeout">POST + timeout=5s</button>
        <button class="demo-btn config" @click="demoCancelRequest">GET + Abort 取消</button>
        <button class="demo-btn config" @click="demoResponseType">GET + responseType</button>
      </div>
    </section>

    <!-- 结果展示 -->
    <section class="demo-section" v-if="loading || result || error">
      <h2>📋 响应结果</h2>
      <div v-if="loading" class="loading">请求中...</div>
      <pre v-else-if="result" class="result-success">{{ result }}</pre>
      <pre v-else-if="error" class="result-error">{{ error }}</pre>
    </section>

    <!-- 代码说明 -->
    <section class="demo-section">
      <h2>📖 使用说明</h2>
      <div class="code-block">
        <pre>
// 1. 通用方法 — 全站任意位置直接调用
import { get, post, put, del } from '@/api/request'

const users = await get('/users', { page: 1 })
await post('/users', { name: '张三', email: 'a@b.com' })

// 2. 模块化调用 — 类型安全，推荐
import { getUsers, createUser } from '@/api/modules/user'

const { list, total } = await getUsers({ page: 1, pageSize: 10 })
await createUser({ name: '张三', email: 'a@b.com', role: 'editor' })

// 3. 带 config 的调用 — 第三个参数传入 AxiosRequestConfig
import type { AxiosRequestConfig } from 'axios'

// 自定义 headers
const config: AxiosRequestConfig = {
  headers: { Authorization: 'Bearer xxx', 'X-Trace-Id': 'trace-001' },
}
const data = await get('/users', { page: 1 }, config)

// 自定义 timeout（实例默认 15s，这里覆盖为 5s）
await post('/users', { name: '王五' }, { timeout: 5000 })

// 请求取消（AbortController）
const controller = new AbortController()
setTimeout(() => controller.abort(), 100)
await get('/users', { page: 1 }, { signal: controller.signal })

// 自定义响应类型 / 状态校验
await get('/users', {}, {
  responseType: 'json',
  validateStatus: (status) => status &lt; 500,
})

// 4. 错误处理
import { BizError } from '@/api/request'

try {
  await getUsers()
} catch (e) {
  if (e instanceof BizError) {
    console.log('业务异常:', e.code, e.message)
  } else if (e?.code === 'ERR_CANCELED') {
    console.log('请求已取消')
  } else {
    console.log('网络错误:', e.message)
  }
}

// 5. 每个请求自动带上 t=时间戳
// GET /api/users?page=1&t=1686912345678</pre
        >
      </div>
    </section>

    <!-- 拦截器说明 -->
    <section class="demo-section">
      <h2>🛡 拦截器</h2>
      <table class="info-table">
        <thead>
          <tr>
            <th>位置</th>
            <th>功能</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>请求拦截器</td>
            <td>自动追加 <code>t</code> 时间戳 · 可注入 token</td>
          </tr>
          <tr>
            <td>响应拦截器（成功）</td>
            <td>解析 <code>code</code>，非 0/200 抛出 <code>BizError</code></td>
          </tr>
          <tr>
            <td>响应拦截器（错误）</td>
            <td>统一 <code>console.error</code> 输出 · 返回 Promise.reject</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.api-demo {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 12px;
}

.env-badge {
  text-align: center;
  font-size: 13px;
  color: #888;
  margin-bottom: 28px;
  padding: 8px 16px;
  background: #f6f8fa;
  border-radius: 6px;
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
}

.env-badge code {
  background: #e8e8e8;
  padding: 1px 6px;
  border-radius: 3px;
}

.demo-section {
  margin-bottom: 24px;
}

.demo-section h2 {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 6px;
}

.desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
}

.desc code {
  background: #eff2f5;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 13px;
}

.btn-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.demo-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #fff;
  transition: opacity 0.2s;
}

.demo-btn:hover {
  opacity: 0.85;
}

.demo-btn.get {
  background: #52c41a;
}
.demo-btn.post {
  background: #1890ff;
}
.demo-btn.put {
  background: #fa8c16;
}
.demo-btn.delete {
  background: #ff4d4f;
}
.demo-btn.config {
  background: #722ed1;
}

.loading {
  color: #1890ff;
  font-size: 14px;
  padding: 12px;
  background: #e6f7ff;
  border-radius: 6px;
}

.result-success {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 13px;
  overflow-x: auto;
  max-height: 400px;
  white-space: pre-wrap;
  word-break: break-all;
}

.result-error {
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 13px;
  color: #cf1322;
  white-space: pre-wrap;
}

.code-block {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
}

.code-block pre {
  color: #d4d4d4;
  font-size: 13px;
  line-height: 1.7;
  margin: 0;
  font-family: 'Fira Code', 'Consolas', monospace;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.info-table th,
.info-table td {
  text-align: left;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.info-table th {
  background: #fafafa;
  color: #555;
}

.info-table td code {
  background: #eff2f5;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 13px;
}
</style>
