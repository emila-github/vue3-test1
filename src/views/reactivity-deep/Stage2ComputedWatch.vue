<script setup lang="ts">
import { ref, reactive, computed, watch, watchEffect, nextTick } from 'vue'
import { message } from 'ant-design-vue'

// ========== 1. computed（只读） ==========
const price = ref(100)
const quantity = ref(3)
const total = computed(() => price.value * quantity.value)

// ========== 2. computed（可写） ==========
const firstName = ref('张')
const lastName = ref('三')
const fullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (val: string) => {
    const parts = val.split(' ')
    firstName.value = parts[0] || ''
    lastName.value = parts[1] || ''
  },
})

// ========== 3. watch（侦听单一源） ==========
const count = ref(0)

// ========== 4. watch（deep 选项） ==========
const profile = reactive({ name: '王五', info: { score: 80 } })

// ========== 5. watch（immediate） ==========
const search = ref('')

// ========== 6. watchEffect ==========
const watchEffectCount = ref(0)
const watchEffectResult = ref('')

// ========== 日志 ==========
const logs = ref<string[]>([])

function addLog(msg: string) {
  logs.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// ---- setup watches ----
// watch count
// Using a watcher that tracks changes
let watchTriggered = false

// watchEffect: 自动追踪
watchEffect(() => {
  const val = watchEffectCount.value
  if (watchTriggered) {
    watchEffectResult.value = `count = ${val}，当前时间 ${new Date().toLocaleTimeString()}`
    addLog(`watchEffect 触发 → count=${val}`)
  }
  watchTriggered = true
})

// watch immediate
watch(
  search,
  (newVal) => {
    addLog(`watch(search) immediate → "${newVal}"`)
  },
  { immediate: true },
)

// ---- 操作方法 ----
function inc() {
  count.value++
  addLog(`count++ → ${count.value}`)
  message.info(`count = ${count.value}`)
}

function incWatchEffect() {
  watchEffectCount.value++
  addLog(`watchEffectCount++ → ${watchEffectCount.value}`)
}

function changeProfile() {
  profile.info.score += 10
  addLog(`修改嵌套属性 profile.info.score → ${profile.info.score}`)
}
function replaceProfile() {
  profile.name = profile.name === '王五' ? '赵六' : '王五'
  addLog(`修改顶层属性 profile.name → ${profile.name}`)
}

function setFullName() {
  fullName.value = '李 四'
  addLog(`设置 fullName = "李 四" → firstName: ${firstName.value}, lastName: ${lastName.value}`)
}

function changePrice() {
  price.value += 50
  addLog(`price +50 → ${price.value}，total = ${total.value}`)
}

function changeQty() {
  quantity.value++
  addLog(`quantity++ → ${quantity.value}，total = ${total.value}`)
}

function resetAll() {
  price.value = 100
  quantity.value = 3
  count.value = 0
  watchEffectCount.value = 0
  watchEffectResult.value = ''
  watchTriggered = false
  profile.name = '王五'
  profile.info.score = 80
  firstName.value = '张'
  lastName.value = '三'
  search.value = ''
  logs.value = []
  message.success('已重置')
}
</script>

<template>
  <div class="stage-page">
    <header class="stage-header">
      <a class="back-link" @click="$router.push('/reactivity-deep')">← 返回概览</a>
      <h1>Stage 2：computed & watch 深入</h1>
      <p class="subtitle">
        可写 computed、watch deep / immediate / flush、watchEffect / watchPostEffect / watchSyncEffect —
        精确把控副作用执行时机
      </p>
    </header>

    <!-- computed 只读 -->
    <section class="card">
      <h2>1. computed() — 只读计算属性</h2>
      <p class="card-desc">依赖自动追踪，缓存值直到依赖变化。适合从已有数据推导出新值。</p>
      <div class="demo-row">
        <div class="demo-col">
          <p>
            <code>price:</code> {{ price }} | <code>quantity:</code> {{ quantity }} →
            <strong>total: {{ total }}</strong>
          </p>
          <a-space>
            <a-button size="small" type="primary" @click="changePrice">price +50</a-button>
            <a-button size="small" @click="changeQty">qty++</a-button>
          </a-space>
        </div>
      </div>
    </section>

    <!-- computed 可写 -->
    <section class="card">
      <h2>2. computed() — 可写计算属性</h2>
      <p class="card-desc">提供 get/set 函数，set 时修改原始数据，适合 v-model 双向绑定。</p>
      <div class="demo-row">
        <div class="demo-col">
          <p>
            <code>firstName:</code> {{ firstName }} | <code>lastName:</code> {{ lastName }} →
            <strong>fullName: {{ fullName }}</strong>
          </p>
          <a-button size="small" type="primary" @click="setFullName">设置 fullName = "李 四"</a-button>
        </div>
      </div>
    </section>

    <!-- watch 基础 -->
    <section class="card">
      <h2>3. watch() — 侦听器基础</h2>
      <p class="card-desc">
        精确侦听指定数据源，获取新旧值。支持 <code>ref</code>、<code>reactive 属性</code>、<code>getter</code>、数组。
      </p>
      <div class="demo-row">
        <div class="demo-col">
          <p>count: {{ count }}</p>
          <a-button size="small" type="primary" @click="inc">count++</a-button>
        </div>
      </div>
    </section>

    <!-- watch deep -->
    <section class="card">
      <h2>4. watch() — deep 深度侦听</h2>
      <p class="card-desc">设置 <code>{ deep: true }</code> 后，嵌套属性变化也能触发回调。reactive 对象默认 deep。</p>
      <div class="demo-row">
        <div class="demo-col">
          <p>profile: {{ JSON.stringify(profile) }}</p>
          <a-space>
            <a-button size="small" type="primary" @click="changeProfile">修改 score +10（深层）</a-button>
            <a-button size="small" @click="replaceProfile">修改 name（顶层）</a-button>
          </a-space>
        </div>
      </div>
    </section>

    <!-- watch immediate -->
    <section class="card">
      <h2>5. watch() — immediate 立即执行</h2>
      <p class="card-desc">设置 <code>{ immediate: true }</code>，watch 在创建时立即执行一次回调。</p>
      <div class="demo-row">
        <div class="demo-col">
          <a-input-search
            v-model:value="search"
            placeholder="输入搜索内容（watch immediate 会记录初始值）"
            style="max-width: 300px"
            allow-clear
          />
        </div>
      </div>
    </section>

    <!-- watchEffect -->
    <section class="card">
      <h2>6. watchEffect() — 自动追踪副作用</h2>
      <p class="card-desc">
        自动追踪回调中所有响应式依赖，依赖变化时重新执行。<strong>不需要指定侦听源</strong>，比 watch 更简洁。
      </p>
      <div class="demo-row">
        <div class="demo-col">
          <p>watchEffectCount: {{ watchEffectCount }}</p>
          <p class="effect-result" v-if="watchEffectResult">→ {{ watchEffectResult }}</p>
          <a-button size="small" type="primary" @click="incWatchEffect">count++</a-button>
        </div>
      </div>
    </section>

    <!-- 对比表 -->
    <section class="card">
      <h2>7. watch vs watchEffect 对比</h2>
      <a-table
        :columns="[
          { title: '特性', dataIndex: 'feature', key: 'feature', width: 160 },
          { title: 'watch', dataIndex: 'watch', key: 'watch' },
          { title: 'watchEffect', dataIndex: 'watchEffect', key: 'watchEffect' },
        ]"
        :data-source="[
          { feature: '侦听源', watch: '手动指定（ref/getter/数组）', watchEffect: '自动追踪回调中的依赖' },
          { feature: '新旧值', watch: '✅ 回调参数 (newVal, oldVal)', watchEffect: '❌ 无新旧值' },
          { feature: '立即执行', watch: '默认不执行，需 immediate: true', watchEffect: '✅ 创建时立即执行' },
          { feature: 'deep 选项', watch: '✅ 支持', watchEffect: '✅ 自动深层追踪' },
          { feature: 'flush 选项', watch: '✅ pre/post/sync', watchEffect: '✅ pre/post/sync' },
          { feature: '停止侦听', watch: '调用返回的 stop()', watchEffect: '调用返回的 stop()' },
          { feature: '使用场景', watch: '需要比较新旧值的场景', watchEffect: '副作用不关心变化细节' },
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
        <p v-if="logs.length === 0" class="log-empty">暂无日志</p>
      </div>
      <a-space style="margin-top: 12px">
        <a-button v-if="logs.length > 0" size="small" @click="logs = []">清空日志</a-button>
        <a-button size="small" @click="resetAll">全部重置</a-button>
      </a-space>
    </section>
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

.effect-result {
  color: #1677ff !important;
  font-size: 13px !important;
  background: #e6f7ff;
  padding: 6px 10px;
  border-radius: 6px;
  word-break: break-all;
}

.log-container {
  max-height: 200px;
  overflow-y: auto;
  background: #fafafa;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  border: 1px solid #f0f0f0;
}

.log-line {
  margin: 0 0 4px;
  color: #555;
  font-family: monospace;
}

.log-empty {
  color: #bbb;
  margin: 0;
}

@media (max-width: 640px) {
  .demo-row {
    flex-direction: column;
  }
}
</style>
