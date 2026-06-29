<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: 'Setup Store 快速上手',
    desc: 'defineStore、storeToRefs、Options Store 对比、计数器实战',
    path: '/pinia/stage1',
    icon: '🚀',
    color: '#ffd700',
  },
  {
    id: 2,
    title: 'State 与 Getters',
    desc: 'ref/reactive 状态、computed 计算属性、$patch 批量更新、$reset 重置',
    path: '/pinia/stage2',
    icon: '📊',
    color: '#52c41a',
  },
  {
    id: 3,
    title: 'Actions 与异步',
    desc: '同步/异步 actions、$onAction 监听、完整 CRUD 操作',
    path: '/pinia/stage3',
    icon: '⚡',
    color: '#1890ff',
  },
  {
    id: 4,
    title: '多 Store 协作',
    desc: 'Store 之间互相引用、跨 Store 共享状态、$subscribe 订阅',
    path: '/pinia/stage4',
    icon: '🔗',
    color: '#722ed1',
  },
  {
    id: 5,
    title: '进阶与最佳实践',
    desc: 'Options Store、插件、持久化、DevTools、SSR、常见陷阱',
    path: '/pinia/stage5',
    icon: '📦',
    color: '#fa541c',
  },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="pinia-index">
    <header class="page-header">
      <h1>Pinia 状态管理学习</h1>
      <p class="subtitle">
        基于 <code>pinia@^3.0.4</code>，Composition API 风格（Setup Store），覆盖从入门到进阶的核心特性。
      </p>
    </header>

    <!-- 核心 API 速览 -->
    <section class="card quick-ref">
      <h2>核心 API 速览</h2>
      <div class="api-grid">
        <div class="api-item">
          <code>defineStore()</code>
          <span>定义 Store（Setup / Options）</span>
        </div>
        <div class="api-item">
          <code>storeToRefs()</code>
          <span>解构保持响应式</span>
        </div>
        <div class="api-item">
          <code>$patch()</code>
          <span>批量更新 state</span>
        </div>
        <div class="api-item">
          <code>$reset()</code>
          <span>重置到初始状态</span>
        </div>
        <div class="api-item">
          <code>$subscribe()</code>
          <span>订阅 state 变化</span>
        </div>
        <div class="api-item">
          <code>$onAction()</code>
          <span>监听 action 调用</span>
        </div>
        <div class="api-item">
          <code>$state</code>
          <span>直接访问/替换 state</span>
        </div>
        <div class="api-item">
          <code>$dispose()</code>
          <span>销毁 store</span>
        </div>
      </div>
    </section>

    <!-- 学习阶段 -->
    <section class="stages">
      <h2>学习阶段（共 5 个）</h2>
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
          <div class="stage-badge" :style="{ background: s.color, color: s.color === '#ffd700' ? '#333' : '#fff' }">
            Stage {{ s.id }}
          </div>
        </div>
      </div>
    </section>

    <!-- Pinia vs Vuex / 关键概念 -->
    <section class="card">
      <h2>Pinia 3.x 核心特性</h2>
      <a-table
        :columns="[
          { title: '特性', dataIndex: 'feature', key: 'feature' },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="[
          { feature: 'Setup Store（推荐）', desc: '使用 Composition API 定义 Store，与组件写法一致，类型推导完美' },
          { feature: 'Options Store', desc: '类 Vuex 风格，适合从 Vuex 迁移，支持 state / getters / actions' },
          { feature: '无 mutations', desc: 'actions 直接修改 state，无需定义 mutations' },
          { feature: 'TypeScript 原生支持', desc: 'defineStore 完全类型推导，无需额外类型定义' },
          { feature: 'DevTools 支持', desc: '完美集成 Vue DevTools，时间旅行、状态快照、action 追踪' },
          { feature: '无命名空间模块', desc: '每个 Store 独立文件，import 即用，天然支持 Tree Shaking' },
          { feature: 'Store 间相互引用', desc: '直接在 actions/getters 中 import 其他 Store' },
          { feature: '轻量极简', desc: '压缩后约 1.5KB，无运行时魔法字符串' },
        ]"
        :pagination="false"
        size="small"
      />
    </section>
  </div>
</template>

<style scoped>
.pinia-index {
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

.subtitle {
  color: #666;
  font-size: 14px;
}

.subtitle code {
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

/* 核心 API 速览 */
.api-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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

.api-item code {
  font-size: 13px;
  color: #1677ff;
  font-weight: 500;
}

.api-item span {
  font-size: 12px;
  color: #999;
}

/* 阶段卡片 */
.stages h2 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #333;
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

/* 响应式 */
@media (max-width: 768px) {
  .api-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stage-grid {
    grid-template-columns: 1fr;
  }
}
</style>
