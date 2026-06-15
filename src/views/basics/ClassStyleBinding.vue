<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// ====================================================================
// 1. class 对象语法
// ====================================================================
// 核心思想：根据数据真假动态切换 CSS class
//
// 类比：:class 就像"开关面板"🎛️
//   { active: true }  → 加上 active 类
//   { active: false } → 移除 active 类
//   每个属性是一个开关，值决定开关状态

const isActive = ref(true)
const hasError = ref(false)
const classObject = reactive({
  active: true,
  'text-danger': false,
  'text-large': true,
})
const computedClassObj = computed(() => ({
  active: isActive.value,
  'text-danger': hasError.value,
}))

const classObjectCode = `// :class 对象语法 — 根据布尔值切换 class

// 单个 class
<div :class="{ active: isActive }">...</div>
// isActive=true  → class="active"
// isActive=false → class=""

// 多个 class
<div :class="{ active: isActive, 'text-danger': hasError }">...</div>

// 绑定对象变量
<div :class="classObject">...</div>
// classObject = { active: true, 'text-large': true }

// computed 对象（推荐：逻辑复杂时用）
const computedClass = computed(() => ({
  active: isActive.value,
  'text-danger': hasError.value,
}))

// 与静态 class 共存
<div class="static" :class="{ active: isActive }">...</div>`

// ====================================================================
// 2. class 数组语法
// ====================================================================
const activeClass = ref('highlight')
const errorClass = ref('error-text')

const classArrayCode = `// :class 数组语法 — 应用多个 class

// 基本数组
<div :class="[activeClass, errorClass]">...</div>
// activeClass='highlight', errorClass='error-text'
// → class="highlight error-text"

// 条件数组（三元表达式）
<div :class="[isActive ? activeClass : '', errorClass]">...</div>

// 混合语法（数组中放对象）
<div :class="[{ active: isActive }, errorClass]">...</div>`

// ====================================================================
// 3. style 对象语法
// ====================================================================
const activeColor = ref('#1890ff')
const fontSize = ref(16)
const styleObject = reactive({
  color: '#ff4d4f',
  fontSize: '18px',
  fontWeight: 'bold',
})

const styleObjectCode = `// :style 对象语法 — 动态内联样式

// 直接绑定（camelCase 属性名）
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }">...</div>

// 绑定对象变量
<div :style="styleObject">...</div>
// styleObject = { color: '#ff4d4f', fontSize: '18px' }`

// ====================================================================
// 4. style 数组语法
// ====================================================================
const baseStyle = reactive({
  color: '#333',
  fontSize: '14px',
})
const overrideStyle = reactive({
  fontWeight: 'bold',
  fontSize: '20px',
})

const styleArrayCode = `// :style 数组语法 — 合并多个样式对象
<div :style="[baseStyle, overrideStyle]">...</div>
// 后面的对象会覆盖前面相同的属性
// baseStyle: { fontSize: '14px' }
// overrideStyle: { fontSize: '20px' }
// → 最终 fontSize: '20px'（后面的覆盖前面的）`
</script>

<template>
  <div class="demo-page">
    <h1 class="page-title">🎨 类与样式绑定</h1>
    <p class="page-subtitle">:class / :style — 动态控制元素的 CSS 类和内联样式</p>

    <!-- ==================== 前置说明 ==================== -->
    <section class="demo-section intro-section">
      <h2>📖 为什么要动态绑定 class 和 style？</h2>
      <div class="explain-box">
        <p>
          <strong>一句话解释：</strong>根据数据状态<em>自动切换 CSS 类名和内联样式</em>，实现动态视觉效果。
        </p>

        <div class="key-points">
          <p>🔑 <strong>核心要点：</strong></p>
          <ul>
            <li><code>:class</code> 支持<strong>对象语法</strong>（根据布尔值切换）和<strong>数组语法</strong>（应用多个类）</li>
            <li><code>:style</code> 支持<strong>对象语法</strong>（camelCase 属性名）和<strong>数组语法</strong>（合并多个样式）</li>
            <li>可以<strong>与静态 class 共存</strong>：<code>class="static" :class="dynamic"</code></li>
            <li>推荐用 <code>computed</code> 处理复杂的 class 逻辑</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 1. class 对象语法 -->
    <section class="demo-section">
      <h2>1. :class 对象语法 — 布尔开关</h2>
      <p class="section-desc">
        每个属性是一个开关，<code>true</code> 则应用该类，<code>false</code> 则移除。
      </p>
      <pre class="code-block">{{ classObjectCode }}</pre>
      <div class="demo-boxes">
        <div :class="{ active: isActive }" class="demo-box">单个 class 切换</div>
        <div :class="{ active: isActive, 'text-danger': hasError }" class="demo-box">多个 class</div>
        <div :class="classObject" class="demo-box">对象变量绑定</div>
        <div class="static demo-box" :class="{ active: isActive }">与静态 class 共存</div>
        <div :class="computedClassObj" class="demo-box">computed 对象</div>
      </div>
      <div class="controls">
        <button @click="isActive = !isActive" class="demo-btn">
          isActive = {{ isActive }}
        </button>
        <button @click="hasError = !hasError" class="demo-btn">
          hasError = {{ hasError }}
        </button>
      </div>
    </section>

    <!-- 2. class 数组语法 -->
    <section class="demo-section">
      <h2>2. :class 数组语法 — 多个类名</h2>
      <p class="section-desc">
        数组元素可以是字符串、对象或三元表达式。
      </p>
      <pre class="code-block">{{ classArrayCode }}</pre>
      <div class="demo-boxes">
        <div :class="[activeClass, errorClass]" class="demo-box">基本数组</div>
        <div :class="[isActive ? activeClass : '', errorClass]" class="demo-box">条件数组</div>
        <div :class="[{ active: isActive }, errorClass]" class="demo-box">混合语法</div>
      </div>
    </section>

    <!-- 3. style 对象语法 -->
    <section class="demo-section">
      <h2>3. :style 对象语法 — 动态内联样式</h2>
      <p class="section-desc">
        属性名用 camelCase（如 <code>fontSize</code>），值可以是响应式变量。
      </p>
      <pre class="code-block">{{ styleObjectCode }}</pre>
      <div class="demo-boxes">
        <div :style="{ color: activeColor, fontSize: fontSize + 'px' }" class="demo-box">
          直接绑定 — 颜色: {{ activeColor }}, 字号: {{ fontSize }}px
        </div>
        <div :style="styleObject" class="demo-box">对象变量绑定</div>
      </div>
      <div class="controls">
        <button @click="fontSize += 2" class="demo-btn">字号 +2 ({{ fontSize }}px)</button>
        <button @click="activeColor = activeColor === '#1890ff' ? '#ff4d4f' : '#1890ff'" class="demo-btn">
          切换颜色
        </button>
      </div>
    </section>

    <!-- 4. style 数组语法 -->
    <section class="demo-section">
      <h2>4. :style 数组语法 — 合并多个样式</h2>
      <p class="section-desc">
        后面的样式对象会<strong>覆盖</strong>前面相同的属性。
      </p>
      <pre class="code-block">{{ styleArrayCode }}</pre>
      <div :style="[baseStyle, overrideStyle]" class="demo-box">
        多个样式对象合并 — 后面的 fontSize:20px 覆盖前面的 14px
      </div>
      <p class="hint">
        💡 <code>baseStyle</code> 的 <code>fontSize: 14px</code> 被 <code>overrideStyle</code> 的 <code>fontSize: 20px</code> 覆盖了。
      </p>
    </section>

    <!-- ==================== 速查表 ==================== -->
    <section class="demo-section summary-section">
      <h2>📋 :class / :style 速查表</h2>
      <table class="summary-table">
        <thead>
          <tr>
            <th>语法</th>
            <th>用途</th>
            <th>示例</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>:class="{ active: isActive }"</code></td>
            <td>对象语法 — 布尔切换</td>
            <td>根据条件加/去 class</td>
          </tr>
          <tr>
            <td><code>:class="classObj"</code></td>
            <td>绑定对象变量</td>
            <td>多个 class 统一管理</td>
          </tr>
          <tr>
            <td><code>:class="computedObj"</code></td>
            <td>computed 对象</td>
            <td>复杂 class 逻辑</td>
          </tr>
          <tr>
            <td><code>:class="[a, b]"</code></td>
            <td>数组语法</td>
            <td>应用多个 class</td>
          </tr>
          <tr>
            <td><code>:class="[isA ? a : '', b]"</code></td>
            <td>条件数组</td>
            <td>三元表达式动态选 class</td>
          </tr>
          <tr>
            <td><code>:style="{ color: c }"</code></td>
            <td>style 对象</td>
            <td>动态内联样式</td>
          </tr>
          <tr>
            <td><code>:style="styleObj"</code></td>
            <td>绑定样式对象</td>
            <td>多个样式统一管理</td>
          </tr>
          <tr>
            <td><code>:style="[a, b]"</code></td>
            <td>style 数组</td>
            <td>合并多个样式（后者覆盖前者）</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
/* ===== 页面头部 ===== */
.demo-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.page-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 28px;
}

.page-subtitle {
  text-align: center;
  color: #888;
  font-size: 14px;
  margin-bottom: 30px;
}

/* ===== 通用 Section ===== */
.demo-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  border-left: 4px solid #722ed1;
}

.demo-section h2 {
  margin-top: 0;
  color: #1a1a1a;
  font-size: 18px;
}

.section-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.7;
  margin: 8px 0 14px;
}

.section-desc code {
  background: #e8e8e8;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 13px;
  color: #cf1322;
}

/* ===== 介绍区域 ===== */
.intro-section {
  border-left-color: #fa8c16;
  background: #fffbe6;
}

.explain-box {
  line-height: 1.8;
}

.explain-box p {
  margin: 6px 0;
  color: #444;
}

.key-points {
  background: #fff;
  border: 1px solid #ffd591;
  border-radius: 6px;
  padding: 12px 16px;
  margin-top: 12px;
}

.key-points p {
  margin: 0 0 6px;
  color: #d46b08;
}

.key-points ul {
  margin: 0;
  padding-left: 20px;
}

.key-points li {
  margin: 4px 0;
  font-size: 14px;
  color: #555;
}

.key-points code {
  background: #fff3e0;
  padding: 1px 5px;
  border-radius: 3px;
  color: #d46b08;
}

/* ===== 代码块 ===== */
.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 14px 16px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
  margin: 0 0 12px;
  white-space: pre;
}

/* ===== 演示盒子 ===== */
.demo-boxes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-box {
  margin: 4px 0;
  padding: 10px 14px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #e8e8e8;
  font-size: 14px;
}

.controls {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.demo-btn {
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  transition: all 0.2s;
}

.demo-btn:hover {
  border-color: #722ed1;
  color: #722ed1;
  background: #f9f0ff;
}

.hint {
  color: #999;
  font-size: 13px;
  margin-top: 10px;
}

.hint code {
  background: #f0f0f0;
  padding: 1px 5px;
  border-radius: 3px;
  color: #666;
}

/* 动态 class 样式 */
.active {
  background: #e6f7ff !important;
  border-color: #1890ff !important;
  color: #1890ff;
  font-weight: bold;
}

.text-danger {
  color: #ff4d4f !important;
  border-color: #ff4d4f !important;
}

.text-large {
  font-size: 18px;
}

.highlight {
  background: #fff7e6 !important;
  border-color: #fa8c16 !important;
  color: #fa8c16;
}

.error-text {
  text-decoration: line-through;
}

.static {
  font-style: italic;
}

/* ===== 速查表 ===== */
.summary-section {
  border-left-color: #1890ff;
  background: #e6f7ff;
}

.summary-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  font-size: 14px;
}

.summary-table th {
  background: #dbeafe;
  padding: 10px 14px;
  text-align: left;
  font-weight: 600;
  color: #1e40af;
  border-bottom: 2px solid #93c5fd;
}

.summary-table td {
  padding: 10px 14px;
  border-bottom: 1px solid #e8e8e8;
  color: #444;
}

.summary-table code {
  background: #e8e8e8;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
  color: #cf1322;
  white-space: nowrap;
}

.summary-table tbody tr:hover {
  background: #f5f5f5;
}
</style>
