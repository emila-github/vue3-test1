<script setup lang="ts">
import { ref, computed } from 'vue'

// 模拟一个待测试的 composable
function useCounter(initial = 0) {
  const count = ref(initial)
  const double = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  function decrement() {
    count.value--
  }
  function reset() {
    count.value = initial
  }
  return { count, double, increment, decrement, reset }
}

const counter = useCounter(0)
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>测试</h1>
      <p>使用 Vitest + Vue Test Utils 进行单元测试，Playwright 进行端到端测试。</p>
    </header>

    <!-- 测试金字塔 -->
    <section class="card">
      <h2>测试策略：测试金字塔</h2>
      <div class="pyramid">
        <div class="pyramid-level level-top">
          <strong>E2E</strong>
          <span>Playwright</span>
          <small>少量、关键流程</small>
        </div>
        <div class="pyramid-level level-mid">
          <strong>组件测试</strong>
          <span>Vue Test Utils</span>
          <small>组件交互、事件、渲染</small>
        </div>
        <div class="pyramid-level level-bottom">
          <strong>单元测试</strong>
          <span>Vitest</span>
          <small>Composables、工具函数、Store</small>
        </div>
      </div>
    </section>

    <!-- Vitest 单元测试 -->
    <section class="card">
      <h2>Vitest：单元测试 + 组件测试</h2>
      <p>Vitest 基于 Vite，与项目配置共享，<strong>开箱即用</strong>。支持 HMR 模式（边改代码边跑测试）。</p>
      <pre class="code-block">
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',   // 模拟浏览器 DOM
    globals: true,          // 全局 test/expect
  },
})

// 运行
pnpm test:unit</pre
      >
    </section>

    <!-- 测试用例示例 -->
    <section class="card">
      <h2>编写测试用例</h2>
      <div class="two-col">
        <div>
          <h4>Composable 测试</h4>
          <pre class="code-block" style="font-size: 12px">
// useCounter.test.ts
import { useCounter } from './useCounter'

test('初始值为 0', () => {
  const { count } = useCounter()
  expect(count.value).toBe(0)
})

test('increment 后为 1', () => {
  const { count, increment } = useCounter()
  increment()
  expect(count.value).toBe(1)
})</pre
          >
        </div>
        <div>
          <h4>组件测试</h4>
          <pre class="code-block" style="font-size: 12px">
// Counter.test.ts
import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

test('点击按钮 count +1', async () => {
  const wrapper = mount(Counter)
  await wrapper.find('button').trigger('click')
  expect(wrapper.text()).toContain('1')
})</pre
          >
        </div>
      </div>

      <div class="demo-box" style="margin-top: 12px">
        <h4>上述 Composable 的运行效果（当前页面实时演示）：</h4>
        <div class="counter-demo">
          <span
            >Count: <strong>{{ counter.count.value }}</strong></span
          >
          <span
            >Double: <strong>{{ counter.double.value }}</strong></span
          >
          <a-space>
            <a-button size="small" @click="counter.increment()">+1</a-button>
            <a-button size="small" @click="counter.decrement()">-1</a-button>
            <a-button size="small" danger @click="counter.reset()">重置</a-button>
          </a-space>
        </div>
      </div>
    </section>

    <!-- Playwright E2E -->
    <section class="card">
      <h2>Playwright：端到端测试</h2>
      <p>Playwright 模拟真实浏览器操作，测试<strong>完整的用户流程</strong>。支持 Chromium、Firefox、WebKit。</p>
      <pre class="code-block">
// e2e/example.spec.ts
import { test, expect } from '@playwright/test'

test('首页标题正确', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Vue 3')
})

test('计数器点击递增', async ({ page }) => {
  await page.goto('/counter')
  await page.click('button:has-text("+1")')
  await expect(page.locator('.count')).toHaveText('1')
})

// 运行
pnpm test:e2e</pre
      >
    </section>

    <!-- 测试最佳实践 -->
    <section class="card">
      <h2>测试最佳实践</h2>
      <div class="practice-grid">
        <div class="practice-item">
          <h4>📌 测试行为而非实现</h4>
          <p>关注输入输出，不依赖内部状态细节</p>
        </div>
        <div class="practice-item">
          <h4>📌 一个测试一个断言</h4>
          <p>每个 test 聚焦一个行为，失败时快速定位</p>
        </div>
        <div class="practice-item">
          <h4>📌 Mock 外部依赖</h4>
          <p>vi.mock() 隔离 API、路由等外部因素</p>
        </div>
        <div class="practice-item">
          <h4>📌 优先单元测试</h4>
          <p>单元测试快且稳定，组件测试次之，E2E 最少</p>
        </div>
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

.demo-box {
  background: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  padding: 16px;
}

.demo-box h4 {
  margin: 0 0 10px;
  font-size: 13px;
  color: #999;
  font-weight: 400;
}

.counter-demo {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.counter-demo strong {
  font-size: 18px;
  color: #1677ff;
}

.pyramid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.pyramid-level {
  text-align: center;
  padding: 16px;
  border-radius: 8px;
  color: #fff;
}

.level-top {
  background: #fa541c;
  width: 180px;
}

.level-mid {
  background: #fa8c16;
  width: 300px;
}

.level-bottom {
  background: #ffc53d;
  width: 420px;
}

.pyramid-level strong {
  display: block;
  font-size: 18px;
}
.pyramid-level span {
  display: block;
  font-size: 13px;
  margin: 2px 0;
}
.pyramid-level small {
  display: block;
  font-size: 11px;
  opacity: 0.8;
}

.two-col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.two-col h4 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #333;
}

.practice-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.practice-item {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
}

.practice-item h4 {
  margin: 0 0 6px;
  font-size: 14px;
  color: #333;
}

.practice-item p {
  font-size: 12px;
  color: #999;
  margin: 0;
}

@media (max-width: 640px) {
  .two-col,
  .practice-grid {
    grid-template-columns: 1fr;
  }
  .level-top {
    width: 140px;
  }
  .level-mid {
    width: 220px;
  }
  .level-bottom {
    width: 300px;
  }
}
</style>
