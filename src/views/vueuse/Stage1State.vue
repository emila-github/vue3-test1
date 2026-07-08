<script setup lang="ts">
/**
 * Stage 1: VueUse 状态管理工具
 * 演示 useStorage、useLocalStorage、useToggle、useRefHistory
 */
import { ref, shallowRef } from 'vue'
import { useStorage, useLocalStorage, useToggle, useRefHistory } from '@vueuse/core'

const log = ref<string[]>([])

function addLog(msg: string) {
  log.value.push(msg)
}

// ============ useStorage ============
const theme = useStorage('vueuse-theme', 'light', localStorage, {
  mergeDefaults: true,
})
const themeOptions = ['light', 'dark', 'auto']

function switchTheme(t: string) {
  theme.value = t
  addLog(`useStorage: theme → ${t}`)
}

// ============ useLocalStorage ============
interface UserPref {
  name: string
  fontSize: number
  notifications: boolean
}
const userPref = useLocalStorage<UserPref>('vueuse-user-pref', {
  name: 'Alice',
  fontSize: 14,
  notifications: true,
})

function updatePref(key: keyof UserPref, val: unknown) {
  ;(userPref.value as Record<string, unknown>)[key] = val
  addLog(`useLocalStorage: ${key} → ${JSON.stringify(val)}`)
}

// ============ useToggle ============
const [darkMode, toggleDark] = useToggle(false)
const [status, toggleStatus] = useToggle<'online' | 'offline' | 'busy'>('online', 'offline', 'busy')

// ============ useRefHistory ============
const counter = ref(0)
const { history, undo, redo, canUndo, canRedo, clear: clearHistory } = useRefHistory(counter, { capacity: 10 })

function incAndLog() {
  counter.value++
  addLog(`计数器: ${counter.value}`)
}

// 清除所有存储
function clearAllStorage() {
  localStorage.removeItem('vueuse-theme')
  localStorage.removeItem('vueuse-user-pref')
  theme.value = 'light'
  userPref.value = { name: 'Alice', fontSize: 14, notifications: true }
  addLog('已清除所有 localStorage 数据')
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 1：状态管理工具</h1>
      <p>掌握 <code>useStorage</code>、<code>useLocalStorage</code>、<code>useToggle</code>、<code>useRefHistory</code> 四个核心 API。</p>
    </header>

    <!-- 1.1 useStorage -->
    <section class="card">
      <h2>1.1 useStorage —— 响应式 localStorage</h2>
      <p>
        自动将 <code>ref</code> 与 localStorage 同步，支持跨标签页通信（通过 <code>storage</code> 事件）。
        比手写 <code>watch + localStorage</code> 更简洁可靠。
      </p>
      <pre class="code-block">
const theme = useStorage('vueuse-theme', 'light', localStorage)</pre>
      <div class="demo-box">
        <p><strong>当前主题：</strong>{{ theme }}</p>
        <div class="btn-row">
          <button
            v-for="t in themeOptions"
            :key="t"
            :class="['btn', { active: theme === t }]"
            @click="switchTheme(t)"
          >
            {{ t }}
          </button>
        </div>
      </div>
    </section>

    <!-- 1.2 useLocalStorage -->
    <section class="card">
      <h2>1.2 useLocalStorage —— 带类型序列化</h2>
      <p>
        <code>useLocalStorage</code> 自动处理 JSON 序列化/反序列化，支持 TypeScript 泛型。
      </p>
      <pre class="code-block">
const userPref = useLocalStorage&lt;UserPref&gt;('vueuse-user-pref', {
  name: 'Alice',
  fontSize: 14,
  notifications: true,
})</pre>
      <div class="demo-box">
        <div class="pref-row">
          <span>用户名：</span>
          <a-input v-model:value="userPref.name" @change="addLog('pref.name 已更新')" style="width: 200px" />
        </div>
        <div class="pref-row">
          <span>字体大小：</span>
          <a-input-number v-model:value="userPref.fontSize" @change="addLog('pref.fontSize 已更新')" :min="10" :max="30" />
        </div>
        <div class="pref-row">
          <span>通知：</span>
          <a-switch v-model:checked="userPref.notifications" @change="addLog('pref.notifications 已更新')" />
        </div>
        <p class="hint">刷新页面后数据依然保留（存储在 localStorage）</p>
        <button class="btn btn-danger" @click="clearAllStorage">清除所有 localStorage</button>
      </div>
    </section>

    <!-- 1.3 useToggle -->
    <section class="card">
      <h2>1.3 useToggle —— 多值切换</h2>
      <p>
        在多个预设值之间循环切换，适合主题切换、状态切换等场景。
      </p>
      <pre class="code-block">
// 布尔切换
const [darkMode, toggleDark] = useToggle(false)

// 多值循环切换
const [status, toggleStatus] = useToggle('online', 'offline', 'busy')</pre>
      <div class="demo-box">
        <div class="toggle-row">
          <span><strong>暗色模式：</strong>{{ darkMode }}</span>
          <a-switch :checked="darkMode" @change="toggleDark()" />
        </div>
        <div class="toggle-row">
          <span><strong>状态：</strong>{{ status }}</span>
          <button class="btn" @click="toggleStatus()">切换状态</button>
        </div>
      </div>
    </section>

    <!-- 1.4 useRefHistory -->
    <section class="card">
      <h2>1.4 useRefHistory —— 撤销/重做</h2>
      <p>
        自动追踪 ref 的历史变化，提供 undo/redo 能力，适合编辑器等需要撤销功能的场景。
      </p>
      <pre class="code-block">
const counter = ref(0)
const { history, undo, redo, canUndo, canRedo } = useRefHistory(counter)</pre>
      <div class="demo-box">
        <div class="counter-area">
          <p class="counter-value">count = {{ counter }}</p>
          <div class="btn-row">
            <button class="btn" @click="incAndLog">+1</button>
            <button class="btn" :disabled="!canUndo" @click="undo()">↩ 撤销</button>
            <button class="btn" :disabled="!canRedo" @click="redo()">↪ 重做</button>
            <button class="btn" @click="clearHistory()">清空历史</button>
          </div>
        </div>
        <div class="history-snaps">
          <p><strong>历史快照（最多 10 条）：</strong></p>
          <div class="snap-list">
            <span v-for="(snap, i) in history" :key="i" class="snap-item">
              {{ snap.snapshot }}
            </span>
          </div>
        </div>
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

.btn-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
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
  border-color: #10b981;
  color: #10b981;
}

.btn.active {
  background: #10b981;
  color: #fff;
  border-color: #10b981;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-danger {
  color: #ff4d4f;
  border-color: #ffccc7;
  margin-top: 12px;
}

.pref-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #333;
}

.hint {
  color: #999;
  font-size: 12px;
  margin: 8px 0 0;
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 14px;
}

.counter-area {
  text-align: center;
}

.counter-value {
  font-size: 32px;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 12px;
}

.history-snaps {
  margin-top: 16px;
}

.snap-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.snap-item {
  background: #e6f7ff;
  color: #1890ff;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 13px;
  border: 1px solid #91d5ff;
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
  .stage-page {
    padding: 16px;
  }
}
</style>
