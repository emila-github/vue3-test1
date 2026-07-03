<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import axios from 'axios'

// ==================== Demo 1: AbortController 取消请求 ====================
const cancelLogs = ref<string[]>([])
let controller: AbortController | null = null

function addCancelLog(msg: string) {
  cancelLogs.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
  if (cancelLogs.value.length > 20) cancelLogs.value.shift()
}

async function doLongRequest() {
  // 取消之前的请求
  if (controller) {
    controller.abort()
    addCancelLog('🔴 已取消上一个未完成的请求')
  }

  controller = new AbortController()
  addCancelLog('🟢 发起新请求...')

  try {
    // 模拟一个慢请求
    const res = await axios.get('/api/axios-demo/list', {
      signal: controller.signal,
      // 模拟延迟（实际网络延迟由 mock 的 slow 接口提供，这里直接用普通接口）
    })
    addCancelLog('✅ 请求完成: ' + JSON.stringify(res.data?.code))
    message.success('请求成功')
  } catch (err: any) {
    if (axios.isCancel(err)) {
      addCancelLog('⚠️ 请求已被取消 (axios.isCancel = true)')
      message.info('请求已取消')
    } else {
      addCancelLog(`❌ 请求失败: ${err.message}`)
    }
  } finally {
    controller = null
  }
}

function doCancelRequest() {
  if (controller) {
    controller.abort()
    addCancelLog('🔴 用户手动取消请求')
  } else {
    message.info('没有正在进行的请求')
  }
}

// ==================== Demo 2: 连续搜索（防抖 + 取消） ====================
const searchKeyword = ref('')
const searchResult = ref<string>('')
let searchController: AbortController | null = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function onSearchInput() {
  if (debounceTimer) clearTimeout(debounceTimer)

  debounceTimer = setTimeout(async () => {
    if (!searchKeyword.value.trim()) {
      searchResult.value = ''
      return
    }

    // 取消上一次搜索
    if (searchController) searchController.abort()
    searchController = new AbortController()

    try {
      searchResult.value = '搜索中...'
      const res = await axios.get('/api/axios-demo/list', {
        params: { keyword: searchKeyword.value },
        signal: searchController.signal,
      })
      searchResult.value = `搜索 "${searchKeyword.value}" 完成，找到 ${res.data?.data?.total || 0} 条结果`
    } catch (err: any) {
      if (axios.isCancel(err)) {
        searchResult.value = '(上一次搜索已取消)'
      } else {
        searchResult.value = `搜索失败: ${err.message}`
      }
    }
  }, 400) // 400ms 防抖
}

// ==================== Demo 3: 文件上传 ====================
const uploadLoading = ref(false)
const uploadProgress = ref(0)
const uploadResult = ref<string>('')
let uploadController: AbortController | null = null

function simulateUpload() {
  uploadLoading.value = true
  uploadProgress.value = 0
  uploadResult.value = ''
  uploadController = new AbortController()

  // 模拟上传进度（使用 axios 的 onUploadProgress 回调）
  let fakeProgress = 0
  const timer = setInterval(() => {
    fakeProgress += Math.random() * 15
    if (fakeProgress > 95) fakeProgress = 95
    uploadProgress.value = Math.round(fakeProgress)
  }, 300)

  axios
    .post(
      '/api/axios-demo/upload',
      { filename: 'test-file.pdf' },
      {
        signal: uploadController.signal,
        onUploadProgress: (e) => {
          // 实际上传进度由 xhr 提供，这里仅作代码演示
          addCancelLog(`📤 上传中... ${e.loaded}/${e.total || '?'}`)
        },
      },
    )
    .then((res) => {
      clearInterval(timer)
      uploadProgress.value = 100
      uploadResult.value = `上传成功: ${JSON.stringify(res.data?.data)}`
      message.success('上传成功')
    })
    .catch((err) => {
      clearInterval(timer)
      if (axios.isCancel(err)) {
        uploadResult.value = '上传已被取消'
        message.info('上传已取消')
      } else {
        uploadResult.value = `上传失败: ${err.message}`
      }
    })
    .finally(() => {
      uploadLoading.value = false
      uploadController = null
    })
}

function cancelUpload() {
  if (uploadController) {
    uploadController.abort()
  }
}

// ==================== Demo 4: 文件下载 ====================
const downloadLoading = ref(false)
const downloadProgress = ref(0)
const downloadResult = ref<string>('')

function simulateDownload() {
  downloadLoading.value = true
  downloadProgress.value = 0
  downloadResult.value = ''

  // 模拟下载进度
  let fakeProgress = 0
  const timer = setInterval(() => {
    fakeProgress += Math.random() * 20
    if (fakeProgress >= 100) {
      fakeProgress = 100
      clearInterval(timer)

      // 完成后模拟响应
      axios.get('/api/axios-demo/download').then((res) => {
        downloadResult.value = `下载完成! 文件名: ${res.data?.data?.filename}`
        message.success('下载完成')
        downloadLoading.value = false
      })
    } else {
      downloadProgress.value = Math.round(fakeProgress)
    }
  }, 250)
}

// 清理
onUnmounted(() => {
  if (controller) controller.abort()
  if (searchController) searchController.abort()
  if (debounceTimer) clearTimeout(debounceTimer)
})

// ==================== Demo 5: 代码展示 ====================
const cancelCode = ref(`// AbortController 取消请求
const controller = new AbortController()

axios.get('/api/users', { signal: controller.signal })
  .then(res => console.log(res))
  .catch(err => {
    if (axios.isCancel(err)) {
      console.log('请求已取消')
    }
  })

// 取消请求
controller.abort()`)

const uploadCode = ref(`// 文件上传（FormData + 进度监控）
const formData = new FormData()
formData.append('file', file)

axios.post('/api/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  onUploadProgress: (e) => {
    const percent = Math.round((e.loaded * 100) / (e.total ?? 1))
    console.log(\`上传进度: \${percent}%\`)
  },
  signal: controller.signal,  // 支持取消
})

// 文件下载（Blob + 进度）
axios.get('/api/download', {
  responseType: 'blob',
  onDownloadProgress: (e) => {
    const percent = Math.round((e.loaded * 100) / (e.total ?? 1))
    console.log(\`下载进度: \${percent}%\`)
  },
}).then(res => {
  const url = URL.createObjectURL(res.data)
  const a = document.createElement('a')
  a.href = url
  a.download = 'file.pdf'
  a.click()
  URL.revokeObjectURL(url)
})`)
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 3: 取消请求与上传下载</h1>
      <p>AbortController 取消请求、搜索防抖、FormData 文件上传、Blob 流式下载与进度监控</p>
    </header>

    <!-- AbortController 取消请求 -->
    <section class="card">
      <h2>1. AbortController — 取消重复请求</h2>
      <p class="desc">
        每次新请求前 <code>abort()</code> 掉上一个未完成的请求，避免并发冲突和资源浪费。
        连续点击"发起请求"按钮，观察上一个请求是否被取消。
      </p>
      <div class="demo-row">
        <a-button type="primary" @click="doLongRequest">发起请求</a-button>
        <a-button danger @click="doCancelRequest">取消请求</a-button>
      </div>
      <div class="log-box">
        <div v-for="(log, i) in cancelLogs" :key="i" class="log-line">{{ log }}</div>
        <div v-if="cancelLogs.length === 0" class="log-empty">点击按钮观察取消请求效果</div>
      </div>
    </section>

    <!-- 搜索防抖 + 取消 -->
    <section class="card">
      <h2>2. 搜索防抖 + AbortController — 连续输入时自动取消上一次搜索</h2>
      <p class="desc">每次输入都会取消上一次的搜索请求（400ms 防抖），确保只有最后一次搜索真正发出。</p>
      <div class="demo-row">
        <a-input
          v-model:value="searchKeyword"
          placeholder="输入关键词搜索（自动防抖 400ms）"
          style="width: 300px"
          @input="onSearchInput"
          allow-clear
        />
      </div>
      <div v-if="searchResult" class="result-box">
        {{ searchResult }}
      </div>
    </section>

    <!-- 文件上传模拟 -->
    <section class="card">
      <h2>3. 文件上传 — FormData + 进度监控 + 可取消</h2>
      <p class="desc">使用 <code>onUploadProgress</code> 回调监控上传进度，<code>AbortController</code> 支持取消。</p>
      <div class="demo-row">
        <a-button type="primary" :loading="uploadLoading" @click="simulateUpload">模拟上传</a-button>
        <a-button danger :disabled="!uploadLoading" @click="cancelUpload">取消上传</a-button>
      </div>
      <div v-if="uploadLoading || uploadProgress > 0" style="margin-top: 12px">
        <a-progress :percent="uploadProgress" :status="uploadProgress === 100 ? 'success' : 'active'" />
      </div>
      <div v-if="uploadResult" class="result-box">{{ uploadResult }}</div>
    </section>

    <!-- 文件下载模拟 -->
    <section class="card">
      <h2>4. 文件下载 — Blob 流 + 进度</h2>
      <p class="desc">使用 <code>responseType: 'blob'</code> 和 <code>onDownloadProgress</code> 实现文件下载。</p>
      <div class="demo-row">
        <a-button type="primary" :loading="downloadLoading" @click="simulateDownload">模拟下载</a-button>
      </div>
      <div v-if="downloadLoading || downloadProgress > 0" style="margin-top: 12px">
        <a-progress :percent="downloadProgress" :status="downloadProgress === 100 ? 'success' : 'active'" />
      </div>
      <div v-if="downloadResult" class="result-box">{{ downloadResult }}</div>
    </section>

    <!-- 代码展示 -->
    <section class="card">
      <h2>5. 完整代码参考</h2>
      <div class="code-grid">
        <div>
          <h3>AbortController 取消</h3>
          <div class="code-block">
            <pre>{{ cancelCode }}</pre>
          </div>
        </div>
        <div>
          <h3>上传 / 下载</h3>
          <div class="code-block">
            <pre>{{ uploadCode }}</pre>
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
