<script setup lang="ts">
import { ref, reactive, watch, watchEffect } from 'vue'

// ====================================================================
// 1. watch() — 搜索防抖示例
// ====================================================================
// 核心思想：明确指定侦听目标，变化时执行副作用（如 API 请求）
//
// 类比：watch 就像"安保监控"👀
//   你指定要盯着谁（明确指定源）
//   他一旦有变化，你就采取行动（执行回调）
//   你还能知道他从什么状态变成了什么状态（可获取新旧值）

const keyword = ref('')
const results = ref<string[]>([])
const allData = ['Apple', 'Banana', 'Orange', 'Grape', 'Watermelon']

watch(keyword, (newVal, oldVal) => {
  console.log(`keyword 从 "${oldVal}" 变为 "${newVal}"`)
  results.value = allData.filter((item) => item.toLowerCase().includes(newVal.toLowerCase()))
})

const watchBasicCode = `// watch(源, 回调)：明确指定侦听谁，可获取新旧值
const keyword = ref('')
const results = ref<string[]>([])

watch(keyword, (newVal, oldVal) => {
  console.log(\`keyword: "\${oldVal}" → "\${newVal}"\`)
  // 执行搜索逻辑...
  results.value = allData.filter(item =>
    item.toLowerCase().includes(newVal.toLowerCase())
  )
})

// watch 默认是惰性的：首次不会执行
// 加 { immediate: true } 可让回调立即执行一次
// watch(keyword, callback, { immediate: true })`

// ====================================================================
// 2. 监听多个数据源
// ====================================================================
// 核心思想：用一个 watch 同时监听多个值，任一变化都触发
//
// 类比：就像"多屏监控"📺
//   同时盯着姓和名两个屏幕
//   任何一个屏幕画面变了，都会触发警报

const firstName = ref('张')
const lastName = ref('三')
const watchLog = ref<string[]>([])

watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  const msg = `姓名从 "${oldFirst} ${oldLast}" 变为 "${newFirst} ${newLast}"`
  watchLog.value.unshift(msg)
  if (watchLog.value.length > 8) watchLog.value.pop()
})

const multiWatchCode = `// 监听多个源：传入数组，回调参数也是数组
watch(
  [firstName, lastName],                    // 源数组
  ([newFirst, newLast], [oldFirst, oldLast]) => {  // 新值数组 + 旧值数组
    console.log(\`姓名: "\${oldFirst} \${oldLast}" → "\${newFirst} \${newLast}"\`)
  }
)

// 任一源变化都会触发回调
// firstName 变化 → 触发
// lastName 变化  → 触发
// 两个同时变    → 只触发一次`

// ====================================================================
// 3. 监听 reactive 对象
// ====================================================================
// 核心思想：监听 reactive 对象的属性必须用 getter 函数
//
// 重要！watch 不能直接传 reactive 的属性值：
//   watch(state.count, ...)     ❌ 错误！传的是值，不是引用
//   watch(() => state.count, ...) ✅ 正确！传 getter 函数

const state = reactive({ count: 0, name: 'test' })

watch(
  () => state.count,
  (newVal, oldVal) => {
    console.log(`state.count 从 ${oldVal} 变为 ${newVal}`)
  },
)

const reactiveWatchCode = `// ===== 监听 reactive 对象 =====
const state = reactive({ count: 0, name: 'test' })

// ❌ 错误：直接传值，watch 无法追踪
// watch(state.count, (newVal) => { ... })

// ✅ 正确：用 getter 函数
watch(
  () => state.count,       // getter 函数
  (newVal, oldVal) => { ... }
)

// ✅ 监听整个 reactive 对象（深度监听默认开启）
watch(state, (newState) => {
  console.log('state 中任何属性变化都会触发')
})

// ✅ 监听多个 reactive 属性
watch(
  [() => state.count, () => state.name],
  ([newCount, newName], [oldCount, oldName]) => { ... }
)`

// ====================================================================
// 4. watchEffect() — 自动追踪
// ====================================================================
// 核心思想：不用指定侦听谁，函数里用了谁就自动侦听谁
//
// 类比：watchEffect 就像"智能管家"🤖
//   你不需要告诉他"盯着 count"
//   你只需写"我要知道 count × 2"
//   他会自动发现你用了 count，然后自动盯着它

const effectCount = ref(0)
const effectMsg = ref('')
let effectCallCount = 0

watchEffect(() => {
  effectCallCount++
  effectMsg.value = `count 当前值为：${effectCount.value}（第 ${effectCallCount} 次执行）`
})

const watchEffectCode = `// watchEffect：自动追踪依赖，立即执行一次
watchEffect(() => {
  // 函数里用了 effectCount.value
  // → watchEffect 自动追踪 effectCount 作为依赖
  // → effectCount 变化时自动重新执行
  console.log(effectCount.value)
})

// ===== watchEffect 三大特点 =====
// 1. 立即执行：创建时马上运行一次
// 2. 自动追踪：不需要手动指定依赖
// 3. 无法获取旧值：回调参数没有 oldVal

// ===== 停止侦听 =====
const stop = watchEffect(() => { ... })
stop()  // 手动停止侦听`

// ====================================================================
// 5. watch vs watchEffect 对比
// ====================================================================
const compareCode = `// ===== watch =====
watch(source, (newVal, oldVal) => {
  // ✅ 明确指定侦听目标
  // ✅ 可获取新旧值
  // ✅ 惰性执行（默认不立即执行）
  // ✅ 可配置 immediate/deep/once
})

// ===== watchEffect =====
watchEffect(() => {
  // ✅ 自动追踪依赖（不用指定源）
  // ✅ 立即执行一次
  // ❌ 无法获取旧值
  // ✅ 返回 stop 函数可停止侦听
})

// ===== 选择建议 =====
// 用 computed：需要派生一个值用于模板
// 用 watch：   需要精确控制监听源 / 需要新旧值
// 用 watchEffect：简单副作用，让 Vue 自动追踪`
</script>

<template>
  <div class="demo-page">
    <h1 class="page-title">👀 侦听器</h1>
    <p class="page-subtitle">watch / watchEffect — 数据变化时自动执行副作用</p>

    <!-- ==================== 前置说明 ==================== -->
    <section class="demo-section intro-section">
      <h2>📖 什么是侦听器？什么时候用它？</h2>
      <div class="explain-box">
        <p><strong>一句话解释：</strong>侦听器让你在<em>数据变化时自动执行操作</em>（如发请求、存数据、操作 DOM）。</p>

        <h3>为什么需要侦听器？🤔</h3>
        <pre class="code-block">
// 没有侦听器：手动在每次数据变化后调用操作
function changeKeyword(val) {
  keyword.value = val
  searchAPI(val)      // 每次都要手动调用！
  saveToLocal(val)     // 容易遗漏！
  updateLog(val)       // 代码散落各处！
}

// 有了侦听器：数据变化自动触发
watch(keyword, (val) => {
  searchAPI(val)       // 自动执行！
  saveToLocal(val)     // 自动执行！
  updateLog(val)       // 自动执行！
})</pre
        >

        <div class="key-points">
          <p>🔑 <strong>核心要点：</strong></p>
          <ul>
            <li><code>watch</code>：明确指定侦听目标，可获取新旧值，默认惰性执行</li>
            <li><code>watchEffect</code>：自动追踪依赖，立即执行一次，无法获取旧值</li>
            <li>侦听 <code>reactive</code> 属性<strong>必须用 getter 函数</strong></li>
            <li>用 <code>computed</code> 派生值，用 <code>watch</code> 执行副作用——各司其职</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 1. watch() 基本用法 -->
    <section class="demo-section">
      <h2>1. watch() — 搜索示例</h2>
      <p class="section-desc">输入关键词 → <code>watch</code> 自动执行过滤逻辑 → 结果列表自动更新。</p>
      <pre class="code-block">{{ watchBasicCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p>
            <span class="label">关键词</span> = <code>"{{ keyword }}"</code>
          </p>
          <p>
            <span class="label">匹配结果</span> = <code>{{ results.length }} 条</code>
          </p>
          <ul class="result-list" v-if="results.length">
            <li v-for="item in results" :key="item">{{ item }}</li>
          </ul>
          <p v-else class="no-result">无匹配结果</p>
        </div>
        <div class="action-box">
          <input v-model="keyword" class="demo-input" placeholder="搜索水果..." />
        </div>
      </div>
      <p class="hint">💡 打开控制台可以看到新旧值对比日志。</p>
    </section>

    <!-- 2. 监听多个数据源 -->
    <section class="demo-section">
      <h2>2. 监听多个数据源</h2>
      <p class="section-desc">同时监听姓和名，任一变化都会触发回调——新旧值以数组形式提供。</p>
      <pre class="code-block">{{ multiWatchCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p>
            <span class="label">姓</span> = <code>{{ firstName }}</code>
          </p>
          <p>
            <span class="label">名</span> = <code>{{ lastName }}</code>
          </p>
          <p class="highlight-result">
            <span class="label">全名</span> = <code>{{ firstName }} {{ lastName }}</code>
          </p>
        </div>
        <div class="action-box">
          <label class="input-label">姓：<input v-model="firstName" class="demo-input" /></label>
          <label class="input-label">名：<input v-model="lastName" class="demo-input" /></label>
        </div>
      </div>
      <div class="log-area" v-if="watchLog.length">
        <p class="log-title">📋 变化日志（最新在前）：</p>
        <p v-for="(log, i) in watchLog" :key="i" class="log-item">{{ log }}</p>
      </div>
    </section>

    <!-- 3. watchEffect() -->
    <section class="demo-section">
      <h2>3. watchEffect() — 自动追踪</h2>
      <p class="section-desc">不用指定侦听谁，函数里用了谁就自动侦听谁。立即执行一次，之后依赖变化再执行。</p>
      <pre class="code-block">{{ watchEffectCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p class="highlight-result">
            <span class="label">watchEffect 结果</span> = <code>{{ effectMsg }}</code>
          </p>
        </div>
        <div class="action-box">
          <button @click="effectCount++" class="demo-btn">effectCount++</button>
        </div>
      </div>
      <p class="hint">💡 <code>watchEffect</code> 初始化时立即执行了一次（第 1 次），每次点击按钮会再执行。</p>
    </section>

    <!-- 4. 监听 reactive 对象 -->
    <section class="demo-section">
      <h2>4. 监听 reactive 对象属性</h2>
      <p class="section-desc">
        <strong>重要！</strong>不能直接传 <code>state.count</code>，必须用 <code>() => state.count</code> getter 函数。
      </p>
      <pre class="code-block">{{ reactiveWatchCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p>
            <span class="label">state.count</span> = <code>{{ state.count }}</code>
          </p>
          <p>
            <span class="label">state.name</span> = <code>{{ state.name }}</code>
          </p>
        </div>
        <div class="action-box">
          <button @click="state.count++" class="demo-btn">state.count++</button>
          <button @click="state.name = state.name === 'test' ? 'hello' : 'test'" class="demo-btn">
            切换 state.name
          </button>
        </div>
      </div>
      <p class="hint">
        💡 打开控制台查看 <code>state.count</code> 变化日志。注意 <code>state.name</code> 没有 watch，所以不会打印。
      </p>
    </section>

    <!-- 5. 对比总结 -->
    <section class="demo-section">
      <h2>5. watch vs watchEffect 对比</h2>
      <pre class="code-block">{{ compareCode }}</pre>
    </section>

    <!-- ==================== 速查表 ==================== -->
    <section class="demo-section summary-section">
      <h2>📋 侦听器知识速查表</h2>
      <table class="summary-table">
        <thead>
          <tr>
            <th>特性</th>
            <th>watch</th>
            <th>watchEffect</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>依赖追踪</td>
            <td>手动指定源</td>
            <td>自动追踪</td>
          </tr>
          <tr>
            <td>首次执行</td>
            <td>默认不执行（可设 immediate）</td>
            <td>立即执行一次</td>
          </tr>
          <tr>
            <td>获取旧值</td>
            <td>✅ 可获取</td>
            <td>❌ 不可获取</td>
          </tr>
          <tr>
            <td>停止侦听</td>
            <td>组件卸载时自动停止</td>
            <td>返回 stop 函数可手动停止</td>
          </tr>
          <tr>
            <td>深度监听</td>
            <td>ref 对象默认不深度（可设 deep）</td>
            <td>自动深度（用了什么追踪什么）</td>
          </tr>
          <tr>
            <td>配置选项</td>
            <td>immediate / deep / once / flush</td>
            <td>flush</td>
          </tr>
          <tr>
            <td>适用场景</td>
            <td>精确控制、需要新旧值</td>
            <td>简单副作用、自动追踪</td>
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
  border-left: 4px solid #a0d911;
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
  border-color: #a0d911;
  color: #7cb305;
  background: #fcffe6;
}

/* ===== 日志区域 ===== */
.log-area {
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: 6px;
  padding: 12px;
  min-height: 40px;
  max-height: 200px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 13px;
  margin-top: 12px;
}

.log-title {
  color: #a0d911;
  font-weight: 600;
  margin-bottom: 6px !important;
}

.log-item {
  margin: 2px 0;
  padding: 2px 0;
  border-bottom: 1px solid #333;
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
