<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter'
import { message } from 'ant-design-vue'

// 使用 store
const counterStore = useCounterStore()

// ❌ 直接解构会丢失响应式
// const { count, doubleCount } = counterStore

// ✅ 使用 storeToRefs 保持响应式
const { count, doubleCount } = storeToRefs(counterStore)

const log = ref<string[]>([])

function handleIncrement() {
  counterStore.increment()
  addLog(`increment() → 值变为 ${count.value}`)
}

function directModify() {
  counterStore.count++
  addLog(`直接修改 count++ → 值变为 ${count.value}`)
}

function batchPatch() {
  counterStore.$patch({ count: 100 })
  addLog(`$patch({ count: 100 }) → 批量更新`)
}

function resetStore() {
  counterStore.$reset()
  addLog(`$reset() → 恢复到初始值 0`)
}

function addLog(msg: string) {
  log.value.push(msg)
  message.info(msg)
}

function clearLog() {
  log.value = []
  message.success('日志已清除')
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 1：Setup Store 快速上手</h1>
      <p>使用 <code>defineStore</code> + Composition API 创建你的第一个 Pinia Store。</p>
    </header>

    <!-- 1.1 创建 Store -->
    <section class="card">
      <h2>1.1 使用 defineStore 创建 Store</h2>
      <p>
        Pinia 3.x 推荐使用 <strong>Setup Store</strong> 语法，与 Vue 组件 Composition API 写法完全一致，
        <code>ref</code> 作为 state，<code>computed</code> 作为 getter，<code>function</code> 作为 action。
      </p>
      <pre class="code-block">
// stores/counter.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // state   —— ref
  const count = ref(0)

  // getter  —— computed
  const doubleCount = computed(() => count.value * 2)

  // action  —— 普通函数
  function increment() {
    count.value++
  }

  // 必须 return 所有需要暴露的内容
  return { count, doubleCount, increment }
})</pre
      >
      <div class="tip-box">
        <strong>要点：</strong>
        <ul>
          <li><code>defineStore(id, setup)</code> — Setup Store（推荐）</li>
          <li><code>defineStore(id, options)</code> — Options Store（类 Vuex 风格）</li>
          <li>setup 函数必须 <strong>return</strong> 需要暴露的 state/getter/action</li>
          <li>Store 命名约定：<code>useXxxStore</code>（如 <code>useCounterStore</code>）</li>
        </ul>
      </div>
    </section>

    <!-- 1.2 使用 Store -->
    <section class="card">
      <h2>1.2 在组件中使用 Store</h2>
      <p>
        在 <code>&lt;script setup&gt;</code> 中调用 <code>useXxxStore()</code> 获取 store 实例。
        注意：<strong>不能直接解构</strong>，需要用 <code>storeToRefs()</code> 保持响应式。
      </p>

      <div class="demo-box">
        <h4>计数器演示：</h4>
        <div class="counter-display">
          <div class="stat">
            <span class="stat-label">count</span>
            <span class="stat-value">{{ count }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">doubleCount</span>
            <span class="stat-value">{{ doubleCount }}</span>
          </div>
        </div>
        <a-space wrap style="margin-top: 12px">
          <a-button type="primary" @click="handleIncrement">increment()</a-button>
          <a-button @click="directModify">直接修改 count++</a-button>
          <a-button @click="batchPatch">$patch({ count: 100 })</a-button>
          <a-button danger @click="resetStore">$reset()</a-button>
        </a-space>
      </div>

      <pre class="code-block">
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()

// ❌ 直接解构 — 丢失响应式！
const { count, doubleCount } = store

// ✅ storeToRefs — 保持响应式
const { count, doubleCount } = storeToRefs(store)

// action 可直接解构（不是响应式数据）
const { increment } = store

// 直接修改 state 也可以（不需要 mutation）
store.count++
store.$patch({ count: 100 })
store.$reset()</pre
      >
    </section>

    <!-- 1.3 Options Store 对比 -->
    <section class="card">
      <h2>1.3 Options Store 语法（对比）</h2>
      <p>Pinia 同时支持 Options Store 语法，类似 Vuex 风格但更简洁。适合从 Vuex 迁移的场景。</p>
      <pre class="code-block">
// Options Store 风格
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})</pre
      >
      <div class="tip-box">
        <strong>两种语法对比：</strong>
        <a-table
          :columns="[
            { title: '特性', dataIndex: 'f', key: 'f' },
            { title: 'Setup Store', dataIndex: 'setup', key: 'setup' },
            { title: 'Options Store', dataIndex: 'options', key: 'options' },
          ]"
          :data-source="[
            { f: 'State', setup: 'ref / reactive', options: 'state 对象' },
            { f: 'Getter', setup: 'computed', options: 'getters 对象' },
            { f: 'Action', setup: '普通函数', options: 'actions 对象' },
            { f: 'this 访问', setup: '直接变量名', options: 'this.xxx' },
            { f: 'TypeScript', setup: '完美推导', options: '推断良好' },
            { f: 'Composables', setup: '可直接使用', options: '不支持' },
          ]"
          :pagination="false"
          size="small"
          style="margin-top: 8px"
        />
      </div>
    </section>

    <!-- 1.4 Pinia 与 main.ts 集成 -->
    <section class="card">
      <h2>1.4 Pinia 全局注册</h2>
      <pre class="code-block">
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())   // 注册 Pinia
app.mount('#app')</pre
      >
    </section>

    <!-- 操作日志 -->
    <section class="card">
      <h2>操作日志</h2>
      <div v-if="log.length === 0" style="color: #999; font-size: 13px">点击上方按钮记录操作...</div>
      <div v-else>
        <div v-for="(item, i) in log" :key="i" class="log-item">
          <span class="log-num">{{ i + 1 }}</span>
          <span>{{ item }}</span>
        </div>
        <a-button size="small" danger @click="clearLog" style="margin-top: 8px"> 清除日志 </a-button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  color: #1a1a1a;
  margin: 0 0 6px;
}

.page-header p {
  color: #666;
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
  margin: 0 0 12px;
  font-size: 18px;
  color: #333;
}

.card p {
  font-size: 14px;
  color: #555;
  line-height: 1.7;
  margin: 0 0 12px;
}

.card p code,
.card li code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
  color: #d63384;
}

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
  margin: 12px 0;
  white-space: pre;
  tab-size: 2;
}

.demo-box {
  background: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
}

.demo-box h4 {
  margin: 0 0 10px;
  font-size: 13px;
  color: #999;
  font-weight: 400;
}

.counter-display {
  display: flex;
  gap: 32px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #ffd700;
  font-variant-numeric: tabular-nums;
}

.tip-box {
  background: #fffbe6;
  border-left: 3px solid #faad14;
  padding: 12px 16px;
  border-radius: 4px;
  margin: 12px 0;
  font-size: 13px;
  color: #595959;
}

.tip-box ul {
  margin: 6px 0 0;
  padding-left: 20px;
}

.tip-box li {
  margin-bottom: 4px;
}

.log-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
  color: #555;
}

.log-num {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e6f4ff;
  color: #1677ff;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
}
</style>
