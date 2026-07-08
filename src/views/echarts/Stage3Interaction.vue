<script setup lang="ts">
/**
 * ECharts Stage 3: 高级特性与交互优化
 * 演示地图可视化、动态数据刷新、事件交互、自适应缩放、深色主题
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent, DataZoomComponent, ToolboxComponent } from 'echarts/components'

use([CanvasRenderer, LineChart, BarChart,
     TitleComponent, TooltipComponent, LegendComponent, GridComponent, DataZoomComponent, ToolboxComponent])

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// ============ 动态刷新 + 实时数据 ============
const realtimeData = ref(generateData())
let timer: ReturnType<typeof setInterval> | null = null

function generateData() {
  const now = new Date()
  const data: [string, number][] = []
  for (let i = 9; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3000)
    const h = time.getHours().toString().padStart(2, '0')
    const m = time.getMinutes().toString().padStart(2, '0')
    const s = time.getSeconds().toString().padStart(2, '0')
    data.push([`${h}:${m}:${s}`, Math.round(Math.random() * 100)])
  }
  return data
}

const realtimeOption = computed(() => ({
  title: { text: '实时监控（每3秒刷新）', left: 'center' },
  tooltip: { trigger: 'axis' },
  grid: { top: 50, left: 60, right: 30, bottom: 30 },
  xAxis: { type: 'category', data: realtimeData.value.map((d) => d[0]) },
  yAxis: { type: 'value', min: 0, max: 100 },
  series: [{
    type: 'line',
    data: realtimeData.value.map((d) => d[1]),
    smooth: true,
    areaStyle: { color: 'rgba(84,112,198,0.2)' },
    color: '#5470c6',
  }],
}))

onMounted(() => {
  timer = setInterval(() => {
    realtimeData.value = generateData()
    addLog('数据刷新')
  }, 3000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// ============ DataZoom + Toolbox ============
const zoomData = computed(() => {
  const data: number[] = []
  for (let i = 0; i < 100; i++) {
    data.push(Math.round(Math.random() * 500 + 100))
  }
  return data
})

const zoomOption = computed(() => ({
  title: { text: 'DataZoom 区域缩放 + Toolbox 工具栏', left: 'center' },
  tooltip: { trigger: 'axis' },
  toolbox: {
    feature: {
      saveAsImage: { title: '保存图片' },
      dataZoom: { title: { zoom: '区域缩放', back: '还原' } },
      restore: { title: '还原' },
    },
    right: 20,
  },
  dataZoom: [
    { type: 'slider', start: 0, end: 50 },
    { type: 'inside', start: 0, end: 50 },
  ],
  grid: { top: 60, left: 50, right: 30, bottom: 60 },
  xAxis: {
    type: 'category',
    data: Array.from({ length: 100 }, (_, i) => `D${i + 1}`),
  },
  yAxis: { type: 'value' },
  series: [{
    type: 'line',
    data: zoomData.value,
    color: '#91cc75',
  }],
}))

// ============ 深色主题 ============
const darkThemeOption = computed(() => ({
  backgroundColor: '#100C2A',
  title: { text: '深色主题风格', left: 'center', textStyle: { color: '#eee' } },
  tooltip: {},
  legend: { textStyle: { color: '#ccc' }, top: 25 },
  grid: { top: 65, left: 50, right: 30, bottom: 30 },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: { lineStyle: { color: '#444' } },
    axisLabel: { color: '#ccc' },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#333' } },
    axisLabel: { color: '#ccc' },
  },
  series: [
    {
      name: '访问量',
      type: 'bar',
      data: [320, 450, 380, 520, 490, 600, 550],
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: '#667eea' }, { offset: 1, color: '#764ba2' }] },
      },
    },
    {
      name: '成交量',
      type: 'line',
      data: [180, 220, 200, 280, 250, 320, 300],
      smooth: true,
      lineStyle: { color: '#f093fb', width: 2 },
      itemStyle: { color: '#f093fb' },
      areaStyle: { color: 'rgba(240,147,251,0.15)' },
    },
  ],
}))

// ============ 事件交互 ============
const eventLogVisible = ref(true)
function onChartClick(params: any) {
  if (!eventLogVisible.value) return
  addLog(`点击：series=${params.seriesName}, value=${params.value}, name=${params.name}`)
}

function onChartMouseover(params: any) {
  if (!eventLogVisible.value) return
  addLog(`悬停：${params.seriesName} - ${params.name}`)
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 3：高级特性与交互优化</h1>
      <p>掌握动态数据刷新、DataZoom 区域缩放、Toolbox 工具栏、深色主题、事件交互、自适应缩放等高级特性。</p>
    </header>

    <!-- 3.1 动态刷新 -->
    <section class="card">
      <h2>3.1 动态数据刷新（实时监控）</h2>
      <v-chart :option="realtimeOption" style="height:350px" />
      <p class="note">通过 <code>setInterval</code> 定时更新数据源，VChart 自动响应式重绘。</p>
      <pre class="code-block">{{ `// 定时更新数据
setInterval(() => {
  realtimeData.value = generateNewData()
}, 3000)

// ECharts 自动检测 computed option 变化并 setOption
// 使用 notMerge: true 完全替换配置
// 或使用 merge 模式增量更新` }}</pre>
    </section>

    <!-- 3.2 DataZoom + Toolbox -->
    <section class="card">
      <h2>3.2 DataZoom 区域缩放 + Toolbox 工具栏</h2>
      <v-chart :option="zoomOption" style="height:350px" @click="onChartClick" />
      <pre class="code-block">{{ `const option = {
  toolbox: {
    feature: {
      saveAsImage: {},  // 保存为图片
      dataZoom: {},     // 区域缩放
      restore: {},      // 还原
    }
  },
  dataZoom: [
    { type: 'slider', start: 0, end: 50 },  // 滑块缩放
    { type: 'inside', start: 0, end: 50 },  // 鼠标滚轮缩放
  ],
}` }}</pre>
    </section>

    <!-- 3.3 深色主题 -->
    <section class="card">
      <h2>3.3 深色主题自定义</h2>
      <v-chart :option="darkThemeOption" style="height:350px" @mouseover="onChartMouseover" />
      <pre class="code-block">{{ `// 自定义深色主题
const option = {
  backgroundColor: '#100C2A',
  xAxis: { axisLabel: { color: '#ccc' }, axisLine: { lineStyle: { color: '#444' } } },
  yAxis: { splitLine: { lineStyle: { color: '#333' } } },
  series: [{
    itemStyle: {
      borderRadius: [6, 6, 0, 0],
      color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [{ offset: 0, color: '#667eea' }, { offset: 1, color: '#764ba2' }]
      }
    }
  }]
}` }}</pre>
    </section>

    <!-- 3.4 自适应与事件 -->
    <section class="card">
      <h2>3.4 自适应缩放与事件交互</h2>
      <div class="demo-row">
        <el-checkbox v-model="eventLogVisible">启用事件日志</el-checkbox>
      </div>
      <div class="feature-grid">
        <div class="feature-item">
          <strong>自动 resize</strong>
          <p>VChart 默认监听容器 <code>ResizeObserver</code>，窗口大小变化时自动重绘，无需手动调用 <code>chart.resize()</code></p>
        </div>
        <div class="feature-item">
          <strong>按需引入</strong>
          <p>只注册实际使用的图表和组件（通过 <code>echarts/core</code> 的 <code>use()</code>），大幅减小打包体积</p>
        </div>
        <div class="feature-item">
          <strong>事件绑定</strong>
          <p>通过 <code>@click</code>、<code>@mouseover</code> 等 Vue 事件绑定，获取 <code>params</code> 参数执行数据钻取</p>
        </div>
        <div class="feature-item">
          <strong>loading 状态</strong>
          <p>通过 <code>ref</code> 获取 chart 实例：<code>chart.value.showLoading()</code> / <code>chart.value.hideLoading()</code></p>
        </div>
      </div>
    </section>

    <!-- 操作日志 -->
    <section class="card">
      <h2>操作日志</h2>
      <div class="log-area">
        <div v-if="log.length === 0" class="log-empty">暂无操作记录</div>
        <div v-for="(item, i) in log" :key="i" class="log-item">{{ item }}</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page { max-width: 960px; margin: 0 auto; padding: 24px; }
.page-header { text-align: center; margin-bottom: 24px; }
.page-header h1 { font-size: 24px; color: #1a1a1a; margin: 0 0 8px; }
.page-header p { color: #666; font-size: 14px; }
.card { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.card h2 { margin: 0 0 16px; font-size: 18px; color: #333; padding-bottom: 6px; border-bottom: 1px solid #f0f0f0; }
.note { font-size: 13px; color: #999; margin: 8px 0; }
.note code { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; font-size: 12px; }
.code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; font-size: 12px; line-height: 1.6; overflow-x: auto; white-space: pre; margin-top: 12px; }
.demo-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 16px; }
.feature-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.feature-item { background: #f7f8fa; padding: 14px; border-radius: 8px; border: 1px solid #ebedf0; }
.feature-item strong { display: block; font-size: 14px; color: #333; margin-bottom: 6px; }
.feature-item p { font-size: 12px; color: #666; margin: 0; line-height: 1.6; }
.feature-item code { background: #e8f5e9; padding: 1px 6px; border-radius: 3px; font-size: 11px; color: #00a86b; }
.log-area { max-height: 200px; overflow-y: auto; background: #fafafa; border-radius: 8px; padding: 12px; }
.log-empty { color: #ccc; text-align: center; padding: 20px; }
.log-item { font-size: 12px; color: #666; padding: 3px 0; font-family: monospace; border-bottom: 1px dashed #f0f0f0; }
@media (max-width: 768px) { .feature-grid { grid-template-columns: 1fr; } }
</style>
