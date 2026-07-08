<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: '基础图表：折线图、柱状图、饼图',
    desc: 'ECharts 初始化、option 配置结构、折线图/柱状图/饼图实战、tooltip/legend 配置',
    path: '/echarts/stage1',
    icon: '📊',
    color: '#5470c6',
  },
  {
    id: 2,
    title: '进阶图表：雷达图、散点图、仪表盘',
    desc: '雷达图多维分析、散点图数据分布、仪表盘监控、混合图表、坐标轴配置',
    path: '/echarts/stage2',
    icon: '📈',
    color: '#91cc75',
  },
  {
    id: 3,
    title: '高级特性与交互优化',
    desc: '地图可视化、动态数据刷新、事件交互、自适应缩放、深色主题、vue-echarts 封装',
    path: '/echarts/stage3',
    icon: '🗺',
    color: '#ee6666',
  },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="echarts-index">
    <header class="page-header">
      <h1>ECharts 数据可视化学习</h1>
      <p class="subtitle">
        基于 <code>echarts@^5.x</code> + <code>vue-echarts@^7.x</code>，Apache 顶级开源项目，功能最强大的数据可视化库。
      </p>
    </header>

    <!-- 核心概念速览 -->
    <section class="card quick-ref">
      <h2>ECharts 核心概念</h2>
      <div class="api-grid">
        <div class="api-item"><code>option</code><span>图表配置对象</span></div>
        <div class="api-item"><code>series</code><span>数据系列</span></div>
        <div class="api-item"><code>xAxis</code><span>X 轴</span></div>
        <div class="api-item"><code>yAxis</code><span>Y 轴</span></div>
        <div class="api-item"><code>legend</code><span>图例</span></div>
        <div class="api-item"><code>tooltip</code><span>提示框</span></div>
        <div class="api-item"><code>grid</code><span>绘图网格</span></div>
        <div class="api-item"><code>toolbox</code><span>工具栏</span></div>
        <div class="api-item"><code>dataZoom</code><span>区域缩放</span></div>
        <div class="api-item"><code>visualMap</code><span>视觉映射</span></div>
        <div class="api-item"><code>setOption</code><span>设置配置</span></div>
        <div class="api-item"><code>resize</code><span>自适应</span></div>
        <div class="api-item"><code>dispatchAction</code><span>触发行为</span></div>
        <div class="api-item"><code>on('click')</code><span>事件监听</span></div>
        <div class="api-item"><code>VChart</code><span>vue-echarts 组件</span></div>
      </div>
    </section>

    <!-- 学习阶段 -->
    <section class="stages">
      <h2>学习阶段（共 3 个）</h2>
      <div class="stage-grid">
        <div
          v-for="s in stages"
          :key="s.id"
          class="stage-card"
          :style="{ borderTopColor: s.color }"
          @click="navigateTo(s.path)"
        >
          <span class="stage-icon">{{ s.icon }}</span>
          <h3>{{ s.title }}</h3>
          <p class="stage-desc">{{ s.desc }}</p>
          <div class="stage-badge" :style="{ background: s.color, color: '#fff' }">
            Stage {{ s.id }}
          </div>
        </div>
      </div>
    </section>

    <!-- 为什么选 ECharts -->
    <section class="card">
      <h2>为什么选择 ECharts？</h2>
      <ul class="why-list">
        <li><strong>功能全面</strong>：内置 30+ 图表类型（折线、柱状、饼图、散点、地图、雷达、仪表盘等）</li>
        <li><strong>开箱即用</strong>：丰富的交互组件（tooltip、legend、dataZoom、brush 等）</li>
        <li><strong>高性能</strong>：WebGL 加速渲染百万级数据点，支持增量更新</li>
        <li><strong>移动端</strong>：针对移动端触摸交互优化，手势缩放/平移</li>
        <li><strong>可扩展</strong>：插件化架构，支持自定义图表类型</li>
        <li><strong>中文优先</strong>：国内最活跃的可视化社区，大量中文文档和示例</li>
        <li><strong>vue-echarts</strong>：官方 Vue 3 封装，声明式 API，响应式数据驱动</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.echarts-index {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}
.page-header h1 { font-size: 28px; color: #1a1a1a; margin: 0 0 8px; }
.subtitle { color: #666; font-size: 14px; }
.subtitle code { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; font-size: 13px; }

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.card h2 { margin: 0 0 16px; font-size: 18px; color: #333; }

.api-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.api-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}
.api-item code { font-size: 13px; color: #5470c6; font-weight: 500; }
.api-item span { font-size: 12px; color: #999; }

.stages h2 { margin: 0 0 16px; font-size: 18px; color: #333; }
.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stage-card {
  position: relative;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-top: 3px solid;
  border-radius: 10px;
  padding: 20px 16px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
}
.stage-card:hover { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); transform: translateY(-2px); }
.stage-icon { font-size: 28px; }
.stage-card h3 { margin: 10px 0 6px; font-size: 15px; color: #333; }
.stage-desc { font-size: 12px; color: #999; line-height: 1.5; margin: 0; }
.stage-badge { position: absolute; top: 10px; right: 10px; font-size: 11px; padding: 2px 8px; border-radius: 10px; }

.why-list { list-style: none; padding: 0; }
.why-list li { padding: 6px 0; font-size: 14px; color: #555; line-height: 1.6; }

@media (max-width: 768px) {
  .api-grid { grid-template-columns: repeat(3, 1fr); }
  .stage-grid { grid-template-columns: 1fr; }
}
</style>
