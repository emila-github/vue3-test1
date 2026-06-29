<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToPinia() {
  router.push('/pinia')
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>状态管理</h1>
      <p>随着应用规模增长，跨组件共享状态需要统一管理。Vue 官方推荐 <code>Pinia</code>。</p>
    </header>

    <!-- 为什么需要 -->
    <section class="card">
      <h2>为什么需要状态管理？</h2>
      <div class="problem-scene">
        <div class="scene-step">
          <span class="scene-icon">😰</span>
          <strong>问题</strong>
          <p>深层嵌套组件间传递 props 繁琐（prop drilling），兄弟组件通信困难</p>
        </div>
        <span class="scene-arrow">→</span>
        <div class="scene-step">
          <span class="scene-icon">💡</span>
          <strong>方案</strong>
          <p>将共享状态抽取到全局 Store，任意组件可直接访问和修改</p>
        </div>
        <span class="scene-arrow">→</span>
        <div class="scene-step">
          <span class="scene-icon">😎</span>
          <strong>效果</strong>
          <p>状态集中管理、数据流清晰、DevTools 可追踪</p>
        </div>
      </div>
    </section>

    <!-- 方案对比 -->
    <section class="card">
      <h2>Vue 状态管理方案对比</h2>
      <a-table
        :columns="[
          { title: '方案', dataIndex: 'name', key: 'name', width: 140 },
          { title: '适用场景', dataIndex: 'scene', key: 'scene' },
          { title: '特点', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="[
          { name: 'ref/reactive', scene: '局部状态、简单 UI 状态', desc: '无需额外库，适合组件内部' },
          { name: 'Composables', scene: '少数组件共享逻辑', desc: '将响应式状态抽出复用，useXxx() 模式' },
          { name: 'provide/inject', scene: '祖先向后代传数据', desc: '避免 prop drilling，非响应式需包装' },
          { name: 'Pinia（推荐）', scene: '中大型应用全局状态', desc: 'TypeScript 原生、DevTools 支持、模块化' },
          { name: 'Vuex 4', scene: 'Vue 2 迁移项目', desc: '前代官方方案，Pinia 已是官方默认' },
        ]"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- Pinia 核心 -->
    <section class="card">
      <h2>Pinia：官方状态管理</h2>
      <p>
        Pinia 是 Vue 官方推荐的状态管理库，支持 <strong>Setup Store</strong>（Composition API 风格）和
        <strong>Options Store</strong>（类 Vuex 风格）两种语法。
      </p>
      <pre class="code-block">// Setup Store（推荐）
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)                       // state
  const double = computed(() => count * 2)   // getter
  function increment() { count.value++ }     // action
  return { count, double, increment }
})

// 组件中使用
const store = useCounterStore()
const { count, double } = storeToRefs(store) // 保持响应式
store.increment()                             // 调用 action</pre>
    </section>

    <!-- Pinia 特性 -->
    <section class="card">
      <h2>Pinia 3.x 核心优势</h2>
      <div class="feature-grid">
        <div class="feat-item">
          <span>🏗</span>
          <strong>模块化设计</strong>
          <p>每个 Store 独立文件，import 即用，天然 Tree Shaking</p>
        </div>
        <div class="feat-item">
          <span>🔍</span>
          <strong>TypeScript 原生</strong>
          <p>defineStore 完美类型推导，无需额外类型声明</p>
        </div>
        <div class="feat-item">
          <span>🛠</span>
          <strong>DevTools 支持</strong>
          <p>时间旅行、状态快照、action 追踪</p>
        </div>
        <div class="feat-item">
          <span>📦</span>
          <strong>极简体积</strong>
          <p>压缩后约 1.5KB，零运行时魔法字符串</p>
        </div>
        <div class="feat-item">
          <span>🔗</span>
          <strong>Store 互引用</strong>
          <p>在 getter/action 中直接使用其他 Store</p>
        </div>
        <div class="feat-item">
          <span>🔄</span>
          <strong>无 Mutations</strong>
          <p>action 直接修改 state，消除样板代码</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="card cta-card">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px">
        <div>
          <h2 style="margin: 0 0 4px">深入学习 Pinia</h2>
          <p style="margin: 0; color: #888">5 阶段完整教程：Setup Store → State/Getter → Actions → 多Store协作 → 最佳实践</p>
        </div>
        <a-button type="primary" size="large" @click="goToPinia">
          进入 Pinia 教程 →
        </a-button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  color: #1a1a1a;
  margin: 0 0 6px;
}

.page-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.page-header p code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
  color: #d63384;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card h2 {
  margin: 0 0 12px;
  font-size: 18px;
  color: #333;
}

.card p {
  font-size: 14px;
  color: #555;
  line-height: 1.7;
  margin: 0 0 12px;
}

.card p code,
.card li code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
  color: #d63384;
}

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
  margin: 12px 0;
  white-space: pre;
  tab-size: 2;
}

.problem-scene {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.scene-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  max-width: 200px;
}

.scene-step strong {
  font-size: 14px;
  color: #333;
}

.scene-step p {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.scene-icon {
  font-size: 24px;
}

.scene-arrow {
  font-size: 18px;
  color: #ccc;
  margin-top: 20px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.feat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.feat-item span {
  font-size: 20px;
}

.feat-item strong {
  font-size: 13px;
  color: #333;
}

.feat-item p {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.cta-card {
  border: 2px solid #f9f0ff;
  background: #fdfaff;
}

@media (max-width: 640px) {
  .problem-scene {
    flex-direction: column;
    align-items: center;
  }
  .scene-arrow {
    transform: rotate(90deg);
  }
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
