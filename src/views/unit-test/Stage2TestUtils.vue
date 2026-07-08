<script setup lang="ts">
import { ref } from 'vue'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

const mountVsShallowCode = `// mount() — 完整挂载，渲染所有子组件
import { mount } from '@vue/test-utils'
import Parent from './Parent.vue'

const wrapper = mount(Parent)
// Parent + 所有子组件都会完整渲染

// shallowMount() — 浅挂载，stub 所有子组件
import { shallowMount } from '@vue/test-utils'
const wrapper = shallowMount(Parent)
// 只渲染 Parent 本身，子组件被 stub（占位符）
// 优点：隔离测试，避免子组件影响`

const wrapperApiCode = `// wrapper 核心 API
const wrapper = mount(Counter, {
  props: { initial: 0 }
})

// 查找元素
wrapper.find('button')              // 返回第一个匹配的 DOMWrapper
wrapper.findAll('button')           // 返回所有匹配的 DOMWrapper[]
wrapper.find('[data-testid="add"]') // 推荐：使用 data-testid

// 查找组件
wrapper.findComponent({ name: 'Child' })     // 按组件名查找
wrapper.findAllComponents(Child)              // 按组件引用查找

// 状态检查
wrapper.exists()        // 元素是否存在
wrapper.isVisible()     // 是否可见（v-show）
wrapper.text()          // 获取文本内容
wrapper.html()          // 获取 HTML 字符串
wrapper.classes()       // 获取 class 列表
wrapper.attributes()    // 获取属性对象`

const findCode = `// 推荐：使用 data-testid 查找元素
<template>
  <button data-testid="submit-btn" @click="submit">提交</button>
  <span data-testid="result">{{ result }}</span>
</template>

// 测试代码
import { mount } from '@vue/test-utils'
import Form from './Form.vue'

const wrapper = mount(Form)

// 通过 data-testid 查找，不依赖 CSS 类名或标签
const btn = wrapper.find('[data-testid="submit-btn"]')
const result = wrapper.find('[data-testid="result"]')

expect(btn.exists()).toBe(true)
expect(result.text()).toBe('初始')`

const demoCounter = ref(0)
function increment() { demoCounter.value++ }
function decrement() { demoCounter.value-- }
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 2：Vue Test Utils 核心 API</h1>
      <p>掌握 mount() 和 shallowMount() 的区别、wrapper 查找 API、以及推荐的 data-testid 查找策略。</p>
    </header>

    <!-- mount vs shallowMount -->
    <section class="card">
      <h2>mount() vs shallowMount()</h2>
      <div class="compare-grid">
        <div class="compare-col good">
          <h4>✅ mount()</h4>
          <p>完整渲染所有子组件，适合集成测试</p>
        </div>
        <div class="compare-col bad">
          <h4>⚠ shallowMount()</h4>
          <p>只渲染当前组件，子组件用 stub 替代，适合单元测试</p>
        </div>
      </div>
      <pre class="code-block"><code>{{ mountVsShallowCode }}</code></pre>
    </section>

    <!-- wrapper API -->
    <section class="card">
      <h2>Wrapper 核心 API</h2>
      <p class="intro">
        <code>mount()</code> 返回一个 <strong>VueWrapper</strong> 对象，提供丰富的 API 来检查和操作组件。
      </p>
      <pre class="code-block"><code>{{ wrapperApiCode }}</code></pre>
    </section>

    <!-- data-testid 最佳实践 -->
    <section class="card">
      <h2>data-testid 查找策略</h2>
      <p class="intro">
        推荐使用 <code>data-testid</code> 属性查找元素，避免因 CSS 类名或标签变化导致测试失败。
      </p>
      <pre class="code-block"><code>{{ findCode }}</code></pre>
    </section>

    <!-- 组件演示 -->
    <section class="card">
      <h2>待测试组件演示</h2>
      <p class="intro">下面是一个简单的 Counter 组件，展示如何使用 Vue Test Utils 来测试它。</p>

      <div class="demo-area">
        <h3>Counter 组件渲染：</h3>
        <div class="counter-box">
          <button data-testid="decrement-btn" @click="decrement" class="ctrl-btn">-</button>
          <span data-testid="count-display" class="count-num">{{ demoCounter }}</span>
          <button data-testid="increment-btn" @click="increment" class="ctrl-btn">+</button>
        </div>
        <pre class="code-block" style="margin-top: 16px;"><code>// 编写测试
import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

describe('Counter', () => {
  it('renders initial count', () => {
    const wrapper = mount(Counter)
    expect(wrapper.find('[data-testid="count-display"]').text()).toBe('0')
  })

  it('increments on + click', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('[data-testid="increment-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="count-display"]').text()).toBe('1')
  })
})</code></pre>
      </div>
    </section>

    <!-- 快速参考 -->
    <section class="card">
      <h2>常用 Wrapper 方法速查</h2>
      <div class="info-grid">
        <div class="info-item"><strong><code>find(selector)</code></strong><span>返回第一个匹配 DOM 元素</span></div>
        <div class="info-item"><strong><code>findAll(selector)</code></strong><span>返回所有匹配元素数组</span></div>
        <div class="info-item"><strong><code>findComponent(comp)</code></strong><span>查找子组件</span></div>
        <div class="info-item"><strong><code>text()</code></strong><span>获取元素文本</span></div>
        <div class="info-item"><strong><code>html()</code></strong><span>获取内部 HTML</span></div>
        <div class="info-item"><strong><code>exists()</code></strong><span>判断元素是否存在</span></div>
        <div class="info-item"><strong><code>isVisible()</code></strong><span>判断元素是否可见</span></div>
        <div class="info-item"><strong><code>props()</code></strong><span>获取组件 props</span></div>
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
.card h3 { margin: 16px 0 8px; font-size: 15px; color: #555; }
.intro { color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 12px; }
.intro code { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; font-size: 13px; }
.code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.6; margin: 12px 0; }
.demo-area { padding: 16px; background: #fafafa; border-radius: 8px; margin: 12px 0; }
.compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 12px; }
.compare-col { padding: 12px; border-radius: 8px; }
.compare-col.good { background: #f6ffed; border: 1px solid #b7eb8f; }
.compare-col.bad { background: #fff7e6; border: 1px solid #ffe58f; }
.compare-col h4 { margin: 0 0 4px; font-size: 14px; }
.compare-col p { margin: 0; font-size: 13px; color: #666; }
.counter-box { display: flex; align-items: center; gap: 12px; }
.ctrl-btn { width: 36px; height: 36px; border: 1px solid #d9d9d9; border-radius: 6px; background: #fff; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.ctrl-btn:hover { border-color: #3178c6; color: #3178c6; }
.count-num { font-size: 24px; font-weight: 700; color: #3178c6; min-width: 40px; text-align: center; }
.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; }
.info-item { padding: 12px; background: #fafafa; border-radius: 6px; border: 1px solid #f0f0f0; }
.info-item strong { display: block; margin-bottom: 4px; font-size: 14px; color: #333; }
.info-item code { background: #e8e8e8; padding: 2px 6px; border-radius: 3px; font-size: 13px; }
.info-item span { font-size: 12px; color: #999; }
@media (max-width: 768px) { .info-grid { grid-template-columns: 1fr; } .compare-grid { grid-template-columns: 1fr; } }
</style>
