<script setup lang="ts">
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from 'vue'

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

// ====== 实战：定时器 + 事件监听 ======
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
</script>

<template>
  <div class="demo-page">
    <h1>生命周期</h1>

    <!-- 1. 常用生命周期钩子 -->
    <section class="demo-section">
      <h2>1. 常用生命周期钩子</h2>
      <p>计数：<strong>{{ count }}</strong></p>
      <button @click="count++">+1（触发 beforeUpdate / updated）</button>

      <h4>生命周期日志：</h4>
      <div class="log-area">
        <p v-for="(log, i) in lifecycleLog" :key="i" class="log-item">{{ log }}</p>
      </div>
    </section>

    <!-- 2. 实战示例 -->
    <section class="demo-section">
      <h2>2. 实战示例（定时器 + 事件监听）</h2>
      <div class="info-card">
        <div class="info-item">
          <span class="label">当前时间：</span>
          <span class="value">{{ currentTime }}</span>
        </div>
        <div class="info-item">
          <span class="label">窗口大小：</span>
          <span class="value">{{ windowWidth }} × {{ windowHeight }}</span>
        </div>
      </div>
      <p class="hint">定时器在 onMounted 启动，窗口大小监听 resize 事件</p>
      <p class="hint">离开页面时 onBeforeUnmount 会清理定时器和事件监听</p>
    </section>

    <!-- 3. 生命周期一览表 -->
    <section class="demo-section">
      <h2>3. 生命周期钩子一览</h2>
      <table class="compare-table">
        <thead>
          <tr>
            <th>钩子函数</th>
            <th>说明</th>
            <th>常用场景</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>onBeforeMount</code></td>
            <td>挂载前</td>
            <td>很少使用</td>
          </tr>
          <tr>
            <td><code>onMounted</code></td>
            <td>挂载后</td>
            <td>API 请求、初始化、DOM 操作</td>
          </tr>
          <tr>
            <td><code>onBeforeUpdate</code></td>
            <td>更新前</td>
            <td>更新前的状态记录</td>
          </tr>
          <tr>
            <td><code>onUpdated</code></td>
            <td>更新后</td>
            <td>DOM 更新后的操作</td>
          </tr>
          <tr>
            <td><code>onBeforeUnmount</code></td>
            <td>卸载前</td>
            <td>清理定时器、取消订阅</td>
          </tr>
          <tr>
            <td><code>onUnmounted</code></td>
            <td>卸载后</td>
            <td>组件销毁后的收尾</td>
          </tr>
          <tr>
            <td><code>onActivated</code></td>
            <td>keep-alive 激活</td>
            <td>缓存组件激活时刷新数据</td>
          </tr>
          <tr>
            <td><code>onDeactivated</code></td>
            <td>keep-alive 失活</td>
            <td>缓存组件失活时保存状态</td>
          </tr>
        </tbody>
      </table>
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
  border-left: 4px solid #597ef7;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
}

.demo-section h4 {
  margin: 12px 0 4px 0;
  color: #666;
}

button {
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
}

button:hover {
  border-color: #597ef7;
  color: #597ef7;
}

.log-area {
  background: #1e1e1e;
  color: #a0d911;
  border-radius: 6px;
  padding: 12px;
  min-height: 100px;
  max-height: 280px;
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

.hint {
  color: #999;
  font-size: 13px;
  margin-top: 4px;
}

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

.label {
  color: #666;
}

.value {
  font-weight: bold;
  color: #1890ff;
  font-size: 18px;
  font-family: monospace;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0;
}

.compare-table th,
.compare-table td {
  border: 1px solid #e8e8e8;
  padding: 8px 12px;
  text-align: left;
  font-size: 14px;
}

.compare-table th {
  background: #fafafa;
  font-weight: bold;
}

.compare-table code {
  background: #f0f5ff;
  padding: 2px 6px;
  border-radius: 3px;
  color: #2f54eb;
  font-size: 13px;
}
</style>
