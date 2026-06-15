<script setup lang="ts">
import { ref, reactive } from 'vue'
import MyButton from '../../components/MyButton.vue'
import UserCard from '../../components/UserCard.vue'
import CounterButton from '../../components/CounterButton.vue'
import Card from '../../components/Card.vue'
import ListComponent from '../../components/ListComponent.vue'

// ====================================================================
// 1. 组件定义与注册
// ====================================================================
// 核心思想：Vue 组件是可复用的 Vue 实例，通过 import 引入即可使用
//
// 类比：组件就像"乐高积木"🧱
//   每个组件是一个独立的积木块
//   可以自由组合搭建出复杂的页面

// ====================================================================
// 2. Props — 父传子
// ====================================================================
// 核心思想：父组件通过 props 向子组件传递数据，子组件通过 defineProps 接收
//
// 类比：props 就像"函数参数"📥
//   父组件调用子组件时传入参数
//   子组件用这些参数决定如何渲染

const userName = ref('李四')
const userInfo = reactive({
  name: '王五',
  age: 30,
  isAdmin: false,
})

const propsCode = `// ===== Props：父组件 → 子组件 =====

// 父组件中传值：
<UserCard name="张三" />                           // 静态 prop
<UserCard :name="userName" :age="25" />            // 动态 prop（用 : 绑定）
<UserCard v-bind="userInfo" />                     // 批量传递（v-bind 对象）

// 子组件中接收（UserCard.vue）：
const props = defineProps({
  name: String,
  age: { type: Number, default: 18 },
  isAdmin: { type: Boolean, default: false },
})

// 单向数据流：props 是只读的，子组件不能直接修改
// 如果需要修改，应该通过 emit 通知父组件`

// ====================================================================
// 3. Emits — 子传父
// ====================================================================
// 核心思想：子组件通过 emit 向父组件发送事件，父组件用 @event 监听
//
// 类比：emit 就像"对讲机"📡
//   子组件喊话（emit 事件）
//   父组件听到后做相应处理

const counterValue = ref(0)

const emitsCode = `// ===== Emits：子组件 → 父组件 =====

// 子组件中（CounterButton.vue）：
const emit = defineEmits(['update', 'reset'])
emit('update', newValue)  // 触发 update 事件，传 newValue
emit('reset')             // 触发 reset 事件

// 父组件中监听：
<CounterButton
  @update="counterValue = $event"   // $event 是子组件传来的值
  @reset="counterValue = 0"         // 不传值，直接重置
/>`

// ====================================================================
// 4. Slots — 插槽
// ====================================================================
// 核心思想：插槽让父组件可以向子组件注入自定义内容
//
// 类比：slots 就像"预留空位"🕳️
//   子组件定义好框架结构
//   父组件往空位里填入自己的内容

const productList = ref([
  { id: 1, name: '苹果', price: 10 },
  { id: 2, name: '香蕉', price: 5 },
  { id: 3, name: '橙子', price: 8 },
])

const slotsCode = `// ===== Slots：父组件向子组件注入内容 =====

// 默认插槽
<Card>
  <p>这段内容会放到 Card 组件的默认插槽位置</p>
</Card>

// 具名插槽
<Card>
  <template #header>
    <h3>自定义标题</h3>
  </template>
  <p>默认插槽内容</p>
  <template #footer>
    <button>确认</button>
  </template>
</Card>

// 作用域插槽：子组件向父组件暴露数据
<ListComponent :items="list">
  <template #item="{ item, index }">
    &#123;&#123; index &#125;&#125;. &#123;&#123; item.name &#125;&#125;  // 使用子组件传来的数据
  </template>
</ListComponent>`
</script>

<template>
  <div class="demo-page">
    <h1 class="page-title">🧩 组件基础</h1>
    <p class="page-subtitle">Props / Emits / Slots — 组件通信三要素</p>

    <!-- ==================== 前置说明 ==================== -->
    <section class="demo-section intro-section">
      <h2>📖 什么是组件？</h2>
      <div class="explain-box">
        <p>
          <strong>一句话解释：</strong>组件是<em>可复用的 Vue 实例</em>，通过 Props（父→子）、Emits（子→父）、Slots（内容分发）实现通信。
        </p>

        <div class="key-points">
          <p>🔑 <strong>核心要点：</strong></p>
          <ul>
            <li><strong>Props</strong>：父组件向子组件传递数据，<strong>单向数据流</strong>，子组件不能直接修改</li>
            <li><strong>Emits</strong>：子组件向父组件发送事件，父组件用 <code>@event</code> 监听</li>
            <li><strong>Slots</strong>：父组件向子组件注入自定义 HTML 内容</li>
            <li><strong>作用域插槽</strong>：子组件向父组件暴露数据，父组件用这些数据渲染</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 1. 组件定义 -->
    <section class="demo-section">
      <h2>1. 组件定义 — import 即用</h2>
      <p class="section-desc">
        <code>&lt;script setup&gt;</code> 中 import 的组件会自动注册，模板中直接使用。
      </p>
      <div class="demo-row">
        <MyButton type="default">默认按钮</MyButton>
        <MyButton type="primary">主要按钮</MyButton>
        <MyButton type="danger">危险按钮</MyButton>
      </div>
      <p class="hint">💡 通过 props 控制按钮类型，使用 slot 插入文字内容。</p>
    </section>

    <!-- 2. Props -->
    <section class="demo-section">
      <h2>2. Props — 父 → 子传数据</h2>
      <p class="section-desc">
        静态值、动态绑定、<code>v-bind</code> 批量传递——三种传值方式。
      </p>
      <pre class="code-block">{{ propsCode }}</pre>
      <div class="card-row">
        <UserCard name="张三" />
        <UserCard :name="userName" :age="25" :is-admin="true" />
        <UserCard v-bind="userInfo" />
      </div>
      <p class="hint">💡 三种方式：静态 prop、动态 prop（:绑定）、v-bind 批量传递。</p>
    </section>

    <!-- 3. Emits -->
    <section class="demo-section">
      <h2>3. Emits — 子 → 父发事件</h2>
      <p class="section-desc">
        子组件 <code>emit('event', value)</code>，父组件 <code>@event="handler"</code>。
      </p>
      <pre class="code-block">{{ emitsCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p><span class="label">父组件计数</span> = <code>{{ counterValue }}</code></p>
        </div>
        <div class="action-box">
          <CounterButton
            @update="counterValue = $event"
            @reset="counterValue = 0"
          />
        </div>
      </div>
    </section>

    <!-- 4. 插槽 -->
    <section class="demo-section">
      <h2>4. Slots — 父 → 子注入内容</h2>
      <p class="section-desc">
        默认插槽和具名插槽，父组件填充子组件预留的空位。
      </p>
      <pre class="code-block">{{ slotsCode }}</pre>
      <Card>
        <template #header>
          <h3 style="margin: 0">自定义标题</h3>
        </template>
        <p>这是通过默认插槽插入的主体内容</p>
        <template #footer>
          <button style="margin-right: 8px" class="demo-btn">确认</button>
          <button class="demo-btn">取消</button>
        </template>
      </Card>
    </section>

    <!-- 5. 作用域插槽 -->
    <section class="demo-section">
      <h2>5. 作用域插槽 — 子组件向父组件暴露数据</h2>
      <p class="section-desc">
        子组件把数据暴露给父组件，父组件决定如何渲染每条数据。
      </p>
      <ListComponent :items="productList">
        <template #item="{ item, index }">
          <span class="item-index">{{ index + 1 }}.</span>
          <strong>{{ item.name }}</strong>
          <span class="item-price">¥{{ item.price }}</span>
        </template>
      </ListComponent>
    </section>

    <!-- ==================== 速查表 ==================== -->
    <section class="demo-section summary-section">
      <h2>📋 组件通信速查表</h2>
      <table class="summary-table">
        <thead>
          <tr>
            <th>通信方向</th>
            <th>机制</th>
            <th>语法</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>父 → 子</td>
            <td>Props</td>
            <td><code>:prop="value"</code> / <code>v-bind="obj"</code></td>
          </tr>
          <tr>
            <td>子 → 父</td>
            <td>Emits</td>
            <td><code>$emit('event', val)</code> / <code>@event="fn"</code></td>
          </tr>
          <tr>
            <td>父 → 子（内容）</td>
            <td>默认插槽</td>
            <td><code>&lt;slot /&gt;</code></td>
          </tr>
          <tr>
            <td>父 → 子（多区域）</td>
            <td>具名插槽</td>
            <td><code>&lt;slot name="header" /&gt;</code> + <code>#header</code></td>
          </tr>
          <tr>
            <td>子 → 父（数据）</td>
            <td>作用域插槽</td>
            <td><code>&lt;slot :item="item" /&gt;</code> + <code>#default="{ item }"</code></td>
          </tr>
          <tr>
            <td>跨层级</td>
            <td>Provide / Inject</td>
            <td><code>provide('key', val)</code> / <code>inject('key')</code></td>
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
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

/* ===== 结果展示 ===== */
.result-box {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px 16px;
  flex: 1;
  min-width: 200px;
}

.result-box p {
  margin: 5px 0;
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

.card-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-box {
  display: flex;
  flex-direction: column;
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
  border-color: #1890ff;
  color: #1890ff;
}

.item-index {
  color: #999;
  margin-right: 8px;
}

.item-price {
  color: #ff4d4f;
  margin-left: 12px;
  font-weight: bold;
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
