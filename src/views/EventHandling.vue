<script setup lang="ts">
import { ref } from 'vue'

// ====== 基本事件 ======
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

// ====== 事件修饰符 ======
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
</script>

<template>
  <div class="demo-page">
    <h1>事件处理</h1>

    <!-- 1. 基本事件 -->
    <section class="demo-section">
      <h2>1. 基本用法</h2>
      <p>计数：{{ count }}</p>
      <button @click="count++">内联语句：count++</button>
      <button @click="handleClick" style="margin-left: 8px">调用方法</button>
      <button @click="say('Hello Vue 3!')" style="margin-left: 8px">传入参数</button>
      <button @click="handleEvent($event)" style="margin-left: 8px">获取 $event</button>
      <button @click="warn('警告信息', $event)" style="margin-left: 8px">$event + 参数</button>
    </section>

    <!-- 2. 事件修饰符 -->
    <section class="demo-section">
      <h2>2. 事件修饰符</h2>

      <!-- .prevent -->
      <a @click.prevent="addLog('阻止默认行为 (.prevent)')" href="https://example.com">
        阻止跳转 (.prevent)
      </a>

      <!-- .stop -->
      <div class="parent-box" @click="handleParentLog">
        父元素区域
        <button @click.stop="handleChildLog">阻止冒泡 (.stop)</button>
      </div>

      <!-- .once -->
      <button @click.once="handleOnceLog" style="margin-right: 8px">只触发一次 (.once)</button>

      <!-- .self -->
      <div class="self-box" @click.self="handleSelfLog">
        只有点击自身才触发 (.self)
        <button>点击我不会触发父元素</button>
      </div>

      <!-- 串联修饰符 -->
      <a @click.stop.prevent="addLog('阻止冒泡 + 阻止默认')" href="#">
        串联修饰符 (.stop.prevent)
      </a>
    </section>

    <!-- 3. 按键修饰符 -->
    <section class="demo-section">
      <h2>3. 按键修饰符</h2>
      <p>
        <input @keyup.enter="addLog('按下了 Enter')" placeholder="按回车键触发" />
      </p>
      <p>
        <input @keyup.esc="addLog('按下了 Esc')" placeholder="按 Esc 触发" />
      </p>
      <p class="hint">常用：.enter .tab .delete .esc .space .up .down .left .right</p>
    </section>

    <!-- 事件日志 -->
    <section class="demo-section">
      <h2>事件日志</h2>
      <div class="log-area">
        <p v-for="(log, i) in eventLog" :key="i" class="log-item">{{ log }}</p>
        <p v-if="eventLog.length === 0" class="hint">暂无日志</p>
      </div>
      <button @click="eventLog = []">清空日志</button>
    </section>
  </div>
</template>

<style scoped>
.demo-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.demo-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #2f54eb;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
}

button {
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  margin: 4px 0;
}

button:hover {
  border-color: #2f54eb;
  color: #2f54eb;
}

input {
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  width: 240px;
}

a {
  display: inline-block;
  margin: 4px 8px 4px 0;
  color: #2f54eb;
}

.parent-box {
  padding: 16px;
  background: #f0f5ff;
  border: 1px solid #adc6ff;
  border-radius: 6px;
  margin: 8px 0;
}

.self-box {
  padding: 16px;
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 6px;
  margin: 8px 0;
}

.hint {
  color: #999;
  font-size: 13px;
}

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
  margin: 8px 0;
}

.log-item {
  margin: 2px 0;
  padding: 2px 0;
  border-bottom: 1px solid #333;
}
</style>
