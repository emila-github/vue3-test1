<script setup lang="ts">
import { ref } from 'vue'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// v-bind 同名简写演示
const id = ref('my-input')
const disabled = ref(false)
const placeholder = ref('请输入内容')
const value = ref('')

// defineOptions 演示
// defineOptions({ name: 'MyComponent', inheritAttrs: false })

const shorthandCode = `// 3.4 之前 — 需要重复写属性名
<input :id="id" :disabled="disabled" :placeholder="placeholder">

// 3.4+ — 同名可省略值，简洁明了
<input :id :disabled :placeholder>

// 适用于所有 v-bind 场景
// :src, :key, :class, :style, 自定义 props 等
<avatar :src :alt :size />`

const defineOptionsCode = `// 3.3+ defineOptions — 在 <script setup> 中声明组件选项
<script setup lang="ts">
defineOptions({
  name: 'CustomInput',      // 组件名称（DevTools 中显示）
  inheritAttrs: false,       // 是否继承透传属性
  customOptions: { ... },    // 自定义选项
})
</` + `script>

// 等价于 Options API 中：
// export default {
//   name: 'CustomInput',
//   inheritAttrs: false,
// }`

const shorthandDemo = ref([
  { original: ':id="id"', shorthand: ':id', note: 'id 属性' },
  { original: ':src="src"', shorthand: ':src', note: '图片 src' },
  { original: ':key="key"', shorthand: ':key', note: 'v-for key' },
  { original: ':disabled="disabled"', shorthand: ':disabled', note: '禁用状态' },
  { original: ':required="required"', shorthand: ':required', note: '必填控制' },
])

function toggleDisabled() {
  disabled.value = !disabled.value
  addLog(`disabled 切换为: ${disabled.value}`)
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 4：v-bind 同名简写 & defineOptions</h1>
      <p>Vue 3.4+ 引入的 v-bind 同名简写提高代码简洁性，defineOptions 宏让 <code>&lt;script setup&gt;</code> 更完整。</p>
    </header>

    <!-- v-bind 同名简写 -->
    <section class="card">
      <h2>v-bind 同名简写（3.4+）</h2>
      <p class="intro-text">当属性名和变量名相同时，可以省略属性值，只需写 <code>:id</code> 代替 <code>:id="id"</code>。</p>
      <pre class="code-block"><code>{{ shorthandCode }}</code></pre>

      <h3>简写对照表</h3>
      <a-table
        :columns="[
          { title: '旧写法', dataIndex: 'original', key: 'original' },
          { title: '新简写', dataIndex: 'shorthand', key: 'shorthand' },
          { title: '说明', dataIndex: 'note', key: 'note' },
        ]"
        :data-source="shorthandDemo"
        :pagination="false"
        size="small"
      />

      <h3>交互演示</h3>
      <div class="demo-area">
        <p>使用同名简写绑定：</p>
        <input :id :placeholder v-model="value" :disabled class="demo-input" />
        <p style="margin-top: 8px; font-size: 13px; color: #666;">
          模板代码：<code>&lt;input :id :placeholder v-model="value" :disabled /&gt;</code>
        </p>
        <p style="margin-top: 4px; font-size: 13px; color: #52c41a;">
          变量值：id="{{ id }}", placeholder="{{ placeholder }}", disabled="{{ disabled }}"
        </p>
        <button class="btn" @click="toggleDisabled">切换 disabled</button>
      </div>
    </section>

    <!-- defineOptions -->
    <section class="card">
      <h2>defineOptions()（3.3+）</h2>
      <p class="intro-text">
        在 <code>&lt;script setup&gt;</code> 中声明组件选项（如 name、inheritAttrs），无需额外 <code>&lt;script&gt;</code> 块。
      </p>
      <pre class="code-block"><code>{{ defineOptionsCode }}</code></pre>

      <h3>defineOptions 常见用途</h3>
      <div class="info-grid">
        <div class="info-item">
          <strong><code>name</code></strong>
          <span>在 Vue DevTools 中显示的组件名称，用于调试和递归组件</span>
        </div>
        <div class="info-item">
          <strong><code>inheritAttrs</code></strong>
          <span>控制是否自动将父组件的透传属性应用到根元素</span>
        </div>
        <div class="info-item">
          <strong><code>customOptions</code></strong>
          <span>传递给自定义选项（如路由、i18n 配置等）</span>
        </div>
      </div>
    </section>

    <!-- 操作日志 -->
    <section class="card" v-if="log.length">
      <h2>操作日志</h2>
      <div class="log-panel">
        <div v-for="(l, i) in log" :key="i">{{ l }}</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page { max-width: 960px; margin: 0 auto; padding: 24px; }
.page-header { text-align: center; margin-bottom: 32px; }
.page-header h1 { font-size: 28px; color: #1a1a1a; margin: 0 0 8px; }
.page-header p { color: #666; font-size: 14px; line-height: 1.6; }
.page-header code { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; font-size: 13px; }
.card { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.card h2 { margin: 0 0 16px; font-size: 18px; color: #333; }
.card h3 { margin: 20px 0 10px; font-size: 15px; color: #555; }
.intro-text { color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 12px; }
.intro-text code { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; font-size: 13px; }
.code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.6; margin: 12px 0; }
.demo-area { padding: 16px; background: #fafafa; border-radius: 8px; margin: 12px 0; }
.demo-input { padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 14px; width: 250px; }
.btn { padding: 8px 16px; background: #3178c6; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; margin-top: 8px; }
.btn:hover { background: #265ea8; }
.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.info-item { padding: 12px; background: #fafafa; border-radius: 6px; border: 1px solid #f0f0f0; }
.info-item strong { display: block; margin-bottom: 6px; font-size: 14px; color: #333; }
.info-item code { background: #e8e8e8; padding: 2px 6px; border-radius: 3px; font-size: 13px; }
.info-item span { font-size: 12px; color: #999; }
.log-panel { background: #fafafa; border: 1px solid #f0f0f0; border-radius: 8px; padding: 12px; max-height: 200px; overflow-y: auto; font-family: monospace; font-size: 12px; color: #666; }
@media (max-width: 768px) { .info-grid { grid-template-columns: 1fr; } }
</style>
