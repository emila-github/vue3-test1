<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: 'shallowRef / shallowReactive',
    desc: '浅层响应式，减少深度追踪开销，大数据场景必备',
    path: '/vue-perf/stage1',
    icon: '⚡',
    color: '#52c41a',
  },
  {
    id: 2,
    title: 'v-memo / v-once',
    desc: '模板级渲染缓存，跳过不必要的 VNode 比较',
    path: '/vue-perf/stage2',
    icon: '📌',
    color: '#1890ff',
  },
  {
    id: 3,
    title: '懒加载与异步组件',
    desc: 'defineAsyncComponent、路由懒加载、Intersection Observer',
    path: '/vue-perf/stage3',
    icon: '🦥',
    color: '#fa8c16',
  },
  {
    id: 4,
    title: 'KeepAlive 缓存策略',
    desc: 'include/exclude/max 配置、activated/deactivated 生命周期',
    path: '/vue-perf/stage4',
    icon: '💾',
    color: '#722ed1',
  },
  {
    id: 5,
    title: '虚拟滚动与 Bundle 优化',
    desc: '大列表渲染方案、代码分割、Tree Shaking、打包分析',
    path: '/vue-perf/stage5',
    icon: '📦',
    color: '#cf1322',
  },
])

const tips = ref([
  { technique: 'shallowRef', scenario: '大型对象、第三方实例、不变数据', benefit: '减少深度响应式追踪开销' },
  { technique: 'v-memo', scenario: '列表项依赖少量数据变化', benefit: '跳过子树的 VNode diff' },
  { technique: 'defineAsyncComponent', scenario: '非首屏组件、重型组件', benefit: '减小初始 Bundle 体积' },
  { technique: 'KeepAlive', scenario: 'Tab 页切换、表单页面', benefit: '避免重复渲染和状态丢失' },
  { technique: '虚拟滚动', scenario: '超过 1000 条的大列表', benefit: '只渲染可视区域的 DOM' },
  { technique: '路由懒加载', scenario: '所有路由页面', benefit: '按需加载页面代码' },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>⚡ Vue 3 性能优化</h1>
      <p>
        系统学习 Vue 3 性能优化技巧，涵盖响应式优化、渲染优化、加载优化、缓存策略、Bundle 优化，
        5 阶段从入门到实战。
      </p>
    </header>

    <!-- 优化技巧速览 -->
    <section class="card">
      <h2>优化技巧速览</h2>
      <div class="info-grid">
        <div v-for="item in tips" :key="item.technique" class="info-item">
          <strong><code>{{ item.technique }}</code></strong>
          <span class="scenario">场景：{{ item.scenario }}</span>
          <span class="benefit">收益：{{ item.benefit }}</span>
        </div>
      </div>
    </section>

    <!-- 学习阶段 -->
    <section>
      <h2 style="margin: 0 0 16px; font-size: 18px; color: #333;">学习阶段（共 5 个）</h2>
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
          <div class="stage-badge" :style="{ background: s.color, color: '#fff' }">Stage {{ s.id }}</div>
        </div>
      </div>
    </section>

    <!-- 优化三层面 -->
    <section class="card">
      <h2>Vue 3 性能优化三层面</h2>
      <a-table
        :columns="[
          { title: '层面', dataIndex: 'layer', key: 'layer' },
          { title: '关注点', dataIndex: 'focus', key: 'focus' },
          { title: '核心手段', dataIndex: 'means', key: 'means' },
        ]"
        :data-source="[
          { layer: '响应式层', focus: '减少不必要的追踪和更新', means: 'shallowRef、computed 缓存、manual trigger' },
          { layer: '渲染层', focus: '减少 VNode Diff 开销', means: 'v-memo、v-once、合理拆分组件' },
          { layer: '加载层', focus: '减少初始 JS 体积', means: '异步组件、路由懒加载、代码分割' },
        ]"
        :pagination="false"
        size="small"
      />
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.page-header p {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card h2 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.info-item {
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item strong {
  font-size: 14px;
  color: #333;
}

.info-item code {
  background: #e8e8e8;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.scenario {
  font-size: 12px;
  color: #666;
}

.benefit {
  font-size: 12px;
  color: #52c41a;
}

.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
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

.stage-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.stage-icon {
  font-size: 28px;
}

.stage-card h3 {
  margin: 10px 0 6px;
  font-size: 15px;
  color: #333;
}

.stage-desc {
  font-size: 12px;
  color: #999;
  line-height: 1.5;
  margin: 0;
}

.stage-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

@media (max-width: 768px) {
  .info-grid { grid-template-columns: 1fr; }
  .stage-grid { grid-template-columns: 1fr; }
}
</style>
