<script setup lang="ts">
import { ref, computed } from 'vue'

// ===== v-memo 演示 =====
const vmemoItems = ref([
  { id: 1, name: 'Item A', selected: false },
  { id: 2, name: 'Item B', selected: false },
  { id: 3, name: 'Item C', selected: false },
  { id: 4, name: 'Item D', selected: false },
  { id: 5, name: 'Item E', selected: false },
])

const vmemoUpdateCount = ref(0)
const vmemoRenderCounts = ref<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
const vmemoLastRender = ref('')

function toggleVmemoItem(id: number) {
  const item = vmemoItems.value.find((i) => i.id === id)
  if (item) item.selected = !item.selected
  vmemoUpdateCount.value++
  vmemoLastRender.value = `更新 #${vmemoUpdateCount.value}：切换了 Item ${id}`
}

function recordRender(id: number) {
  vmemoRenderCounts.value[id] = (vmemoRenderCounts.value[id] ?? 0) + 1
}

// ===== v-once 演示 =====
const onceTimestamp = ref(new Date().toISOString())
const onceCounter = ref(0)

function updateOnceCounter() {
  onceCounter.value++
}

// ===== 长列表演示 =====
const listItems = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    text: `List Item ${i + 1}`,
    active: false,
  })),
)

const listUpdateCount = ref(0)
const listRenderCounts = ref<Record<number, number>>({})
for (let i = 1; i <= 20; i++) {
  listRenderCounts.value[i] = 0
}

function toggleListItem(id: number) {
  const item = listItems.value.find((i) => i.id === id)
  if (item) item.active = !item.active
  listUpdateCount.value++
}

function recordListRender(id: number) {
  listRenderCounts.value[id] = (listRenderCounts.value[id] ?? 0) + 1
}

// ===== 对比统计 =====
const totalMemoRenders = computed(() =>
  Object.values(vmemoRenderCounts.value).reduce((a, b) => a + b, 0),
)

const totalListRenders = computed(() =>
  Object.values(listRenderCounts.value).reduce((a, b) => a + b, 0),
)

// ===== 代码示例 =====
const codeVMemo = [
  '<!-- v-memo：仅当依赖项变化时重新渲染 -->',
  '<div v-for="item in items" :key="item.id"',
  '     v-memo="[item.selected]">',
  '  <!-- 只有 item.selected 变化时才更新此 div -->',
  '  <span>{{ item.name }}</span>',
  '  <span>{{ item.selected ? \'\\u2705\' : \'\\u2B1C\' }}</span>',
  '</div>',
  '',
  '// 等价于 shouldComponentUpdate / React.memo',
  '// 依赖项数组中的值不变 → 跳过整个子树更新',
].join('\n')

const codeVOnce = [
  '<!-- v-once：只渲染一次，永不更新 -->',
  '<div v-once>',
  '  <h2>创建时间：{{ createdAt }}</h2>',
  '  <p>这个区块永远不会被重新渲染</p>',
  '</div>',
  '',
  '// 适合：静态内容、SEO 文本、',
  '// 不会变化的配置展示区域',
].join('\n')

const codeVMemolist = [
  '<!-- 大列表中使用 v-memo -->',
  '<div v-for="item in list" :key="item.id"',
  '     v-memo="[item.active]">',
  '  <ExpensiveComponent :item="item" />',
  '</div>',
  '',
  '// 当修改某一项时，只有该项重新渲染',
  '// 其他项被 v-memo 缓存，跳过更新',
  '// 对 1000+ 列表效果显著',
].join('\n')

const codeWhenToUse = [
  '// v-memo 适用场景：',
  '// 1. 大列表 (> 100 项)，只有少数项频繁变化',
  '// 2. 子树包含复杂计算或大量 DOM',
  '// 3. v-for 内部配合 :key 使用',
  '',
  '// v-once 适用场景：',
  '// 1. 纯静态内容（文档、条款、帮助文本）',
  '// 2. 页面头部/底部等不变区域',
  '// 3. 初始化后不再变化的配置面板',
  '',
  '// 注意事项：',
  '// - v-memo 依赖项太多反而增加比对开销',
  '// - v-once 内的响应式数据不会触发更新',
  '// - 两者都是编译优化，不影响 JS 逻辑',
].join('\n')
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 2：v-memo / v-once</h1>
      <p>模板级渲染缓存 — 跳过不必要的 VNode 比对，减少 DOM 更新开销</p>
    </header>

    <!-- 概念对比 -->
    <section class="card">
      <h2>v-memo vs v-once 对比</h2>
      <div class="compare-grid">
        <div class="compare-col bad">
          <h4>无优化（默认行为）</h4>
          <p>每次父组件更新时，所有子 VNode 都会参与 diff 比对。即使数据没变，也要走一遍 patch 流程。</p>
        </div>
        <div class="compare-col good">
          <h4>v-memo / v-once 优化</h4>
          <p>v-memo：依赖项不变时缓存整个子树。v-once：只渲染一次永不更新。两者都可显著减少不必要的 patch。</p>
        </div>
      </div>
    </section>

    <!-- v-memo 交互演示 -->
    <section class="card">
      <h2>v-memo 交互演示</h2>
      <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
        点击下方按钮切换选中状态。注意观察每个 Item 的渲染次数 — v-memo 确保只有 selected 变化的项重新渲染。
      </p>
      <div class="demo-area">
        <p style="font-size: 13px; color: #888;">总更新次数：{{ vmemoUpdateCount }} &nbsp;|&nbsp; 总渲染次数：{{ totalMemoRenders }}</p>
        <p style="font-size: 12px; color: #aaa;">{{ vmemoLastRender || '尚未操作' }}</p>
        <div class="vmemo-list">
          <div
            v-for="item in vmemoItems"
            :key="item.id"
            v-memo="[item.selected]"
            class="vmemo-item"
            :class="{ selected: item.selected }"
          >
            {{ recordRender(item.id) }}
            <span class="item-name">{{ item.name }}</span>
            <span class="item-status">{{ item.selected ? '✅ 已选' : '⬜ 未选' }}</span>
            <span class="item-renders">渲染 {{ vmemoRenderCounts[item.id] }} 次</span>
          </div>
        </div>
        <div style="margin-top: 12px;">
          <button
            v-for="item in vmemoItems"
            :key="item.id"
            class="btn"
            @click="toggleVmemoItem(item.id)"
          >
            切换 {{ item.name }}
          </button>
        </div>
      </div>
    </section>

    <!-- v-once 演示 -->
    <section class="card">
      <h2>v-once 交互演示</h2>
      <div class="demo-area">
        <div class="once-demo">
          <div class="once-block" v-once>
            <p><strong>v-once 区块（永不更新）</strong></p>
            <p>创建时间：{{ onceTimestamp }}</p>
            <p>计数器：{{ onceCounter }}</p>
          </div>
          <div class="normal-block">
            <p><strong>正常区块（响应式）</strong></p>
            <p>创建时间：{{ onceTimestamp }}</p>
            <p>计数器：{{ onceCounter }}</p>
          </div>
        </div>
        <button class="btn" @click="updateOnceCounter" style="margin-top: 12px;">
          计数器 +1（当前：{{ onceCounter }}）
        </button>
        <p style="font-size: 12px; color: #999; margin-top: 8px;">
          左侧 v-once 区块的值不会变化，右侧正常区块会跟随更新。
        </p>
      </div>
    </section>

    <!-- 长列表 v-memo 演示 -->
    <section class="card">
      <h2>长列表 v-memo 演示（20 项）</h2>
      <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
        点击任意项切换 active 状态。v-memo 确保只有 active 变化的项重新渲染。
      </p>
      <div class="demo-area">
        <p style="font-size: 13px; color: #888;">总更新次数：{{ listUpdateCount }} &nbsp;|&nbsp; 总渲染次数：{{ totalListRenders }}</p>
        <div class="list-grid">
          <div
            v-for="item in listItems"
            :key="item.id"
            v-memo="[item.active]"
            class="list-item"
            :class="{ active: item.active }"
            @click="toggleListItem(item.id)"
          >
            {{ recordListRender(item.id) }}
            <span>#{{ item.id }}</span>
            <span class="list-render">渲染 {{ listRenderCounts[item.id] }} 次</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 使用场景 -->
    <section class="card">
      <h2>适用场景</h2>
      <div class="info-grid">
        <div class="info-item">
          <strong>v-memo + v-for 大列表</strong>
          <span>列表中仅少数项频繁更新时，v-memo 避免整个列表重新渲染</span>
        </div>
        <div class="info-item">
          <strong>v-once 静态内容区</strong>
          <span>文档页面、服务条款、帮助文本等初始化后不再变化的内容</span>
        </div>
        <div class="info-item">
          <strong>复杂组件子树</strong>
          <span>子树包含大量 DOM 或计算属性时，v-memo 可避免不必要的 VNode 比对</span>
        </div>
        <div class="info-item">
          <strong>配合虚拟滚动</strong>
          <span>在虚拟滚动场景中，v-memo 确保可视区域外的项不被重新渲染</span>
        </div>
      </div>
    </section>

    <!-- 代码示例 -->
    <section class="card">
      <h2>代码示例</h2>
      <h3>v-memo 基本用法</h3>
      <pre class="code-block"><code>{{ codeVMemo }}</code></pre>

      <h3>v-once 基本用法</h3>
      <pre class="code-block"><code>{{ codeVOnce }}</code></pre>

      <h3>大列表中使用 v-memo</h3>
      <pre class="code-block"><code>{{ codeVMemolist }}</code></pre>

      <h3>使用建议</h3>
      <pre class="code-block"><code>{{ codeWhenToUse }}</code></pre>
    </section>
  </div>
</template>

<style scoped>
.stage-page { max-width: 960px; margin: 0 auto; padding: 24px; }
.page-header { text-align: center; margin-bottom: 32px; }
.page-header h1 { font-size: 28px; color: #1a1a1a; margin: 0 0 8px; }
.page-header p { color: #666; font-size: 14px; }
.card { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.card h2 { margin: 0 0 16px; font-size: 18px; color: #333; }
.card h3 { margin: 16px 0 8px; font-size: 15px; color: #555; }
.code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.6; margin: 12px 0; }
.code-block code { font-family: 'Fira Code', 'Consolas', monospace; }
.demo-area { padding: 16px; background: #fafafa; border-radius: 8px; margin: 12px 0; }
.btn { padding: 8px 16px; background: #52c41a; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; margin-right: 8px; margin-bottom: 6px; }
.btn:hover { background: #45a418; }
.result-box { padding: 12px; background: #f5f5f5; border-left: 3px solid #52c41a; border-radius: 4px; margin-top: 12px; font-family: monospace; font-size: 13px; white-space: pre-wrap; }
.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.info-item { padding: 12px; background: #fafafa; border-radius: 6px; border: 1px solid #f0f0f0; }
.info-item strong { display: block; margin-bottom: 4px; color: #333; font-size: 14px; }
.info-item span { font-size: 12px; color: #999; }
.compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.compare-col { padding: 16px; border-radius: 8px; }
.compare-col.bad { background: #fff2f0; border: 1px solid #ffccc7; }
.compare-col.good { background: #f6ffed; border: 1px solid #b7eb8f; }
.compare-col h4 { margin: 0 0 8px; font-size: 14px; }
.compare-col p { font-size: 13px; color: #666; line-height: 1.6; }
.vmemo-list { display: flex; flex-direction: column; gap: 6px; }
.vmemo-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: #fff; border-radius: 8px; border: 1px solid #f0f0f0; transition: background 0.2s; }
.vmemo-item.selected { background: #e6f7ff; border-color: #91d5ff; }
.item-name { font-weight: 600; font-size: 14px; }
.item-status { font-size: 13px; color: #888; }
.item-renders { margin-left: auto; font-size: 12px; color: #aaa; font-family: monospace; }
.once-demo { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.once-block, .normal-block { padding: 12px; border-radius: 8px; font-size: 13px; }
.once-block { background: #fff2f0; border: 1px solid #ffccc7; }
.normal-block { background: #f6ffed; border: 1px solid #b7eb8f; }
.once-block p, .normal-block p { margin: 4px 0; }
.list-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
.list-item { display: flex; flex-direction: column; align-items: center; padding: 10px; background: #fff; border-radius: 8px; border: 1px solid #f0f0f0; cursor: pointer; font-size: 13px; transition: all 0.2s; }
.list-item.active { background: #e6f7ff; border-color: #91d5ff; }
.list-render { font-size: 11px; color: #bbb; font-family: monospace; margin-top: 4px; }
@media (max-width: 640px) {
  .compare-grid, .once-demo { grid-template-columns: 1fr; }
  .list-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
