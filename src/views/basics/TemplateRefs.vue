<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChildComponent from '../../components/ChildComponent.vue'

// ====================================================================
// 1. 获取 DOM 元素
// ====================================================================
// 核心思想：ref 属性 + 同名 ref 变量，获取原生 DOM 元素引用
//
// 类比：ref 就像"标签"🏷️
//   在模板元素上贴一个标签
//   在 JS 中通过这个标签找到对应的 DOM 元素
//   注意：onMounted 之后才能访问（组件挂载完毕）

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})

function focusInput() {
  inputRef.value?.focus()
}

const domRefCode = `// ref 获取 DOM 元素
const inputRef = ref<HTMLInputElement | null>(null)

// 模板中：
<input ref="inputRef" />

// 注意：onMounted 之后才能访问
onMounted(() => {
  inputRef.value?.focus()  // 自动聚焦
})

// ref 变量名必须和模板中的 ref 属性值一致！
// 模板：ref="inputRef"  ←→  脚本：const inputRef = ref(null)`

// ====================================================================
// 2. v-for 中的模板引用
// ====================================================================
// 核心思想：v-for 中需要用函数形式的 ref 来收集多个元素
//
// 类比：函数 ref 就像"收集箱"📦
//   每渲染一个元素，就自动往箱子里放一个
//   最终得到所有元素的数组

const list = ref([
  { id: 1, name: '项目一' },
  { id: 2, name: '项目二' },
  { id: 3, name: '项目三' },
])

const itemRefs = ref<HTMLElement[]>([])

function setItemRef(el: any) {
  if (el) {
    itemRefs.value.push(el as HTMLElement)
  }
}

function highlightItems() {
  itemRefs.value.forEach((el) => {
    el.style.background = '#e6f7ff'
    setTimeout(() => {
      el.style.background = ''
    }, 1000)
  })
}

const vforRefCode = `// v-for 中的 ref：使用函数形式
const itemRefs = ref<HTMLElement[]>([])

function setItemRef(el: any) {
  if (el) {
    itemRefs.value.push(el as HTMLElement)
  }
}

// 模板中：
<li v-for="item in list" :ref="setItemRef">
// 每个 <li> 渲染时都会调用 setItemRef
// itemRefs.value 最终包含所有 <li> 元素`

// ====================================================================
// 3. 获取组件实例
// ====================================================================
// 核心思想：ref 用在组件上，获取的是组件实例（默认只能访问暴露的属性）
//
// 类比：组件 ref 就像"遥控器"🎮
//   通过 ref 拿到子组件的"遥控器"
//   子组件用 defineExpose 决定哪些按钮可以按

const childRef = ref<InstanceType<typeof ChildComponent> | null>(null)

function callChildMethod() {
  childRef.value?.publicMethod()
  alert('子组件暴露的数据: ' + childRef.value?.exposedData)
}

const componentRefCode = `// ref 获取组件实例
const childRef = ref<InstanceType<typeof ChildComponent> | null>(null)

// 模板中：
<ChildComponent ref="childRef" />

// 子组件需要用 defineExpose 暴露才能访问：
// ChildComponent.vue 中：
defineExpose({
  publicMethod,
  exposedData,
})

// 然后父组件可以：
childRef.value?.publicMethod()      // 调用子组件方法
childRef.value?.exposedData         // 访问子组件数据

// ⚠️ 注意：<script setup> 默认是封闭的
// 不 defineExpose 的话什么都访问不到`
</script>

<template>
  <div class="demo-page">
    <h1 class="page-title">🔗 模板引用</h1>
    <p class="page-subtitle">ref — 直接访问 DOM 元素或组件实例</p>

    <!-- ==================== 前置说明 ==================== -->
    <section class="demo-section intro-section">
      <h2>📖 什么是模板引用？</h2>
      <div class="explain-box">
        <p>
          <strong>一句话解释：</strong><code>ref</code> 属性让你
          <em>在 JS 中直接拿到模板中 DOM 元素或组件实例的引用</em>。
        </p>

        <div class="key-points">
          <p>🔑 <strong>核心要点：</strong></p>
          <ul>
            <li>模板中 <code>ref="xxx"</code>，脚本中 <code>const xxx = ref(null)</code>——名字要一致</li>
            <li><strong>onMounted 之后</strong>才能访问（组件挂载完毕前是 null）</li>
            <li>v-for 中需要用<strong>函数形式的 ref</strong>来收集多个元素</li>
            <li>组件 ref 只能访问子组件 <strong>defineExpose</strong> 暴露的内容</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 1. 获取 DOM 元素 -->
    <section class="demo-section">
      <h2>1. 获取 DOM 元素 — ref 属性</h2>
      <p class="section-desc">模板中用 <code>ref="xxx"</code> 标记元素，脚本中用同名 <code>ref</code> 变量接收。</p>
      <pre class="code-block">{{ domRefCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <input ref="inputRef" type="text" class="demo-input" placeholder="自动聚焦的输入框" />
        </div>
        <div class="action-box">
          <button @click="focusInput" class="demo-btn">手动聚焦</button>
        </div>
      </div>
      <p class="hint">💡 页面加载时自动聚焦，也可点击按钮手动聚焦——通过 <code>inputRef.value?.focus()</code> 实现。</p>
    </section>

    <!-- 2. v-for 中的模板引用 -->
    <section class="demo-section">
      <h2>2. v-for 中的模板引用 — 函数形式</h2>
      <p class="section-desc">v-for 中需要用函数形式的 <code>:ref</code> 来收集多个元素。</p>
      <pre class="code-block">{{ vforRefCode }}</pre>
      <ul class="ref-list">
        <li v-for="item in list" :key="item.id" :ref="setItemRef">
          {{ item.name }}
        </li>
      </ul>
      <button @click="highlightItems" class="demo-btn">高亮所有列表项（1秒）</button>
      <p class="hint">💡 点击按钮，通过 <code>itemRefs</code> 数组操作所有列表项的样式。</p>
    </section>

    <!-- 3. 获取组件实例 -->
    <section class="demo-section">
      <h2>3. 获取组件实例 — defineExpose</h2>
      <p class="section-desc">子组件通过 <code>defineExpose</code> 决定哪些内容可以被父组件访问。</p>
      <pre class="code-block">{{ componentRefCode }}</pre>
      <ChildComponent ref="childRef" />
      <button @click="callChildMethod" class="demo-btn" style="margin-top: 12px">调用子组件方法</button>
      <p class="hint">
        💡 子组件通过 <code>defineExpose</code> 暴露了 <code>publicMethod</code> 和 <code>exposedData</code>。
      </p>
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
  border-left: 4px solid #f5222d;
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

.demo-input {
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  width: 260px;
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
  border-color: #f5222d;
  color: #f5222d;
  background: #fff2f0;
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

/* ===== ref 列表 ===== */
.ref-list {
  margin: 4px 0;
  padding-left: 20px;
}

.ref-list li {
  padding: 8px 12px;
  margin: 4px 0;
  border-radius: 4px;
  transition: background 0.3s;
  border: 1px solid #e8e8e8;
  background: #fff;
}
</style>
