<script setup lang="ts">
import { ref } from 'vue'

// ====================================================================
// 1. 基本事件处理
// ====================================================================
// 核心思想：v-on（简写 @）监听 DOM 事件，触发时执行 JS 代码
//
// 类比：v-on 就像"事件接线员"📞
//   告诉 Vue："当这个按钮被点击时，帮我执行这段代码"
//   可以执行内联语句、调用方法、传递参数、获取事件对象

const count = ref(0)

function handleClick() {
  alert('按钮被点击！')
}

function say(message: string) {
  alert(message)
}

function handleEvent(event: MouseEvent) {
  alert(`事件类型: ${event.type}\n坐标: (${event.clientX}, ${event.clientY})`)
}

function warn(message: string, event: Event) {
  event.preventDefault()
  alert(message)
}

const basicEventCode = `// v-on:event="handler" 或简写 @event="handler"

// 1. 内联语句
<button @click="count++">+1</button>

// 2. 调用方法（无参数）
<button @click="handleClick">点击</button>

// 3. 传入参数
<button @click="say('Hello')">打招呼</button>

// 4. 获取原生事件对象 $event
<button @click="handleEvent($event)">获取事件</button>

// 5. $event + 自定义参数
<button @click="warn('警告', $event)">警告</button>`

// ====================================================================
// 2. 事件修饰符
// ====================================================================
// 核心思想：用 .修饰符 简化常见的 DOM 事件处理模式
//
// 类比：事件修饰符就像"快捷开关"🔘
//   不用在方法里写 event.preventDefault()
//   直接在模板上加 .prevent 就行

const eventLog = ref<string[]>([])

function addLog(msg: string) {
  eventLog.value.unshift(msg)
  if (eventLog.value.length > 10) eventLog.value.pop()
}

function handleParentLog() {
  addLog('父元素被点击')
}
function handleChildLog() {
  addLog('子元素被点击（.stop 阻止冒泡）')
}
function handleOnceLog() {
  addLog('只触发一次！')
}
function handleCaptureLog() {
  addLog('捕获模式')
}
function handleSelfLog() {
  addLog('自身被点击（.self）')
}

const modifierCode = `// 事件修饰符：简化常见 DOM 事件操作

// .prevent → event.preventDefault() 阻止默认行为
<a @click.prevent="onClick" href="/">不跳转</a>

// .stop → event.stopPropagation() 阻止冒泡
<button @click.stop="onClick">不冒泡</button>

// .once → 只触发一次
<button @click.once="onClick">点一次就失效</button>

// .self → 只有点击自身才触发（不响应子元素冒泡）
<div @click.self="onClick">...</div>

// .capture → 捕获模式（从外到内触发）
<div @click.capture="onClick">...</div>

// 可以串联多个修饰符
<a @click.stop.prevent="onClick">阻止冒泡 + 阻止默认</a>`

// ====================================================================
// 3. 按键修饰符
// ====================================================================
const keyModifierCode = `// 按键修饰符：监听特定按键
<input @keyup.enter="submit" />       // Enter
<input @keyup.esc="cancel" />         // Esc
<input @keyup.delete="clear" />       // Delete / Backspace

// 常用按键别名：
// .enter  .tab  .delete  .esc  .space
// .up  .down  .left  .right

// 系统修饰键：
// .ctrl  .alt  .shift  .meta
<input @keyup.ctrl.enter="submit" />  // Ctrl + Enter

// 鼠标修饰符：
// .left  .right  .middle
<button @click.right="onRightClick">右键</button>`
</script>

<template>
  <div class="demo-page">
    <h1 class="page-title">🖱️ 事件处理</h1>
    <p class="page-subtitle">v-on / @ — 监听 DOM 事件，响应用户交互</p>

    <!-- ==================== 前置说明 ==================== -->
    <section class="demo-section intro-section">
      <h2>📖 什么是事件处理？</h2>
      <div class="explain-box">
        <p>
          <strong>一句话解释：</strong><code>v-on</code>（简写 <code>@</code>）让你<em
            >在 HTML 中直接绑定事件处理函数</em
          >，告别 <code>addEventListener</code>。
        </p>

        <div class="key-points">
          <p>🔑 <strong>核心要点：</strong></p>
          <ul>
            <li><code>@click="handler"</code> 是最常用的事件绑定方式</li>
            <li>
              <strong>事件修饰符</strong>：<code>.prevent</code> <code>.stop</code> <code>.once</code>
              <code>.self</code> 简化常见操作
            </li>
            <li>
              <strong>按键修饰符</strong>：<code>.enter</code> <code>.esc</code> <code>.delete</code> 等，响应特定按键
            </li>
            <li><code>$event</code> 是原生 DOM 事件对象，可传给方法</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 1. 基本事件 -->
    <section class="demo-section">
      <h2>1. 基本用法 — @click 等</h2>
      <p class="section-desc">内联语句、调用方法、传参、获取 <code>$event</code>——五种常见用法。</p>
      <pre class="code-block">{{ basicEventCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p>
            <span class="label">计数</span> = <code>{{ count }}</code>
          </p>
        </div>
        <div class="action-box">
          <button @click="count++" class="demo-btn">内联语句：count++</button>
          <button @click="handleClick" class="demo-btn">调用方法</button>
          <button @click="say('Hello Vue 3!')" class="demo-btn">传入参数</button>
          <button @click="handleEvent($event)" class="demo-btn">获取 $event</button>
          <button @click="warn('警告信息', $event)" class="demo-btn">$event + 参数</button>
        </div>
      </div>
    </section>

    <!-- 2. 事件修饰符 -->
    <section class="demo-section">
      <h2>2. 事件修饰符</h2>
      <p class="section-desc">
        用 <code>.修饰符</code> 简化 <code>preventDefault()</code>、<code>stopPropagation()</code> 等常见操作。
      </p>
      <pre class="code-block">{{ modifierCode }}</pre>
      <div class="modifier-demos">
        <div class="modifier-item">
          <a @click.prevent="addLog('阻止默认行为 (.prevent)')" href="https://example.com" class="demo-link">
            🔗 阻止跳转 (.prevent)
          </a>
        </div>
        <div class="modifier-item">
          <div class="parent-box" @click="handleParentLog">
            父元素区域（点击背景会触发）
            <button @click.stop="handleChildLog" class="demo-btn">阻止冒泡 (.stop)</button>
          </div>
        </div>
        <div class="modifier-item">
          <button @click.once="handleOnceLog" class="demo-btn">只触发一次 (.once)</button>
        </div>
        <div class="modifier-item">
          <div class="self-box" @click.self="handleSelfLog">
            只有点击自身才触发 (.self)
            <button class="demo-btn">点击我不会触发父元素</button>
          </div>
        </div>
        <div class="modifier-item">
          <a @click.stop.prevent="addLog('阻止冒泡 + 阻止默认')" href="#" class="demo-link">
            🔗 串联修饰符 (.stop.prevent)
          </a>
        </div>
      </div>
    </section>

    <!-- 3. 按键修饰符 -->
    <section class="demo-section">
      <h2>3. 按键修饰符</h2>
      <p class="section-desc">监听特定按键触发事件，如 Enter 提交、Esc 取消。</p>
      <pre class="code-block">{{ keyModifierCode }}</pre>
      <div class="demo-row">
        <div class="action-box" style="width: 100%">
          <input @keyup.enter="addLog('按下了 Enter')" class="demo-input wide" placeholder="按回车键触发 .enter" />
          <input @keyup.esc="addLog('按下了 Esc')" class="demo-input wide" placeholder="按 Esc 触发 .esc" />
        </div>
      </div>
      <p class="hint">常用按键：.enter .tab .delete .esc .space .up .down .left .right</p>
    </section>

    <!-- 事件日志 -->
    <section class="demo-section">
      <h2>📋 事件日志</h2>
      <div class="log-area">
        <p v-for="(log, i) in eventLog" :key="i" class="log-item">{{ log }}</p>
        <p v-if="eventLog.length === 0" class="log-empty">暂无日志，点击上方按钮试试</p>
      </div>
      <button @click="eventLog = []" class="demo-btn" style="margin-top: 8px">清空日志</button>
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
  border-left: 4px solid #2f54eb;
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
  margin: 5px 0;
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

/* ===== 修饰符演示 ===== */
.modifier-demos {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modifier-item {
  margin: 4px 0;
}

.parent-box {
  padding: 16px;
  background: #f0f5ff;
  border: 1px solid #adc6ff;
  border-radius: 6px;
}

.self-box {
  padding: 16px;
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 6px;
}

.demo-link {
  display: inline-block;
  color: #2f54eb;
  text-decoration: none;
  font-size: 14px;
}

.demo-link:hover {
  text-decoration: underline;
}

/* ===== 操作按钮区 ===== */
.action-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 180px;
}

.demo-input {
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  width: 240px;
}

.demo-input.wide {
  width: 100%;
  max-width: 400px;
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
  border-color: #2f54eb;
  color: #2f54eb;
  background: #f0f5ff;
}

/* ===== 日志区域 ===== */
.log-area {
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: 6px;
  padding: 12px;
  min-height: 60px;
  max-height: 200px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 13px;
}

.log-item {
  margin: 2px 0;
  padding: 2px 0;
  border-bottom: 1px solid #333;
}

.log-empty {
  color: #666;
  font-style: italic;
}
</style>
