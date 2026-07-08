<script setup lang="ts">
import { ref } from 'vue'

const log = ref<string[]>([])
function addLog(msg: string) {
  log.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

const installCode = `# 安装 Vitest
pnpm add -D vitest

# package.json 添加脚本
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}`

const basicTestCode = `// counter.test.ts
import { describe, it, expect } from 'vitest'

// describe — 测试套件，对相关测试用例分组
describe('counter', () => {
  // it — 单个测试用例（别名 test）
  it('should add numbers', () => {
    const result = 1 + 2
    expect(result).toBe(3)
  })

  it('should multiply numbers', () => {
    expect(2 * 3).toBe(6)
  })
})`

const matchersCode = `// 常用断言匹配器大全
describe('matchers 大全', () => {
  // 相等性
  test('toBe vs toEqual', () => {
    expect(2 + 2).toBe(4)              // 严格相等 ===
    expect({ name: 'Vue' }).toEqual({ name: 'Vue' }) // 深度相等
  })

  // 真假值
  test('truthy & falsy', () => {
    expect(1).toBeTruthy()
    expect(0).toBeFalsy()
    expect(null).toBeNull()
    expect(undefined).toBeUndefined()
    expect('hello').toBeDefined()
  })

  // 比较
  test('comparisons', () => {
    expect(5).toBeGreaterThan(3)
    expect(5).toBeLessThan(10)
    expect(5).toBeGreaterThanOrEqual(5)
  })

  // 字符串 & 数组
  test('string & array', () => {
    expect('Hello Vue').toContain('Vue')
    expect([1, 2, 3]).toContain(2)
    expect([1, 2, 3]).toHaveLength(3)
  })

  // 对象
  test('object', () => {
    expect({ name: 'Vue', version: 3 }).toHaveProperty('name')
    expect({ name: 'Vue', version: 3 }).toMatchObject({ name: 'Vue' })
  })

  // 异常
  test('throw', () => {
    expect(() => { throw new Error('oops') }).toThrow('oops')
  })
})`

const hooksCode = `// 生命周期钩子
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('hooks demo', () => {
  let counter = 0

  // 每个测试用例执行前
  beforeEach(() => {
    counter = 0
    console.log('重置 counter')
  })

  // 每个测试用例执行后
  afterEach(() => {
    console.log('清理资源')
  })

  it('increments', () => {
    counter++
    expect(counter).toBe(1)
  })

  it('still starts fresh', () => {
    // counter 被 beforeEach 重置为 0
    expect(counter).toBe(0)
  })
})

// 还有 beforeAll / afterAll（套件级别，只执行一次）`

const counterTest = ref(0)
const testCases = ref([
  { name: 'toBe(3)', fn: () => counterTest.value + 1 + 2, expected: 3, passed: null as boolean | null },
  { name: 'toBeGreaterThan(0)', fn: () => counterTest.value, expected: undefined, passed: null as boolean | null },
  { name: 'toBeTruthy()', fn: () => counterTest.value, expected: undefined, passed: null as boolean | null },
])

function runTest(index: number) {
  const tc = testCases.value[index]
  counterTest.value++
  if (tc.expected !== undefined) {
    tc.passed = tc.fn() === tc.expected
  } else if (index === 1) {
    tc.passed = counterTest.value > 0
  } else if (index === 2) {
    tc.passed = !!counterTest.value
  }
  addLog(`运行测试: expect(counterTest).${tc.name} → ${tc.passed ? '✅ PASS' : '❌ FAIL'} (counterTest = ${counterTest.value})`)
}

function resetTests() {
  counterTest.value = 0
  testCases.value.forEach(tc => (tc.passed = null))
  addLog('所有测试结果已重置')
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 1：Vitest 快速上手</h1>
      <p>掌握 Vitest 安装配置、describe/it/expect 基础模式、常用断言匹配器和生命周期钩子。</p>
    </header>

    <!-- 安装配置 -->
    <section class="card">
      <h2>安装与配置</h2>
      <pre class="code-block"><code>{{ installCode }}</code></pre>
    </section>

    <!-- 基本结构 -->
    <section class="card">
      <h2>测试文件基本结构</h2>
      <p class="intro">每个 <code>.test.ts</code> 文件由 <strong>describe</strong>（套件）和 <strong>it/test</strong>（用例）组成，<strong>expect</strong> 用于断言。</p>
      <pre class="code-block"><code>{{ basicTestCode }}</code></pre>
    </section>

    <!-- 断言匹配器 -->
    <section class="card">
      <h2>常用断言匹配器</h2>
      <pre class="code-block"><code>{{ matchersCode }}</code></pre>
    </section>

    <!-- 生命周期钩子 -->
    <section class="card">
      <h2>生命周期钩子</h2>
      <p class="intro">用于在测试前后执行准备和清理操作，确保测试环境独立。</p>
      <pre class="code-block"><code>{{ hooksCode }}</code></pre>
    </section>

    <!-- 交互演示 -->
    <section class="card">
      <h2>交互演示：模拟测试运行</h2>
      <p class="intro">模拟 describe/it/expect 模式，每次点击测试会让 counterTest 递增。</p>
      <div class="demo-area">
        <p style="font-weight: 600;">当前 counterTest 值：{{ counterTest }}</p>
        <div class="test-list">
          <div v-for="(tc, i) in testCases" :key="i" class="test-item">
            <button class="btn" @click="runTest(i)">运行：expect(counterTest).{{ tc.name }}</button>
            <span v-if="tc.passed === true" class="tag pass">✅ PASS</span>
            <span v-else-if="tc.passed === false" class="tag fail">❌ FAIL</span>
            <span v-else class="tag pending">待运行</span>
          </div>
        </div>
        <button class="btn reset" @click="resetTests">重置</button>
      </div>
    </section>

    <!-- 日志 -->
    <section class="card" v-if="log.length">
      <h2>测试日志</h2>
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
.intro { color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 12px; }
.intro code { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; font-size: 13px; }
.code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.6; margin: 12px 0; }
.demo-area { padding: 16px; background: #fafafa; border-radius: 8px; margin: 12px 0; }
.test-list { display: flex; flex-direction: column; gap: 8px; margin: 12px 0; }
.test-item { display: flex; align-items: center; gap: 10px; }
.btn { padding: 8px 16px; background: #3178c6; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
.btn:hover { background: #265ea8; }
.btn.reset { background: #ff4d4f; }
.btn.reset:hover { background: #d9363e; }
.tag { font-size: 13px; font-weight: 600; padding: 4px 8px; border-radius: 4px; }
.tag.pass { color: #52c41a; }
.tag.fail { color: #ff4d4f; }
.tag.pending { color: #999; }
.log-panel { background: #fafafa; border: 1px solid #f0f0f0; border-radius: 8px; padding: 12px; max-height: 200px; overflow-y: auto; font-family: monospace; font-size: 12px; color: #666; }
@media (max-width: 768px) { .test-item { flex-direction: column; align-items: flex-start; } }
</style>
