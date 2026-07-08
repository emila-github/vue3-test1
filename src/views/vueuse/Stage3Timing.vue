<script setup lang="ts">
/**
 * Stage 3: VueUse 时序与防抖工具
 * 演示 useDebounceFn、useThrottleFn、useIntervalFn、useTimeoutFn、useNow
 */
import { ref, computed } from 'vue'
import { useDebounceFn, useThrottleFn, useIntervalFn, useTimeoutFn, useNow } from '@vueuse/core'
import { message } from 'ant-design-vue'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(msg)
}

// ============ useDebounceFn ============
const searchText = ref('')
const debouncedResult = ref('')

const debouncedSearch = useDebounceFn((val: string) => {
  debouncedResult.value = `搜索: "${val}" (防抖 500ms)`
  addLog(`防抖搜索触发: ${val}`)
}, 500)

function onSearchInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  searchText.value = val
  debouncedSearch(val)
}

// ============ useThrottleFn ============
const throttleCount = ref(0)
const throttledCount = ref(0)

const throttledInc = useThrottleFn(() => {
  throttledCount.value++
  addLog(`节流触发: ${throttledCount.value}`)
}, 1000)

function doThrottle() {
  throttleCount.value++
  throttledInc()
}

// ============ useIntervalFn ============
const intervalCounter = ref(0)
const isRunning = ref(false)
const { pause: pauseInterval, resume: resumeInterval, isActive: intervalActive } = useIntervalFn(
  () => {
    intervalCounter.value++
    addLog(`定时器触发 #${intervalCounter.value}`)
  },
  1000,
  { immediate: false },
)

function toggleInterval() {
  if (intervalActive.value) {
    pauseInterval()
    isRunning.value = false
    addLog('定时器已暂停')
  } else {
    resumeInterval()
    isRunning.value = true
    addLog('定时器已启动')
  }
}

// ============ useTimeoutFn ============
const timeoutMsg = ref('等待触发…')
const { start: startTimeout, stop: stopTimeout } = useTimeoutFn(() => {
  timeoutMsg.value = '⏰ 延迟 2 秒触发！'
  message.info('延迟操作完成')
  addLog('延迟任务执行完成')
}, 2000)

// ============ useNow ============
const now = useNow({ interval: 1000 })
const nowFormatted = computed(() => {
  const d = now.value
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
})
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 3：时序与防抖工具</h1>
      <p>掌握 <code>useDebounceFn</code>、<code>useThrottleFn</code>、<code>useIntervalFn</code>、<code>useTimeoutFn</code>、<code>useNow</code>。</p>
    </header>

    <!-- 3.1 useDebounceFn -->
    <section class="card">
      <h2>3.1 useDebounceFn —— 防抖</h2>
      <p>高频触发时，只有最后一次调用会在延迟后执行。适合搜索框输入。</p>
      <pre class="code-block">
const debouncedSearch = useDebounceFn((val) => {
  // 500ms 无新调用后才执行
  fetchResults(val)
}, 500)</pre>
      <div class="demo-box">
        <div class="input-row">
          <a-input placeholder="输入搜索关键词…" @input="onSearchInput" style="width: 350px" />
          <span class="badge">防抖 500ms</span>
        </div>
        <p v-if="searchText" class="result-text">输入中: {{ searchText }}</p>
        <p class="result-text primary">{{ debouncedResult }}</p>
      </div>
    </section>

    <!-- 3.2 useThrottleFn -->
    <section class="card">
      <h2>3.2 useThrottleFn —— 节流</h2>
      <p>固定时间间隔内最多执行一次。适合滚动事件、窗口 resize。</p>
      <pre class="code-block">const throttledHandler = useThrottleFn(() => {
  // 每 1000ms 最多执行一次
  handleScroll()
}, 1000)</pre>
      <div class="demo-box">
        <div class="counter-row">
          <div class="stat">
            <span class="stat-label">原始点击</span>
            <span class="stat-value">{{ throttleCount }}</span>
          </div>
          <span class="arrow">→</span>
          <div class="stat">
            <span class="stat-label">节流执行</span>
            <span class="stat-value primary">1 秒最多 1 次 → {{ throttledCount }}</span>
          </div>
        </div>
        <button class="btn btn-lg" @click="doThrottle">快速连续点击我</button>
      </div>
    </section>

    <!-- 3.3 useIntervalFn -->
    <section class="card">
      <h2>3.3 useIntervalFn —— 定时器</h2>
      <p>
        比原生 <code>setInterval</code> 更安全（自动清理），支持 <code>pause</code>/<code>resume</code>。
      </p>
      <pre class="code-block">
const { pause, resume, isActive } = useIntervalFn(() => {
  counter.value++
}, 1000)</pre>
      <div class="demo-box flex-center-col">
        <p class="counter-display">{{ intervalCounter }}</p>
        <div class="btn-row">
          <button :class="['btn', isRunning ? 'btn-stop' : 'btn-start']" @click="toggleInterval">
            {{ isRunning ? '⏸ 暂停' : '▶ 启动' }}
          </button>
        </div>
      </div>
    </section>

    <!-- 3.4 useTimeoutFn -->
    <section class="card">
      <h2>3.4 useTimeoutFn —— 延迟执行</h2>
      <p>比原生 <code>setTimeout</code> 更安全（自动清理），支持 <code>start</code>/<code>stop</code>。</p>
      <pre class="code-block">
const { start, stop } = useTimeoutFn(() => {
  // 2 秒后执行
  showNotification()
}, 2000)</pre>
      <div class="demo-box flex-center-col">
        <p class="delay-label">{{ timeoutMsg }}</p>
        <div class="btn-row">
          <button class="btn" @click="startTimeout()">开始 2 秒延迟</button>
          <button class="btn btn-stop" @click="stopTimeout()">取消</button>
        </div>
      </div>
    </section>

    <!-- 3.5 useNow -->
    <section class="card">
      <h2>3.5 useNow —— 实时时钟</h2>
      <p>每秒更新的当前时间戳，比手写定时器更简洁。</p>
      <pre class="code-block">const now = useNow({ interval: 1000 })</pre>
      <div class="demo-box flex-center">
        <span class="clock-icon">🕐</span>
        <span class="clock-display">{{ nowFormatted }}</span>
      </div>
    </section>

    <!-- 操作日志 -->
    <section class="card">
      <h2>操作日志</h2>
      <div class="log-area">
        <div v-for="(item, i) in log" :key="i" class="log-item">[{{ i + 1 }}] {{ item }}</div>
        <div v-if="log.length === 0" class="log-empty">暂无操作记录</div>
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
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 26px;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.page-header p {
  color: #666;
  font-size: 14px;
}

.page-header code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card h2 {
  margin: 0 0 12px;
  font-size: 18px;
  color: #333;
}

.card p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 12px;
}

.code-block {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  margin-bottom: 16px;
}

.demo-box {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.flex-center-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.badge {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 10px;
  background: #fef3c7;
  color: #d97706;
}

.result-text {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.result-text.primary {
  color: #f59e0b;
  font-weight: 600;
}

.counter-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.primary {
  color: #f59e0b !important;
}

.arrow {
  font-size: 20px;
  color: #ccc;
}

.counter-display {
  font-size: 48px;
  font-weight: 800;
  color: #f59e0b;
  margin: 0;
}

.delay-label {
  font-size: 18px;
  color: #666;
  margin: 0;
}

.clock-icon {
  font-size: 32px;
}

.clock-display {
  font-size: 28px;
  font-weight: 700;
  color: #f59e0b;
  font-family: 'Courier New', monospace;
}

.btn-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  border-color: #f59e0b;
  color: #f59e0b;
}

.btn-start {
  background: #10b981;
  color: #fff;
  border-color: #10b981;
}

.btn-stop {
  color: #ef4444;
  border-color: #fca5a5;
}

.btn-lg {
  padding: 10px 32px;
  font-size: 15px;
}

.log-area {
  max-height: 200px;
  overflow-y: auto;
  font-size: 13px;
}

.log-item {
  padding: 4px 0;
  color: #555;
  border-bottom: 1px dashed #f0f0f0;
}

.log-empty {
  color: #ccc;
  text-align: center;
  padding: 20px;
}

@media (max-width: 640px) {
  .stage-page { padding: 16px; }
  .counter-display { font-size: 36px; }
}
</style>
