<script setup lang="ts">
import { ref, reactive, shallowRef, triggerRef, toRefs, computed } from 'vue'
import { message } from 'ant-design-vue'

// ========== 1. shallowRef + triggerRef 大对象优化 ==========
interface BigItem {
  id: number
  label: string
  value: number
}

// 生成 10000 条数据
function generateBigData(count: number): BigItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    label: `Item-${i}`,
    value: Math.random() * 1000,
  }))
}

// 普通 ref — 整个数组深层代理
const normalBigData = ref<BigItem[]>([])

// shallowRef — 只有 .value 层级是响应式的，数组内部不代理
const shallowBigData = shallowRef<BigItem[]>([])

const normalTime = ref(0)
const shallowTime = ref(0)

function loadNormalRef() {
  const start = performance.now()
  normalBigData.value = generateBigData(10000)
  normalTime.value = Math.round(performance.now() - start)
  message.success(`普通 ref 加载 10000 条数据耗时 ${normalTime.value}ms`)
}

function loadShallowRef() {
  const start = performance.now()
  shallowBigData.value = generateBigData(10000)
  shallowTime.value = Math.round(performance.now() - start)
  message.success(`shallowRef 加载 10000 条数据耗时 ${shallowTime.value}ms`)
}

function modifyNormalItem() {
  const start = performance.now()
  if (normalBigData.value.length > 0) {
    normalBigData.value[0].value = Math.random() * 1000
  }
  message.info(`普通 ref 修改单个元素耗时 ${Math.round(performance.now() - start)}ms`)
}

function modifyShallowItem() {
  // 直接修改内部属性不会触发更新
  if (shallowBigData.value.length > 0) {
    shallowBigData.value[0].value = Math.random() * 1000
    message.warning('已修改浅层数组内部元素，但不会触发视图更新')
  }
}

function triggerShallowUpdate() {
  const start = performance.now()
  // 必须整体替换或调用 triggerRef 才能触发更新
  triggerRef(shallowBigData)
  message.success(`triggerRef 手动触发更新，耗时 ${Math.round(performance.now() - start)}ms`)
}

// ========== 2. reactive 解构丢失响应性 ==========
const product = reactive({ name: 'MacBook Pro', price: 12999, stock: 50 })

// ❌ 普通解构 — 丢失响应性
const { name: destructuredName, price: destructuredPrice } = product

// ✅ toRefs 解构 — 保持响应性
const { name: refName, price: refPrice, stock: refStock } = toRefs(product)

// ========== 3. v-once 演示 ==========
const onceCount = ref(0)

// ========== 4. v-memo 演示 ==========
const list = ref([
  { id: 1, name: 'Item A', selected: false },
  { id: 2, name: 'Item B', selected: false },
  { id: 3, name: 'Item C', selected: false },
  { id: 4, name: 'Item D', selected: false },
  { id: 5, name: 'Item E', selected: false },
])

const otherState = ref(0)

function toggleItem(id: number) {
  const item = list.value.find((i) => i.id === id)
  if (item) item.selected = !item.selected
}

function incOther() {
  otherState.value++
}

// ========== 日志 ==========
const logs = ref<string[]>([])

function addLog(msg: string) {
  logs.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

function resetAll() {
  normalBigData.value = []
  shallowBigData.value = []
  normalTime.value = 0
  shallowTime.value = 0
  product.name = 'MacBook Pro'
  product.price = 12999
  product.stock = 50
  logs.value = []
  message.success('已重置')
}
</script>

<template>
  <div class="stage-page">
    <header class="stage-header">
      <a class="back-link" @click="$router.push('/reactivity-deep')">← 返回概览</a>
      <h1>Stage 5：性能优化与常见陷阱</h1>
      <p class="subtitle">
        <code>shallowRef + triggerRef</code> 大对象优化、<code>reactive</code> 解构陷阱、 <code>v-once</code>、<code
          >v-memo</code
        >
        — 写出高性能 Vue 3 应用
      </p>
    </header>

    <!-- 1. shallowRef 性能 -->
    <section class="card">
      <h2>1. shallowRef vs ref — 大数据性能对比</h2>
      <p class="card-desc">
        当数据量很大（如 10000 条数组），<code>ref</code> 会深层代理每个元素，开销巨大。 <code>shallowRef</code> 只代理
        <code>.value</code> 层级，配合 <code>triggerRef</code> 手动触发更新。
      </p>
      <div class="demo-row">
        <div class="demo-col">
          <p>
            <strong>普通 ref：</strong>{{ normalBigData.length }} 条 | 加载耗时: {{ normalTime }}ms | 首项 value:
            {{ normalBigData[0]?.value?.toFixed(2) || '-' }}
          </p>
          <a-space>
            <a-button size="small" type="primary" @click="loadNormalRef">加载 10000 条</a-button>
            <a-button size="small" @click="modifyNormalItem">修改首元素</a-button>
          </a-space>
        </div>
        <div class="demo-col">
          <p>
            <strong>shallowRef：</strong>{{ shallowBigData.length }} 条 | 加载耗时: {{ shallowTime }}ms | 首项 value:
            {{ shallowBigData[0]?.value?.toFixed(2) || '-' }}
          </p>
          <a-space>
            <a-button size="small" type="primary" @click="loadShallowRef">加载 10000 条</a-button>
            <a-button size="small" @click="modifyShallowItem">修改不更新</a-button>
            <a-button size="small" @click="triggerShallowUpdate">triggerRef</a-button>
          </a-space>
        </div>
      </div>
      <a-alert
        type="warning"
        message="提示：该演示仅示例模式。浏览器 DevTools Performance 面板可测量更精确的差异。"
        show-icon
        style="margin-top: 12px"
      />
    </section>

    <!-- 2. reactive 解构陷阱 -->
    <section class="card">
      <h2>2. reactive 解构丢失响应性</h2>
      <p class="card-desc">
        用 ES6 解构 <code>reactive</code> 对象时，解构出的值是<strong>普通值</strong>，不再响应式。 必须使用
        <code>toRefs()</code> 或 <code>toRef()</code> 保持响应式绑定。
      </p>
      <div class="demo-row">
        <div class="demo-col">
          <p>原始 product: name={{ product.name }}, price={{ product.price }}, stock={{ product.stock }}</p>
          <a-space>
            <a-button
              size="small"
              type="primary"
              @click="product.price += 1000; addLog('product.price += 1000')"
              >涨价 +1000</a-button
            >
            <a-button
              size="small"
              @click="product.stock--; addLog('product.stock--')"
              >库存 -1</a-button
            >
          </a-space>
        </div>
      </div>
      <div class="compare-grid">
        <div class="compare-box bad">
          <h4>❌ 普通解构（丢失响应式）</h4>
          <p>name: {{ destructuredName }}</p>
          <p>price: {{ destructuredPrice }}</p>
          <p class="hint">点了「涨价」上面价格不变</p>
        </div>
        <div class="compare-box good">
          <h4>✅ toRefs 解构（保持响应式）</h4>
          <p>name: {{ refName }}</p>
          <p>price: {{ refPrice }}</p>
          <p>stock: {{ refStock }}</p>
          <p class="hint">点了「涨价」价格同步更新</p>
        </div>
      </div>
    </section>

    <!-- 3. v-once -->
    <section class="card">
      <h2>3. v-once — 只渲染一次</h2>
      <p class="card-desc">标记 <code>v-once</code> 的元素/组件只渲染一次，后续即使依赖数据变化也不会重新渲染。</p>
      <div class="demo-row">
        <div class="demo-col">
          <p>
            <strong>v-once 区域：</strong><span v-once class="highlight">初始值: {{ onceCount }}</span>
          </p>
          <p>
            <strong>普通区域：</strong><span class="highlight">当前值: {{ onceCount }}</span>
          </p>
          <a-button
            size="small"
            type="primary"
            @click="onceCount++; addLog(`onceCount++ → ${onceCount}`)"
            >onceCount++</a-button
          >
        </div>
      </div>
    </section>

    <!-- 4. v-memo -->
    <section class="card">
      <h2>4. v-memo — 条件性跳过更新</h2>
      <p class="card-desc">
        <code>v-memo="[deps]"</code>：只有依赖数组中的值变化时才重新渲染子树。 下面列表中，只有
        <code>selected</code> 属性变化才触发重新渲染，<code>otherState</code> 变化不影响。
      </p>
      <div class="demo-row">
        <div class="demo-col">
          <p>otherState: {{ otherState }}（变化不影响列表渲染）</p>
          <a-space>
            <a-button
              size="small"
              @click="incOther(); addLog('otherState++，列表不重新渲染')"
              >otherState++</a-button
            >
          </a-space>
          <div class="memo-list" style="margin-top: 12px">
            <div
              v-for="item in list"
              :key="item.id"
              v-memo="[item.selected]"
              :class="['memo-item', { selected: item.selected }]"
              @click="toggleItem(item.id)"
            >
              {{ item.name }} — {{ item.selected ? '✅ 已选' : '☐ 未选' }}
            </div>
          </div>
          <p class="hint" style="margin-top: 6px">点击列表项切换 selected，被点击的项才会重新渲染。</p>
        </div>
      </div>
    </section>

    <!-- 对比总结 -->
    <section class="card">
      <h2>5. 性能优化速查表</h2>
      <a-table
        :columns="[
          { title: '技术', dataIndex: 'tech', key: 'tech', width: 180 },
          { title: '适用场景', dataIndex: 'scenario', key: 'scenario' },
          { title: '效果', dataIndex: 'effect', key: 'effect' },
        ]"
        :data-source="[
          { tech: 'shallowRef', scenario: '大型对象/数组（如万条数据列表）', effect: '避免深层代理，减少创建开销' },
          { tech: 'shallowReactive', scenario: '嵌套层级深但只需顶层响应', effect: '跳过深层 Proxy 包装' },
          { tech: 'markRaw()', scenario: '第三方实例（地图/图表/WebGL）', effect: '永不代理，避免性能问题和副作用' },
          { tech: 'v-once', scenario: '静态内容（如页头、注释）', effect: '跳过后续所有 diff 和渲染' },
          {
            tech: 'v-memo',
            scenario: '大列表部分更新、子树选择性刷新',
            effect: '按依赖决定是否 diff，减少 VNode 对比',
          },
          { tech: 'computed 缓存', scenario: '计算密集型派生数据', effect: '依赖不变则直接返回缓存，不重复计算' },
          { tech: 'toRefs 而非解构', scenario: 'reactive 对象传给子组件', effect: '保持响应式，不创建额外副本' },
        ]"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- 操作日志 -->
    <section class="card">
      <h2>📋 操作日志</h2>
      <div class="log-container">
        <p v-for="(line, i) in logs" :key="i" class="log-line">{{ line }}</p>
        <p v-if="logs.length === 0" class="log-empty">点击上方按钮查看日志</p>
      </div>
    </section>

    <a-button @click="resetAll">全部重置</a-button>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

.stage-header {
  margin-bottom: 28px;
}

.back-link {
  display: inline-block;
  color: #888;
  cursor: pointer;
  font-size: 13px;
  margin-bottom: 8px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #1677ff;
}

.stage-header h1 {
  font-size: 24px;
  color: #1a1a1a;
  margin: 0 0 6px;
}

.subtitle {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
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
  padding: 22px 24px;
  margin-bottom: 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card h2 {
  margin: 0 0 6px;
  font-size: 17px;
  color: #333;
}

.card-desc {
  font-size: 13px;
  color: #888;
  margin: 0 0 14px;
  line-height: 1.5;
}

.card-desc code {
  background: #f0f0f0;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
  color: #1677ff;
}

.demo-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.demo-col {
  flex: 1;
  min-width: 260px;
}

.demo-col p {
  margin: 0 0 8px;
  font-size: 14px;
}

.demo-col code {
  background: #f0f0f0;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 13px;
  color: #333;
}

.highlight {
  background: #fff7e6;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  color: #fa8c16;
}

.compare-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 14px;
}

.compare-box {
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid;
}

.compare-box.bad {
  border-color: #ffa39e;
  background: #fff1f0;
}

.compare-box.good {
  border-color: #95de64;
  background: #f6ffed;
}

.compare-box h4 {
  margin: 0 0 8px;
  font-size: 14px;
}

.compare-box p {
  margin: 3px 0;
  font-size: 13px;
}

.compare-box .hint {
  color: #888;
  font-size: 12px;
  margin-top: 6px;
}

.memo-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.memo-item {
  padding: 8px 12px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  font-size: 13px;
  user-select: none;
}

.memo-item:hover {
  background: #f5f5f5;
}

.memo-item.selected {
  background: #e6f7ff;
  border-color: #91d5ff;
}

.hint {
  color: #aaa;
  font-size: 12px;
}

.log-container {
  max-height: 150px;
  overflow-y: auto;
  background: #fafafa;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  border: 1px solid #f0f0f0;
}

.log-line {
  margin: 0 0 3px;
  color: #555;
  font-family: monospace;
}

.log-empty {
  color: #bbb;
  margin: 0;
}

@media (max-width: 640px) {
  .demo-row,
  .compare-grid {
    grid-template-columns: 1fr;
  }
}
</style>
