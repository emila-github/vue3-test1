<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: 'Vitest 快速上手',
    desc: '安装配置、describe/it/expect 用法、常用断言匹配器',
    path: '/unit-test/stage1',
    icon: '🚀',
    color: '#52c41a',
  },
  {
    id: 2,
    title: 'Vue Test Utils 核心 API',
    desc: 'mount/shallowMount、find/findComponent、wrapper 方法',
    path: '/unit-test/stage2',
    icon: '🔧',
    color: '#1890ff',
  },
  {
    id: 3,
    title: '组件测试实战',
    desc: 'trigger 事件模拟、emitted 断言、setProps、状态验证',
    path: '/unit-test/stage3',
    icon: '🎯',
    color: '#fa8c16',
  },
  {
    id: 4,
    title: '异步与 Mock',
    desc: 'vi.fn()、vi.mock()、异步组件测试、flushPromises',
    path: '/unit-test/stage4',
    icon: '🔄',
    color: '#722ed1',
  },
  {
    id: 5,
    title: 'TDD 与最佳实践',
    desc: '测试驱动开发、覆盖率、快照测试、常见陷阱',
    path: '/unit-test/stage5',
    icon: '📐',
    color: '#cf1322',
  },
])

const apiList = ref([
  { api: 'describe()', desc: '定义测试套件，分组测试用例' },
  { api: 'it() / test()', desc: '定义单个测试用例' },
  { api: 'expect()', desc: '断言结果是否符合预期' },
  { api: 'vi.fn()', desc: '创建 Mock 函数' },
  { api: 'vi.mock()', desc: 'Mock 整个模块' },
  { api: 'mount()', desc: '完整挂载组件及其子组件' },
  { api: 'shallowMount()', desc: '浅挂载，stub 所有子组件' },
  { api: 'trigger()', desc: '触发组件上的 DOM 事件' },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>🧪 单元测试学习</h1>
      <p>
        基于 <code>vitest</code> + <code>@vue/test-utils</code>，系统学习 Vue 3 组件单元测试，
        从 Vitest 上手到组件测试实战、异步 Mock、TDD 最佳实践。
      </p>
    </header>

    <!-- API 速览 -->
    <section class="card">
      <h2>核心 API 速览</h2>
      <div class="info-grid">
        <div v-for="item in apiList" :key="item.api" class="info-item">
          <strong><code>{{ item.api }}</code></strong>
          <span>{{ item.desc }}</span>
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

    <!-- 测试金字塔 -->
    <section class="card">
      <h2>测试金字塔</h2>
      <a-table
        :columns="[
          { title: '层级', dataIndex: 'level', key: 'level' },
          { title: '类型', dataIndex: 'type', key: 'type' },
          { title: '工具', dataIndex: 'tool', key: 'tool' },
          { title: '特点', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="[
          { level: '底层', type: '单元测试', tool: 'Vitest + Vue Test Utils', desc: '最多、最快、最稳定' },
          { level: '中层', type: '组件测试', tool: 'Vitest + Vue Test Utils', desc: '验证组件行为和交互' },
          { level: '上层', type: 'E2E 测试', tool: 'Playwright / Cypress', desc: '模拟真实用户操作' },
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

.page-header code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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

.info-item span {
  font-size: 12px;
  color: #999;
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
