<script setup lang="ts">
import { ref, useTemplateRef, onMounted, nextTick } from 'vue'

const log = ref<string[]>([])

function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// 旧方式
const oldInputRef = ref<HTMLInputElement | null>(null)

// 新方式：useTemplateRef
const newInputRef = useTemplateRef<HTMLInputElement>('newInput')

// v-for 场景
const items = ref([
  { id: 1, text: 'Item 1' },
  { id: 2, text: 'Item 2' },
  { id: 3, text: 'Item 3' },
])
const itemRefs = useTemplateRef<HTMLLIElement[]>('itemEls')

// 代码示例
const oldWayCode = ref(`// 旧方式：手动声明 ref(null)
const inputRef = ref<HTMLInputElement | null>(null)

// 模板中
// <input ref="inputRef" />

// 访问时需要处理 null
function focus() {
  inputRef.value?.focus()
}`)

const newWayCode = ref(`// 新方式：useTemplateRef（Vue 3.5+）
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')

// 模板中使用 ref 属性
// <input ref="inputRef" />

// 类型安全，自动推导！
function focus() {
  inputRef.value?.focus()
}`)

const vForCode = ref(`// v-for 中的 useTemplateRef
const itemRefs = useTemplateRef<HTMLLIElement[]>('itemEls')

// 模板
// <li v-for="item in items" :key="item.id" :ref="itemEls">

// 访问：itemRefs.value 是 HTMLLIElement[]`)

// 交互演示
function focusOldInput() {
  oldInputRef.value?.focus()
  addLog('旧方式 ref 聚焦输入框')
}

function focusNewInput() {
  newInputRef.value?.focus()
  addLog('useTemplateRef 聚焦输入框')
}

function readInputValue() {
  const oldVal = oldInputRef.value?.value ?? ''
  const newVal = newInputRef.value?.value ?? ''
  addLog(`旧方式 ref 值: "${oldVal}" | useTemplateRef 值: "${newVal}"`)
}

function checkVForRefs() {
  const refs = itemRefs.value
  if (refs && refs.length > 0) {
    const texts = Array.from(refs).map(el => el.textContent).join(', ')
    addLog(`v-for refs 数量: ${refs.length}, 内容: ${texts}`)
  } else {
    addLog('v-for refs 为空')
  }
}

function clearLog() {
  log.value = []
}

onMounted(() => {
  addLog('组件已挂载，useTemplateRef 已就绪')
})
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 2：useTemplateRef — 类型安全的模板引用</h1>
      <p>Vue 3.5 引入的 useTemplateRef() 提供类型安全的模板引用获取方式，替代传统的 ref(null) 模式。</p>
    </header>

    <!-- 旧方式 vs 新方式 -->
    <section class="card">
      <h2>旧方式 vs 新方式</h2>
      <div class="comparison-grid">
        <div class="comparison-col">
          <h3 style="color: #cf1322;">旧方式（ref(null)）</h3>
          <pre class="code-block"><code>{{ oldWayCode }}</code></pre>
        </div>
        <div class="comparison-col">
          <h3 style="color: #52c41a;">新方式（useTemplateRef）</h3>
          <pre class="code-block"><code>{{ newWayCode }}</code></pre>
        </div>
      </div>
    </section>

    <!-- 优势对比 -->
    <section class="card">
      <h2>useTemplateRef 优势</h2>
      <div class="info-grid">
        <div class="info-item">
          <strong>更好的类型推导</strong>
          <span>泛型参数直接指定类型，无需手动标注 null 联合类型</span>
        </div>
        <div class="info-item">
          <strong>语义更清晰</strong>
          <span>函数名明确表达了"获取模板引用"的意图</span>
        </div>
        <div class="info-item">
          <strong>统一 API 风格</strong>
          <span>与 useId、useAttrs 等 Vue 组合式 API 命名一致</span>
        </div>
        <div class="info-item">
          <strong>支持 v-for</strong>
          <span>在 v-for 中返回元素数组，类型自动推导</span>
        </div>
      </div>
    </section>

    <!-- v-for 场景 -->
    <section class="card">
      <h2>v-for 中使用 useTemplateRef</h2>
      <pre class="code-block"><code>{{ vForCode }}</code></pre>
      <div class="demo-area" style="margin-top: 12px;">
        <ul class="item-list">
          <li v-for="item in items" :key="item.id" :ref="itemRefs" class="list-item">
            {{ item.text }}
          </li>
        </ul>
        <a-button @click="checkVForRefs">检查 v-for refs</a-button>
      </div>
    </section>

    <!-- 交互演示 -->
    <section class="card">
      <h2>交互演示</h2>
      <p class="tip">比较两种方式获取模板引用的行为 — 功能等价，但 useTemplateRef 类型更安全。</p>
      <div class="demo-area">
        <div class="demo-row">
          <label>旧方式：</label>
          <input ref="oldInputRef" placeholder="ref(null) 方式" class="demo-input" />
          <a-button size="small" @click="focusOldInput">聚焦</a-button>
        </div>
        <div class="demo-row">
          <label>新方式：</label>
          <input ref="newInputRef" placeholder="useTemplateRef 方式" class="demo-input" />
          <a-button size="small" @click="focusNewInput">聚焦</a-button>
        </div>
        <div style="margin-top: 12px;">
          <a-button type="primary" @click="readInputValue">读取两个输入框的值</a-button>
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
  min-width: 70px;
  font-weight: 600;
}

.demo-input {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  flex: 1;
  max-width: 300px;
  outline: none;
}

.demo-input:focus {
  border-color: #3178c6;
  box-shadow: 0 0 0 2px rgba(49, 120, 198, 0.2);
}

.item-list {
  list-style: none;
  padding: 0;
  margin: 0 0 12px;
}

.list-item {
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  margin-bottom: 6px;
  font-size: 14px;
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
