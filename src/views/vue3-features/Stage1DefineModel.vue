<script setup lang="ts">
import { ref, computed } from 'vue'

const log = ref<string[]>([])

function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// 旧方式演示：props + emit
const oldWayCode = ref(`// ===== 旧方式：子组件 =====
// 子组件需要定义 props + emit
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}`)

const newWayCode = ref(`// ===== 新方式：defineModel =====
// 一行搞定！自动处理 props + emit
const modelValue = defineModel<string>({ default: '' })
// modelValue 是一个 ref，直接读写即可`)

const multiModelCode = ref(`// 多个 v-model
const firstName = defineModel<string>('firstName', { default: '' })
const lastName = defineModel<string>('lastName', { default: '' })

// 父组件使用：
// <ChildComponent v-model:firstName="first" v-model:lastName="last" />`)

const modifiersCode = ref(`// 自定义修饰符
const [modelValue, modifiers] = defineModel<string>({
  setter(value) {
    // 根据修饰符处理值
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})

// 父组件：<ChildComponent v-model.capitalize="text" />`)

// 交互演示
const demoText = ref('Hello defineModel')
const demoName = ref('Zhang')
const demoSurname = ref('San')

function clearLog() {
  log.value = []
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 1：defineModel — 简化 v-model 双向绑定</h1>
      <p>Vue 3.4 引入的 defineModel 宏，替代传统的 props + emit 模式，让 v-model 声明更简洁。</p>
    </header>

    <!-- 旧方式 vs 新方式 -->
    <section class="card">
      <h2>旧方式 vs 新方式</h2>
      <div class="comparison-grid">
        <div class="comparison-col">
          <h3 style="color: #cf1322;">旧方式（props + emit）</h3>
          <pre class="code-block"><code>{{ oldWayCode }}</code></pre>
        </div>
        <div class="comparison-col">
          <h3 style="color: #52c41a;">新方式（defineModel）</h3>
          <pre class="code-block"><code>{{ newWayCode }}</code></pre>
        </div>
      </div>
    </section>

    <!-- 核心特性 -->
    <section class="card">
      <h2>defineModel 核心特性</h2>
      <div class="info-grid">
        <div class="info-item">
          <strong>自动声明</strong>
          <span>自动创建同名的 prop 和 emit，无需手动定义</span>
        </div>
        <div class="info-item">
          <strong>返回值是 ref</strong>
          <span>返回一个 Ref，可直接读写，自动触发 update:xxx 事件</span>
        </div>
        <div class="info-item">
          <strong>支持默认值</strong>
          <span>通过参数指定默认值：defineModel({ default: '' })</span>
        </div>
        <div class="info-item">
          <strong>多个 v-model</strong>
          <span>传入名称参数：defineModel('title')</span>
        </div>
        <div class="info-item">
          <strong>required 模式</strong>
          <span>defineModel({ required: true }) 标记为必填</span>
        </div>
        <div class="info-item">
          <strong>自定义修饰符</strong>
          <span>解构获取 modifiers，在 setter 中按需处理</span>
        </div>
      </div>
    </section>

    <!-- 多个 v-model -->
    <section class="card">
      <h2>多个 v-model 支持</h2>
      <pre class="code-block"><code>{{ multiModelCode }}</code></pre>
    </section>

    <!-- 自定义修饰符 -->
    <section class="card">
      <h2>自定义修饰符</h2>
      <pre class="code-block"><code>{{ modifiersCode }}</code></pre>
    </section>

    <!-- 交互演示 -->
    <section class="card">
      <h2>交互演示：模拟 defineModel 行为</h2>
      <p class="tip">以下演示 defineModel 在实际使用中的效果 — 输入框修改会自动双向同步。</p>
      <div class="demo-area">
        <div class="demo-row">
          <label>modelValue：</label>
          <a-input v-model:value="demoText" style="width: 300px" />
          <span class="demo-value">当前值：{{ demoText }}</span>
        </div>
        <div class="demo-row">
          <label>firstName：</label>
          <a-input v-model:value="demoName" style="width: 300px" />
          <span class="demo-value">当前值：{{ demoName }}</span>
        </div>
        <div class="demo-row">
          <label>lastName：</label>
          <a-input v-model:value="demoSurname" style="width: 300px" />
          <span class="demo-value">当前值：{{ demoSurname }}</span>
        </div>
        <div style="margin-top: 12px;">
          <a-button type="primary" @click="addLog('defineModel 示例：modelValue=' + demoText + ', name=' + demoName + ' ' + demoSurname)">
            记录当前值
          </a-button>
        </div>
      </div>
      <div class="log-panel" v-if="log.length > 0">
        <div class="log-header">
          <strong>操作日志</strong>
          <a-button size="small" @click="clearLog">清空</a-button>
        </div>
        <div v-for="(entry, idx) in log" :key="idx" class="log-entry">{{ entry }}</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.page-header p {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card h2 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #333;
}

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.7;
  margin: 0;
}

.code-block code {
  font-family: 'Fira Code', 'Consolas', monospace;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

.info-item {
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item strong {
  font-size: 14px;
  color: #333;
}

.info-item span {
  font-size: 12px;
  color: #999;
  line-height: 1.5;
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.comparison-col h3 {
  margin: 0 0 10px;
  font-size: 15px;
}

.tip {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
}

.demo-area {
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.demo-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.demo-row label {
  font-size: 13px;
  color: #666;
  min-width: 90px;
  font-weight: 600;
}

.demo-value {
  font-size: 13px;
  color: #3178c6;
  font-family: monospace;
}

.log-panel {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 12px;
  max-height: 200px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 12px;
  margin-top: 16px;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f0f0f0;
}

.log-entry {
  padding: 2px 0;
  color: #666;
}

.btn {
  padding: 8px 16px;
  background: #3178c6;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .comparison-grid {
    grid-template-columns: 1fr;
  }
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
