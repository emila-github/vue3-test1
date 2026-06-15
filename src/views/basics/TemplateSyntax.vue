<script setup lang="ts">
import { ref, reactive } from 'vue'

// ====================================================================
// 1. 文本插值 (Mustache)
// ====================================================================
// 核心思想：用 &#123;&#123; &#125;&#125; 将数据渲染到 HTML 中，自动保持同步
//
// 类比：Mustache 就像"填空"✏️
//   HTML 是模板，&#123;&#123; &#125;&#125; 是空位
//   数据变化时，空位自动填入最新值

const message = ref('Hello Vue 3')
const number = ref(10)
const isActive = ref(true)

const mustacheCode = `// &#123;&#123; expression &#125;&#125; — 双花括号插值
&#123;&#123; message &#125;&#125;                          // 直接显示变量
&#123;&#123; number + 1 &#125;&#125;                      // 可以写 JS 表达式
&#123;&#123; isActive ? '激活' : '未激活' &#125;&#125;        // 三元表达式
&#123;&#123; message.split('').reverse().join('') &#125;&#125; // 方法调用

// 注意：&#123;&#123; &#125;&#125; 中只能写单条表达式，不能写语句
// &#123;&#123; if (ok) { return 'YES' } &#125;&#125;  ❌ 错误！这是语句不是表达式
// &#123;&#123; ok ? 'YES' : 'NO' &#125;&#125;          ✅ 用三元表达式代替`

// ====================================================================
// 2. 原始 HTML (v-html)
// ====================================================================
// 核心思想：&#123;&#123; &#125;&#125; 会转义 HTML，v-html 可以输出真正的 HTML
//
// ⚠️ 安全警告：v-html 可能导致 XSS 攻击，只用于可信任内容！

const rawHtml = ref('<strong style="color: #1890ff;">加粗文字</strong>')

const vHtmlCode = `// &#123;&#123; &#125;&#125; vs v-html
&#123;&#123; rawHtml &#125;&#125;                    // 输出：&lt;strong&gt;加粗文字&lt;/strong&gt;（转义了）
<span v-html="rawHtml"></span>  // 输出：<strong>加粗文字</strong>（真正的 HTML）

// ⚠️ 安全警告：
// 绝不要对用户输入使用 v-html，否则可能被注入恶意脚本！
// <div v-html="userInput"></div>  // ❌ 危险！`

// ====================================================================
// 3. 属性绑定 (v-bind)
// ====================================================================
// 核心思想：将 JS 数据绑定到 HTML 属性上
//
// 类比：v-bind 就像"管道连接"🔗
//   把 JS 变量接到 HTML 属性上
//   变量一变，属性自动更新

const dynamicId = ref('my-id')
const isDisabled = ref(true)
const attrsObj = reactive({
  id: 'container',
  class: 'wrapper',
  'data-title': 'hello',
})

const vBindCode = `// v-bind — 将 JS 数据绑定到 HTML 属性
// 完整写法：
<div v-bind:id="dynamicId">...</div>

// 简写（最常用）：
<div :id="dynamicId">...</div>

// 布尔属性：值为 true 时属性存在，false 时移除
<button :disabled="isDisabled">按钮</button>

// 多属性对象绑定：
<div v-bind="attrsObj">...</div>
// 等价于：<div id="container" class="wrapper" data-title="hello">...</div>

// 动态属性名（Vue 3.2+）：
<div :[attrName]="attrValue">...</div>`

// ====================================================================
// 4. JavaScript 表达式
// ====================================================================
const ok = ref(true)

const jsExprCode = `// &#123;&#123; &#125;&#125; 中可用的表达式类型：
&#123;&#123; number + 1 &#125;&#125;                         // ✅ 数学运算
&#123;&#123; ok ? 'YES' : 'NO' &#125;&#125;                  // ✅ 三元表达式
&#123;&#123; message.split('').reverse().join('') &#125;&#125;  // ✅ 方法调用
&#123;&#123; arr.join(', ') &#125;&#125;                      // ✅ 数组方法
&#123;&#123; obj.name &#125;&#125;                             // ✅ 属性访问

// 不能用的是语句：
// &#123;&#123; let x = 1 &#125;&#125;      ❌ 变量声明
// &#123;&#123; if (ok) { ... } &#125;&#125;  ❌ 条件语句
// &#123;&#123; for (...) { ... } &#125;&#125; ❌ 循环语句

// 如果需要复杂逻辑，用 computed 或 method`
</script>

<template>
  <div class="demo-page">
    <h1 class="page-title">📝 模板语法</h1>
    <p class="page-subtitle">Vue 模板语法 — 声明式地将数据渲染到 DOM</p>

    <!-- ==================== 前置说明 ==================== -->
    <section class="demo-section intro-section">
      <h2>📖 什么是模板语法？</h2>
      <div class="explain-box">
        <p>
          <strong>一句话解释：</strong>Vue 模板语法让你<em>在 HTML 中直接绑定 JS 数据</em>，数据变化时 DOM 自动更新。
        </p>

        <h3>传统方式 vs Vue 方式</h3>
        <pre class="code-block">
// 传统 JS：手动操作 DOM
document.getElementById('msg').textContent = message

// Vue 模板：声明式绑定
&lt;p&gt;&#123;&#123; message &#125;&#125;&lt;/p&gt;  ← 就这一行！数据变化自动更新</pre>

        <div class="key-points">
          <p>🔑 <strong>核心要点：</strong></p>
          <ul>
            <li><code>&#123;&#123; &#125;&#125;</code> 文本插值：将数据渲染为文本，自动转义 HTML</li>
            <li><code>v-html</code> 输出原始 HTML（⚠️ 注意 XSS 安全）</li>
            <li><code>v-bind</code>（简写 <code>:</code>）：将数据绑定到 HTML 属性</li>
            <li>模板中只能写<strong>单条 JS 表达式</strong>，不能写语句</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 1. 文本插值 -->
    <section class="demo-section">
      <h2>1. 文本插值 — &#123;&#123; &#125;&#125; Mustache</h2>
      <p class="section-desc">
        双花括号将数据渲染为纯文本，数据变化时自动更新。支持任意 JS 表达式。
      </p>
      <pre class="code-block">{{ mustacheCode }}</pre>
      <div class="result-box">
        <p><span class="label">message</span> = <code>"{{ message }}"</code></p>
        <p><span class="label">number + 1</span> = <code>{{ number + 1 }}</code></p>
        <p><span class="label">三元表达式</span> = <code>{{ isActive ? '激活' : '未激活' }}</code></p>
        <p><span class="label">方法调用</span> = <code>{{ message.split('').reverse().join('') }}</code></p>
      </div>
    </section>

    <!-- 2. 原始 HTML -->
    <section class="demo-section">
      <h2>2. 原始 HTML — v-html</h2>
      <p class="section-desc">
        <code>&#123;&#123; &#125;&#125;</code> 会将 HTML 转义为安全文本，<code>v-html</code> 则输出真正的 HTML。
      </p>
      <pre class="code-block">{{ vHtmlCode }}</pre>
      <div class="result-box">
        <p><span class="label">文本插值</span> → <code>{{ rawHtml }}</code></p>
        <p><span class="label">v-html 输出</span> → <span v-html="rawHtml"></span></p>
      </div>
      <p class="hint">
        ⚠️ <code>v-html</code> 仅在内容可信时使用，用户输入绝不应用 v-html！
      </p>
    </section>

    <!-- 3. 属性绑定 -->
    <section class="demo-section">
      <h2>3. 属性绑定 — v-bind / :attr</h2>
      <p class="section-desc">
        将 JS 数据绑定到 HTML 属性。最常用简写 <code>:attr</code>。
      </p>
      <pre class="code-block">{{ vBindCode }}</pre>
      <div class="result-box">
        <p><span class="label">:id="dynamicId"</span> → <code class="demo-attr">[id="{{ dynamicId }}"]</code></p>
        <p>
          <span class="label">:disabled="isDisabled"</span> →
          <button :disabled="isDisabled" class="demo-btn">{{ isDisabled ? '禁用中' : '可用' }}</button>
          <button @click="isDisabled = !isDisabled" class="demo-btn" style="margin-left:8px">切换</button>
        </p>
        <p>
          <span class="label">v-bind="attrsObj"</span> →
          <span v-bind="attrsObj" class="attr-demo">多属性绑定效果</span>
        </p>
      </div>
    </section>

    <!-- 4. JS 表达式 -->
    <section class="demo-section">
      <h2>4. JavaScript 表达式</h2>
      <p class="section-desc">
        模板中只能写<strong>单条表达式</strong>，不能写语句（if/for/let 等）。
      </p>
      <pre class="code-block">{{ jsExprCode }}</pre>
      <div class="result-box">
        <p><span class="label">✅ number + 1</span> = <code>{{ number + 1 }}</code></p>
        <p><span class="label">✅ ok ? 'YES' : 'NO'</span> = <code>{{ ok ? 'YES' : 'NO' }}</code></p>
        <p><span class="label">✅ 反转字符串</span> = <code>{{ message.split('').reverse().join('') }}</code></p>
        <p class="hint">❌ if 语句、for 循环、变量声明都不能在模板中直接使用</p>
      </div>
    </section>

    <!-- ==================== 速查表 ==================== -->
    <section class="demo-section summary-section">
      <h2>📋 模板语法速查表</h2>
      <table class="summary-table">
        <thead>
          <tr>
            <th>语法</th>
            <th>作用</th>
            <th>示例</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>&#123;&#123; expr &#125;&#125;</code></td>
            <td>文本插值</td>
            <td><code>&#123;&#123; message &#125;&#125;</code></td>
          </tr>
          <tr>
            <td><code>v-html</code></td>
            <td>输出原始 HTML</td>
            <td><code>&lt;div v-html="raw"&gt;&lt;/div&gt;</code></td>
          </tr>
          <tr>
            <td><code>v-bind:attr</code></td>
            <td>属性绑定</td>
            <td><code>&lt;div :id="myId"&gt;</code></td>
          </tr>
          <tr>
            <td><code>:attr</code></td>
            <td>v-bind 简写</td>
            <td><code>&lt;img :src="url"&gt;</code></td>
          </tr>
          <tr>
            <td><code>v-bind="obj"</code></td>
            <td>批量绑定属性</td>
            <td><code>&lt;div v-bind="attrs"&gt;</code></td>
          </tr>
          <tr>
            <td><code>:[attrName]</code></td>
            <td>动态属性名</td>
            <td><code>&lt;div :[key]="val"&gt;</code></td>
          </tr>
          <tr>
            <td><code>v-once</code></td>
            <td>只渲染一次</td>
            <td><code>&lt;span v-once&gt;&#123;&#123; msg &#125;&#125;&lt;/span&gt;</code></td>
          </tr>
          <tr>
            <td><code>v-pre</code></td>
            <td>跳过编译</td>
            <td><code>&lt;pre v-pre&gt;&#123;&#123; 不编译 &#125;&#125;&lt;/pre&gt;</code></td>
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
  border-left: 4px solid #1890ff;
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

.explain-box h3 {
  font-size: 15px;
  margin: 16px 0 8px;
  color: #333;
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

/* ===== 结果展示 ===== */
.result-box {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px 16px;
}

.result-box p {
  margin: 8px 0;
  font-size: 14px;
  color: #333;
}

.label {
  font-weight: 500;
  color: #555;
  min-width: 120px;
  display: inline-block;
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

.demo-attr {
  background: #fff3e0;
  padding: 2px 6px;
  border-radius: 3px;
  color: #d46b08;
}

.attr-demo {
  display: inline-block;
  padding: 8px 14px;
  border: 2px dashed #1890ff;
  border-radius: 4px;
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

.demo-btn:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}

.demo-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== 速查表 ===== */
.summary-section {
  border-left-color: #52c41a;
  background: #f6ffed;
}

.summary-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  font-size: 14px;
}

.summary-table th {
  background: #e8f5e9;
  padding: 10px 14px;
  text-align: left;
  font-weight: 600;
  color: #2e7d32;
  border-bottom: 2px solid #c8e6c9;
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
