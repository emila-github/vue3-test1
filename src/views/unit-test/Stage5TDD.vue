<script setup lang="ts">
import { ref } from 'vue'

const tddSteps = ref([
  { step: '🔴 Red', title: '先写失败测试', desc: '根据需求编写测试用例，运行后预期失败（因为功能尚未实现）' },
  { step: '🟢 Green', title: '编写最小实现', desc: '编写刚好能让测试通过的代码，不追求完美' },
  { step: '🔵 Refactor', title: '重构优化', desc: '在测试保护下优化代码结构、提升可读性' },
])

const tddCycleCode = `// TDD 三步走示例：开发一个 add 函数
import { describe, it, expect } from 'vitest'

// 🔴 Red：先写测试（此时 add 还不存在，测试会失败）
describe('add', () => {
  it('should add two numbers', () => {
    expect(add(1, 2)).toBe(3)
  })
})

// 🟢 Green：实现让测试通过
function add(a: number, b: number): number {
  return a + b
}

// 🔵 Refactor：重构优化（比如添加边界处理）
function add(a: number, b: number): number {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers')
  }
  return a + b
}`

const bestPracticesCode = `// 测试最佳实践
describe('UserList', () => {
  // ✅ DO：遵循 AAA 模式（Arrange → Act → Assert）
  it('should display user count', () => {
    // Arrange（准备）
    const wrapper = mount(UserList, {
      props: { users: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }] }
    })
    // Act（执行）
    const countText = wrapper.find('.count').text()
    // Assert（断言）
    expect(countText).toBe('2 users')
  })

  // ✅ DO：测试用户可见的行为
  // ❌ DONT：测试内部实现细节
  it('should emit delete when button clicked', () => {
    const wrapper = mount(UserList, { props: { users: [...] } })
    wrapper.find('[data-test="delete-btn-1"]').trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
  })

  // ✅ DO：使用 data-test 属性定位
  // ❌ DONT：依赖 CSS class 或 DOM 结构定位元素
})`

const coverageCode = `# 生成测试覆盖率报告
pnpm vitest --coverage

# vitest.config.ts 配置
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',          // 或 'istanbul'
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/main.ts'],
      thresholds: {
        lines: 80,             // 行覆盖率目标 80%
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
})`

const snapshotCode = `// 快照测试 — 确保 UI 不会意外变化
import { it, expect } from 'vitest'

it('renders correctly', () => {
  const wrapper = mount(UserCard, {
    props: { name: 'Alice', role: 'Admin' }
  })
  // 首次运行生成快照，后续运行对比
  expect(wrapper.html()).toMatchSnapshot()
})

// 更新快照：pnpm vitest --update`

const pitfalls = [
  { pitfall: '测试实现细节而非行为', fix: '测试用户可见的结果（渲染内容、事件），不测试内部方法' },
  { pitfall: '过度 Mock', fix: '只 Mock 外部依赖（API、第三方库），不要 Mock 自己的代码' },
  { pitfall: '测试用例有顺序依赖', fix: '每个测试用例应独立，使用 beforeEach 重置状态' },
  { pitfall: '断言不够具体', fix: '使用精准的匹配器，避免 expect(true).toBeTruthy()' },
  { pitfall: '忽略边界情况', fix: '测试空数据、null、undefined、极大值等边界条件' },
]

</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 5：TDD 与最佳实践</h1>
      <p>掌握测试驱动开发（TDD）方法论、测试覆盖率、快照测试及常见陷阱避坑指南。</p>
    </header>

    <!-- TDD 循环 -->
    <section class="card">
      <h2>TDD 三步循环：Red → Green → Refactor</h2>
      <div class="tdd-grid">
        <div v-for="s in tddSteps" :key="s.step" class="tdd-item">
          <span class="tdd-step">{{ s.step }}</span>
          <strong>{{ s.title }}</strong>
          <p>{{ s.desc }}</p>
        </div>
      </div>
      <pre class="code-block"><code>{{ tddCycleCode }}</code></pre>
    </section>

    <!-- 最佳实践 -->
    <section class="card">
      <h2>测试最佳实践：AAA 模式</h2>
      <p class="intro">
        <strong>AAA</strong> = <strong>A</strong>rrange（准备）→ <strong>A</strong>ct（执行）→ <strong>A</strong>ssert（断言），
        是单元测试的黄金法则。
      </p>
      <pre class="code-block"><code>{{ bestPracticesCode }}</code></pre>
    </section>

    <!-- 测试覆盖率 -->
    <section class="card">
      <h2>测试覆盖率</h2>
      <p class="intro">衡量测试质量的关键指标，但覆盖率 100% 不等于零 Bug。</p>
      <pre class="code-block"><code>{{ coverageCode }}</code></pre>
    </section>

    <!-- 快照测试 -->
    <section class="card">
      <h2>快照测试</h2>
      <p class="intro">记录组件渲染 HTML，后续对比检测意外变化。适合 UI 回归测试。</p>
      <pre class="code-block"><code>{{ snapshotCode }}</code></pre>
    </section>

    <!-- 常见陷阱 -->
    <section class="card">
      <h2>常见陷阱与解决方案</h2>
      <div class="pitfall-list">
        <div v-for="p in pitfalls" :key="p.pitfall" class="pitfall-item">
          <div class="pitfall-header">
            <span class="pitfall-badge">⚠️</span>
            <strong>{{ p.pitfall }}</strong>
          </div>
          <p class="pitfall-fix">✅ {{ p.fix }}</p>
        </div>
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
.code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.6; margin: 12px 0; }

.tdd-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px; }
.tdd-item { padding: 16px; background: #fafafa; border-radius: 10px; border: 2px solid #f0f0f0; text-align: center; }
.tdd-step { display: block; font-size: 32px; margin-bottom: 8px; }
.tdd-item strong { display: block; font-size: 15px; color: #333; margin-bottom: 6px; }
.tdd-item p { font-size: 12px; color: #999; margin: 0; line-height: 1.5; }

.pitfall-list { display: flex; flex-direction: column; gap: 10px; }
.pitfall-item { padding: 12px 16px; background: #fafafa; border-radius: 8px; border: 1px solid #f0f0f0; }
.pitfall-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.pitfall-badge { font-size: 16px; }
.pitfall-item strong { font-size: 14px; color: #333; }
.pitfall-fix { font-size: 13px; color: #52c41a; margin: 4px 0 0 24px; }

@media (max-width: 768px) { .tdd-grid { grid-template-columns: 1fr; } }
</style>
