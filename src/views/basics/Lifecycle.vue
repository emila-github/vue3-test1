<script setup lang="ts">
import { ref, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted } from 'vue'

// ====================================================================
// 1. 常用生命周期钩子
// ====================================================================
// 核心思想：Vue 组件从创建到销毁会经历一系列"生命周期"，每个阶段有对应的钩子函数
//
// 类比：生命周期就像"人的一生"👶→👦→👨→👴
//   onBeforeMount  → 出生前（组件即将挂载）
//   onMounted      → 出生了（组件已挂载，可以操作 DOM）
//   onBeforeUpdate → 长身体（数据变了，即将更新 DOM）
//   onUpdated      → 长好了（DOM 已更新）
//   onBeforeUnmount→ 临终前（组件即将卸载，清理资源）
//   onUnmounted    → 去世了（组件已销毁）

const count = ref(0)
const lifecycleLog = ref<string[]>([])

function addLog(msg: string) {
  lifecycleLog.value.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`)
  if (lifecycleLog.value.length > 15) lifecycleLog.value.pop()
}

onBeforeMount(() => addLog('onBeforeMount: 组件即将挂载'))
onMounted(() => addLog('onMounted: 组件已挂载 ✅'))
onBeforeUpdate(() => addLog(`onBeforeUpdate: 数据已变化(${count.value})，DOM 即将更新`))
onUpdated(() => addLog(`onUpdated: DOM 已更新(${count.value}) ✅`))
onBeforeUnmount(() => addLog('onBeforeUnmount: 组件即将卸载'))
onUnmounted(() => addLog('onUnmounted: 组件已卸载'))

const lifecycleCode = `// ===== 最常用的 4 个生命周期钩子 =====

// 1. onMounted — 组件挂载后（最常用！）
//    用途：API 请求、初始化第三方库、操作 DOM
onMounted(() => {
  fetchData()           // 发起 API 请求
  initChart()           // 初始化图表（需要 DOM 存在）
  inputRef.value?.focus() // 自动聚焦输入框
})

// 2. onBeforeUpdate — DOM 更新前
//    用途：记录更新前的状态（较少使用）
onBeforeUpdate(() => {
  // DOM 还没更新，可以获取旧的 DOM 状态
})

// 3. onUpdated — DOM 更新后
//    用途：DOM 更新后的操作（慎用，容易死循环）
onUpdated(() => {
  // DOM 已更新，可以操作新的 DOM
})

// 4. onBeforeUnmount — 组件卸载前（很重要！）
//    用途：清理定时器、取消订阅、移除事件监听
onBeforeUnmount(() => {
  clearInterval(timer)           // 清理定时器
  window.removeEventListener()   // 移除事件监听
  unsubscribe()                  // 取消订阅
})

// 如果不清理，会导致内存泄漏！`

// ====================================================================
// 2. 实战：定时器 + 事件监听
// ====================================================================
// 核心思想：onMounted 中启动，onBeforeUnmount 中清理——这是标准模式
//
// 类比：就像"租房子"🏠
//   onMounted → 搬进去，开灯开空调
//   onBeforeUnmount → 搬走前，关灯关空调，把钥匙还回去

const currentTime = ref('')
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

let timer: ReturnType<typeof setInterval> | null = null

function handleResize() {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString()
  }, 1000)
  window.addEventListener('resize', handleResize)
  addLog('实战示例：定时器和事件监听已启动')
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  window.removeEventListener('resize', handleResize)
})

const cleanupCode = `// ===== 标准模式：onMounted 启动 + onBeforeUnmount 清理 =====

// ✅ 正确：成对使用
onMounted(() => {
  timer = setInterval(updateTime, 1000)     // 启动定时器
  window.addEventListener('resize', onResize) // 监听事件
})

onBeforeUnmount(() => {
  clearInterval(timer)                        // 清理定时器
  window.removeEventListener('resize', onResize) // 移除监听
})

// ❌ 错误：只在 onMounted 中启动，不清理
// 组件切换离开后，定时器还在跑，事件还在监听！
// 这就是内存泄漏的根源！`
</script>

<template>
  <div class="demo-page">
    <h1 class="page-title">🔄 生命周期</h1>
    <p class="page-subtitle">理解组件从创建到销毁的全过程</p>

    <!-- ==================== 前置说明 ==================== -->
    <section class="demo-section intro-section">
      <h2>📖 什么是生命周期？</h2>
      <div class="explain-box">
        <p>
          <strong>一句话解释：</strong>Vue
          组件从<em>创建→挂载→更新→销毁</em>会经历一系列阶段，每个阶段提供钩子函数让你在合适的时机执行代码。
        </p>

        <div class="key-points">
          <p>🔑 <strong>核心要点：</strong></p>
          <ul>
            <li><code>onMounted</code> 最常用：API 请求、初始化、DOM 操作都在这里</li>
            <li><code>onBeforeUnmount</code> 很重要：<strong>必须清理</strong>定时器、事件监听、订阅</li>
            <li>
              <strong>setup 阶段</strong>：相当于 <code>beforeCreate</code> + <code>created</code>，数据初始化在这里
            </li>
            <li><strong>不清理的后果</strong>：内存泄漏、重复请求、事件冲突</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 1. 常用生命周期钩子 -->
    <section class="demo-section">
      <h2>1. 最常用的 4 个钩子</h2>
      <p class="section-desc">点击 +1 按钮触发 <code>beforeUpdate</code> 和 <code>updated</code>，日志会实时显示。</p>
      <pre class="code-block">{{ lifecycleCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p>
            <span class="label">计数</span> = <code>{{ count }}</code>
          </p>
        </div>
        <div class="action-box">
          <button @click="count++" class="demo-btn">+1（触发 update 钩子）</button>
        </div>
      </div>
      <div class="log-area">
        <p v-for="(log, i) in lifecycleLog" :key="i" class="log-item">{{ log }}</p>
      </div>
    </section>

    <!-- 2. 实战示例 -->
    <section class="demo-section">
      <h2>2. 实战示例 — 定时器 + 事件监听</h2>
      <p class="section-desc">标准模式：<code>onMounted</code> 启动 → <code>onBeforeUnmount</code> 清理。缺一不可！</p>
      <pre class="code-block">{{ cleanupCode }}</pre>
      <div class="info-card">
        <div class="info-item">
          <span class="info-label">当前时间：</span>
          <span class="info-value">{{ currentTime }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">窗口大小：</span>
          <span class="info-value">{{ windowWidth }} × {{ windowHeight }}</span>
        </div>
      </div>
      <p class="hint">💡 定时器每秒更新，窗口大小实时响应。切换到其他标签页再回来——清理机制确保不会有残留的定时器。</p>
    </section>

    <!-- 3. 生命周期一览表 -->
    <section class="demo-section summary-section">
      <h2>📋 生命周期钩子速查表</h2>
      <table class="summary-table">
        <thead>
          <tr>
            <th>钩子函数</th>
            <th>阶段</th>
            <th>能访问 DOM？</th>
            <th>常用场景</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>setup()</code></td>
            <td>初始化</td>
            <td>❌</td>
            <td>定义数据、方法、computed、watch</td>
          </tr>
          <tr>
            <td><code>onBeforeMount</code></td>
            <td>挂载前</td>
            <td>❌</td>
            <td>很少使用</td>
          </tr>
          <tr>
            <td><code>onMounted</code></td>
            <td>挂载后</td>
            <td>✅</td>
            <td><strong>API 请求、初始化、DOM 操作</strong></td>
          </tr>
          <tr>
            <td><code>onBeforeUpdate</code></td>
            <td>更新前</td>
            <td>✅</td>
            <td>更新前的状态记录</td>
          </tr>
          <tr>
            <td><code>onUpdated</code></td>
            <td>更新后</td>
            <td>✅</td>
            <td>DOM 更新后的操作（慎用）</td>
          </tr>
          <tr>
            <td><code>onBeforeUnmount</code></td>
            <td>卸载前</td>
            <td>✅</td>
            <td><strong>清理定时器、取消订阅、移除监听</strong></td>
          </tr>
          <tr>
            <td><code>onUnmounted</code></td>
            <td>卸载后</td>
            <td>❌</td>
            <td>组件销毁后的收尾</td>
          </tr>
          <tr>
            <td><code>onActivated</code></td>
            <td>keep-alive 激活</td>
            <td>✅</td>
            <td>缓存组件激活时刷新数据</td>
          </tr>
          <tr>
            <td><code>onDeactivated</code></td>
            <td>keep-alive 失活</td>
            <td>✅</td>
            <td>缓存组件失活时保存状态</td>
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
  border-left: 4px solid #597ef7;
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
  border-color: #597ef7;
  color: #597ef7;
  background: #f0f5ff;
}

.hint {
  color: #999;
  font-size: 13px;
  margin-top: 10px;
}

/* ===== 日志区域 ===== */
.log-area {
  background: #1e1e1e;
  color: #a0d911;
  border-radius: 6px;
  padding: 12px;
  min-height: 100px;
  max-height: 300px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 13px;
  margin-top: 12px;
}

.log-item {
  margin: 2px 0;
  padding: 2px 0;
  border-bottom: 1px solid #333;
}

/* ===== 信息卡片 ===== */
.info-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
  border: 1px solid #e8e8e8;
}

.info-item {
  margin: 8px 0;
}

.info-label {
  color: #666;
}

.info-value {
  font-weight: bold;
  color: #1890ff;
  font-size: 18px;
  font-family: monospace;
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
  background: #f0f5ff;
  padding: 2px 6px;
  border-radius: 3px;
  color: #2f54eb;
  font-size: 13px;
  white-space: nowrap;
}

.summary-table tbody tr:hover {
  background: #f5f5f5;
}
</style>
