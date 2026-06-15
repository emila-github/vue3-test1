<script setup lang="ts">
import { ref, computed } from 'vue'

// ====================================================================
// 1. 基本计算属性
// ====================================================================
// 核心思想：基于已有数据自动计算派生值，自动缓存
//
// 类比：computed 就像 Excel 公式 📊
//   A1 = '张', B1 = '三'
//   C1 = A1 & ' ' & B1 → 自动得到 '张 三'
//   修改 A1 或 B1 → C1 自动重新计算
//   只有依赖变化才重新计算，否则直接返回缓存值

const firstName = ref('张')
const lastName = ref('三')
const fullName = computed(() => firstName.value + ' ' + lastName.value)

const basicComputedCode = `// computed：根据已有数据派生新数据，自动缓存
const firstName = ref('张')
const lastName = ref('三')

// fullName 的值由 firstName 和 lastName 自动计算
const fullName = computed(() => firstName.value + ' ' + lastName.value)
// fullName.value = '张 三'

// computed 关键特性：
// 1. 懒计算：只有被访问时才计算
// 2. 自动缓存：依赖不变时直接返回上次结果
// 3. 自动追踪：依赖变化时自动重新计算`

// ====================================================================
// 2. 可写计算属性
// ====================================================================
// 核心思想：computed 也可以支持 setter，实现双向数据流
//
// 类比：可写计算属性就像"翻译官"🌐
//   读的时候 → 把姓和名拼成全名
//   写的时候 → 把全名拆成姓和名
//   一个接口，两种方向

const first = ref('张')
const last = ref('三')
const writableFullName = computed({
  get() {
    return first.value + ' ' + last.value
  },
  set(newValue: string) {
    const parts = newValue.split(' ')
    first.value = parts[0] || ''
    last.value = parts[1] || ''
  },
})

const writableComputedCode = `// 可写计算属性：同时支持读取和修改
const first = ref('张')
const last = ref('三')

const writableFullName = computed({
  // getter：读取时调用，返回计算后的值
  get() {
    return first.value + ' ' + last.value
  },
  // setter：修改时调用，反向拆解值并更新源数据
  set(newValue: string) {
    const parts = newValue.split(' ')
    first.value = parts[0] || ''
    last.value = parts[1] || ''
  },
})

// 使用场景：v-model 绑定、需要双向转换的数据`

// ====================================================================
// 3. 计算属性 vs 方法
// ====================================================================
// 核心思想：computed 有缓存，方法没有。多次访问 computed 只算一次。
//
// 类比：
//   computed → 就像"计算器记住了上次结果"，只要数字没变就直接告诉你
//   method   → 就像"每次都要重新按一遍计算器"

const counter = ref(0)
let computedCallCount = 0
let methodCallCount = 0

const computedMsg = computed(() => {
  console.log('computed 调用')
  computedCallCount++
  return `当前计数：${counter.value}`
})

function getMsg() {
  console.log('方法调用')
  methodCallCount++
  return `当前计数：${counter.value}`
}

const vsMethodCode = `// ===== computed vs method：核心区别 =====
const counter = ref(0)

// computed：有缓存
const computedMsg = computed(() => {
  console.log('computed 调用')  // 依赖不变时只打印一次
  return '当前计数：' + counter.value
})

// method：无缓存
function getMsg() {
  console.log('方法调用')  // 每次访问都打印
  return '当前计数：' + counter.value
}

// 模板中多次访问：
// &#123;&#123; computedMsg &#125;&#125;  ← 只算一次（缓存命中）
// &#123;&#123; computedMsg &#125;&#125;  ← 直接返回缓存，不重算！
// &#123;&#123; getMsg() &#125;&#125;      ← 重新计算
// &#123;&#123; getMsg() &#125;&#125;      ← 又重算一次！`

// ====================================================================
// 4. 搜索过滤
// ====================================================================
// 核心思想：computed 是响应式的——关键词变化时列表自动过滤

const keyword = ref('')
const list = ref(['Apple', 'Banana', 'Orange', 'Grape', 'Watermelon'])
const filteredList = computed(() =>
  list.value.filter((item) => item.toLowerCase().includes(keyword.value.toLowerCase())),
)

const filterCode = `// computed 实现搜索过滤：关键词一变，列表自动刷新
const keyword = ref('')
const list = ref(['Apple', 'Banana', 'Orange', 'Grape', 'Watermelon'])

const filteredList = computed(() =>
  list.value.filter(item =>
    item.toLowerCase().includes(keyword.value.toLowerCase())
  )
)

// keyword 变化 → filteredList 自动重新过滤 → 视图自动更新
// 不需要手动调用任何过滤函数！`

// ====================================================================
// 5. 购物车
// ====================================================================
const cart = ref([
  { name: '商品A', price: 100, count: 2 },
  { name: '商品B', price: 200, count: 1 },
])
const totalPrice = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.count, 0),
)

const cartCode = `// computed 实现购物车总价自动计算
const cart = ref([
  { name: '商品A', price: 100, count: 2 },
  { name: '商品B', price: 200, count: 1 },
])

const totalPrice = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.count, 0)
)
// totalPrice.value = 400

// 商品价格、数量、增删商品 → totalPrice 自动更新`

// ====================================================================
// 6. 表单验证
// ====================================================================
const password = ref('')
const isPasswordValid = computed(() => password.value.length >= 6 && password.value.length <= 20)

const validationCode = `// computed 实现实时表单验证
const password = ref('')

const isPasswordValid = computed(() =>
  password.value.length >= 6 && password.value.length <= 20
)

// 输入框每打一个字，isPasswordValid 自动更新
// 模板中可直接用 isPasswordValid 控制提示信息
// <p :class="isPasswordValid ? 'valid' : 'invalid'">
//   &#123;&#123; isPasswordValid ? '✅ 合格' : '❌ 6-20位' &#125;&#125;
// </p>`
</script>

<template>
  <div class="demo-page">
    <h1 class="page-title">📊 计算属性</h1>
    <p class="page-subtitle">computed — 声明式派生数据，自动缓存，智能更新</p>

    <!-- ==================== 前置说明 ==================== -->
    <section class="demo-section intro-section">
      <h2>📖 什么是计算属性？为什么用它？</h2>
      <div class="explain-box">
        <p>
          <strong>一句话解释：</strong><code>computed</code> 是<em>声明式的派生状态</em>——你只需要描述"这个值怎么算出来的"，Vue 负责追踪依赖和缓存。
        </p>

        <h3>不用 computed 的痛苦 😫</h3>
        <pre class="code-block">
// 每次都要手动同步数据，容易遗漏
let total = 0
function updateTotal() {
  total = price * quantity * discount  // 每次改 price/quantity/discount 都要调用！
}
updateTotal()  // 忘了调用 → 数据不一致 → bug！</pre>

        <h3>用了 computed 之后 😎</h3>
        <pre class="code-block">
// 声明式：描述计算关系即可，Vue 自动维护
const total = computed(() => price.value * quantity.value * discount.value)
// total 自动与 price、quantity、discount 保持同步！</pre>

        <div class="key-points">
          <p>🔑 <strong>核心要点：</strong></p>
          <ul>
            <li><code>computed</code> 返回一个<strong>只读的</strong> <code>ref</code>，用 <code>.value</code> 访问</li>
            <li><strong>自动缓存</strong>：依赖不变时直接返回上次结果，不重复计算</li>
            <li><strong>懒计算</strong>：只有被访问时才计算，不用就不算</li>
            <li>支持 <strong>setter</strong>，可实现可写计算属性（双向转换）</li>
            <li>模板中多次访问 computed 只计算一次，而方法每次渲染都调用</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 1. 基本计算属性 -->
    <section class="demo-section">
      <h2>1. 基本计算属性 — 自动拼接</h2>
      <p class="section-desc">
        <code>fullName</code> 的值由 <code>firstName</code> + <code>lastName</code> 自动派生。
        修改任一个源，全名自动更新。
      </p>
      <pre class="code-block">{{ basicComputedCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p><span class="label">姓</span> = <code>{{ firstName }}</code></p>
          <p><span class="label">名</span> = <code>{{ lastName }}</code></p>
          <p class="highlight-result">
            <span class="label">全名</span> = <code>{{ fullName }}</code>
            <span class="type-hint">// 自动派生</span>
          </p>
        </div>
        <div class="action-box">
          <label class="input-label">姓：<input v-model="firstName" class="demo-input" /></label>
          <label class="input-label">名：<input v-model="lastName" class="demo-input" /></label>
        </div>
      </div>
      <p class="hint">
        💡 <code>fullName</code> 只依赖 <code>firstName</code> 和 <code>lastName</code>，
        这两个值不变就不会重新计算。
      </p>
    </section>

    <!-- 2. 可写计算属性 -->
    <section class="demo-section">
      <h2>2. 可写计算属性 — 双向转换</h2>
      <p class="section-desc">
        计算属性也可以有 <strong>setter</strong>。修改全名时自动拆分成姓和名——像一个数据转换器。
      </p>
      <pre class="code-block">{{ writableComputedCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p><span class="label">姓</span> = <code>{{ first }}</code></p>
          <p><span class="label">名</span> = <code>{{ last }}</code></p>
          <p class="highlight-result">
            <span class="label">全名（可写）</span> = <code>{{ writableFullName }}</code>
          </p>
        </div>
        <div class="action-box">
          <label class="input-label">修改全名：<input v-model="writableFullName" class="demo-input" placeholder="输入 '李 四' 试试" /></label>
        </div>
      </div>
      <p class="hint">
        💡 输入 "李 四" 并回车：姓变成"李"，名变成"四"——这就是 setter 的反向拆解逻辑。
      </p>
    </section>

    <!-- 3. 计算属性 vs 方法 -->
    <section class="demo-section">
      <h2>3. computed vs method — 缓存的威力</h2>
      <p class="section-desc">
        模板中多次访问 <code>computed</code> 只计算一次，而 <strong>method 每次访问都重新计算</strong>。
        看下面的计数器对比。
      </p>
      <pre class="code-block">{{ vsMethodCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p><span class="label">计数 counter</span> = <code>{{ counter }}</code></p>
          <p>
            <span class="label">computed 调用次数</span> = <code>{{ computedCallCount }}</code>
            <span class="type-hint">（多次访问只算一次）</span>
          </p>
          <p><span class="label">computed 结果</span> = <code>{{ computedMsg }}</code></p>
          <p><span class="label">computed 再次访问</span> = <code>{{ computedMsg }}</code></p>
          <p>
            <span class="label">方法调用次数</span> = <code>{{ methodCallCount }}</code>
            <span class="type-hint">（每次访问都重新算）</span>
          </p>
          <p><span class="label">方法结果</span> = <code>{{ getMsg() }}</code></p>
          <p><span class="label">方法再次调用</span> = <code>{{ getMsg() }}</code></p>
        </div>
        <div class="action-box">
          <button @click="counter++" class="demo-btn">counter++</button>
        </div>
      </div>
      <p class="hint">
        💡 注意看：模板中访问了两次 <code>computedMsg</code>，但只调用 1 次；访问两次 <code>getMsg()</code>，却调用了 2 次！
      </p>
    </section>

    <!-- 4. 搜索过滤 -->
    <section class="demo-section">
      <h2>4. 搜索过滤 — computed 实战</h2>
      <p class="section-desc">
        输入关键词，列表自动过滤——<code>keyword</code> 一变，<code>filteredList</code> 自动更新。
      </p>
      <pre class="code-block">{{ filterCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p><span class="label">搜索关键词</span> = <code>"{{ keyword }}"</code></p>
          <ul class="result-list" v-if="filteredList.length">
            <li v-for="item in filteredList" :key="item">{{ item }}</li>
          </ul>
          <p v-else class="no-result">无匹配结果</p>
        </div>
        <div class="action-box">
          <input v-model="keyword" class="demo-input" placeholder="输入搜索关键词..." />
        </div>
      </div>
    </section>

    <!-- 5. 购物车 -->
    <section class="demo-section">
      <h2>5. 购物车总价 — 多依赖计算</h2>
      <p class="section-desc">
        购物车中任何商品的价格、数量变化，总价自动重新计算。
      </p>
      <pre class="code-block">{{ cartCode }}</pre>
      <div class="result-box">
        <ul class="result-list">
          <li v-for="item in cart" :key="item.name">
            <span class="label">{{ item.name }}</span>
            — ¥{{ item.price }} × {{ item.count }}
          </li>
        </ul>
        <p class="highlight-result">
          <span class="label">总价</span> = <code>¥{{ totalPrice }}</code>
          <span class="type-hint">// 自动计算</span>
        </p>
      </div>
    </section>

    <!-- 6. 表单验证 -->
    <section class="demo-section">
      <h2>6. 表单验证 — 实时反馈</h2>
      <p class="section-desc">
        每输入一个字符，<code>isPasswordValid</code> 自动重新验证——无需手动调用验证函数。
      </p>
      <pre class="code-block">{{ validationCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p>
            <span class="label">密码</span> = <code>{{ password || '(空)' }}</code>
          </p>
          <p :class="isPasswordValid ? 'valid-msg' : 'invalid-msg'">
            {{ isPasswordValid ? '✅ 密码格式正确' : '❌ 密码长度需 6-20 位' }}
          </p>
        </div>
        <div class="action-box">
          <input v-model="password" type="password" class="demo-input" placeholder="输入密码（6-20位）" />
        </div>
      </div>
    </section>

    <!-- ==================== 速查表 ==================== -->
    <section class="demo-section summary-section">
      <h2>📋 computed 知识速查表</h2>
      <table class="summary-table">
        <thead>
          <tr>
            <th>概念</th>
            <th>说明</th>
            <th>关键特征</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>computed()</code></td>
            <td>创建计算属性</td>
            <td>返回只读 ref，自动缓存</td>
          </tr>
          <tr>
            <td>getter</td>
            <td>定义如何计算值</td>
            <td>依赖变化时自动重新计算</td>
          </tr>
          <tr>
            <td>setter</td>
            <td>定义如何修改值（可选）</td>
            <td>实现双向数据转换</td>
          </tr>
          <tr>
            <td>缓存机制</td>
            <td>依赖不变 → 返回缓存</td>
            <td>性能优化关键</td>
          </tr>
          <tr>
            <td>懒计算</td>
            <td>被访问时才计算</td>
            <td>不用就不算，节省资源</td>
          </tr>
          <tr>
            <td>vs method</td>
            <td>computed 有缓存，method 没有</td>
            <td>模板中多次访问首选 computed</td>
          </tr>
          <tr>
            <td>vs watch</td>
            <td>computed 用于派生值，watch 用于副作用</td>
            <td>computed 有返回值，watch 没有</td>
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
  border-left: 4px solid #fa8c16;
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

.highlight-result {
  background: #f6ffed;
  padding: 6px 8px;
  border-radius: 4px;
  margin-top: 8px !important;
  border: 1px dashed #b7eb8f;
}

.label {
  font-weight: 500;
  color: #555;
  min-width: 140px;
  display: inline-block;
}

.type-hint {
  color: #bbb;
  font-size: 12px;
  margin-left: 8px;
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

.result-list {
  margin: 4px 0;
  padding-left: 20px;
}

.result-list li {
  margin: 3px 0;
  font-size: 14px;
  color: #333;
}

.no-result {
  color: #999;
  font-style: italic;
}

/* ===== 操作按钮区 ===== */
.action-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #555;
  white-space: nowrap;
}

.demo-input {
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  width: 180px;
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
  border-color: #fa8c16;
  color: #fa8c16;
  background: #fff7e6;
}

/* ===== 验证消息 ===== */
.valid-msg {
  color: #52c41a;
  font-weight: bold;
}

.invalid-msg {
  color: #ff4d4f;
  font-weight: bold;
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
