<script setup lang="ts">
/**
 * Stage 1: Pinia 持久化快速上手
 * 演示 pinia-plugin-persistedstate 的基础用法
 */
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePersistCounterStore } from '@/stores/persistCounter'
import { message } from 'ant-design-vue'

const counterStore = usePersistCounterStore()
const { count, doubleCount } = storeToRefs(counterStore)

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(msg)
  message.info(msg)
}

function handleIncrement() {
  counterStore.increment()
  addLog(`increment() → count = ${count.value}（已自动持久化到 localStorage）`)
}

function setRandom() {
  const val = Math.floor(Math.random() * 100)
  counterStore.$patch({ count: val })
  addLog(`$patch → count = ${val}（已自动持久化）`)
}

function resetStore() {
  counterStore.$reset()
  addLog('$reset() → 恢复到初始值 0（注意：重置不会清除 localStorage！）')
}

// 查看 localStorage 中的存储数据
function checkStorage() {
  const stored = localStorage.getItem('persist-counter')
  addLog(`localStorage 中的原始数据: ${stored || '(空)'}`)
}

function clearStorage() {
  localStorage.removeItem('persist-counter')
  addLog('已手动清除 localStorage 中的数据')
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 1：Pinia 持久化快速上手</h1>
      <p>使用 <code>pinia-plugin-persistedstate</code> 实现 Store 数据自动持久化到 localStorage。</p>
    </header>

    <!-- 1.1 插件安装 -->
    <section class="card">
      <h2>1.1 插件安装与注册</h2>
      <p>在 <code>main.ts</code> 中注册插件，所有 Store 都可以使用持久化功能。</p>
      <pre class="code-block">
// main.ts
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)  // 注册持久化插件

app.use(pinia)</pre>
    </section>

    <!-- 1.2 Store 定义 -->
    <section class="card">
      <h2>1.2 定义带持久化的 Store</h2>
      <p>在 Store 的 <code>defineStore</code> 第三个参数中配置 <code>persist: true</code>。</p>
      <pre class="code-block">
// stores/persistCounter.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usePersistCounterStore = defineStore(
  'persist-counter',
  () => {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    function increment() {
      count.value++
    }
    return { count, doubleCount, increment }
  },
  {
    persist: true,  // 👈 只需这一行！Store 所有 state 自动持久化
  },
)</pre>
      <div class="tip-box">
        <strong>说明：</strong>
        <ul>
          <li><code>persist: true</code> — 启用持久化，使用默认配置（key = store id，storage = localStorage）</li>
          <li>Store 的整个 state 默认被持久化（JSON 序列化）</li>
          <li>页面加载时自动从 localStorage 恢复数据</li>
          <li>state 变化时自动写入 localStorage</li>
        </ul>
      </div>
    </section>

    <!-- 1.3 交互演示 -->
    <section class="card">
      <h2>1.3 交互演示：持久化计数器</h2>
      <p>修改计数器值后<strong>刷新页面</strong>，数据会自动恢复。</p>
      <div class="demo-box">
        <div class="counter-display">
          <span class="counter-value">{{ count }}</span>
          <span class="counter-label">Count（持久化到 localStorage）</span>
        </div>
        <div class="info-row">
          <span>Double Count：<strong>{{ doubleCount }}</strong></span>
        </div>
        <div class="btn-row">
          <button class="btn" @click="handleIncrement">+1</button>
          <button class="btn" @click="setRandom">随机值</button>
          <button class="btn btn-danger" @click="resetStore">重置</button>
        </div>
        <div class="btn-row" style="margin-top: 12px">
          <button class="btn btn-outline" @click="checkStorage">查看 localStorage</button>
          <button class="btn btn-outline-danger" @click="clearStorage">清除 localStorage</button>
        </div>
      </div>
    </section>

    <!-- 1.4 验证持久化 -->
    <section class="card">
      <h2>1.4 验证持久化效果</h2>
      <div class="demo-box">
        <ol class="verify-list">
          <li>点击 <strong>+1</strong> 按钮增加计数</li>
          <li>点击 <strong>查看 localStorage</strong> 确认数据已写入</li>
          <li><strong>刷新浏览器页面</strong></li>
          <li>观察计数器值自动恢复（而非重置为 0）</li>
          <li>打开浏览器 DevTools → Application → Local Storage 查看 <code>persist-counter</code></li>
        </ol>
      </div>
    </section>

    <!-- 日志 -->
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
.page-header h1 { font-size: 26px; color: #1a1a1a; margin: 0 0 8px; }
.page-header p { color: #666; font-size: 14px; }
.page-header code { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; }

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.card h2 { margin: 0 0 12px; font-size: 18px; color: #333; }
.card p { font-size: 14px; color: #666; line-height: 1.6; margin: 0 0 12px; }

.code-block {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  margin-bottom: 16px;
  white-space: pre-wrap;
}

.tip-box {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #389e0d;
}
.tip-box strong { display: block; margin-bottom: 4px; }
.tip-box ul { margin: 4px 0 0; padding-left: 18px; }
.tip-box li { margin-bottom: 2px; }

.demo-box {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.counter-display {
  text-align: center;
  margin-bottom: 16px;
}
.counter-value {
  display: block;
  font-size: 56px;
  font-weight: 800;
  color: #52c41a;
}
.counter-label {
  font-size: 13px;
  color: #999;
}

.info-row {
  text-align: center;
  margin-bottom: 12px;
  font-size: 15px;
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
.btn:hover { border-color: #52c41a; color: #52c41a; }
.btn-danger { color: #ff4d4f; border-color: #ffccc7; }
.btn-outline { border-color: #1677ff; color: #1677ff; background: #fff; }
.btn-outline-danger { border-color: #ffccc7; color: #ff4d4f; background: #fff; }

.verify-list {
  padding-left: 18px;
  font-size: 14px;
  color: #555;
  line-height: 2;
}

.log-area { max-height: 200px; overflow-y: auto; font-size: 13px; }
.log-item { padding: 4px 0; color: #555; border-bottom: 1px dashed #f0f0f0; }
.log-empty { color: #ccc; text-align: center; padding: 20px; }

@media (max-width: 640px) { .stage-page { padding: 16px; } }
</style>
