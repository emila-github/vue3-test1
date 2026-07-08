<script setup lang="ts">
/**
 * Stage 2: Pinia 持久化进阶配置
 * 演示 sessionStorage、自定义 serializer、部分持久化、pick/omit 模式
 */
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdvancedStore } from '@/stores/persistAdvanced'
import { message } from 'ant-design-vue'

const store = useAdvancedStore()
const { loginState, preferences, sensitiveData } = storeToRefs(store)

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(msg)
  message.info(msg)
}

// 修改被持久化的数据（loginState 和 preferences 会持久化，sensitiveData 不会）
function updateLogin(state: string) {
  store.loginState.status = state
  addLog(`loginState.status → ${state}（持久化到 sessionStorage）`)
}

function updateTheme(theme: string) {
  store.preferences.theme = theme
  addLog(`preferences.theme → ${theme}（持久化到 localStorage）`)
}

function updateSensitive() {
  store.sensitiveData.token = `token_${Date.now()}`
  addLog(`sensitiveData.token 已更新（不持久化，刷新后丢失）`)
}

function checkAllStorage() {
  const s1 = sessionStorage.getItem('persist-advanced')
  const s2 = localStorage.getItem('persist-advanced-prefs')
  addLog(`sessionStorage: ${s1 || '(空)'}`)
  addLog(`localStorage: ${s2 || '(空)'}`)
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 2：进阶配置与策略</h1>
      <p>掌握 sessionStorage、自定义序列化、pick/omit 模式、多字段不同存储策略。</p>
    </header>

    <!-- 2.1 sessionStorage -->
    <section class="card">
      <h2>2.1 使用 sessionStorage</h2>
      <p>通过 <code>storage</code> 选项指定存储引擎。sessionStorage 在关闭标签页后自动清除。</p>
      <pre class="code-block">
persist: {
  storage: sessionStorage,  // 使用 sessionStorage，非默认 localStorage
}</pre>
      <div class="tip-box">
        <strong>适用场景：</strong> 登录状态、会话级数据（关闭浏览器标签后自动清除）。
      </div>
    </section>

    <!-- 2.2 pick / omit -->
    <section class="card">
      <h2>2.2 pick / omit —— 部分持久化</h2>
      <p>控制哪些 state 字段需要持久化，避免敏感数据泄露。</p>
      <pre class="code-block">
// pick 模式：只持久化指定字段
persist: {
  pick: ['loginState'],  // 只持久化 loginState
}

// omit 模式：排除指定字段
persist: {
  omit: ['sensitiveData'],  // 排除 sensitiveData，其他全部持久化
}</pre>
    </section>

    <!-- 2.3 自定义 serializer -->
    <section class="card">
      <h2>2.3 自定义序列化器</h2>
      <p>适用于需要加密存储、非 JSON 格式、或自定义数据转换的场景。</p>
      <pre class="code-block">
persist: {
  serializer: {
    serialize: (value) =&gt; {
      // 自定义序列化（如加密后存储）
      return JSON.stringify(btoa(JSON.stringify(value)))
    },
    deserialize: (value) =&gt; {
      // 自定义反序列化（如解密后读取）
      return JSON.parse(atob(JSON.parse(value)))
    },
  },
}</pre>
    </section>

    <!-- 2.4 复杂 Store 演示 -->
    <section class="card">
      <h2>2.4 多策略持久化实战</h2>
      <p>
        Store 中不同字段使用不同的持久化策略：
        <code>loginState</code> 存 sessionStorage，
        <code>preferences</code> 存 localStorage，
        <code>sensitiveData</code> 不持久化。
      </p>
      <pre class="code-block">
// stores/persistAdvanced.ts
export const useAdvancedStore = defineStore('persist-advanced', () =&gt; {
  const loginState = ref({ status: 'offline', lastLogin: '' })
  const preferences = ref({ theme: 'light', lang: 'zh-CN' })
  const sensitiveData = ref({ token: '', password: '' })
  return { loginState, preferences, sensitiveData }
}, {
  persist: [
    {
      key: 'persist-advanced',
      storage: sessionStorage,
      pick: ['loginState'],  // 存 sessionStorage
    },
    {
      key: 'persist-advanced-prefs',
      storage: localStorage,
      pick: ['preferences'],  // 存 localStorage
    },
    // sensitiveData 不在任何 pick 中 → 不持久化
  ],
})</pre>
    </section>

    <!-- 2.5 交互演示 -->
    <section class="card">
      <h2>2.5 交互演示</h2>
      <div class="demo-box">
        <!-- 登录状态（sessionStorage） -->
        <div class="section-group">
          <h3>🔐 登录状态（sessionStorage — 关闭标签页后清除）</h3>
          <div class="info-row">
            <span>状态：<strong>{{ loginState.status }}</strong></span>
            <span>最后登录：<strong>{{ loginState.lastLogin || '--' }}</strong></span>
          </div>
          <div class="btn-row">
            <button class="btn" @click="updateLogin('online')">上线</button>
            <button class="btn" @click="updateLogin('offline')">离线</button>
          </div>
        </div>

        <!-- 偏好设置（localStorage） -->
        <div class="section-group">
          <h3>⚙ 偏好设置（localStorage — 永久存储）</h3>
          <div class="info-row">
            <span>主题：<strong>{{ preferences.theme }}</strong></span>
          </div>
          <div class="btn-row">
            <button :class="['btn', { active: preferences.theme === 'light' }]" @click="updateTheme('light')">
              ☀ 浅色
            </button>
            <button :class="['btn', { active: preferences.theme === 'dark' }]" @click="updateTheme('dark')">
              🌙 暗色
            </button>
          </div>
        </div>

        <!-- 敏感数据（不持久化） -->
        <div class="section-group">
          <h3>🔒 敏感数据（不持久化）</h3>
          <div class="info-row">
            <span>Token：<code>{{ sensitiveData.token || '(空)' }}</code></span>
          </div>
          <button class="btn btn-sm" @click="updateSensitive">生成新 Token</button>
          <p class="hint">⚠ 刷新页面后 Token 不保留</p>
        </div>

        <div class="btn-row" style="margin-top: 20px;">
          <button class="btn btn-outline" @click="checkAllStorage">查看所有存储</button>
        </div>
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

.demo-box {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.section-group {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px dashed #e8e8e8;
}
.section-group:last-child { border-bottom: none; margin-bottom: 0; }
.section-group h3 { font-size: 15px; color: #333; margin: 0 0 10px; }

.info-row {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #555;
}
.info-row code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.btn-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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
.btn:hover { border-color: #722ed1; color: #722ed1; }
.btn.active { background: #722ed1; color: #fff; border-color: #722ed1; }
.btn-sm { padding: 4px 12px; font-size: 12px; }
.btn-outline { border-color: #1677ff; color: #1677ff; }

.hint { font-size: 12px; color: #999; margin-top: 6px; }

.log-area { max-height: 200px; overflow-y: auto; font-size: 13px; }
.log-item { padding: 4px 0; color: #555; border-bottom: 1px dashed #f0f0f0; }
.log-empty { color: #ccc; text-align: center; padding: 20px; }

@media (max-width: 640px) { .stage-page { padding: 16px; } }
</style>
