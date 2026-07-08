<script setup lang="ts">
import { ref, customRef, computed } from 'vue'
import { message } from 'ant-design-vue'

// ========== 1. debounceRef（防抖 ref） ==========
function useDebouncedRef<T>(initial: T, delay = 500) {
  let timer: ReturnType<typeof setTimeout> | null = null
  let innerValue = initial

  return customRef<T>((track, trigger) => ({
    get() {
      track() // 追踪依赖
      return innerValue
    },
    set(val) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        innerValue = val
        trigger() // 触发更新
      }, delay)
    },
  }))
}

const searchText = useDebouncedRef('', 500)
const debounceLogs = ref<string[]>([])

// watch searchText changes
const searchResult = computed(() => {
  if (!searchText.value) return '暂无输入'
  return `搜索 "${searchText.value}" 的结果（已在 500ms 防抖后更新）`
})

// Track set operations
let rawInput = ''
function onSearchInput(e: Event) {
  rawInput = (e.target as HTMLInputElement).value
  searchText.value = rawInput
  debounceLogs.value.push(`[${new Date().toLocaleTimeString()}] 输入: "${rawInput}"`)
}

// ========== 2. 带验证的 ref ==========
function useValidatedRef(initial: number, validator: (v: number) => boolean, errMsg = '验证失败') {
  let value = initial
  let error = ''
  return customRef<{ value: number; error: string }>((track, trigger) => ({
    get() {
      track()
      return { value, error }
    },
    set(newObj: { value: number; error?: string }) {
      error = ''
      if (!validator(newObj.value)) {
        error = errMsg
      } else {
        value = newObj.value
      }
      trigger()
    },
  }))
}

const validatedInput = useValidatedRef(0, (v) => v >= 0 && v <= 100, '值必须在 0~100 之间')
const validatedLogs = ref<string[]>([])

function setValidated(val: number) {
  validatedInput.value = { value: val }
  const result = validatedInput.value
  validatedLogs.value.push(`设置 ${val} → value=${result.value}, error="${result.error || '无'}"`)
  if (result.error) message.warning(result.error)
  else message.success(`设置为 ${result.value}`)
}

// ========== 3. throttleRef（节流 ref） ==========
function useThrottledRef<T>(initial: T, delay = 1000) {
  let value = initial
  let lastTrigger = 0
  let pendingValue: T | null = null
  let timer: ReturnType<typeof setTimeout> | null = null

  return customRef<T>((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(val) {
      const now = Date.now()
      if (now - lastTrigger >= delay) {
        value = val
        lastTrigger = now
        trigger()
      } else {
        // 保存最后一次值，延迟触发
        pendingValue = val
        if (!timer) {
          timer = setTimeout(
            () => {
              if (pendingValue !== null) {
                value = pendingValue
                pendingValue = null
                lastTrigger = Date.now()
                trigger()
              }
              timer = null
            },
            delay - (now - lastTrigger),
          )
        }
      }
    },
  }))
}

const throttleCount = useThrottledRef(0, 1000)
const throttleLogs = ref<string[]>([])

function quickClick() {
  throttleCount.value = throttleCount.value + 1
  throttleLogs.value.push(`[${new Date().toLocaleTimeString()}] 点击，当前值: ${throttleCount.value}`)
}

// ========== 4. 带缓存失效的 ref ==========
function useStaleWhileRevalidateRef<T>(initial: T, ttl = 3000) {
  let value = initial
  let lastUpdate = 0

  return customRef<T>((track, trigger) => ({
    get() {
      track()
      // 超过 TTL 视为过期（仅标记，不过滤）
      return value
    },
    set(val) {
      value = val
      lastUpdate = Date.now()
      trigger()
    },
  }))
}

const cachedData = useStaleWhileRevalidateRef<{ text: string; time: string }>(
  { text: '初始数据', time: new Date().toLocaleTimeString() },
  3000,
)

function updateCached() {
  cachedData.value = { text: `更新数据 #${Date.now() % 10000}`, time: new Date().toLocaleTimeString() }
  message.success('缓存数据已更新')
}

function resetAll() {
  searchText.value = ''
  rawInput = ''
  debounceLogs.value = []
  validatedLogs.value = []
  throttleLogs.value = []
  cachedData.value = { text: '初始数据', time: new Date().toLocaleTimeString() }
  message.success('已重置')
}
</script>

<template>
  <div class="stage-page">
    <header class="stage-header">
      <a class="back-link" @click="$router.push('/reactivity-deep')">← 返回概览</a>
      <h1>Stage 4：customRef 自定义引用</h1>
      <p class="subtitle">
        通过 <code>track()</code> 和 <code>trigger()</code> 手动控制依赖收集与更新通知，实现防抖、节流、验证等高级模式。
      </p>
    </header>

    <!-- 防抖 ref -->
    <section class="card">
      <h2>1. useDebouncedRef — 防抖 ref</h2>
      <p class="card-desc">set 时启动定时器，只在 500ms 无新输入后才调用 <code>trigger()</code>。适合搜索框输入。</p>
      <div class="demo-row">
        <div class="demo-col">
          <a-input
            @input="onSearchInput"
            placeholder="输入搜索内容（500ms 防抖）"
            allow-clear
            style="max-width: 320px"
          />
          <div class="result-box">
            <p>
              <strong>实时输入：</strong><code>{{ rawInput }}</code>
            </p>
            <p>
              <strong>防抖后值：</strong><code>{{ searchText }}</code>
            </p>
            <p><strong>搜索结果：</strong>{{ searchResult }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 带验证的 ref -->
    <section class="card">
      <h2>2. useValidatedRef — 带验证的 ref</h2>
      <p class="card-desc">set 时运行 validator，不合法则拒绝更新并记录错误信息。</p>
      <div class="demo-row">
        <div class="demo-col">
          <p>
            当前值: <strong>{{ validatedInput.value.value }}</strong> | 错误:
            <span style="color: #cf1322">{{ validatedInput.value.error || '无' }}</span>
          </p>
          <a-space>
            <a-button size="small" type="primary" @click="setValidated(50)">设为 50（合法）</a-button>
            <a-button size="small" @click="setValidated(100)">设为 100（合法）</a-button>
            <a-button size="small" danger @click="setValidated(150)">设为 150（非法）</a-button>
            <a-button size="small" danger @click="setValidated(-10)">设为 -10（非法）</a-button>
          </a-space>
          <div class="log-sub" v-if="validatedLogs.length" style="margin-top: 10px">
            <p v-for="(l, i) in validatedLogs" :key="i" class="log-line">{{ l }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 节流 ref -->
    <section class="card">
      <h2>3. useThrottledRef — 节流 ref</h2>
      <p class="card-desc">在指定间隔内最多触发一次更新。快速点击时，只有第一次生效 + 最后一次延迟触发。</p>
      <div class="demo-row">
        <div class="demo-col">
          <p>
            节流值: <strong>{{ throttleCount }}</strong
            >（1 秒内最多更新一次）
          </p>
          <a-space>
            <a-button size="small" type="primary" @click="quickClick">快速点击（节流）</a-button>
            <a-button
              size="small"
              @click="quickClick(); quickClick(); quickClick()"
              >模拟连续 3 次</a-button
            >
          </a-space>
          <div class="log-sub" v-if="throttleLogs.length" style="margin-top: 10px">
            <p v-for="(l, i) in throttleLogs" :key="i" class="log-line">{{ l }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- customRef 原理 -->
    <section class="card">
      <h2>4. customRef 原理图解</h2>
      <div class="principle-box">
        <pre class="code-block"><code>function myRef&lt;T&gt;(value: T) {
  return customRef&lt;T&gt;((track, trigger) => ({
    get() {
      track()        // ← 告诉 Vue：我在收集依赖
      return value
    },
    set(newVal) {
      value = newVal
      trigger()      // ← 告诉 Vue：值变了，通知所有依赖
    },
  }))
}</code></pre>
        <ul class="principle-list">
          <li><code>track()</code>：在 get 中调用，建立「谁用了我」的依赖关系</li>
          <li><code>trigger()</code>：在 set 中调用，通知所有依赖重新计算</li>
          <li>你可以在这两个钩子之间 <strong>添加任意逻辑</strong>（防抖/节流/验证/格式化/条件触发）</li>
          <li>本质上，<code>ref()</code> 就是用 <code>customRef</code> 实现的</li>
        </ul>
      </div>
    </section>

    <!-- 操作日志 -->
    <section class="card">
      <h2>📋 防抖输入日志</h2>
      <div class="log-container">
        <p v-for="(line, i) in debounceLogs" :key="i" class="log-line">{{ line }}</p>
        <p v-if="debounceLogs.length === 0" class="log-empty">在搜索框输入内容查看日志</p>
      </div>
    </section>

    <a-button @click="resetAll">全部重置</a-button>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

.stage-header {
  margin-bottom: 28px;
}

.back-link {
  display: inline-block;
  color: #888;
  cursor: pointer;
  font-size: 13px;
  margin-bottom: 8px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #1677ff;
}

.stage-header h1 {
  font-size: 24px;
  color: #1a1a1a;
  margin: 0 0 6px;
}

.subtitle {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.subtitle code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 22px 24px;
  margin-bottom: 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card h2 {
  margin: 0 0 6px;
  font-size: 17px;
  color: #333;
}

.card-desc {
  font-size: 13px;
  color: #888;
  margin: 0 0 14px;
  line-height: 1.5;
}

.card-desc code {
  background: #f0f0f0;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
  color: #1677ff;
}

.demo-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.demo-col {
  flex: 1;
  min-width: 260px;
}

.demo-col p {
  margin: 0 0 8px;
  font-size: 14px;
}

.demo-col code {
  background: #f0f0f0;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 13px;
  color: #333;
}

.result-box {
  margin-top: 10px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 10px 14px;
}

.result-box p {
  margin: 3px 0;
  font-size: 13px;
}

.log-sub {
  background: #fafafa;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  max-height: 120px;
  overflow-y: auto;
  border: 1px solid #f0f0f0;
}

.log-line {
  margin: 0 0 3px;
  color: #555;
  font-family: monospace;
  font-size: 12px;
}

.log-container {
  max-height: 150px;
  overflow-y: auto;
  background: #fafafa;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  border: 1px solid #f0f0f0;
}

.log-line {
  margin: 0 0 3px;
  color: #555;
  font-family: monospace;
}

.log-empty {
  color: #bbb;
  margin: 0;
}

.principle-box {
  background: #1a1a2e;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
}

.code-block {
  margin: 0 0 12px;
  color: #e6e6e6;
  font-size: 13px;
  line-height: 1.7;
}

.code-block code {
  color: #e6e6e6;
}

.principle-list {
  margin: 0;
  padding-left: 20px;
  color: #aaa;
  font-size: 13px;
  line-height: 1.7;
}

.principle-list code {
  background: #2a2a4a;
  color: #52c41a;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
}

@media (max-width: 640px) {
  .demo-row {
    flex-direction: column;
  }
}
</style>
