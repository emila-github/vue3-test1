<script setup lang="ts">
/**
 * Stage 1: Day.js 基础操作
 * 演示解析、格式化、差值、增减时间、比较、Unix 时间戳
 */
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(msg)
}

const now = dayjs()

// 1. 创建实例
const createdFrom = ref('dayjs()')
const targetDate = ref(dayjs('2025-01-15T10:30:00'))

// 2. 格式化
const formatStr = ref('YYYY年MM月DD日 HH:mm:ss')
const formatted = computed(() => targetDate.value.format(formatStr.value))

// 3. 增减时间
function addDays(n: number) {
  targetDate.value = targetDate.value.add(n, 'day')
  addLog(`+${n} 天 → ${targetDate.value.format('YYYY-MM-DD')}`)
}

function subtractHours(n: number) {
  targetDate.value = targetDate.value.subtract(n, 'hour')
  addLog(`-${n} 小时 → ${targetDate.value.format('HH:mm')}`)
}

// 4. 差值计算
const diffFrom = ref(dayjs('2025-01-01'))

// 5. 比较
function checkIsBefore() {
  const d = targetDate.value
  const compare = now
  addLog(`${d.format('YYYY-MM-DD')} isBefore ${compare.format('YYYY-MM-DD')}: ${d.isBefore(compare)}`)
}

function checkIsAfter() {
  const d = targetDate.value
  const compare = now
  addLog(`${d.format('YYYY-MM-DD')} isAfter ${compare.format('YYYY-MM-DD')}: ${d.isAfter(compare)}`)
}

// 6. 时间范围
const startOfMonth = computed(() => now.startOf('month').format('YYYY-MM-DD HH:mm:ss'))
const endOfMonth = computed(() => now.endOf('month').format('YYYY-MM-DD HH:mm:ss'))
const startOfWeek = computed(() => now.startOf('week').format('YYYY-MM-DD'))
const endOfWeek = computed(() => now.endOf('week').format('YYYY-MM-DD'))

// 7. 重置
function resetDate() {
  targetDate.value = dayjs('2025-01-15T10:30:00')
  addLog('目标日期已重置')
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 1：Day.js 基础操作</h1>
      <p>掌握解析、格式化、差值、增减时间、比较日期、Unix 时间戳。</p>
    </header>

    <!-- 1.1 创建实例 -->
    <section class="card">
      <h2>1.1 创建 Day.js 实例</h2>
      <pre class="code-block">
import dayjs from 'dayjs'

dayjs()                          // 当前时间
dayjs('2025-01-15')             // ISO 8601 字符串
dayjs('2025-01-15T10:30:00')   // 带时间的字符串
dayjs(1700000000000)            // 毫秒时间戳
dayjs.unix(1700000000)          // Unix 秒级时间戳</pre>
    </section>

    <!-- 1.2 格式化 -->
    <section class="card">
      <h2>1.2 格式化日期</h2>
      <p><code>.format()</code> 使用与 Moment.js 完全一致的格式模板。</p>
      <pre class="code-block">
dayjs().format('YYYY-MM-DD HH:mm:ss')        // 2025-01-15 10:30:00
dayjs().format('YYYY年MM月DD日')              // 2025年01月15日
dayjs().format('dddd, MMMM D, YYYY h:mm A')  // 星期三, 一月 15, 2025 10:30 AM</pre>
      <div class="demo-box">
        <p>目标日期：<strong>{{ targetDate.format('YYYY-MM-DD HH:mm:ss') }}</strong></p>
        <div class="pref-row">
          <span>格式模板：</span>
          <a-input v-model:value="formatStr" style="width: 300px" />
        </div>
        <p class="mt8">格式化结果：<strong class="primary">{{ formatted }}</strong></p>
        <div class="btn-row mt8">
          <button class="btn btn-sm" @click="formatStr = 'YYYY-MM-DD'">YYYY-MM-DD</button>
          <button class="btn btn-sm" @click="formatStr = 'YYYY年MM月DD日 HH:mm:ss'">中文</button>
          <button class="btn btn-sm" @click="formatStr = 'MM/DD/YYYY h:mm A'">美式</button>
        </div>
      </div>
    </section>

    <!-- 1.3 增减时间 -->
    <section class="card">
      <h2>1.3 add / subtract —— 时间运算</h2>
      <pre class="code-block">
dayjs().add(7, 'day')       // 7 天后
dayjs().subtract(1, 'month') // 1 个月前
dayjs().add(2, 'hour')      // 2 小时后</pre>
      <div class="demo-box">
        <p>当前日期：<strong>{{ targetDate.format('YYYY-MM-DD HH:mm') }}</strong></p>
        <div class="btn-row">
          <button class="btn" @click="addDays(1)">+1 天</button>
          <button class="btn" @click="addDays(7)">+7 天</button>
          <button class="btn" @click="subtractHours(1)">-1 小时</button>
          <button class="btn" @click="subtractHours(24)">-24 小时</button>
          <button class="btn" @click="resetDate">重置</button>
        </div>
      </div>
    </section>

    <!-- 1.4 diff 差值 -->
    <section class="card">
      <h2>1.4 diff —— 计算差值</h2>
      <pre class="code-block">
const a = dayjs('2025-01-15')
const b = dayjs('2025-01-01')

a.diff(b, 'day')      // 14  (天数差)
a.diff(b, 'hour')     // 336 (小时差)
a.diff(b, 'minute')   // 20160 (分钟差)</pre>
      <div class="demo-box">
        <p>基准日期：<strong>{{ diffFrom.format('YYYY-MM-DD') }}</strong></p>
        <a-table
          :columns="[
            { title: '对比日期', dataIndex: 'date' },
            { title: '天数差', dataIndex: 'days' },
            { title: '小时差', dataIndex: 'hours' },
            { title: '分钟差', dataIndex: 'minutes' },
          ]"
          :data-source="[
            { date: '2025-01-01', days: targetDate.diff(diffFrom, 'day'), hours: targetDate.diff(diffFrom, 'hour'), minutes: targetDate.diff(diffFrom, 'minute') },
            { date: '今天', days: now.diff(diffFrom, 'day'), hours: now.diff(diffFrom, 'hour'), minutes: now.diff(diffFrom, 'minute') },
            { date: '2025-01-31', days: now.add(23, 'day').diff(diffFrom, 'day'), hours: now.add(23, 'day').diff(diffFrom, 'hour'), minutes: now.add(23, 'day').diff(diffFrom, 'minute') },
          ]"
          :pagination="false"
          size="small"
        />
      </div>
    </section>

    <!-- 1.5 比较 -->
    <section class="card">
      <h2>1.5 isBefore / isAfter / isSame</h2>
      <pre class="code-block">
dayjs('2025-01-15').isBefore('2025-02-01')  // true
dayjs('2025-01-15').isAfter('2025-01-01')   // true
dayjs('2025-01-15').isSame('2025-01-15')    // true
dayjs().isSame('2025-01-15', 'month')       // true（同年同月）</pre>
      <div class="demo-box">
        <p>目标日期：<strong>{{ targetDate.format('YYYY-MM-DD') }}</strong></p>
        <p>今天：<strong>{{ now.format('YYYY-MM-DD') }}</strong></p>
        <div class="btn-row">
          <button class="btn" @click="checkIsBefore">isBefore？</button>
          <button class="btn" @click="checkIsAfter">isAfter？</button>
        </div>
      </div>
    </section>

    <!-- 1.6 startOf / endOf -->
    <section class="card">
      <h2>1.6 startOf / endOf —— 时间边界</h2>
      <pre class="code-block">dayjs().startOf('month')  // 本月第一天 00:00:00
dayjs().endOf('month')    // 本月最后一天 23:59:59</pre>
      <div class="demo-box">
        <div class="time-grid">
          <div class="time-item"><span>月初</span><strong>{{ startOfMonth }}</strong></div>
          <div class="time-item"><span>月末</span><strong>{{ endOfMonth }}</strong></div>
          <div class="time-item"><span>周一</span><strong>{{ startOfWeek }}</strong></div>
          <div class="time-item"><span>周日</span><strong>{{ endOfWeek }}</strong></div>
        </div>
      </div>
    </section>

    <!-- 日志 -->
    <section class="card">
      <h2>操作日志</h2>
      <div class="log-area">
        <div v-for="(item, i) in log" :key="i" class="log-item">[{{ i + 1 }}] {{ item }}</div>
        <div v-if="log.length === 0" class="log-empty">暂无操作记录</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.page-header { text-align: center; margin-bottom: 32px; }
.page-header h1 { font-size: 26px; color: #1a1a1a; margin: 0 0 8px; }
.page-header p { color: #666; font-size: 14px; }

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.card h2 { margin: 0 0 12px; font-size: 18px; color: #333; }
.card p { font-size: 14px; color: #666; line-height: 1.6; margin: 0 0 12px; }

.code-block {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  margin-bottom: 16px;
  white-space: pre-wrap;
}

.demo-box {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.primary { color: #f59e0b; }
.mt8 { margin-top: 8px; }

.pref-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; font-size: 14px; }

.btn-row { display: flex; gap: 8px; flex-wrap: wrap; }
.btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn:hover { border-color: #f59e0b; color: #f59e0b; }
.btn-sm { padding: 4px 10px; font-size: 12px; }

.time-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.time-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}
.time-item span { font-size: 12px; color: #999; }
.time-item strong { font-size: 14px; color: #333; }

.log-area { max-height: 200px; overflow-y: auto; font-size: 13px; }
.log-item { padding: 4px 0; color: #555; border-bottom: 1px dashed #f0f0f0; }
.log-empty { color: #ccc; text-align: center; padding: 20px; }

@media (max-width: 640px) { .stage-page { padding: 16px; } }
</style>
