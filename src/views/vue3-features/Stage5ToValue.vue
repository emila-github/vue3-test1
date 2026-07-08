<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

// toValue 演示
const rawValue = ref('Hello')
const getterValue = () => rawValue.value.toUpperCase()
const plainValue = 'Plain Text'

function showToValueResult() {
  addLog(`toValue(rawValue) = "${rawValue.value}" (ref 自动解包)`)
  addLog(`toValue(getterValue) = "${getterValue()}" (调用 getter)`)
  addLog(`toValue(plainValue) = "${plainValue}" (普通值原样返回)`)
}

// onWatcherCleanup 演示
const fetchCount = ref(0)
const fetchResult = ref('等待请求...')

function simulateFetch() {
  fetchCount.value++
  const id = fetchCount.value
  fetchResult.value = '请求中...'
  addLog(`发起请求 #${id}`)

  watchEffect((onCleanup) => {
    let cancelled = false
    onCleanup(() => {
      cancelled = true
      addLog(`请求 #${id} 被取消（cleanup 触发）`)
    })

    setTimeout(() => {
      if (!cancelled) {
        fetchResult.value = `请求 #${id} 结果：成功！`
        addLog(`请求 #${id} 完成`)
      }
    }, 2000)
  })
}

const toValueCode = `// toValue() — 统一处理 MaybeRefOrGetter（3.3+）
import { toValue } from 'vue'

// 之前需要手动判断
function useFeature(input) {
  const value = computed(() =>
    isRef(input) ? input.value : typeof input === 'function' ? input() : input
  )
}

// 现在一行搞定！
function useFeature(input) {
  const value = computed(() => toValue(input))
}

// 使用场景
useFeature(ref(5))          // → 5
useFeature(() => 10)         // → 10
useFeature(15)               // → 15`

const watcherCleanupCode = `// onWatcherCleanup() — 在 watch/watchEffect 中注册清理（3.5+）
import { watch, onWatcherCleanup } from 'vue'

watch(userId, async (newId, oldId, onCleanup) => {
  let cancelled = false
  onCleanup(() => { cancelled = true })

  const data = await fetch('/api/user/' + newId)
  if (!cancelled) {
    userData.value = data
  }
})

// 等价于 onWatcherCleanup 语法糖
watch(userId, async (newId) => {
  let cancelled = false
  onWatcherCleanup(() => { cancelled = true })
  // ...
})`

const apiList = ref([
  { api: 'toValue()', ver: '3.3', desc: '统一处理 ref、getter、普通值，返回原始值' },
  { api: 'onWatcherCleanup()', ver: '3.5', desc: '在 watch/watchEffect 内部注册清理函数' },
  { api: 'toRef()', ver: '3.3', desc: '基于响应式对象的属性创建 ref' },
  { api: 'toRefs()', ver: '3.0', desc: '将响应式对象的每个属性转为 ref' },
  { api: 'isRef()', ver: '3.0', desc: '判断一个值是否为 ref' },
  { api: 'unref()', ver: '3.0', desc: 'ref 返回 .value，否则返回原值（toValue 的前身）' },
])
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 5：toValue & 其他新 API</h1>
      <p>掌握 toValue() 统一 MaybeRef 处理、onWatcherCleanup() 内部清理，以及其他实用工具 API。</p>
    </header>

    <!-- toValue -->
    <section class="card">
      <h2>toValue() — 统一 MaybeRef 处理</h2>
      <p class="intro">
        <code>toValue()</code> 可以接受 <strong>ref</strong>、<strong>getter 函数</strong> 或 <strong>普通值</strong>，
        统一返回原始值。是编写 <strong>可适配组合式函数</strong> 的关键 API。
      </p>
      <pre class="code-block"><code>{{ toValueCode }}</code></pre>

      <h3>交互演示：三种输入类型</h3>
      <div class="demo-area">
        <p>ref: <code>{{ rawValue }}</code></p>
        <p>getter: <code>{{ getterValue() }}</code></p>
        <p>plain: <code>{{ plainValue }}</code></p>
        <button class="btn" @click="showToValueResult">调用 toValue() 查看结果</button>
      </div>
    </section>

    <!-- onWatcherCleanup -->
    <section class="card">
      <h2>onWatcherCleanup() — watch 内部清理</h2>
      <p class="intro">
        Vue 3.5 新增的 <code>onWatcherCleanup()</code> 可以在 watch/watchEffect 回调内部直接注册清理函数，
        避免了原先需要通过第三个参数 <code>onCleanup</code> 的方式。
      </p>
      <pre class="code-block"><code>{{ watcherCleanupCode }}</code></pre>

      <h3>交互演示：竞态请求处理</h3>
      <div class="demo-area">
        <p>模拟快速切换请求场景：</p>
        <p style="font-size: 14px; color: #666; margin: 8px 0;">
          连续点击按钮会触发多次请求，只有最后一次请求的结果会被使用，之前的请求会被自动取消。
        </p>
        <button class="btn" @click="simulateFetch">发起请求 #{{ fetchCount + 1 }}</button>
        <div class="result-box" style="margin-top: 12px;">{{ fetchResult }}</div>
      </div>
    </section>

    <!-- 其他工具 API -->
    <section class="card">
      <h2>其他实用工具 API</h2>
      <div class="info-grid">
        <div v-for="item in apiList" :key="item.api" class="info-item">
          <strong>
            <code>{{ item.api }}</code>
            <span class="ver-tag">{{ item.ver }}</span>
          </strong>
          <span>{{ item.desc }}</span>
        </div>
      </div>
    </section>

    <!-- 操作日志 -->
    <section class="card" v-if="log.length">
      <h2>操作日志</h2>
      <div class="log-panel">
        <div v-for="(l, i) in log" :key="i">{{ l }}</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page { max-width: 960px; margin: 0 auto; padding: 24px; }
.page-header { text-align: center; margin-bottom: 32px; }
.page-header h1 { font-size: 28px; color: #1a1a1a; margin: 0 0 8px; }
.page-header p { color: #666; font-size: 14px; line-height: 1.6; }
.card { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.card h2 { margin: 0 0 16px; font-size: 18px; color: #333; }
.card h3 { margin: 20px 0 10px; font-size: 15px; color: #555; }
.intro { color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 12px; }
.intro code { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; font-size: 13px; }
.code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.6; margin: 12px 0; }
.demo-area { padding: 16px; background: #fafafa; border-radius: 8px; margin: 12px 0; font-size: 14px; }
.btn { padding: 8px 16px; background: #3178c6; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; margin-top: 8px; }
.btn:hover { background: #265ea8; }
.result-box { padding: 12px; background: #f5f5f5; border-left: 3px solid #52c41a; border-radius: 4px; font-family: monospace; font-size: 13px; }
.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.info-item { padding: 12px; background: #fafafa; border-radius: 6px; border: 1px solid #f0f0f0; }
.info-item strong { display: block; margin-bottom: 6px; font-size: 14px; color: #333; display: flex; align-items: center; gap: 6px; }
.info-item code { background: #e8e8e8; padding: 2px 6px; border-radius: 3px; font-size: 13px; }
.info-item span { font-size: 12px; color: #999; }
.ver-tag { font-size: 10px; padding: 1px 5px; border-radius: 8px; background: #e6f7ff; color: #1890ff; font-weight: 500; }
.log-panel { background: #fafafa; border: 1px solid #f0f0f0; border-radius: 8px; padding: 12px; max-height: 200px; overflow-y: auto; font-family: monospace; font-size: 12px; color: #666; }
@media (max-width: 768px) { .info-grid { grid-template-columns: 1fr; } }
</style>
