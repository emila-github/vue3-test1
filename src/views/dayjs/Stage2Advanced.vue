<script setup lang="ts">
/**
 * Stage 2: Day.js 进阶技巧与插件
 * 演示国际化 locale、relativeTime、UTC、duration、插件系统
 */
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import { message } from 'ant-design-vue'

// 注册插件（全局一次即可，这里为了演示放在此处）
dayjs.extend(utc)
dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(isLeapYear)
dayjs.extend(weekOfYear)
dayjs.extend(dayOfYear)

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(msg)
}

// ============ 国际化 ============
const currentLocale = ref('zh-cn')
const testDate = ref(dayjs())

function setLocale(locale: string) {
  dayjs.locale(locale)
  currentLocale.value = locale
  addLog(`切换语言为: ${locale}`)
}

// ============ relativeTime ============
const relativeDate = ref(dayjs().subtract(5, 'minute'))

function changeRelativeDate(minutes: number) {
  relativeDate.value = dayjs().add(minutes, 'minute')
  addLog(`相对时间基准: ${minutes > 0 ? `${minutes}分钟后` : `${Math.abs(minutes)}分钟前`}`)
}

// ============ UTC ============
const utcNow = computed(() => dayjs.utc().format('YYYY-MM-DD HH:mm:ss'))
const beijingTime = computed(() => dayjs.utc().add(8, 'hour').format('YYYY-MM-DD HH:mm:ss'))
const nyTime = computed(() => dayjs.utc().subtract(4, 'hour').format('YYYY-MM-DD HH:mm:ss'))

// ============ duration ============
const durationSec = ref(3665) // 1小时1分5秒

// ============ 其他判断 ============
const currentYear = dayjs().year()
const isCurrentLeap = dayjs().isLeapYear()
const currentWeek = dayjs().week()
const dayOfYearResult = dayjs().dayOfYear()
const daysInMonth = computed(() => dayjs().daysInMonth())
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 2：进阶技巧与插件</h1>
      <p>掌握国际化 locale、relativeTime、UTC、duration、插件系统等进阶功能。</p>
    </header>

    <!-- 2.1 locale 国际化 -->
    <section class="card">
      <h2>2.1 locale —— 国际化</h2>
      <pre class="code-block">
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')  // 切换为中文
dayjs().format('dddd, MMMM D')  // 星期三, 一月 15</pre>
      <div class="demo-box">
        <p>当前语言：<strong>{{ currentLocale }}</strong></p>
        <div class="btn-row">
          <button :class="['btn', { active: currentLocale === 'zh-cn' }]" @click="setLocale('zh-cn')">中文</button>
          <button :class="['btn', { active: currentLocale === 'en' }]" @click="setLocale('en')">English</button>
        </div>
        <p class="mt8">格式化结果：<strong class="primary">{{ testDate.format('dddd, MMMM D, YYYY') }}</strong></p>
      </div>
    </section>

    <!-- 2.2 relativeTime -->
    <section class="card">
      <h2>2.2 relativeTime —— 相对时间</h2>
      <p>将日期转为相对时间描述（如"3 小时前"）。</p>
      <pre class="code-block">
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

dayjs().to(dayjs('2025-02-01'))           // "17 天后"
dayjs('2025-01-01').fromNow()             // "2 周前"
dayjs().from(dayjs('2025-05-01'), true)   // "4 个月"  (不带前后缀)</pre>
      <div class="demo-box">
        <div class="btn-row">
          <button class="btn" @click="changeRelativeDate(-60)">60 分钟前</button>
          <button class="btn" @click="changeRelativeDate(-5)">5 分钟前</button>
          <button class="btn" @click="changeRelativeDate(30)">30 分钟后</button>
          <button class="btn" @click="changeRelativeDate(360)">6 小时后</button>
        </div>
        <div class="relative-results mt8">
          <div class="result-item">
            <span>fromNow：</span>
            <strong class="primary">{{ relativeDate.fromNow() }}</strong>
          </div>
          <div class="result-item">
            <span>fromNow(true)：</span>
            <strong class="primary">{{ relativeDate.fromNow(true) }}</strong>
          </div>
          <div class="result-item">
            <span>toNow：</span>
            <strong class="primary">{{ relativeDate.toNow() }}</strong>
          </div>
        </div>
      </div>
    </section>

    <!-- 2.3 UTC -->
    <section class="card">
      <h2>2.3 UTC 时间</h2>
      <pre class="code-block">
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

dayjs.utc()                     // UTC 当前时间
dayjs.utc('2025-01-15')        // UTC 解析</pre>
      <div class="demo-box">
        <div class="time-grid">
          <div class="time-item"><span>UTC</span><strong>{{ utcNow }}</strong></div>
          <div class="time-item"><span>北京时间 (+8)</span><strong>{{ beijingTime }}</strong></div>
          <div class="time-item"><span>纽约时间 (-4)</span><strong>{{ nyTime }}</strong></div>
        </div>
      </div>
    </section>

    <!-- 2.4 duration -->
    <section class="card">
      <h2>2.4 duration —— 持续时间</h2>
      <p>精确表示一段时间长度，支持格式化输出。</p>
      <pre class="code-block">
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

const d = dayjs.duration(3665, 'seconds')
d.hours()   // 1
d.minutes() // 1
d.seconds() // 5
d.format('HH:mm:ss')  // '01:01:05'</pre>
      <div class="demo-box">
        <div class="pref-row">
          <span>秒数：</span>
          <a-input-number v-model:value="durationSec" :min="0" :step="60" style="width: 150px" />
        </div>
        <p class="mt8">
          格式化：<strong class="primary">
            {{ dayjs.duration(durationSec, 'seconds').format('HH:mm:ss') }}
          </strong>
        </p>
        <p>小时：{{ dayjs.duration(durationSec, 'seconds').hours() }}h，分钟：{{ dayjs.duration(durationSec, 'seconds').minutes() }}m，秒：{{ dayjs.duration(durationSec, 'seconds').seconds() }}s</p>
      </div>
    </section>

    <!-- 2.5 其他判断 -->
    <section class="card">
      <h2>2.5 实用判断函数</h2>
      <pre class="code-block">
import isLeapYear from 'dayjs/plugin/isLeapYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(isLeapYear).extend(weekOfYear)</pre>
      <div class="demo-box">
        <a-table
          :columns="[
            { title: '项目', dataIndex: 'name' },
            { title: '值', dataIndex: 'value' },
          ]"
          :data-source="[
            { name: '当前年', value: currentYear },
            { name: '是否闰年', value: isCurrentLeap ? '是' : '否' },
            { name: '第几周', value: `第 ${currentWeek} 周` },
            { name: '一年中第几天', value: `第 ${dayOfYearResult} 天` },
            { name: '本月天数', value: `${daysInMonth} 天` },
          ]"
          :pagination="false"
          size="small"
        />
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

.primary { color: #8b5cf6; }
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
.btn:hover { border-color: #8b5cf6; color: #8b5cf6; }
.btn.active { background: #8b5cf6; color: #fff; border-color: #8b5cf6; }

.relative-results { display: flex; flex-direction: column; gap: 8px; }
.result-item { font-size: 14px; color: #555; }

.time-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
.time-item strong { font-size: 12px; color: #333; word-break: break-all; }

.log-area { max-height: 200px; overflow-y: auto; font-size: 13px; }
.log-item { padding: 4px 0; color: #555; border-bottom: 1px dashed #f0f0f0; }
.log-empty { color: #ccc; text-align: center; padding: 20px; }

@media (max-width: 640px) {
  .stage-page { padding: 16px; }
  .time-grid { grid-template-columns: 1fr; }
}
</style>
