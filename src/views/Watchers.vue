<script setup lang="ts">
import { ref, reactive, watch, watchEffect } from 'vue'

// ====== watch() 基本用法 ======
const keyword = ref('')
const results = ref<string[]>([])
const allData = ['Apple', 'Banana', 'Orange', 'Grape', 'Watermelon']

watch(keyword, (newVal, oldVal) => {
  console.log(`keyword 从 "${oldVal}" 变为 "${newVal}"`)
  results.value = allData.filter((item) => item.toLowerCase().includes(newVal.toLowerCase()))
})

// ====== 监听多个数据源 ======
const firstName = ref('张')
const lastName = ref('三')
const watchLog = ref<string[]>([])

watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  const msg = `姓名从 "${oldFirst} ${oldLast}" 变为 "${newFirst} ${newLast}"`
  watchLog.value.unshift(msg)
  if (watchLog.value.length > 8) watchLog.value.pop()
})

// ====== 监听 reactive 对象 ======
const state = reactive({ count: 0, name: 'test' })

watch(
  () => state.count,
  (newVal, oldVal) => {
    console.log(`state.count 从 ${oldVal} 变为 ${newVal}`)
  },
)

// ====== watchEffect() ======
const effectCount = ref(0)
const effectMsg = ref('')
let effectCallCount = 0

watchEffect(() => {
  effectCallCount++
  effectMsg.value = `count 当前值为：${effectCount.value}（第 ${effectCallCount} 次执行）`
})
</script>

<template>
  <div class="demo-page">
    <h1>侦听器</h1>

    <!-- 1. watch() 基本用法 -->
    <section class="demo-section">
      <h2>1. watch() - 搜索示例</h2>
      <input v-model="keyword" placeholder="搜索水果..." />
      <p>结果数量：{{ results.length }}</p>
      <ul>
        <li v-for="item in results" :key="item">{{ item }}</li>
      </ul>
    </section>

    <!-- 2. 监听多个数据源 -->
    <section class="demo-section">
      <h2>2. 监听多个数据源</h2>
      <p>姓：<input v-model="firstName" /></p>
      <p>名：<input v-model="lastName" /></p>
      <p>全名：{{ firstName }} {{ lastName }}</p>

      <h4>变化日志：</h4>
      <div class="log-area">
        <p v-for="(log, i) in watchLog" :key="i" class="log-item">{{ log }}</p>
        <p v-if="watchLog.length === 0" class="hint">修改姓名查看日志</p>
      </div>
    </section>

    <!-- 3. watchEffect() -->
    <section class="demo-section">
      <h2>3. watchEffect() - 自动追踪</h2>
      <p>{{ effectMsg }}</p>
      <button @click="effectCount++">+1</button>
      <p class="hint">watchEffect 初始化时立即执行，并自动追踪依赖</p>
    </section>

    <!-- 4. watch vs watchEffect -->
    <section class="demo-section">
      <h2>4. watch vs watchEffect 对比</h2>
      <table class="compare-table">
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
            <td>手动指定</td>
            <td>自动追踪</td>
          </tr>
          <tr>
            <td>初始执行</td>
            <td>默认不执行</td>
            <td>默认立即执行</td>
          </tr>
          <tr>
            <td>新旧值</td>
            <td>✅ 可获取</td>
            <td>❌ 不提供</td>
          </tr>
          <tr>
            <td>使用场景</td>
            <td>需要精确控制监听源</td>
            <td>简单副作用</td>
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
  border-left: 4px solid #a0d911;
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

input {
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;
  margin: 4px 0;
}

ul {
  margin: 4px 0;
  padding-left: 20px;
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
  border-color: #a0d911;
  color: #7cb305;
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
  min-height: 40px;
  max-height: 160px;
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
</style>
