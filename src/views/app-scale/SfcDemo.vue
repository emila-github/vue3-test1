<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'

const count = ref(0)
const name = ref('Vue 3')
const showDemo = ref(true)

function increment() {
  count.value++
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>单文件组件 (SFC)</h1>
      <p>Vue 单文件组件（<code>*.vue</code>）将模板、逻辑和样式封装在一个文件中。</p>
    </header>

    <!-- SFC 结构 -->
    <section class="card">
      <h2>SFC 基本结构</h2>
      <p>
        一个 <code>.vue</code> 文件包含三部分：<code>&lt;script setup&gt;</code>（逻辑）、
        <code>&lt;template&gt;</code>（模板）、<code>&lt;style scoped&gt;</code>（样式）。
      </p>
      <pre class="code-block">&lt;script setup lang="ts"&gt;
import { ref } from 'vue'

const count = ref(0)
function increment() { count.value++ }
&lt;/script&gt;

&lt;template&gt;
  &lt;button @click="increment"&gt;
    Count: {{ '{{ count }}' }}
  &lt;/button&gt;
&lt;/template&gt;

&lt;style scoped&gt;
button { font-weight: bold; }
&lt;/style&gt;</pre>
    </section>

    <!-- 演示 -->
    <section class="card">
      <h2>当前文件运行效果</h2>
      <div class="demo-box">
        <a-space align="center" :size="16">
          <a-button type="primary" @click="increment">
            Count: {{ count }}
          </a-button>
          <a-input v-model:value="name" placeholder="输入名称" style="width: 200px" />
          <span style="font-size: 14px">Hello, {{ name }}!</span>
        </a-space>
      </div>
    </section>

    <!-- <script setup> 优势 -->
    <section class="card">
      <h2>&lt;script setup&gt; 的优势</h2>
      <a-table
        :columns="[
          { title: '特性', dataIndex: 'feature', key: 'feature', width: 160 },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
          { title: '对比 Options API', dataIndex: 'compare', key: 'compare' },
        ]"
        :data-source="[
          { feature: '顶级变量自动暴露', desc: '模板中可直接使用脚本顶级变量和函数', compare: '需在 return 或 methods 中声明' },
          { feature: '编译时优化', desc: '更小的运行时开销，静态分析更准确', compare: '运行时解析 this 访问' },
          { feature: 'TypeScript 原生', desc: '直接使用 TS 类型，无需额外配置', compare: '需 defineComponent 包装' },
          { feature: '更少的样板代码', desc: '无需 data()、methods、computed 等选项', compare: '需在对应选项中声明' },
          { feature: 'Composables 复用', desc: '直接 import 组合式函数', compare: '需 mixins 或 provide/inject' },
          { feature: '更好的 IDE 支持', desc: '类型推导、自动导入、智能提示', compare: 'this 推导有时不准确' },
        ]"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- CSS 特性 -->
    <section class="card">
      <h2>样式特性</h2>
      <div class="style-grid">
        <div class="style-card">
          <h4>scoped</h4>
          <p>样式只作用于当前组件，通过 data-v-xxx 属性隔离</p>
          <pre class="code-block" style="font-size: 12px">&lt;style scoped&gt;
.title { color: red; }
&lt;/style&gt;</pre>
        </div>
        <div class="style-card">
          <h4>:deep()</h4>
          <p>穿透 scoped 限制，影响子组件内部元素</p>
          <pre class="code-block" style="font-size: 12px">&lt;style scoped&gt;
.container :deep(.child) {
  color: blue;
}
&lt;/style&gt;</pre>
        </div>
        <div class="style-card">
          <h4>CSS Modules</h4>
          <p>编译为唯一类名，JS 中通过 $style 访问</p>
          <pre class="code-block" style="font-size: 12px">&lt;style module&gt;
.red { color: red; }
&lt;/style&gt;

&lt;!-- 模板中 --&gt;
&lt;div :class="$style.red"&gt;</pre>
        </div>
        <div class="style-card">
          <h4>v-bind() in CSS</h4>
          <p>将 JS 变量注入 CSS（Vue 3.2+）</p>
          <pre class="code-block" style="font-size: 12px">&lt;script setup&gt;
const color = ref('red')
&lt;/script&gt;

&lt;style scoped&gt;
.title { color: v-bind(color); }
&lt;/style&gt;</pre>
        </div>
      </div>
    </section>

    <!-- SFC 编译流程 -->
    <section class="card">
      <h2>SFC 编译流程</h2>
      <div class="compile-flow">
        <div class="flow-step">
          <span class="flow-icon">📄</span>
          <strong>*.vue</strong>
          <span>SFC 源文件</span>
        </div>
        <span class="flow-arrow">→</span>
        <div class="flow-step">
          <span class="flow-icon">⚙</span>
          <strong>@vitejs/plugin-vue</strong>
          <span>Vite 插件解析</span>
        </div>
        <span class="flow-arrow">→</span>
        <div class="flow-step">
          <span class="flow-icon">🔧</span>
          <strong>vue/compiler-sfc</strong>
          <span>拆分为 template/script/style</span>
        </div>
        <span class="flow-arrow">→</span>
        <div class="flow-step">
          <span class="flow-icon">📦</span>
          <strong>ES Module</strong>
          <span>浏览器可执行代码</span>
        </div>
      </div>
      <div class="tip-box" style="margin-top: 16px">
        <strong>关键点：</strong>
        <ul>
          <li><code>&lt;script setup&gt;</code> 在编译时处理，无运行时开销</li>
          <li>模板编译为 render 函数（或 Vapor Mode 直接编译）</li>
          <li><code>scoped</code> 样式通过 PostCSS 转换，添加唯一属性选择器</li>
          <li>可使用多个 <code>&lt;style&gt;</code> 块（如 scoped + global 共存）</li>
        </ul>
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
  padding: 20px;
  margin: 12px 0;
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

.style-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.style-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
}

.style-card h4 {
  margin: 0 0 8px;
  font-size: 15px;
  color: #333;
}

.style-card p {
  font-size: 12px;
  color: #888;
  margin: 0 0 8px;
}

.compile-flow {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  text-align: center;
  min-width: 100px;
}

.flow-step strong {
  font-size: 13px;
  color: #333;
}

.flow-step span:last-child {
  font-size: 11px;
  color: #999;
}

.flow-icon {
  font-size: 20px;
}

.flow-arrow {
  font-size: 20px;
  color: #ccc;
  margin-top: 12px;
}

@media (max-width: 640px) {
  .style-grid {
    grid-template-columns: 1fr;
  }
  .compile-flow {
    flex-direction: column;
    align-items: center;
  }
  .flow-arrow {
    transform: rotate(90deg);
  }
}
</style>
