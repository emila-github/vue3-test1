<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMouse } from './useMouse'
import { useCounter } from './useCounter'
import { useDebouncedSearch } from './useDebouncedSearch'

// ====== 鼠标追踪 ======
const { x, y } = useMouse()

// ====== 计数器 ======
const { count, double, increment, decrement, logs } = useCounter(0)

// ====== 防抖搜索 ======
const mockItems = [
  'Apple', 'Banana', 'Cherry', 'Date', 'Grape', 'Orange', 'Peach',
  'Mango', 'Strawberry', 'Blueberry', 'Pineapple', 'Watermelon',
]

async function searchApi(keyword: string) {
  // 模拟异步搜索
  await new Promise((r) => setTimeout(r, 500))
  return mockItems.filter((i) => i.toLowerCase().includes(keyword.toLowerCase()))
}

const { keyword, results, loading: searchLoading } = useDebouncedSearch(searchApi)
</script>

<template>
  <div>
    <!-- 鼠标追踪 -->
    <section class="demo-section">
      <h2>1. useMouse — 鼠标追踪</h2>
      <div class="mouse-tracker" ref="trackerRef">
        <p>鼠标坐标: <strong>{{ x }}, {{ y }}</strong></p>
        <p class="hint">在此区域内移动鼠标查看实时坐标</p>
      </div>
      <p class="hint">onMounted 注册事件监听，onUnmounted 自动清理</p>
    </section>

    <!-- 组合式函数之间互相调用 -->
    <section class="demo-section">
      <h2>2. useCounter + useEventLogger — 组合式函数复用</h2>
      <div class="counter-demo">
        <div class="counter-display">
          <p>Count: <strong>{{ count }}</strong></p>
          <p>Double: <strong>{{ double }}</strong></p>
        </div>
        <div class="counter-btns">
          <button @click="decrement" class="btn-dec">-</button>
          <button @click="increment" class="btn-inc">+</button>
        </div>
      </div>
      <div class="logs" v-if="logs.length">
        <h4>操作日志 (useEventLogger):</h4>
        <ul>
          <li v-for="(log, i) in logs" :key="i">{{ log }}</li>
        </ul>
      </div>
    </section>

    <!-- 防抖搜索 -->
    <section class="demo-section">
      <h2>3. useDebouncedSearch — 防抖搜索</h2>
      <div class="search-demo">
        <input v-model="keyword" placeholder="输入水果名称搜索..." class="search-input" />
        <span v-if="searchLoading" class="loading-tip">搜索中...</span>
      </div>
      <ul v-if="results.length" class="result-list">
        <li v-for="item in results" :key="item">{{ item }}</li>
      </ul>
      <p v-else-if="keyword && !searchLoading" class="hint">未找到匹配结果</p>
      <p class="hint">输入停止 300ms 后自动搜索</p>
    </section>
  </div>
</template>

<style scoped>
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

.hint {
  color: #999;
  font-size: 13px;
  margin-top: 8px;
}

/* 鼠标追踪 */
.mouse-tracker {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 8px;
  text-align: center;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.mouse-tracker p {
  margin: 4px 0;
}

.mouse-tracker .hint {
  color: rgba(255, 255, 255, 0.7);
}

/* 计数器 */
.counter-demo {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 0;
}

.counter-display p {
  margin: 4px 0;
  font-size: 16px;
}

.counter-display strong {
  color: #597ef7;
  font-size: 20px;
}

.counter-btns {
  display: flex;
  gap: 8px;
}

.counter-btns button {
  width: 40px;
  height: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 20px;
  cursor: pointer;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-inc:hover { background: #f6ffed; border-color: #52c41a; color: #52c41a; }
.btn-dec:hover { background: #fff2f0; border-color: #f5222d; color: #f5222d; }

/* 日志 */
.logs {
  margin-top: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #eee;
}

.logs h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
}

.logs ul {
  margin: 0;
  padding-left: 20px;
}

.logs li {
  font-size: 13px;
  color: #666;
  font-family: monospace;
}

/* 搜索 */
.search-demo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  padding: 8px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  width: 280px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #597ef7;
}

.loading-tip {
  color: #597ef7;
  font-size: 13px;
  animation: blink 1s infinite;
}

@keyframes blink {
  50% { opacity: 0.3; }
}

.result-list {
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.result-list li {
  padding: 4px 14px;
  background: #e6f7ff;
  border-radius: 20px;
  font-size: 14px;
  color: #1890ff;
}
</style>
