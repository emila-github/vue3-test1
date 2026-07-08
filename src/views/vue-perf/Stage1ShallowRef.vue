<script setup lang="ts">
import { ref, shallowRef, shallowReactive, triggerRef, onMounted } from 'vue'

// ===== 常规数据示例 =====
const normalCount = ref(0)
const normalObj = ref({ a: 1, b: { c: 2 } })
const normalObjDisplay = ref('')

// ===== shallowRef 示例 =====
const shallowCount = shallowRef(0)
const shallowObj = shallowRef({ a: 1, b: { c: 2 } })
const shallowObjDisplay = ref('')

// ===== shallowReactive 示例 =====
const sReactiveState = shallowReactive({ x: 0, y: 0, nested: { z: 0 } })

// ===== Benchmark 数据 =====
const ITEM_COUNT = 10000
const refBenchTime = ref(0)
const shallowBenchTime = ref(0)
const benchRunning = ref(false)
const benchResults = ref<string[]>([])

// 生成大数组
function generateLargeArray(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: Math.random() * 1000,
    nested: { x: Math.random(), y: Math.random() },
  }))
}

function runBenchmark() {
  benchRunning.value = true
  benchResults.value = []

  // Benchmark ref
  const refArr = ref(generateLargeArray(ITEM_COUNT))
  const refStart = performance.now()
  for (let i = 0; i < 100; i++) {
    refArr.value = refArr.value.map((item) => ({
      ...item,
      value: Math.random() * 1000,
      nested: { ...item.nested },
    }))
  }
  const refEnd = performance.now()
  refBenchTime.value = +(refEnd - refStart).toFixed(2)

  // Benchmark shallowRef
  const shallowArr = shallowRef(generateLargeArray(ITEM_COUNT))
  const shallowStart = performance.now()
  for (let i = 0; i < 100; i++) {
    shallowArr.value = shallowArr.value.map((item) => ({
      ...item,
      value: Math.random() * 1000,
      nested: { ...item.nested },
    }))
  }
  triggerRef(shallowArr)
  const shallowEnd = performance.now()
  shallowBenchTime.value = +(shallowEnd - shallowStart).toFixed(2)

  const improvement = ((refBenchTime.value - shallowBenchTime.value) / refBenchTime.value * 100).toFixed(1)
  benchResults.value.push(`ref 总耗时: ${refBenchTime.value}ms`)
  benchResults.value.push(`shallowRef 总耗时: ${shallowBenchTime.value}ms`)
  benchResults.value.push(`性能提升: ${improvement}%`)
  benchResults.value.push(`数据量: ${ITEM_COUNT} 条 × 100 次更新`)

  benchRunning.value = false
}

function inspectRefObj() {
  normalObjDisplay.value = JSON.stringify(normalObj.value, null, 2)
}

function inspectShallowObj() {
  shallowObjDisplay.value = JSON.stringify(shallowObj.value, null, 2)
}

function updateNormalNested() {
  normalObj.value.b.c++
}

function updateShallowNested() {
  // 直接修改深层属性不会触发更新
  shallowObj.value.b.c++
  shallowObjDisplay.value = JSON.stringify(shallowObj.value, null, 2)
}

function updateShallowWithTrigger() {
  shallowObj.value.b.c++
  triggerRef(shallowObj)
  shallowObjDisplay.value = JSON.stringify(shallowObj.value, null, 2)
}

function updateShallowWhole() {
  shallowObj.value = { a: Date.now(), b: { c: Math.floor(Math.random() * 100) } }
}

// ===== 代码示例 =====
const codeRefExample = [
  'import { ref } from ' + "'vue'",
  '',
  '// ref 会深层追踪所有属性',
  'const data = ref({',
  '  user: { name: ' + "'Alice'" + ', profile: { age: 25 } }',
  '})',
  '',
  '// 修改深层属性 → 自动触发更新',
  'data.value.user.profile.age = 26 // ✅ 视图自动更新',
  '',
  '// 代价：每个深层属性都会被 Proxy 包装',
  '// 大对象（> 1000 属性）会产生显著性能开销',
].join('\n')

const codeShallowExample = [
  'import { shallowRef, triggerRef } from ' + "'vue'",
  '',
  '// shallowRef 仅追踪 .value 本身',
  'const data = shallowRef({',
  '  user: { name: ' + "'Alice'" + ', profile: { age: 25 } }',
  '})',
  '',
  '// 修改深层属性 → 不会自动触发更新',
  'data.value.user.profile.age = 26 // ❌ 视图不会更新',
  '',
  '// 需要手动触发',
  'triggerRef(data) // ✅ 手动触发更新',
  '',
  '// 或整体替换 .value',
  'data.value = { ...data.value, user: { ... } } // ✅ 自动更新',
].join('\n')

const codeShallowReactive = [
  'import { shallowReactive } from ' + "'vue'",
  '',
  'const state = shallowReactive({',
  '  count: 0,          // ✅ 第一层属性是响应式的',
  '  nested: { z: 0 },  // ❌ 深层属性不是响应式的',
  '})',
  '',
  'state.count++          // ✅ 触发更新',
  'state.nested.z++       // ❌ 不会触发更新',
  'state.nested = { z: 1 } // ✅ 替换整个 nested 会触发',
].join('\n')

const codeUseCases = [
  '// 1. 第三方库实例（ECharts、Three.js、地图等）',
  'const chartInstance = shallowRef<echarts.ECharts | null>(null)',
  '',
  '// 2. 大型不可变数据集',
  'const bigList = shallowRef<Item[]>([])',
  'bigList.value = newData // 整体替换触发更新',
  '',
  '// 3. 与 Pinia 配合',
  '// store 中存储大对象时使用 shallowRef',
  '',
  '// 4. DOM 引用',
  '// ref 本身就是浅层的，.value 是 DOM 元素',
].join('\n')

onMounted(() => {
  inspectRefObj()
  inspectShallowObj()
})
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 1：shallowRef / shallowReactive</h1>
      <p>浅层响应式减少追踪开销 — 适合大对象、第三方实例、不可变数据集</p>
    </header>

    <!-- 概念对比 -->
    <section class="card">
      <h2>ref vs shallowRef 对比</h2>
      <div class="compare-grid">
        <div class="compare-col bad">
          <h4>ref（深层响应式）</h4>
          <p>递归地将对象所有嵌套属性转为响应式。对于大对象，每个属性都需要创建 Proxy，产生大量追踪开销。</p>
        </div>
        <div class="compare-col good">
          <h4>shallowRef（浅层响应式）</h4>
          <p>只有 .value 的引用变化会触发更新。深层属性修改不触发，适合整体替换或手动 triggerRef 的场景。</p>
        </div>
      </div>
    </section>

    <!-- 交互演示：ref vs shallowRef -->
    <section class="card">
      <h2>交互演示：ref 对象 vs shallowRef 对象</h2>
      <div class="demo-area">
        <div class="demo-row">
          <div class="demo-col">
            <h3>ref 对象</h3>
            <p>当前值：</p>
            <div class="result-box">{{ normalObjDisplay || '点击下方按钮查看' }}</div>
            <div style="margin-top: 8px;">
              <button class="btn" @click="updateNormalNested">修改深层属性 b.c</button>
              <button class="btn" @click="inspectRefObj">查看当前值</button>
            </div>
            <p style="font-size: 12px; color: #999; margin-top: 4px;">b.c 的值：{{ normalObj.b.c }}（视图自动更新）</p>
          </div>
          <div class="demo-col">
            <h3>shallowRef 对象</h3>
            <p>当前值：</p>
            <div class="result-box">{{ shallowObjDisplay || '点击下方按钮查看' }}</div>
            <div style="margin-top: 8px;">
              <button class="btn" @click="updateShallowNested">修改深层属性 b.c（无更新）</button>
              <button class="btn" @click="updateShallowWithTrigger">修改后 triggerRef</button>
              <button class="btn" @click="updateShallowWhole">整体替换 .value</button>
              <button class="btn" @click="inspectShallowObj">查看当前值</button>
            </div>
            <p style="font-size: 12px; color: #999; margin-top: 4px;">b.c 的值：{{ shallowObj.b.c }}（数据已变，但视图不自动更新）</p>
          </div>
        </div>
      </div>
    </section>

    <!-- shallowReactive 演示 -->
    <section class="card">
      <h2>shallowReactive 演示</h2>
      <div class="demo-area">
        <p>state.x: <strong>{{ sReactiveState.x }}</strong> &nbsp; state.y: <strong>{{ sReactiveState.y }}</strong> &nbsp; state.nested.z: <strong>{{ sReactiveState.nested.z }}</strong></p>
        <div style="margin-top: 8px;">
          <button class="btn" @click="sReactiveState.x++">x++ (第一层 ✅)</button>
          <button class="btn" @click="sReactiveState.y++">y++ (第一层 ✅)</button>
          <button class="btn" @click="sReactiveState.nested.z++">nested.z++ (深层 ❌)</button>
        </div>
        <p style="font-size: 12px; color: #999; margin-top: 8px;">点击 nested.z++ 后数据已变但视图不会更新，因为只有第一层属性是响应式的。</p>
      </div>
    </section>

    <!-- Benchmark -->
    <section class="card">
      <h2>性能基准测试：ref vs shallowRef</h2>
      <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
        对 {{ ITEM_COUNT }} 条数据执行 100 次全量更新，对比两种方式的耗时差异。
      </p>
      <div class="demo-area">
        <button class="btn" @click="runBenchmark" :disabled="benchRunning">
          {{ benchRunning ? '测试中...' : '运行基准测试' }}
        </button>
        <div v-if="refBenchTime > 0" class="bench-display">
          <div class="bench-item">
            <span class="bench-label">ref</span>
            <span class="bench-num" style="color: #ff4d4f;">{{ refBenchTime }}ms</span>
          </div>
          <div class="bench-item">
            <span class="bench-label">shallowRef</span>
            <span class="bench-num" style="color: #52c41a;">{{ shallowBenchTime }}ms</span>
          </div>
        </div>
        <div v-if="benchResults.length > 0" class="result-box" style="margin-top: 12px;">
          <div v-for="r in benchResults" :key="r">{{ r }}</div>
        </div>
      </div>
    </section>

    <!-- 使用场景 -->
    <section class="card">
      <h2>适用场景</h2>
      <div class="info-grid">
        <div class="info-item">
          <strong>第三方库实例</strong>
          <span>ECharts、Three.js、地图 SDK 等实例对象不需要深层响应式</span>
        </div>
        <div class="info-item">
          <strong>大型不可变数据</strong>
          <span>每次整体替换数组/对象，配合 immutable 模式使用</span>
        </div>
        <div class="info-item">
          <strong>频繁更新的列表</strong>
          <span>虚拟滚动场景中仅需要列表引用变化触发渲染</span>
        </div>
        <div class="info-item">
          <strong>复杂嵌套表单</strong>
          <span>与 toRaw 配合，手动控制更新时机避免频繁重渲染</span>
        </div>
      </div>
    </section>

    <!-- 代码示例 -->
    <section class="card">
      <h2>代码示例</h2>
      <h3>ref 深层响应式</h3>
      <pre class="code-block"><code>{{ codeRefExample }}</code></pre>

      <h3>shallowRef 浅层响应式</h3>
      <pre class="code-block"><code>{{ codeShallowExample }}</code></pre>

      <h3>shallowReactive</h3>
      <pre class="code-block"><code>{{ codeShallowReactive }}</code></pre>

      <h3>典型使用场景</h3>
      <pre class="code-block"><code>{{ codeUseCases }}</code></pre>
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
.btn:disabled { background: #bbb; cursor: not-allowed; }
.btn.reset { background: #ff4d4f; }
.btn.reset:hover { background: #d9363e; }
.result-box { padding: 12px; background: #f5f5f5; border-left: 3px solid #52c41a; border-radius: 4px; margin-top: 12px; font-family: monospace; font-size: 13px; white-space: pre-wrap; }
.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.info-item { padding: 12px; background: #fafafa; border-radius: 6px; border: 1px solid #f0f0f0; }
.info-item strong { display: block; margin-bottom: 4px; color: #333; font-size: 14px; }
.info-item span { font-size: 12px; color: #999; }
.info-item code { background: #e8e8e8; padding: 2px 6px; border-radius: 3px; font-size: 13px; }
.compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.compare-col { padding: 16px; border-radius: 8px; }
.compare-col.bad { background: #fff2f0; border: 1px solid #ffccc7; }
.compare-col.good { background: #f6ffed; border: 1px solid #b7eb8f; }
.compare-col h4 { margin: 0 0 8px; font-size: 14px; }
.compare-col p { font-size: 13px; color: #666; line-height: 1.6; }
.bench-display { display: flex; gap: 16px; align-items: center; margin-top: 12px; }
.bench-item { text-align: center; padding: 8px 20px; background: #fff; border-radius: 8px; border: 1px solid #f0f0f0; }
.bench-num { font-size: 24px; font-weight: 700; display: block; }
.bench-label { font-size: 13px; color: #999; display: block; margin-bottom: 4px; }
.demo-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.demo-col h3 { margin: 0 0 8px; font-size: 15px; }
.demo-col p { font-size: 13px; color: #888; margin: 4px 0; }
@media (max-width: 640px) {
  .compare-grid, .demo-row { grid-template-columns: 1fr; }
}
</style>
