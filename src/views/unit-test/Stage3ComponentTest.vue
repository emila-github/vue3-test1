<script setup lang="ts">
import { ref, computed } from 'vue'

// trigger 事件触发示例
const triggerCode = ref(`import { mount } from '@vue/test-utils'
import LoginForm from '@/components/LoginForm.vue'

describe('LoginForm', () => {
  it('填写表单并提交', async () => {
    const wrapper = mount(LoginForm)

    // 模拟用户输入
    const emailInput = wrapper.find('[data-test="email"]')
    await emailInput.setValue('user@example.com')

    const passwordInput = wrapper.find('[data-test="password"]')
    await passwordInput.setValue('123456')

    // trigger 触发事件
    await wrapper.find('[data-test="submit"]').trigger('click')

    // 验证提交事件
    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')![0]).toEqual([{
      email: 'user@example.com',
      password: '123456'
    }])
  })

  it('键盘事件测试', async () => {
    const wrapper = mount(SearchBox)
    const input = wrapper.find('input')

    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('search')).toBeTruthy()
  })
})`)

// emitted 事件断言
const emittedCode = ref(`describe('事件断言', () => {
  it('emitted 基本用法', async () => {
    const wrapper = mount(Counter)

    await wrapper.find('button').trigger('click')
    await wrapper.find('button').trigger('click')

    // 断言事件存在
    expect(wrapper.emitted()).toHaveProperty('update')

    // 断言事件触发次数
    expect(wrapper.emitted('update')).toHaveLength(2)

    // 断言事件参数
    expect(wrapper.emitted('update')![0]).toEqual([1])
    expect(wrapper.emitted('update')![1]).toEqual([2])
  })

  it('自定义事件带多个参数', async () => {
    const wrapper = mount(FormComponent)
    await wrapper.find('form').trigger('submit.prevent')

    const submitEvent = wrapper.emitted('submit')
    expect(submitEvent).toBeTruthy()
    // 第一个参数是表单数据
    expect(submitEvent![0][0]).toEqual({ name: '', email: '' })
  })
})`)

// setProps 示例
const setPropsCode = ref(`describe('setProps 更新组件', () => {
  it('动态更新 props', async () => {
    const wrapper = mount(UserCard, {
      props: { name: 'Alice', age: 25 }
    })

    expect(wrapper.text()).toContain('Alice')

    // 更新 props
    await wrapper.setProps({ name: 'Bob' })
    expect(wrapper.text()).toContain('Bob')

    // props 被正确更新
    expect(wrapper.props('name')).toBe('Bob')
  })

  it('props 变化触发重新渲染', async () => {
    const wrapper = mount(ProgressBar, {
      props: { percent: 30 }
    })

    expect(wrapper.find('.bar').attributes('style')).toContain('width: 30%')

    await wrapper.setProps({ percent: 80 })
    expect(wrapper.find('.bar').attributes('style')).toContain('width: 80%')
  })
})`)

// computed 和 watch 测试
const computedWatchCode = ref(`// 被测试的 composable
// useCounter.ts
import { ref, computed, watch } from 'vue'

export function useCounter(initial = 0) {
  const count = ref(initial)
  const double = computed(() => count.value * 2)
  const history = ref<number[]>([])

  watch(count, (newVal) => {
    history.value.push(newVal)
  })

  function increment() {
    count.value++
  }

  return { count, double, history, increment }
}

// useCounter.test.ts
import { describe, it, expect } from 'vitest'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('computed double 正确计算', () => {
    const { count, double, increment } = useCounter(2)
    expect(double.value).toBe(4)

    increment()
    expect(count.value).toBe(3)
    expect(double.value).toBe(6)  // computed 自动响应
  })

  it('watch 记录历史', () => {
    const { increment, history } = useCounter(0)

    increment()  // count: 0 → 1
    increment()  // count: 1 → 2

    expect(history.value).toEqual([1, 2])
  })
})`)

// 交互演示：简单计数器
const count = ref(0)
const eventLog = ref<string[]>([])

function increment() {
  count.value++
  eventLog.value.push(`第 ${eventLog.value.length + 1} 次点击 → 计数变为 ${count.value}`)
}

function resetCounter() {
  count.value = 0
  eventLog.value = []
}

const demoTestCode = computed(() => {
  return `// 计数器组件测试
describe('Counter 组件', () => {
  it('初始计数为 0', () => {
    const wrapper = mount(Counter)
    expect(wrapper.text()).toContain('${count.value}')
  })

  it('点击增加计数', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('[data-test="inc"]').trigger('click')
    ${eventLog.value.length > 0
      ? `    // 当前计数: ${count.value}\n    // 事件日志:\n${eventLog.value.map(l => `    // ${l}`).join('\n')}`
      : `    expect(wrapper.emitted('change')).toHaveLength(1)`}
  })

  it('emitted 事件验证', () => {
    ${eventLog.value.length > 0
      ? `    // 共触发 ${eventLog.value.length} 次点击事件`
      : `    // 尚未触发任何事件`}
  })
})`
})
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 3：组件测试实战</h1>
      <p>掌握 trigger 用户事件、emitted 事件断言、setProps 状态变更、computed/watch 测试技巧。</p>
    </header>

    <!-- 3.1 trigger 事件触发 -->
    <section class="card">
      <h2>3.1 trigger — 模拟用户交互</h2>
      <p class="tip">
        <code>trigger(eventName, options?)</code> 触发 DOM 事件，第二个参数传递事件对象。
        支持 click、input、keydown、submit 等所有原生事件。
      </p>
      <pre class="code-block"><code>{{ triggerCode }}</code></pre>
    </section>

    <!-- 3.2 emitted 事件断言 -->
    <section class="card">
      <h2>3.2 emitted — 事件断言</h2>
      <p class="tip">
        <code>wrapper.emitted()</code> 返回所有触发事件的记录对象。
        每次触发都会记录参数数组，通过索引访问各次触发的参数。
      </p>
      <pre class="code-block"><code>{{ emittedCode }}</code></pre>
    </section>

    <!-- 3.3 setProps -->
    <section class="card">
      <h2>3.3 setProps — 动态更新 Props</h2>
      <p class="tip">
        <code>await wrapper.setProps({ ... })</code> 更新组件 props 并等待重新渲染完成。
        用于测试 props 变化后的组件行为。
      </p>
      <pre class="code-block"><code>{{ setPropsCode }}</code></pre>
    </section>

    <!-- 3.4 computed 和 watch 测试 -->
    <section class="card">
      <h2>3.4 测试 computed 与 watch</h2>
      <p class="tip">
        通过 composable 封装逻辑，直接在测试中调用并断言。computed 是同步的无需 await，watch 需要触发响应式变化后验证。
      </p>
      <pre class="code-block"><code>{{ computedWatchCode }}</code></pre>
    </section>

    <!-- 3.5 常用 trigger 事件速查 -->
    <section class="card">
      <h2>3.5 常用 trigger 事件速查</h2>
      <div class="info-grid">
        <div class="info-item">
          <strong>click</strong>
          <code>await wrapper.find('button').trigger('click')</code>
        </div>
        <div class="info-item">
          <strong>input</strong>
          <code>await wrapper.find('input').trigger('input')</code>
        </div>
        <div class="info-item">
          <strong>change</strong>
          <code>await wrapper.find('select').trigger('change')</code>
        </div>
        <div class="info-item">
          <strong>submit</strong>
          <code>await wrapper.find('form').trigger('submit.prevent')</code>
        </div>
        <div class="info-item">
          <strong>keydown</strong>
          <code>await input.trigger('keydown', { key: 'Enter' })</code>
        </div>
        <div class="info-item">
          <strong>focus / blur</strong>
          <code>await wrapper.find('input').trigger('focus')</code>
        </div>
        <div class="info-item">
          <strong>mouseenter</strong>
          <code>await wrapper.find('div').trigger('mouseenter')</code>
        </div>
        <div class="info-item">
          <strong>setValue</strong>
          <code>await wrapper.find('input').setValue('text')</code>
        </div>
      </div>
    </section>

    <!-- 3.6 交互演示 -->
    <section class="card">
      <h2>3.6 交互演示：计数器 + emitted 日志</h2>
      <p class="tip">点击按钮，观察事件日志与对应的测试代码。</p>
      <div class="demo-row">
        <div class="demo-area">
          <p style="font-size: 20px; font-weight: 700;">{{ count }}</p>
          <div class="btn-group">
            <button class="btn" @click="increment">+1 (trigger click)</button>
            <button class="btn btn-reset" @click="resetCounter">重置</button>
          </div>
          <div v-if="eventLog.length > 0" class="event-log">
            <p style="font-weight: 600; margin: 0 0 6px; font-size: 13px;">emitted 日志：</p>
            <div v-for="(log, i) in eventLog" :key="i" class="log-item">{{ log }}</div>
          </div>
        </div>
        <div class="demo-code">
          <pre class="code-block" style="margin: 0"><code>{{ demoTestCode }}</code></pre>
        </div>
      </div>
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
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.card h2 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #333;
}

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
  margin: 12px 0;
}
.code-block code {
  font-family: 'Fira Code', 'Consolas', monospace;
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
}
.info-item code {
  background: #e8e8e8;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  display: block;
  margin-top: 4px;
}
.info-item strong {
  display: block;
  margin-bottom: 4px;
  color: #333;
}
.info-item span {
  font-size: 12px;
  color: #999;
}

.tip {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
  line-height: 1.6;
}
.tip code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
}

.demo-row {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
.demo-area {
  flex: 0 0 260px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  text-align: center;
}
.demo-code {
  flex: 1;
  min-width: 0;
}

.btn-group {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 12px;
}
.btn {
  padding: 8px 16px;
  background: #3178c6;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.btn:hover {
  background: #265ea8;
}
.btn-reset {
  background: #999;
}
.btn-reset:hover {
  background: #666;
}

.event-log {
  text-align: left;
  margin-top: 12px;
  padding: 8px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
  max-height: 150px;
  overflow-y: auto;
}
.log-item {
  font-size: 11px;
  color: #52c41a;
  font-family: monospace;
  padding: 2px 0;
  border-bottom: 1px solid #f5f5f5;
}

@media (max-width: 768px) {
  .demo-row {
    flex-direction: column;
  }
  .demo-area {
    flex: none;
    width: 100%;
  }
}
</style>
