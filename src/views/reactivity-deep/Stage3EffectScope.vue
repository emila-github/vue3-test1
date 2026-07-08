<script setup lang="ts">
import { ref, effectScope, onScopeDispose, getCurrentScope, watch, watchEffect, computed } from 'vue'
import { message } from 'ant-design-vue'

// ========== 场景 1: 基础 effectScope ==========
const count1 = ref(0)
const count2 = ref(0)
const scope1Active = ref(false)
let scope1: ReturnType<typeof effectScope> | null = null

const scope1Logs = ref<string[]>([])

function startScope1() {
  scope1 = effectScope()
  scope1Active.value = true

  scope1.run(() => {
    // 注册多个副作用
    watch(count1, (val) => {
      scope1Logs.value.push(`watch(count1) → ${val}`)
    })
    watch(count2, (val) => {
      scope1Logs.value.push(`watch(count2) → ${val}`)
    })
    watchEffect(() => {
      scope1Logs.value.push(`watchEffect → count1=${count1.value}, count2=${count2.value}`)
    })
    // 注册清理回调
    onScopeDispose(() => {
      scope1Logs.value.push('🧹 onScopeDispose 清理回调执行')
      message.warning('effectScope 已停止，所有副作用已清理')
    })
  })
  scope1Logs.value.push('✅ effectScope 已创建并启动')
}

function stopScope1() {
  scope1?.stop()
  scope1Active.value = false
  scope1 = null
}

function inc1() {
  count1.value++
}
function inc2() {
  count2.value++
}

// ========== 场景 2: 组合式函数中的 effectScope ==========
function useControlledTimer() {
  const tick = ref(0)
  const isRunning = ref(false)
  const scope = effectScope()

  scope.run(() => {
    const id = setInterval(() => {
      tick.value++
    }, 1000)

    isRunning.value = true

    onScopeDispose(() => {
      clearInterval(id)
      isRunning.value = false
    })
  })

  return {
    tick,
    isRunning,
    stop: () => scope.stop(),
  }
}

const timer1 = useControlledTimer()
const timer2 = useControlledTimer()

// ========== 场景 3: 嵌套 scope ==========
const parentLogs = ref<string[]>([])

function runNestedScope() {
  const parentScope = effectScope()

  parentScope.run(() => {
    parentLogs.value.push('👤 父 scope 启动')

    // 创建子 scope 1
    const child1 = effectScope(true) // detached = true，不继承父 scope 生命周期
    child1.run(() => {
      watchEffect(() => {
        /* 不会因父 scope.stop() 而停止 */
      })
    })

    // 创建子 scope 2（默认继承）
    const child2 = effectScope()
    child2.run(() => {
      watchEffect(() => {
        /* 随父 scope 一起停止 */
      })

      onScopeDispose(() => {
        parentLogs.value.push('🧹 子 scope2 清理')
      })
    })

    onScopeDispose(() => {
      parentLogs.value.push('🧹 父 scope 清理')
      message.info('父 scope.stop()：子 scope1(detached) 不受影响，子 scope2 被清理')
    })

    parentLogs.value.push('✅ 嵌套 scope 已创建（child1 detached, child2 继承）')

    // 3 秒后停止父 scope
    setTimeout(() => {
      parentScope.stop()
    }, 3000)
  })
}

// ========== 场景 4: getCurrentScope ==========
const currentScopeInfo = ref('点击按钮查看')

function checkCurrentScope() {
  const scope = getCurrentScope()
  if (scope) {
    currentScopeInfo.value = `当前在 effectScope 内运行`
  } else {
    currentScopeInfo.value = '当前不在任何 effectScope 中'
  }
}

// 演示：在 scope 内检测
function demoCheckInScope() {
  const tempScope = effectScope()
  tempScope.run(() => {
    const cs = getCurrentScope()
    currentScopeInfo.value = cs ? '✅ 检测到当前在 effectScope 内' : '❌ 未检测到'
    message.success(currentScopeInfo.value)
  })
  tempScope.stop()
}

function demoCheckOutside() {
  const cs = getCurrentScope()
  currentScopeInfo.value = cs ? '❓ 意外在 effectScope 内' : '✅ 当前不在任何 effectScope 中'
  message.info(currentScopeInfo.value)
}

function resetAll() {
  count1.value = 0
  count2.value = 0
  scope1Logs.value = []
  parentLogs.value = []
  currentScopeInfo.value = '点击按钮查看'
  if (scope1) {
    scope1.stop()
    scope1Active.value = false
    scope1 = null
  }
  message.success('已重置')
}
</script>

<template>
  <div class="stage-page">
    <header class="stage-header">
      <a class="back-link" @click="$router.push('/reactivity-deep')">← 返回概览</a>
      <h1>Stage 3：effectScope 作用域管理</h1>
      <p class="subtitle">
        <code>effectScope()</code> / <code>onScopeDispose()</code> / <code>getCurrentScope()</code> —
        一键收拢和清理所有响应式副作用
      </p>
    </header>

    <!-- 场景1: 基础 -->
    <section class="card">
      <h2>1. effectScope 基础 — 绑定多个副作用</h2>
      <p class="card-desc">
        将多个 <code>watch</code> / <code>watchEffect</code> / <code>computed</code> 归入一个 scope， 调用
        <code>scope.stop()</code> 一次性全部清理。
      </p>
      <div class="demo-row">
        <div class="demo-col">
          <p>
            count1: {{ count1 }} | count2: {{ count2 }} | 状态:
            <strong :style="{ color: scope1Active ? '#52c41a' : '#cf1322' }">{{
              scope1Active ? '运行中' : '已停止'
            }}</strong>
          </p>
          <a-space>
            <a-button v-if="!scope1Active" size="small" type="primary" @click="startScope1">启动 scope</a-button>
            <a-button v-if="scope1Active" size="small" @click="inc1">count1++</a-button>
            <a-button v-if="scope1Active" size="small" @click="inc2">count2++</a-button>
            <a-button v-if="scope1Active" size="small" danger @click="stopScope1">停止 scope</a-button>
          </a-space>
          <div class="log-sub" v-if="scope1Logs.length">
            <p v-for="(l, i) in scope1Logs" :key="i" class="log-line">{{ l }}</p>
          </div>
        </div>
      </div>
      <a-alert
        type="info"
        message="提示：scope stop 后，再点击 count1++/count2++ 按钮，日志不会新增。"
        show-icon
        style="margin-top: 12px"
      />
    </section>

    <!-- 场景2: 组合式函数 -->
    <section class="card">
      <h2>2. 组合式函数中的 effectScope — 自动清理定时器</h2>
      <p class="card-desc">
        在 composable 内部用 effectScope 包裹副作用，返回 <code>stop()</code> 方法， 组件卸载时调用即可清理。
      </p>
      <div class="demo-row">
        <div class="demo-col">
          <p>
            Timer 1: <strong>{{ timer1.tick.value }}</strong> 秒 |
            {{ timer1.isRunning.value ? '🟢 运行中' : '🔴 已停止' }}
          </p>
          <p>
            Timer 2: <strong>{{ timer2.tick.value }}</strong> 秒 |
            {{ timer2.isRunning.value ? '🟢 运行中' : '🔴 已停止' }}
          </p>
          <a-space>
            <a-button size="small" danger @click="timer1.stop()">停止 Timer 1</a-button>
            <a-button size="small" danger @click="timer2.stop()">停止 Timer 2</a-button>
          </a-space>
        </div>
      </div>
    </section>

    <!-- 场景3: 嵌套 scope -->
    <section class="card">
      <h2>3. 嵌套 scope 与 detached 模式</h2>
      <p class="card-desc">
        子 scope 默认继承父 scope 生命周期（父 stop 则子 stop）。<br />
        设置 <code>effectScope(true)</code> 创建 <strong>detached（分离）</strong>子 scope，不受父影响。
      </p>
      <div class="demo-row">
        <div class="demo-col">
          <a-button size="small" type="primary" @click="runNestedScope"
            >运行嵌套 scope 演示（3 秒后自动停父 scope）</a-button
          >
          <div class="log-sub" v-if="parentLogs.length" style="margin-top: 10px">
            <p v-for="(l, i) in parentLogs" :key="i" class="log-line">{{ l }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 场景4: getCurrentScope -->
    <section class="card">
      <h2>4. getCurrentScope() — 检测当前作用域</h2>
      <p class="card-desc">判断当前是否在 effectScope 内部，可用于调试和条件逻辑。</p>
      <div class="demo-row">
        <div class="demo-col">
          <p>{{ currentScopeInfo }}</p>
          <a-space>
            <a-button size="small" type="primary" @click="demoCheckInScope">在 scope 内检测</a-button>
            <a-button size="small" @click="demoCheckOutside">在 scope 外检测</a-button>
          </a-space>
        </div>
      </div>
    </section>

    <!-- 最佳实践 -->
    <section class="card">
      <h2>5. 最佳实践</h2>
      <a-table
        :columns="[
          { title: '场景', dataIndex: 'scenario', key: 'scenario', width: 220 },
          { title: '建议', dataIndex: 'advice', key: 'advice' },
        ]"
        :data-source="[
          { scenario: '组合式函数中创建多个副作用', advice: '用 effectScope 包裹，返回 stop()，由 useEffect 收集' },
          { scenario: '组件卸载清理', advice: '利用 Vue 的 onUnmounted + scope.stop() 自动清理' },
          { scenario: '插件 / 指令生命周期', advice: '每个插件实例创建独立 scope，插件销毁时 stop' },
          { scenario: '定时器 / WebSocket / 事件监听', advice: '在 scope 内注册，onScopeDispose 中清理，避免单例乱飞' },
          { scenario: '测试中隔离副作用', advice: '每个测试用例用独立 scope，确保不互相干扰' },
        ]"
        :pagination="false"
        size="small"
      />
    </section>

    <a-button style="margin-top: 8px" @click="resetAll">全部重置</a-button>
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

.log-sub {
  background: #fafafa;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #f0f0f0;
}

.log-line {
  margin: 0 0 3px;
  color: #555;
  font-family: monospace;
  font-size: 12px;
}

@media (max-width: 640px) {
  .demo-row {
    flex-direction: column;
  }
}
</style>
