<script setup lang="ts">
/**
 * ECharts Stage 2: 进阶图表
 * 演示雷达图、散点图、仪表盘、混合图表、坐标轴配置等
 */
import { ref, computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, ScatterChart, RadarChart, GaugeChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent, RadarComponent } from 'echarts/components'

use([CanvasRenderer, LineChart, BarChart, ScatterChart, RadarChart, GaugeChart,
     TitleComponent, TooltipComponent, LegendComponent, GridComponent, RadarComponent])

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// ============ 雷达图 ============
const radarOption = computed(() => ({
  title: { text: '团队能力评估', left: 'center' },
  tooltip: {},
  legend: { data: ['张三', '李四'], bottom: 0 },
  radar: {
    indicator: [
      { name: '技术能力', max: 100 },
      { name: '沟通能力', max: 100 },
      { name: '项目管理', max: 100 },
      { name: '创新思维', max: 100 },
      { name: '团队协作', max: 100 },
    ],
    center: ['50%', '50%'],
    radius: '65%',
  },
  series: [
    {
      type: 'radar',
      data: [
        { value: [85, 70, 90, 75, 80], name: '张三' },
        { value: [70, 90, 65, 88, 85], name: '李四' },
      ],
    },
  ],
}))

// ============ 散点图 ============
const scatterOption = computed(() => ({
  title: { text: '用户活跃度分布', left: 'center' },
  tooltip: { trigger: 'item', formatter: '活跃度: {c}' },
  grid: { top: 50, left: 60, right: 30, bottom: 30 },
  xAxis: { type: 'value', name: '登录天数' },
  yAxis: { type: 'value', name: '操作次数' },
  series: [
    {
      type: 'scatter',
      data: (() => {
        const data: number[][] = []
        for (let i = 0; i < 50; i++) {
          data.push([Math.round(Math.random() * 30), Math.round(Math.random() * 200)])
        }
        return data
      })(),
      symbolSize: 8,
    },
  ],
}))

// ============ 仪表盘 ============
const gaugeValue = ref(72)
const gaugeOption = computed(() => ({
  title: { text: '系统健康度', left: 'center' },
  series: [
    {
      type: 'gauge',
      min: 0, max: 100,
      detail: { formatter: '{value}%', fontSize: 24 },
      data: [{ value: gaugeValue.value, name: '健康度' }],
      axisLine: {
        lineStyle: {
          width: 20,
          color: [[0.3, '#67e0e3'], [0.7, '#37a2da'], [1, '#fd666d']],
        },
      },
    },
  ],
}))

function changeGauge() {
  gaugeValue.value = Math.round(Math.random() * 100)
  addLog(`仪表盘数值更新为：${gaugeValue.value}`)
}

// ============ 混合图表（折线 + 柱状） ============
const mixOption = computed(() => ({
  title: { text: '混合图表：收入与增长率', left: 'center' },
  tooltip: { trigger: 'axis' },
  legend: { data: ['收入', '增长率'], bottom: 0 },
  grid: { top: 50, left: 60, right: 60, bottom: 40 },
  xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
  yAxis: [
    { type: 'value', name: '收入(万元)', position: 'left' },
    { type: 'value', name: '增长率(%)', position: 'right' },
  ],
  series: [
    { name: '收入', type: 'bar', data: [50, 65, 55, 80, 70, 95], color: '#5470c6' },
    { name: '增长率', type: 'line', yAxisIndex: 1, data: [12, 18, 8, 22, 15, 25], color: '#ee6666' },
  ],
}))

function handleClick(params: any) {
  addLog(`点击图表：${params.seriesName || params.name}`)
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 2：进阶图表</h1>
      <p>掌握雷达图、散点图、仪表盘、混合图表（双 Y 轴）等进阶可视化图表类型。</p>
    </header>

    <!-- 2.1 雷达图 -->
    <section class="card">
      <h2>2.1 雷达图 (Radar)</h2>
      <v-chart :option="radarOption" style="height:380px" @click="handleClick" />
      <pre class="code-block">{{ `const option = {
  radar: {
    indicator: [
      { name: '技术能力', max: 100 },
      { name: '沟通能力', max: 100 },
      // ...
    ]
  },
  series: [{
    type: 'radar',
    data: [{ value: [85, 70, 90, 75, 80], name: '张三' }]
  }]
}` }}</pre>
    </section>

    <!-- 2.2 散点图 -->
    <section class="card">
      <h2>2.2 散点图 (Scatter)</h2>
      <v-chart :option="scatterOption" style="height:350px" @click="handleClick" />
      <pre class="code-block">{{ `const option = {
  xAxis: { type: 'value', name: '登录天数' },
  yAxis: { type: 'value', name: '操作次数' },
  series: [{
    type: 'scatter',
    data: [[5, 120], [12, 180], ...],
    symbolSize: 8,
  }]
}` }}</pre>
    </section>

    <!-- 2.3 仪表盘 -->
    <section class="card">
      <h2>2.3 仪表盘 (Gauge)</h2>
      <v-chart :option="gaugeOption" style="height:300px" />
      <div style="text-align:center;margin-top:8px">
        <el-button type="primary" size="small" @click="changeGauge">随机更新</el-button>
        <span style="margin-left:12px;color:#999;font-size:13px">当前值：{{ gaugeValue }}%</span>
      </div>
      <pre class="code-block">{{ `const option = {
  series: [{ type: 'gauge', data: [{ value: 72 }] }]
}

// 动态更新
gaugeValue.value = Math.round(Math.random() * 100)` }}</pre>
    </section>

    <!-- 2.4 混合图表 -->
    <section class="card">
      <h2>2.4 混合图表（双 Y 轴）</h2>
      <v-chart :option="mixOption" style="height:350px" @click="handleClick" />
      <pre class="code-block">{{ `const option = {
  yAxis: [
    { type: 'value', name: '收入', position: 'left' },
    { type: 'value', name: '增长率', position: 'right' },
  ],
  series: [
    { name: '收入', type: 'bar', data: [...] },           // 左Y轴
    { name: '增长率', type: 'line', yAxisIndex: 1, data: [...] }  // 右Y轴
  ]
}` }}</pre>
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
.code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; font-size: 12px; line-height: 1.6; overflow-x: auto; white-space: pre; margin-top: 12px; }
.log-area { max-height: 200px; overflow-y: auto; background: #fafafa; border-radius: 8px; padding: 12px; }
.log-empty { color: #ccc; text-align: center; padding: 20px; }
.log-item { font-size: 12px; color: #666; padding: 3px 0; font-family: monospace; border-bottom: 1px dashed #f0f0f0; }
</style>
