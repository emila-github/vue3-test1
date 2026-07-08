<script setup lang="ts">
/**
 * Stage 2: VueUse 浏览器 API 工具
 * 演示 useDark、useEventListener、useMediaQuery、useTitle、useClipboard、useFullscreen
 */
import { ref, shallowRef, onMounted, onUnmounted } from 'vue'
import {
  useDark,
  useToggle,
  useEventListener,
  useMediaQuery,
  useTitle,
  useClipboard,
  useFullscreen,
  useMouse,
} from '@vueuse/core'
import { message } from 'ant-design-vue'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(msg)
}

// ============ useDark + useToggle ============
const isDark = useDark()
const toggleDark = useToggle(isDark)

// ============ useMediaQuery ============
const isMobile = useMediaQuery('(max-width: 768px)')
const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
const isDesktop = useMediaQuery('(min-width: 1025px)')
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

// ============ useTitle ============
const customTitle = ref('VueUse 浏览器 API 学习')
useTitle(customTitle)

// ============ useClipboard ============
const clipboardSource = ref('Hello from VueUse!')
const { copy, copied, isSupported: clipSupported } = useClipboard()

function doCopy() {
  copy(clipboardSource.value)
  message.success(copied.value ? '复制成功！' : '复制失败')
  addLog(`复制: ${clipboardSource.value}`)
}

// ============ useEventListener ============
const keyPressed = shallowRef('')
onMounted(() => {
  useEventListener(window, 'keydown', (e: KeyboardEvent) => {
    keyPressed.value = e.key
    addLog(`按键: ${e.key} (code: ${e.code})`)
  })
})

// ============ useFullscreen ============
const fullEl = ref<HTMLElement | null>(null)
const { isFullscreen, enter: enterFullscreen, exit: exitFullscreen } = useFullscreen(fullEl)

function toggleFull() {
  if (isFullscreen.value) {
    exitFullscreen()
  } else {
    enterFullscreen()
  }
}

// ============ useMouse ============
const mouseEl = ref<HTMLElement | null>(null)
const { x, y } = useMouse({ type: 'client' })

// 清除标题
onUnmounted(() => {
  useTitle('Vue 3 学习示例')
})
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 2：浏览器 API 工具</h1>
      <p>掌握 <code>useDark</code>、<code>useMediaQuery</code>、<code>useEventListener</code>、<code>useTitle</code>、<code>useClipboard</code>、<code>useFullscreen</code>。</p>
    </header>

    <!-- 2.1 useDark -->
    <section class="card">
      <h2>2.1 useDark —— 暗色模式</h2>
      <p>
        自动在 <code>&lt;html&gt;</code> 上添加/移除 <code>class="dark"</code>，并持久化到 localStorage。
      </p>
      <pre class="code-block">
const isDark = useDark()
const toggleDark = useToggle(isDark)</pre>
      <div class="demo-box flex-center">
        <span class="dark-label">{{ isDark ? '🌙 暗色模式' : '☀ 亮色模式' }}</span>
        <a-switch :checked="isDark" @change="toggleDark()" />
      </div>
    </section>

    <!-- 2.2 useMediaQuery -->
    <section class="card">
      <h2>2.2 useMediaQuery —— 响应式断点</h2>
      <p>监听 CSS 媒体查询变化，比手动监听 resize 更高效。</p>
      <pre class="code-block">const isMobile = useMediaQuery('(max-width: 768px)')</pre>
      <div class="demo-box">
        <div class="query-grid">
          <div :class="['query-card', { active: isMobile }]">
            <span class="q-icon">📱</span>
            <strong>手机</strong>
            <span class="q-status">{{ isMobile ? '✓' : '' }}</span>
          </div>
          <div :class="['query-card', { active: isTablet }]">
            <span class="q-icon">📟</span>
            <strong>平板</strong>
            <span class="q-status">{{ isTablet ? '✓' : '' }}</span>
          </div>
          <div :class="['query-card', { active: isDesktop }]">
            <span class="q-icon">🖥</span>
            <strong>桌面</strong>
            <span class="q-status">{{ isDesktop ? '✓' : '' }}</span>
          </div>
          <div :class="['query-card', { active: prefersReducedMotion }]">
            <span class="q-icon">🎯</span>
            <strong>减弱动效</strong>
            <span class="q-status">{{ prefersReducedMotion ? '✓' : '' }}</span>
          </div>
        </div>
        <p class="hint">试试缩放浏览器窗口来观察变化</p>
      </div>
    </section>

    <!-- 2.3 useTitle -->
    <section class="card">
      <h2>2.3 useTitle —— 动态标题</h2>
      <p>响应式地修改 <code>document.title</code>。</p>
      <pre class="code-block">
const title = ref('VueUse 浏览器 API 学习')
useTitle(title)  // 自动同步到 document.title</pre>
      <div class="demo-box">
        <p>当前标题：<a-input v-model:value="customTitle" style="width: 300px" /></p>
        <p class="hint">查看浏览器标签页标题的变化</p>
      </div>
    </section>

    <!-- 2.4 useClipboard -->
    <section class="card">
      <h2>2.4 useClipboard —— 剪贴板</h2>
      <p>读写系统剪贴板，支持 <code>isSupported</code> 特性检测。</p>
      <pre class="code-block">
const { copy, copied, isSupported } = useClipboard()
copy('Hello!') // 复制到剪贴板</pre>
      <div class="demo-box">
        <div class="clip-row">
          <a-input v-model:value="clipboardSource" style="width: 300px" placeholder="输入要复制的内容" />
          <button class="btn" @click="doCopy" :disabled="!clipSupported">
            {{ copied ? '✅ 已复制' : '📋 复制' }}
          </button>
        </div>
        <p class="hint" v-if="!clipSupported">当前环境不支持 Clipboard API</p>
      </div>
    </section>

    <!-- 2.5 useEventListener -->
    <section class="card">
      <h2>2.5 useEventListener —— 简化事件监听</h2>
      <p>自动在组件卸载时清理事件，避免内存泄漏。</p>
      <pre class="code-block">useEventListener(window, 'keydown', (e) => {
  keyPressed.value = e.key
})</pre>
      <div class="demo-box flex-center">
        <span>按下任意键试试 → </span>
        <span class="key-display">{{ keyPressed || '等待按键…' }}</span>
      </div>
    </section>

    <!-- 2.6 useFullscreen -->
    <section class="card">
      <h2>2.6 useFullscreen —— 全屏控制</h2>
      <p>
        控制元素的全屏显示，<code>isFullscreen</code> 监听全屏状态变化。
      </p>
      <pre class="code-block">
const { isFullscreen, enter, exit } = useFullscreen(targetRef)</pre>
      <div class="demo-box">
        <div ref="fullEl" :class="['full-demo-box', { full: isFullscreen }]">
          <p>这是可以全屏的区域</p>
          <button class="btn" @click="toggleFull">
            {{ isFullscreen ? '退出全屏' : '进入全屏' }}
          </button>
        </div>
      </div>
    </section>

    <!-- 2.7 useMouse -->
    <section class="card">
      <h2>2.7 useMouse —— 鼠标位置追踪</h2>
      <pre class="code-block">const { x, y } = useMouse()</pre>
      <div class="demo-box">
        <p>鼠标坐标 — X: <strong>{{ x }}</strong>, Y: <strong>{{ y }}</strong></p>
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
  gap: 12px;
}

.dark-label {
  font-size: 18px;
  font-weight: 600;
}

.query-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.query-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 8px;
  border: 2px solid #f0f0f0;
  border-radius: 10px;
  transition: all 0.2s;
}

.query-card.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.q-icon {
  font-size: 24px;
}

.q-status {
  color: #3b82f6;
  font-weight: 700;
}

.hint {
  color: #999;
  font-size: 12px;
  margin-top: 12px;
}

.clip-row {
  display: flex;
  gap: 12px;
  align-items: center;
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
  border-color: #3b82f6;
  color: #3b82f6;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.key-display {
  font-size: 32px;
  font-weight: 700;
  color: #3b82f6;
  padding: 8px 16px;
  background: #eff6ff;
  border-radius: 8px;
  border: 2px dashed #3b82f6;
}

.full-demo-box {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s;
}

.full-demo-box.full {
  background: #1a1a1a;
  color: #fff;
  border-color: #3b82f6;
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
  .query-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
