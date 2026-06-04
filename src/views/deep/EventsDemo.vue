<script setup lang="ts">
import { ref } from 'vue'
import EventsChild from './EventsChild.vue'

const submitLog = ref<string[]>([])
const counter = ref(0)

function handleSubmit(email: string, password: string) {
  submitLog.value.unshift(
    `[${new Date().toLocaleTimeString()}] 提交：${email} / ${password}`
  )
  if (submitLog.value.length > 8) submitLog.value.pop()
}

function handleCancel() {
  submitLog.value.unshift(
    `[${new Date().toLocaleTimeString()}] 取消操作`
  )
}

function handleUpdate(val: number) {
  counter.value = val
}
</script>

<template>
  <div class="section">
    <h2>事件 深入</h2>

    <div class="result">
      <h4>子组件：</h4>
      <EventsChild
        @submit="handleSubmit"
        @cancel="handleCancel"
        @update="handleUpdate"
      />
    </div>

    <div class="panel">
      <p>计数器值：<strong>{{ counter }}</strong></p>
    </div>

    <div class="log-area">
      <h4>事件日志：</h4>
      <p v-for="(log, i) in submitLog" :key="i" class="log-item">{{ log }}</p>
      <p v-if="submitLog.length === 0" class="hint">点击子组件按钮查看日志</p>
    </div>

    <div class="info">
      <h4>事件要点：</h4>
      <ul>
        <li><code>defineEmits(['event1', 'event2'])</code> 声明事件</li>
        <li><code>defineEmits({ event: (arg) => boolean })</code> 运行时校验</li>
        <li>父组件用 <code>@event="handler"</code> 监听</li>
        <li>用 <code>$event</code> 或回调参数获取子组件传递的数据</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #722ed1;
}

h2 { margin: 0 0 16px 0; color: #333; }
h4 { margin: 0 0 8px 0; color: #555; }

.panel {
  background: #fff;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 12px 0;
  border: 1px solid #f0f0f0;
}

.result {
  background: #fffbe6;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #ffe58f;
}

.log-area {
  background: #1e1e1e;
  color: #a0d911;
  border-radius: 6px;
  padding: 12px;
  min-height: 40px;
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

.hint { color: #999; font-size: 13px; }

.info {
  background: #f9f0ff;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #555;
  margin-top: 12px;
}

.info ul { margin: 4px 0; padding-left: 20px; }
.info li { margin: 4px 0; }
.info code {
  background: #efdbff;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
  color: #722ed1;
}
</style>
