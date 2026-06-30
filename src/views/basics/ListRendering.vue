<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// ====================================================================
// 1. 遍历数组
// ====================================================================
// 核心思想：v-for 遍历数组，生成对应数量的元素
//
// 类比：v-for 就像"复印机"🖨️
//   给一个模板和一个数据列表
//   自动为每个数据项"复印"一份模板

const items = ref([
  { id: 1, name: '项目一' },
  { id: 2, name: '项目二' },
  { id: 3, name: '项目三' },
])

const arrayVforCode = `// v-for 遍历数组
// v-for="(item, index) in items" :key="item.id"
//   item   → 当前元素
//   index  → 当前索引（从 0 开始）
//   :key   → 必须！唯一标识，帮助 Vue 追踪元素

<ul>
  <li v-for="(item, index) in items" :key="item.id">
    &#123;&#123; index &#125;&#125; - &#123;&#123; item.name &#125;&#125;
  </li>
</ul>

// 为什么需要 :key？
//   Vue 用 key 识别每个元素，数据变化时精准更新
//   没有 key 时 Vue 会"就地复用"，可能导致状态错乱`

// ====================================================================
// 2. 遍历对象
// ====================================================================
const userInfo = reactive({
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com',
})

const objectVforCode = `// v-for 遍历对象
// v-for="(value, key, index) in object"
//   value → 属性值
//   key   → 属性名
//   index → 序号（从 0 开始）

<li v-for="(value, key, index) in userInfo" :key="key">
  &#123;&#123; index &#125;&#125;. &#123;&#123; key &#125;&#125;: &#123;&#123; value &#125;&#125;
</li>

// 输出：
//   0. name: 张三
//   1. age: 25
//   2. email: zhangsan@example.com`

// ====================================================================
// 3. 遍历数字
// ====================================================================
const rangeVforCode = `// v-for 遍历数字范围
<span v-for="n in 5" :key="n">&#123;&#123; n &#125;&#125;</span>

// 输出：1 2 3 4 5
// n in 5 等价于 n in [1, 2, 3, 4, 5]`

// ====================================================================
// 4. 数组变更检测
// ====================================================================
const numList = ref([1, 2, 3, 4, 5])

function addItem() {
  numList.value.push(numList.value.length + 1)
}
function removeItem() {
  numList.value.pop()
}
function replaceAll() {
  numList.value = [10, 20, 30]
}

const arrayMutationCode = `// Vue 3 能检测以下数组变更：
numList.value.push(6)     // ✅ 末尾添加 → 触发更新
numList.value.pop()       // ✅ 末尾删除 → 触发更新
numList.value.shift()     // ✅ 开头删除 → 触发更新
numList.value.unshift(0)  // ✅ 开头添加 → 触发更新
numList.value.splice(2,1) // ✅ 删除/插入 → 触发更新
numList.value.sort()      // ✅ 排序 → 触发更新
numList.value.reverse()   // ✅ 反转 → 触发更新

// 整体替换也触发：
numList.value = [10, 20, 30]  // ✅ 整体替换 → 触发更新

// 注意：直接通过索引修改不会触发：
// numList.value[0] = 999  ❌ Vue 2 不行，Vue 3 通过 Proxy 可以`

// ====================================================================
// 5. v-for 与 v-if
// ====================================================================
const todoItems = ref([
  { id: 1, name: '学习 Vue 3', isActive: true },
  { id: 2, name: '写项目', isActive: false },
  { id: 3, name: '复习笔记', isActive: true },
  { id: 4, name: '代码审查', isActive: false },
])

const activeItems = computed(() => todoItems.value.filter((item) => item.isActive))

const vforVifCode = `// ⚠️ 不推荐：v-for 和 v-if 在同一元素上
// <li v-for="item in items" v-if="item.isActive">  ← 不推荐！
// v-if 优先级更高，但会先遍历再判断，浪费性能

// ✅ 推荐：用 computed 先过滤，再遍历
const activeItems = computed(() =>
  items.filter(item => item.isActive)
)
// <li v-for="item in activeItems">  ← 推荐！

// 或者用 <template> 包裹：
// <template v-for="item in items">
//   <li v-if="item.isActive">...</li>
// </template>`

// ====================================================================
// 6. 过滤排序
// ====================================================================
const keyword = ref('')
const products = ref([
  { id: 1, name: '苹果', price: 10 },
  { id: 2, name: '香蕉', price: 5 },
  { id: 3, name: '橙子', price: 8 },
  { id: 4, name: '葡萄', price: 15 },
])

const filteredProducts = computed(() =>
  products.value.filter((item) => item.name.includes(keyword.value)).sort((a, b) => a.price - b.price),
)

const filterSortCode = `// computed 实现过滤 + 排序
const filteredProducts = computed(() =>
  products.value
    .filter(item => item.name.includes(keyword.value))  // 先过滤
    .sort((a, b) => a.price - b.price)                   // 再排序
)

// keyword 变化 → filteredProducts 自动重新计算
// 视图自动更新，不需要手动操作 DOM`
</script>

<template>
  <div class="demo-page">
    <h1 class="page-title">📋 列表渲染</h1>
    <p class="page-subtitle">v-for — 根据数据列表动态生成 DOM 元素</p>

    <!-- ==================== 前置说明 ==================== -->
    <section class="demo-section intro-section">
      <h2>📖 什么是列表渲染？</h2>
      <div class="explain-box">
        <p>
          <strong>一句话解释：</strong
          ><code>v-for</code> 让你<em>根据数组/对象动态生成一组元素</em>，数据变化时列表自动更新。
        </p>

        <div class="key-points">
          <p>🔑 <strong>核心要点：</strong></p>
          <ul>
            <li>
              <strong>必须加 <code>:key</code></strong
              >：给每个元素唯一标识，帮助 Vue 精准更新
            </li>
            <li>可遍历<strong>数组、对象、数字范围</strong></li>
            <li>Vue 3 通过 Proxy 可检测所有数组变更（push/pop/splice/sort 等）</li>
            <li><strong>不要同时用 v-if 和 v-for</strong>在同一元素上——用 computed 先过滤</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 1. 遍历数组 -->
    <section class="demo-section">
      <h2>1. 遍历数组 — (item, index) in array</h2>
      <p class="section-desc">
        最常用的列表渲染方式。<code>:key</code> 是<strong>必须的</strong>，用唯一 ID 作为 key。
      </p>
      <pre class="code-block">{{ arrayVforCode }}</pre>
      <div class="result-box">
        <ul class="result-list">
          <li v-for="(item, index) in items" :key="item.id">
            <span class="label">索引 {{ index }}</span> — {{ item.name }}
          </li>
        </ul>
      </div>
    </section>

    <!-- 2. 遍历对象 -->
    <section class="demo-section">
      <h2>2. 遍历对象 — (value, key, index) in object</h2>
      <p class="section-desc">遍历对象的属性，可以获取值、属性名和序号。</p>
      <pre class="code-block">{{ objectVforCode }}</pre>
      <div class="result-box">
        <ul class="result-list">
          <li v-for="(value, key, index) in userInfo" :key="key">
            <span class="label">{{ index }}. {{ key }}</span> = <code>{{ value }}</code>
          </li>
        </ul>
      </div>
    </section>

    <!-- 3. 遍历数字 -->
    <section class="demo-section">
      <h2>3. 遍历数字范围 — n in 5</h2>
      <p class="section-desc">从 1 开始遍历到指定数字。</p>
      <pre class="code-block">{{ rangeVforCode }}</pre>
      <div class="result-box">
        <span v-for="n in 5" :key="n" class="number-badge">{{ n }}</span>
      </div>
    </section>

    <!-- 4. 数组变更检测 -->
    <section class="demo-section">
      <h2>4. 数组变更检测</h2>
      <p class="section-desc">Vue 3 能检测所有数组变更方法。整体替换数组也会触发更新。</p>
      <pre class="code-block">{{ arrayMutationCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p>
            <span class="label">列表</span> = <code>{{ numList.join(', ') }}</code>
          </p>
        </div>
        <div class="action-box">
          <button @click="addItem" class="demo-btn">push 末尾添加</button>
          <button @click="removeItem" class="demo-btn">pop 末尾删除</button>
          <button @click="replaceAll" class="demo-btn">替换整个数组</button>
        </div>
      </div>
    </section>

    <!-- 5. v-for 与 v-if -->
    <section class="demo-section">
      <h2>5. v-for 与 v-if — 不要同时用！</h2>
      <p class="section-desc">
        <strong>推荐做法：</strong>用 <code>computed</code> 先过滤数据，再用 <code>v-for</code> 遍历过滤后的结果。
      </p>
      <pre class="code-block">{{ vforVifCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p class="section-label">全部事项：</p>
          <ul class="result-list">
            <li v-for="item in todoItems" :key="item.id" :class="{ done: item.isActive }">
              {{ item.isActive ? '✅' : '⬜' }} {{ item.name }}
            </li>
          </ul>
          <p class="section-label">仅活跃事项（computed 过滤）：</p>
          <ul class="result-list">
            <li v-for="item in activeItems" :key="item.id" class="active-item">✅ {{ item.name }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 6. 过滤排序 -->
    <section class="demo-section">
      <h2>6. 搜索过滤 + 排序 — 实战</h2>
      <p class="section-desc"><code>computed</code> + <code>v-for</code> 实现实时搜索过滤和价格排序。</p>
      <pre class="code-block">{{ filterSortCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <ul class="result-list">
            <li v-for="item in filteredProducts" :key="item.id">
              {{ item.name }} — <strong>¥{{ item.price }}</strong>
            </li>
          </ul>
          <p v-if="filteredProducts.length === 0" class="no-result">无匹配结果</p>
        </div>
        <div class="action-box">
          <input v-model="keyword" class="demo-input" placeholder="搜索商品名称..." />
        </div>
      </div>
      <p class="hint">💡 输入"果"试试——只显示苹果，且按价格升序排列。</p>
    </section>

    <!-- ==================== 速查表 ==================== -->
    <section class="demo-section summary-section">
      <h2>📋 v-for 知识速查表</h2>
      <table class="summary-table">
        <thead>
          <tr>
            <th>用法</th>
            <th>语法</th>
            <th>参数含义</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>遍历数组</td>
            <td><code>v-for="(item, i) in arr"</code></td>
            <td>item=元素, i=索引(0开始)</td>
          </tr>
          <tr>
            <td>遍历对象</td>
            <td><code>v-for="(val, key, i) in obj"</code></td>
            <td>val=值, key=属性名, i=序号</td>
          </tr>
          <tr>
            <td>遍历数字</td>
            <td><code>v-for="n in 10"</code></td>
            <td>n=1,2,3...10</td>
          </tr>
          <tr>
            <td>:key 绑定</td>
            <td><code>:key="item.id"</code></td>
            <td>必须！唯一标识每个元素</td>
          </tr>
          <tr>
            <td>template 包裹</td>
            <td><code>&lt;template v-for&gt;</code></td>
            <td>不渲染包裹元素</td>
          </tr>
          <tr>
            <td>与 v-if 配合</td>
            <td>用 computed 先过滤</td>
            <td>避免同元素上同时使用</td>
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
  border-left: 4px solid #eb2f96;
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

.section-label {
  font-weight: 600;
  color: #555;
  margin: 10px 0 4px !important;
  font-size: 13px;
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
  margin: 5px 0;
  font-size: 14px;
  color: #333;
}

.result-list {
  margin: 4px 0;
  padding-left: 20px;
}

.result-list li {
  margin: 4px 0;
  font-size: 14px;
  color: #333;
}

.label {
  font-weight: 500;
  color: #555;
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

.no-result {
  color: #999;
  font-style: italic;
}

/* ===== 数字徽章 ===== */
.number-badge {
  display: inline-block;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #fff0f6;
  color: #eb2f96;
  border-radius: 50%;
  margin-right: 8px;
  font-weight: bold;
}

/* ===== 操作按钮区 ===== */
.action-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 160px;
}

.demo-input {
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;
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
  border-color: #eb2f96;
  color: #eb2f96;
  background: #fff0f6;
}

/* ===== 状态样式 ===== */
.done {
  color: #52c41a;
  font-weight: bold;
}

.active-item {
  color: #1890ff;
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
