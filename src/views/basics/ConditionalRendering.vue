<script setup lang="ts">
import { ref } from 'vue'

// ====================================================================
// 1. v-if / v-else-if / v-else
// ====================================================================
// 核心思想：根据条件决定是否渲染元素（真正创建/销毁 DOM）
//
// 类比：v-if 就像"灯的开关"💡
//   v-if="true"  → 灯亮（元素存在）
//   v-if="false" → 灯灭（元素完全不存在于 DOM 中）
//   切换时会真正创建或销毁 DOM 元素

const type = ref('A')
const types = ['A', 'B', 'C', 'D']

function changeType() {
  const index = types.indexOf(type.value)
  type.value = types[(index + 1) % types.length]!
}

const vIfCode = `// v-if 系列：真正的条件渲染（创建/销毁 DOM）
<div v-if="type === 'A'">类型 A</div>        // type 是 'A' 时渲染
<div v-else-if="type === 'B'">类型 B</div>   // type 是 'B' 时渲染
<div v-else-if="type === 'C'">类型 C</div>   // type 是 'C' 时渲染
<div v-else>其他类型</div>                    // 以上都不满足时渲染

// 注意：v-if / v-else-if / v-else 必须紧挨着使用
// 中间不能插入其他元素，否则链会断开`

// ====================================================================
// 2. v-show
// ====================================================================
// 核心思想：元素始终存在，只是通过 CSS display 切换显示/隐藏
//
// 类比：v-show 就像"舞台幕布"🎭
//   演员始终在舞台上（DOM 始终存在）
//   只是幕布拉上或拉开（display: none / display: 原值）
//   切换开销很小，适合频繁切换的场景

const isVisible = ref(true)

const vShowCode = `// v-show：通过 CSS display 切换（元素始终存在）
<div v-show="isVisible">这个元素通过 v-show 控制</div>

// isVisible = true  → style="display: 原值"（显示）
// isVisible = false → style="display: none"（隐藏）
// 元素始终在 DOM 中，只是视觉上不可见`

// ====================================================================
// 3. v-if vs v-show 对比
// ====================================================================
const vIfVsShowCode = `// ===== v-if vs v-show =====

// v-if：真正的条件渲染
//   • false 时元素不存在于 DOM（不渲染）
//   • 切换开销大（销毁 + 重建）
//   • 初始开销小（false 时不渲染）
//   • 适合条件很少变化的场景

// v-show：CSS 切换显示
//   • 元素始终在 DOM 中
//   • 切换开销小（只改 CSS）
//   • 初始开销大（始终渲染）
//   • 适合频繁切换显示/隐藏的场景

// 💡 经验法则：频繁切换用 v-show，其他情况用 v-if`

// ====================================================================
// 4. template 上使用 v-if
// ====================================================================
// 核心思想：template 是"幽灵标签"，不渲染到 DOM，只用来包裹多个元素
//
// 类比：template 就像"透明胶带"📎
//   它把多个元素捆在一起
//   但自己不会出现在最终结果中

const isLoggedIn = ref(false)
const userName = ref('张三')

function login() {
  isLoggedIn.value = true
}
function logout() {
  isLoggedIn.value = false
}

const templateVifCode = `// template 上使用 v-if：不渲染包裹元素
<template v-if="isLoggedIn">
  <h3>欢迎回来，&#123;&#123; userName &#125;&#125;</h3>
  <button @click="logout">退出</button>
</template>
<template v-else>
  <p>请先登录</p>
  <button @click="login">登录</button>
</template>

// template 的好处：
//   • 自身不渲染到 DOM（最终只有里面的 h3 和 button）
//   • 可以包裹多个元素而不用加多余的 div
//   • template 只能用 v-if，不能用 v-show`
</script>

<template>
  <div class="demo-page">
    <h1 class="page-title">🔀 条件渲染</h1>
    <p class="page-subtitle">v-if / v-show — 根据条件控制元素的显示与隐藏</p>

    <!-- ==================== 前置说明 ==================== -->
    <section class="demo-section intro-section">
      <h2>📖 什么是条件渲染？</h2>
      <div class="explain-box">
        <p>
          <strong>一句话解释：</strong>根据数据条件<em>动态决定元素是否显示</em>。Vue
          提供两种方式：<code>v-if</code>（销毁/重建 DOM）和 <code>v-show</code>（CSS 切换）。
        </p>

        <div class="key-points">
          <p>🔑 <strong>核心要点：</strong></p>
          <ul>
            <li><code>v-if</code>：真正创建/销毁元素，切换开销大，初始开销小</li>
            <li><code>v-show</code>：始终渲染，通过 CSS <code>display</code> 切换，初始开销大</li>
            <li><code>v-if</code> 可以配合 <code>v-else-if</code> / <code>v-else</code> 形成条件链</li>
            <li><code>template</code> 上只能用 <code>v-if</code>，不能用 <code>v-show</code></li>
            <li><strong>频繁切换用 v-show，其他用 v-if</strong></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 1. v-if / v-else-if / v-else -->
    <section class="demo-section">
      <h2>1. v-if / v-else-if / v-else — 条件链</h2>
      <p class="section-desc">像 JavaScript 的 <code>if/else</code> 一样形成条件链，只渲染第一个满足条件的元素。</p>
      <pre class="code-block">{{ vIfCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p>
            <span class="label">当前类型</span> = <code>{{ type }}</code>
          </p>
          <div v-if="type === 'A'" class="type-box type-a">✅ 类型 A 的内容</div>
          <div v-else-if="type === 'B'" class="type-box type-b">✅ 类型 B 的内容</div>
          <div v-else-if="type === 'C'" class="type-box type-c">✅ 类型 C 的内容</div>
          <div v-else class="type-box type-other">✅ 其他类型的内容</div>
        </div>
        <div class="action-box">
          <button @click="changeType" class="demo-btn">切换类型</button>
        </div>
      </div>
      <p class="hint">💡 打开开发者工具观察：切换时只有当前匹配的元素存在于 DOM 中，其他的被完全移除。</p>
    </section>

    <!-- 2. v-show -->
    <section class="demo-section">
      <h2>2. v-show — CSS 切换显示</h2>
      <p class="section-desc">元素始终在 DOM 中，只是通过 <code>display: none</code> 隐藏。</p>
      <pre class="code-block">{{ vShowCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <div v-show="isVisible" class="type-box type-a">这个元素通过 v-show 控制</div>
          <p>
            <span class="label">isVisible</span> = <code>{{ isVisible }}</code>
          </p>
        </div>
        <div class="action-box">
          <button @click="isVisible = !isVisible" class="demo-btn">切换显示</button>
        </div>
      </div>
      <p class="hint">💡 打开开发者工具观察：元素始终在 DOM 中，只是 style 变成了 <code>display: none</code>。</p>
    </section>

    <!-- 3. v-if vs v-show -->
    <section class="demo-section">
      <h2>3. v-if vs v-show 对比</h2>
      <p class="section-desc">两者的本质区别：<code>v-if</code> 销毁/重建 DOM，<code>v-show</code> 只改 CSS。</p>
      <pre class="code-block">{{ vIfVsShowCode }}</pre>
      <table class="summary-table">
        <thead>
          <tr>
            <th>特性</th>
            <th>v-if</th>
            <th>v-show</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>渲染方式</td>
            <td>条件为 false 时不渲染</td>
            <td>始终渲染，CSS 隐藏</td>
          </tr>
          <tr>
            <td>切换开销</td>
            <td>高（销毁/重建 DOM）</td>
            <td>低（只改 CSS display）</td>
          </tr>
          <tr>
            <td>初始开销</td>
            <td>低（false 时不渲染）</td>
            <td>高（始终渲染）</td>
          </tr>
          <tr>
            <td>配合指令</td>
            <td>v-else-if / v-else</td>
            <td>无</td>
          </tr>
          <tr>
            <td>template 支持</td>
            <td>✅ 支持</td>
            <td>❌ 不支持</td>
          </tr>
          <tr>
            <td>适用场景</td>
            <td>条件很少改变</td>
            <td>频繁切换</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- 4. template 上使用 v-if -->
    <section class="demo-section">
      <h2>4. template 上使用 v-if — 不渲染包裹元素</h2>
      <p class="section-desc"><code>template</code> 是"幽灵标签"——只用来包裹多个元素，自身不会渲染到 DOM。</p>
      <pre class="code-block">{{ templateVifCode }}</pre>
      <div class="result-box">
        <template v-if="isLoggedIn">
          <div class="logged-in">
            <h3>🎉 欢迎回来，{{ userName }}</h3>
            <button @click="logout" class="demo-btn">退出登录</button>
          </div>
        </template>
        <template v-else>
          <div class="logged-out">
            <p>请先登录</p>
            <button @click="login" class="demo-btn">登录</button>
          </div>
        </template>
      </div>
      <p class="hint">💡 查看 DOM 结构：找不到 <code>&lt;template&gt;</code> 标签，只有里面的 <code>div</code>。</p>
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
  border-left: 4px solid #13c2c2;
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

/* ===== 演示行 ===== */
.demo-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: flex-start;
}

/* ===== 结果展示 ===== */
.result-box {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px 16px;
  flex: 1;
  min-width: 260px;
}

.result-box p {
  margin: 8px 0;
  font-size: 14px;
  color: #333;
}

.label {
  font-weight: 500;
  color: #555;
  min-width: 100px;
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

/* ===== 类型盒子 ===== */
.type-box {
  padding: 12px 16px;
  border-radius: 6px;
  margin: 8px 0;
  font-weight: bold;
}

.type-a {
  background: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.type-b {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.type-c {
  background: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.type-other {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #d9d9d9;
}

/* ===== 操作按钮区 ===== */
.action-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 140px;
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
  border-color: #13c2c2;
  color: #13c2c2;
  background: #e6fffb;
}

/* ===== 登录/登出区域 ===== */
.logged-in {
  padding: 16px;
  background: #f6ffed;
  border-radius: 6px;
  border: 1px solid #b7eb8f;
}

.logged-in h3 {
  margin: 0 0 8px 0;
}

.logged-out {
  padding: 16px;
  background: #fff2f0;
  border-radius: 6px;
  border: 1px solid #ffccc7;
}

/* ===== 对比表格 ===== */
.summary-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  font-size: 14px;
}

.summary-table th {
  background: #e6fffb;
  padding: 10px 14px;
  text-align: left;
  font-weight: 600;
  color: #006d75;
  border-bottom: 2px solid #87e8de;
}

.summary-table td {
  padding: 10px 14px;
  border-bottom: 1px solid #e8e8e8;
  color: #444;
}

.summary-table tbody tr:hover {
  background: #f5f5f5;
}
</style>
