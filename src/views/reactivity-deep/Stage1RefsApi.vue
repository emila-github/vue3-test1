<script setup lang="ts">
import {
  ref,
  reactive,
  readonly,
  shallowRef,
  shallowReactive,
  toRef,
  toRefs,
  unref,
  isRef,
  isReactive,
  isReadonly,
  isProxy,
  toRaw,
  markRaw,
  computed,
} from 'vue'
import { message } from 'ant-design-vue'

// ========== 1. ref ==========
const count = ref(0)
const refObj = ref({ name: '张三', age: 25 })

// ========== 2. reactive ==========
const user = reactive({ name: '李四', age: 30, address: { city: '北京' } })

// ========== 3. shallowRef ==========
const shallowObj = shallowRef({ items: [] as string[], count: 0 })

// ========== 4. shallowReactive ==========
const shallowState = shallowReactive({ deep: { a: 1 }, surface: 'hello' })

// ========== 5. readonly ==========
const userReadonly = readonly(user)

// ========== 6. toRef / toRefs ==========
const ageRef = toRef(user, 'age')
const { name: userName, address } = toRefs(user)

// ========== 7. isRef / isReactive / isProxy ==========
const checkResults = computed(() => ({
  'isRef(count)': isRef(count),
  'isRef(user)': isRef(user),
  'isReactive(user)': isReactive(user),
  'isReactive(count)': isReactive(count),
  'isReadonly(userReadonly)': isReadonly(userReadonly),
  'isProxy(user)': isProxy(user),
  'isProxy(userReadonly)': isProxy(userReadonly),
  'unref(count)': unref(count),
  'unref(refObj)': unref(refObj),
}))

// ========== 8. toRaw / markRaw ==========
const rawUser = toRaw(user)
const markedObj = reactive({ a: 1, b: markRaw({ nested: '不会代理' }) })

// ========== 操作日志 ==========
const logs = ref<string[]>([])

function addLog(msg: string) {
  logs.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// ---- ref ----
function incRef() {
  count.value++
  addLog(`ref count++ → ${count.value}`)
}
function updateRefObj() {
  refObj.value.age++
  addLog(`ref 对象 age++ → ${JSON.stringify(refObj.value)}`)
}

// ---- reactive ----
function updateReactive() {
  user.age++
  addLog(`user.age++ → ${user.age}`)
}
function updateNested() {
  user.address.city = user.address.city === '北京' ? '上海' : '北京'
  addLog(`嵌套对象 city → ${user.address.city}`)
}
function addNewProp() {
  // @ts-ignore — 演示 reactive 可以直接添加新属性（Proxy 特性）
  user.email = 'test@vue.org'
  addLog(`添加新属性 email → ${(user as any).email}`)
}

// ---- shallowRef ----
function addShallowItem() {
  shallowObj.value.items.push(`Item ${Date.now() % 1000}`)
  shallowObj.value.count++
  addLog(`浅层修改（不会触发更新）→ 次数 ${shallowObj.value.count}`)
}
function triggerShallow() {
  shallowObj.value = { items: shallowObj.value.items, count: shallowObj.value.count }
  addLog(`整体替换触发更新 → ${shallowObj.value.items.length} 项`)
}

// ---- shallowReactive ----
function updateShallowSurface() {
  shallowState.surface += '!'
  addLog(`shallowReactive 顶层修改 surface → ${shallowState.surface}`)
}
function updateShallowDeep() {
  shallowState.deep.a++
  addLog(`shallowReactive 深层修改（不会触发更新）→ ${shallowState.deep.a}`)
}

// ---- readonly ----
function tryModifyReadonly() {
  try {
    ;(userReadonly as any).age = 999
    addLog('readonly 修改被阻止（开发模式警告）')
  } catch {
    addLog('readonly 修改失败')
  }
}

// ---- toRef ----
function changeToRef() {
  ageRef.value++
  addLog(`toRef ageRef++ → ${ageRef.value}，原始 user.age = ${user.age}`)
}

// ---- 重置 ----
function resetAll() {
  count.value = 0
  refObj.value = { name: '张三', age: 25 }
  user.name = '李四'
  user.age = 30
  user.address.city = '北京'
  // @ts-ignore
  delete user.email
  shallowObj.value = { items: [], count: 0 }
  logs.value = []
  message.success('已重置')
}
</script>

<template>
  <div class="stage-page">
    <header class="stage-header">
      <a class="back-link" @click="$router.push('/reactivity-deep')">← 返回概览</a>
      <h1>Stage 1：ref / reactive API 家族</h1>
      <p class="subtitle">
        全面对比 <code>ref</code> / <code>reactive</code> / <code>shallowRef</code> / <code>shallowReactive</code> /
        <code>readonly</code> / <code>toRef</code> / <code>toRefs</code> / <code>isRef</code> / <code>toRaw</code> /
        <code>markRaw</code>
      </p>
    </header>

    <!-- 基础 ref -->
    <section class="card">
      <h2>1. ref() — 基本响应式值</h2>
      <p class="card-desc">ref 将任意值包装为 <code>.value</code> 访问的响应式引用，支持基本类型和对象。</p>
      <div class="demo-row">
        <div class="demo-col">
          <p>
            <strong>数字 ref：</strong><code>{{ count }}</code>
          </p>
          <a-button size="small" type="primary" @click="incRef">count++</a-button>
        </div>
        <div class="demo-col">
          <p>
            <strong>对象 ref：</strong><code>{{ JSON.stringify(refObj) }}</code>
          </p>
          <a-button size="small" type="primary" @click="updateRefObj">age++</a-button>
        </div>
      </div>
    </section>

    <!-- reactive -->
    <section class="card">
      <h2>2. reactive() — 深层响应式对象</h2>
      <p class="card-desc">
        reactive 基于 Proxy 实现深层代理，可直接修改属性，无需 <code>.value</code>，也可动态添加新属性。
      </p>
      <div class="demo-row">
        <div class="demo-col">
          <p>
            <code>user:</code>
            {{ JSON.stringify({ name: user.name, age: user.age, address: user.address, email: (user as any).email }) }}
          </p>
          <a-space>
            <a-button size="small" type="primary" @click="updateReactive">age++</a-button>
            <a-button size="small" @click="updateNested">切换 city</a-button>
            <a-button size="small" @click="addNewProp">添加 email 属性</a-button>
          </a-space>
        </div>
      </div>
    </section>

    <!-- shallowRef -->
    <section class="card">
      <h2>3. shallowRef() — 浅层 ref，只对 .value 访问做响应式</h2>
      <p class="card-desc">
        修改 <code>shallowObj.value.xxx</code> <strong>不会</strong>触发更新，必须整体替换 <code>.value</code> 或调用
        <code>triggerRef()</code>。
      </p>
      <div class="demo-row">
        <div class="demo-col">
          <p>items: {{ shallowObj.items.length }} 项 | count: {{ shallowObj.count }}</p>
          <a-space>
            <a-button size="small" @click="addShallowItem">添加（不触发更新）</a-button>
            <a-button size="small" type="primary" @click="triggerShallow">整体替换（触发更新）</a-button>
          </a-space>
        </div>
      </div>
    </section>

    <!-- shallowReactive -->
    <section class="card">
      <h2>4. shallowReactive() — 浅层 reactive，只有顶层属性被代理</h2>
      <p class="card-desc">修改 <code>deep.a</code> 不触发更新，修改 <code>surface</code> 触发。</p>
      <div class="demo-row">
        <div class="demo-col">
          <p>surface: {{ shallowState.surface }} | deep.a: {{ shallowState.deep.a }}</p>
          <a-space>
            <a-button size="small" type="primary" @click="updateShallowSurface">修改 surface（触发）</a-button>
            <a-button size="small" @click="updateShallowDeep">修改 deep.a（不触发）</a-button>
          </a-space>
        </div>
      </div>
    </section>

    <!-- readonly -->
    <section class="card">
      <h2>5. readonly() — 只读代理</h2>
      <p class="card-desc">防止数据被修改，开发模式下修改会警告。内部仍然追踪原始数据的依赖。</p>
      <div class="demo-row">
        <div class="demo-col">
          <a-button size="small" danger @click="tryModifyReadonly">尝试修改 readonly</a-button>
        </div>
      </div>
    </section>

    <!-- toRef / toRefs -->
    <section class="card">
      <h2>6. toRef() / toRefs() — 保持响应式的解构</h2>
      <p class="card-desc">
        <code>toRef(obj, key)</code> 为单个属性创建 ref | <code>toRefs(obj)</code> 将整个 reactive 对象转为 ref 集合。
      </p>
      <div class="demo-row">
        <div class="demo-col">
          <p>
            <code>userName:</code> {{ userName }} | <code>ageRef:</code> {{ ageRef }} | <code>address.city:</code>
            {{ address.city }}
          </p>
          <a-space>
            <a-button size="small" type="primary" @click="changeToRef">toRef 修改 age</a-button>
          </a-space>
        </div>
      </div>
    </section>

    <!-- isRef / isReactive 检测 -->
    <section class="card">
      <h2>7. 类型检测 API</h2>
      <a-table
        :columns="[
          { title: '检测表达式', dataIndex: 'key', key: 'key', width: 260 },
          { title: '结果', dataIndex: 'value', key: 'value' },
        ]"
        :data-source="Object.entries(checkResults).map(([k, v]) => ({ key: k, value: String(v) }))"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- toRaw / markRaw -->
    <section class="card">
      <h2>8. toRaw() / markRaw() — 脱离代理</h2>
      <p class="card-desc">
        <code>toRaw(reactiveObj)</code> 返回原始对象（不含 Proxy 包装）。<br />
        <code>markRaw(obj)</code> 标记对象永不代理，适合第三方类实例、大型不可变数据。
      </p>
      <div class="demo-row">
        <div class="demo-col">
          <p><code>toRaw(user) === rawUser</code> → {{ rawUser === toRaw(user) ? '✅ true' : '❌ false' }}</p>
          <p>
            <code>isReactive(markedObj.b)</code> →
            {{ isReactive(markedObj.b) ? '❌ 意外被代理' : '✅ false（未被代理）' }}
          </p>
        </div>
      </div>
    </section>

    <!-- 操作日志 -->
    <section class="card">
      <h2>📋 操作日志</h2>
      <div class="log-container">
        <p v-for="(line, i) in logs" :key="i" class="log-line">{{ line }}</p>
        <p v-if="logs.length === 0" class="log-empty">暂无日志，点击上方按钮开始</p>
      </div>
      <a-button v-if="logs.length > 0" size="small" style="margin-top: 12px" @click="logs = []">清空日志</a-button>
      <a-button size="small" style="margin-top: 12px; margin-left: 8px" @click="resetAll">全部重置</a-button>
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
  word-break: break-all;
}

.demo-col code {
  background: #f0f0f0;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 13px;
  color: #333;
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
