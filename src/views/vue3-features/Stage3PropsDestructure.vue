<script setup lang="ts">
import { ref, computed, useId } from 'vue'

const log = ref<string[]>([])

function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// 旧方式：必须通过 props.xxx 访问
const oldWayCode = ref(`// 旧方式：需要 props.xxx 访问
const props = defineProps<{
  title: string
  count?: number
}>()

// 使用时要写 props.title、props.count
console.log(props.title)
// 默认值需要 withDefaults
`)

// 新方式：直接解构保持响应式
const newWayCode = ref(`// 新方式：直接解构，保持响应式！（Vue 3.5+）
const { title, count = 0 } = defineProps<{
  title: string
  count?: number
}>()

// 直接使用，无需 props. 前缀
console.log(title)
// count 有默认值，且保持响应式
`)

const watchDestructuredCode = ref(`// 解构后的 props 在 watch 中也能正确追踪
const { firstName, lastName } = defineProps<{
  firstName: string
  lastName: string
}>()

watch(
  () => [firstName, lastName],
  ([first, last]) => {
    console.log(\`姓名变化: \${first} \${last}\`)
  }
)`)

// useId 示例
const inputId = useId()
const ariaId = useId()
const formId = useId()

const useIdCode = ref(`// useId() — 生成唯一 ID（Vue 3.5+）
const inputId = useId()
// 输出类似: "v-0", "v-1", "v-2" ...

// 用于表单 label + input 关联
// <label :for="inputId">用户名</label>
// <input :id="inputId" />

// 用于 ARIA 属性
// <div :aria-labelledby="ariaId">

// SSR 友好：服务端和客户端生成一致的 ID`)

const multiIdCode = ref(`// 多次调用，每次返回唯一 ID
const id1 = useId()  // "v-0"
const id2 = useId()  // "v-1"
const id3 = useId()  // "v-2"

// 可用于同一页面多个组件实例，不会冲突`)

// 交互演示
const demoName = ref('')
const demoEmail = ref('')

function submitForm() {
  addLog(`表单提交 — 姓名: "${demoName.value}", 邮箱: "${demoEmail.value}"`)
  addLog(`表单 ID: ${formId}, 姓名输入框 ID: ${inputId}, ARIA ID: ${ariaId}`)
}

function clearLog() {
  log.value = []
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 3：Props 响应式解构 & useId</h1>
      <p>Vue 3.5 引入的 Props 响应式解构和 useId() 唯一 ID 生成，让代码更简洁、可访问性更强。</p>
    </header>

    <!-- Props 响应式解构 -->
    <section class="card">
      <h2>Props 响应式解构 — 旧方式 vs 新方式</h2>
      <div class="comparison-grid">
        <div class="comparison-col">
          <h3 style="color: #cf1322;">旧方式（props.xxx）</h3>
          <pre class="code-block"><code>{{ oldWayCode }}</code></pre>
        </div>
        <div class="comparison-col">
          <h3 style="color: #52c41a;">新方式（直接解构）</h3>
          <pre class="code-block"><code>{{ newWayCode }}</code></pre>
        </div>
      </div>
    </section>

    <!-- 解构后响应式原理 -->
    <section class="card">
      <h2>解构后仍然响应式 — 原理</h2>
      <div class="info-grid">
        <div class="info-item">
          <strong>编译器魔法</strong>
          <span>Vue 编译器在编译时自动将解构转换为 props.xxx 访问</span>
        </div>
        <div class="info-item">
          <strong>默认值支持</strong>
          <span>解构时指定默认值：{ count = 0 }，自动等价于 withDefaults</span>
        </div>
        <div class="info-item">
          <strong>watch 追踪</strong>
          <span>在 watch、computed 中使用解构变量，响应式追踪正常工作</span>
        </div>
        <div class="info-item">
          <strong>重命名</strong>
          <span>支持解构重命名：{ title: heading }，仍保持响应式</span>
        </div>
      </div>
    </section>

    <!-- watch 中使用 -->
    <section class="card">
      <h2>在 watch 中使用解构 Props</h2>
      <pre class="code-block"><code>{{ watchDestructuredCode }}</code></pre>
    </section>

    <!-- useId -->
    <section class="card">
      <h2>useId() — 生成唯一 ID</h2>
      <pre class="code-block"><code>{{ useIdCode }}</code></pre>
      <pre class="code-block" style="margin-top: 12px;"><code>{{ multiIdCode }}</code></pre>
    </section>

    <!-- useId 交互演示 -->
    <section class="card">
      <h2>交互演示：useId 生成的 ID</h2>
      <p class="tip">以下表单使用了 useId() 生成的唯一 ID，确保 label 和 input 正确关联。</p>
      <div class="demo-area">
        <div class="form-demo">
          <div class="form-row">
            <label :for="inputId">姓名：</label>
            <input :id="inputId" v-model="demoName" class="demo-input" placeholder="请输入姓名" />
            <span class="id-tag">id="{{ inputId }}"</span>
          </div>
          <div class="form-row">
            <label :for="ariaId">邮箱：</label>
            <input :id="ariaId" v-model="demoEmail" class="demo-input" placeholder="请输入邮箱" />
            <span class="id-tag">id="{{ ariaId }}"</span>
          </div>
          <a-button type="primary" @click="submitForm" style="margin-top: 8px;">提交（查看 ID）</a-button>
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

.form-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-row label {
  font-size: 13px;
  color: #666;
  min-width: 60px;
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

.id-tag {
  font-size: 11px;
  color: #999;
  font-family: monospace;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
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
