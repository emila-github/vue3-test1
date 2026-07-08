<script setup lang="ts">
/**
 * ECharts Stage 1: 基础图表
 * 演示 VChart 初始化、折线图、柱状图、饼图、tooltip/legend 配置
 */
import { ref, computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'

// 注册必要的组件
use([CanvasRenderer, LineChart, BarChart, PieChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// ============ 折线图 ============
const lineOption = computed(() => ({
  title: { text: '月度销售额趋势', left: 'center' },
  tooltip: { trigger: 'axis' },
  legend: { data: ['销售额', '利润'], bottom: 0 },
  grid: { top: 50, left: 50, right: 30, bottom: 40 },
  xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
  yAxis: { type: 'value' },
  series: [
    { name: '销售额', type: 'line', data: [820, 932, 901, 934, 1290, 1330], smooth: true, color: '#5470c6' },
    { name: '利润', type: 'line', data: [200, 250, 180, 300, 350, 400], smooth: true, color: '#91cc75' },
  ],
}))

// ============ 柱状图 ============
const barOption = computed(() => ({
  title: { text: '各产品线季度销量', left: 'center' },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { data: ['Q1', 'Q2'], bottom: 0 },
  grid: { top: 50, left: 50, right: 30, bottom: 40 },
  xAxis: { type: 'category', data: ['产品A', '产品B', '产品C', '产品D'] },
  yAxis: { type: 'value' },
  series: [
    { name: 'Q1', type: 'bar', data: [120, 200, 150, 80], color: '#5470c6' },
    { name: 'Q2', type: 'bar', data: [165, 230, 180, 100], color: '#91cc75' },
  ],
}))

// ============ 饼图 ============
const pieOption = computed(() => ({
  title: { text: '用户来源分布', left: 'center' },
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { orient: 'vertical', left: 'left' },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['55%', '55%'],
      data: [
        { value: 335, name: '搜索引擎' },
        { value: 310, name: '直接访问' },
        { value: 234, name: '社交媒体' },
        { value: 135, name: '邮件营销' },
        { value: 548, name: '联盟广告' },
      ],
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
      },
    },
  ],
}))

function handleChartClick(params: any) {
  addLog(`点击了：${params.seriesName || params.name} - ${params.value || params.data}`)
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 1：基础图表</h1>
      <p>掌握 VChart 组件初始化、option 配置结构、折线图/柱状图/饼图实战以及 tooltip/legend 配置。</p>
    </header>

    <!-- 1.1 初始化 -->
    <section class="card">
      <h2>1.1 vue-echarts 初始化</h2>
      <pre class="code-block">{{ `pnpm add echarts vue-echarts

// 按需引入（减小包体积）
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'

use([CanvasRenderer, LineChart, BarChart, PieChart,
     TitleComponent, TooltipComponent, LegendComponent, GridComponent])

// 使用 VChart 组件
// <v-chart :option="option" style="height:400px" @click="onClick" />` }}</pre>
    </section>

    <!-- 1.2 折线图 -->
    <section class="card">
      <h2>1.2 折线图 (Line)</h2>
      <v-chart :option="lineOption" style="height:350px" @click="handleChartClick" />
      <pre class="code-block">{{ `const option = {
  xAxis: { type: 'category', data: ['1月','2月','3月','4月','5月','6月'] },
  yAxis: { type: 'value' },
  series: [{
    type: 'line',
    data: [820, 932, 901, 934, 1290, 1330],
    smooth: true,  // 平滑曲线
  }]
}` }}</pre>
    </section>

    <!-- 1.3 柱状图 -->
    <section class="card">
      <h2>1.3 柱状图 (Bar)</h2>
      <v-chart :option="barOption" style="height:350px" @click="handleChartClick" />
      <pre class="code-block">{{ `const option = {
  xAxis: { type: 'category', data: ['A','B','C','D'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [120, 200, 150, 80] },
           { type: 'bar', data: [165, 230, 180, 100] }]
}` }}</pre>
    </section>

    <!-- 1.4 饼图 -->
    <section class="card">
      <h2>1.4 饼图 (Pie)</h2>
      <v-chart :option="pieOption" style="height:350px" @click="handleChartClick" />
      <pre class="code-block">{{ `const option = {
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],  // 环形图
    data: [
      { value: 335, name: '搜索引擎' },
      { value: 310, name: '直接访问' },
    ],
    emphasis: { itemStyle: { shadowBlur: 10 } }
  }]
}` }}</pre>
    </section>

    <!-- 操作日志 -->
    <section class="card">
      <h2>交互日志（点击图表查看）</h2>
      <div class="log-area">
        <div v-if="log.length === 0" class="log-empty">点击任意图表查看交互日志</div>
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
