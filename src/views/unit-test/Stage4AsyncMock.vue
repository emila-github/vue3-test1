<script setup lang="ts">
import { ref, computed } from 'vue'

// vi.fn() 示例
const viFnCode = ref(`import { describe, it, expect, vi } from 'vitest'

describe('vi.fn() 模拟函数', () => {
  it('创建模拟函数并验证调用', () => {
    // 创建模拟函数
    const mockFn = vi.fn()

    // 调用模拟函数
    mockFn('hello', 42)
    mockFn('world')

    // 断言调用次数
    expect(mockFn).toHaveBeenCalledTimes(2)

    // 断言调用参数
    expect(mockFn).toHaveBeenCalledWith('hello', 42)
    expect(mockFn).toHaveBeenCalledWith('world')
  })

  it('模拟返回值', () => {
    const mockFn = vi.fn(() => 'mocked result')
    expect(mockFn()).toBe('mocked result')
  })

  it('使用 mockReturnValue', () => {
    const mockFn = vi.fn()
    mockFn.mockReturnValue(100)
    expect(mockFn()).toBe(100)
  })

  it('模拟异步函数', () => {
    const mockFn = vi.fn()
    mockFn.mockResolvedValue({ data: 'async result' })

    const result = await mockFn()
    expect(result).toEqual({ data: 'async result' })
  })

  it('模拟抛出错误', () => {
    const mockFn = vi.fn()
    mockFn.mockRejectedValue(new Error('Network Error'))

    await expect(mockFn()).rejects.toThrow('Network Error')
  })
})`)

// vi.spyOn() 示例
const viSpyCode = ref(`import { describe, it, expect, vi } from 'vitest'

// 被测试模块
// math.ts
export const math = {
  add: (a: number, b: number) => a + b,
  multiply: (a: number, b: number) => a * b,
}

// math.test.ts
describe('vi.spyOn() 监听方法', () => {
  it('监听对象方法调用', () => {
    const spy = vi.spyOn(math, 'add')

    const result = math.add(2, 3)

    expect(result).toBe(5)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(2, 3)

    // 恢复原始实现
    spy.mockRestore()
  })

  it('替换方法实现', () => {
    vi.spyOn(math, 'multiply').mockReturnValue(999)

    expect(math.multiply(3, 4)).toBe(999)

    vi.restoreAllMocks()
  })
})`)

// vi.mock() 示例
const viMockCode = ref(`import { describe, it, expect, vi } from 'vitest'

// 模拟整个模块
vi.mock('@/api/user', () => ({
  getUser: vi.fn(),
  updateUser: vi.fn(),
}))

import { getUser, updateUser } from '@/api/user'

describe('vi.mock() 模块模拟', () => {
  it('模拟 API 调用', async () => {
    // 设置模拟返回值
    const mockUser = { id: 1, name: 'Alice', email: 'alice@example.com' }
    vi.mocked(getUser).mockResolvedValue(mockUser)

    const result = await getUser(1)
    expect(result).toEqual(mockUser)
    expect(getUser).toHaveBeenCalledWith(1)
  })

  it('模拟 API 失败', async () => {
    vi.mocked(updateUser).mockRejectedValue(new Error('保存失败'))

    await expect(updateUser(1, { name: 'Bob' })).rejects.toThrow('保存失败')
  })
})`)

// 异步组件测试
const asyncTestCode = ref(`import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UserProfile from '@/components/UserProfile.vue'

// 模拟 API
vi.mock('@/api/user', () => ({
  getUser: vi.fn(),
}))

import { getUser } from '@/api/user'

describe('异步组件测试', () => {
  it('挂载后异步加载用户数据', async () => {
    vi.mocked(getUser).mockResolvedValue({
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
    })

    const wrapper = mount(UserProfile, {
      props: { userId: 1 }
    })

    // 初始状态：loading
    expect(wrapper.text()).toContain('加载中...')

    // 等待所有 Promise 完成
    await flushPromises()

    // 验证渲染结果
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('alice@example.com')
  })

  it('加载失败显示错误信息', async () => {
    vi.mocked(getUser).mockRejectedValue(new Error('网络错误'))

    const wrapper = mount(UserProfile, {
      props: { userId: 999 }
    })

    await flushPromises()

    expect(wrapper.text()).toContain('加载失败')
  })
})`)

// nextTick vs flushPromises
const asyncUtils = ref([
  { name: 'await nextTick()', desc: '等待 Vue 下一次 DOM 更新', use: 'await wrapper.trigger("click")\nawait nextTick()' },
  { name: 'await flushPromises()', desc: '刷新所有 pending 的 Promise', use: 'import { flushPromises } from "@vue/test-utils"\nawait flushPromises()' },
  { name: 'await wrapper.vm.$nextTick()', desc: '组件实例级别的 nextTick', use: 'await wrapper.vm.$nextTick()' },
  { name: 'vi.useFakeTimers()', desc: '模拟定时器，控制时间流逝', use: 'vi.useFakeTimers()\nvi.advanceTimersByTime(1000)' },
])

// 交互演示
const apiStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const mockData = ref<{ id: number; name: string } | null>(null)

function simulateApiCall() {
  apiStatus.value = 'loading'
  mockData.value = null
  setTimeout(() => {
    // 模拟成功响应
    mockData.value = { id: 1, name: 'Alice' }
    apiStatus.value = 'success'
  }, 1500)
}

function simulateApiError() {
  apiStatus.value = 'loading'
  mockData.value = null
  setTimeout(() => {
    apiStatus.value = 'error'
  }, 1500)
}

function resetApi() {
  apiStatus.value = 'idle'
  mockData.value = null
}

const demoTestCode = computed(() => {
  const statusMap: Record<string, string> = {
    idle: 'idle',
    loading: 'loading',
    success: 'success',
    error: 'error',
  }
  return `// 异步组件测试
describe('UserProfile 异步加载', () => {
  it('挂载后显示加载状态', () => {
    const wrapper = mount(UserProfile)
    expect(wrapper.text()).toContain('加载中...')
  })

  it('${apiStatus.value === 'success' ? '成功加载用户数据' : apiStatus.value === 'error' ? '加载失败显示错误' : '等待 API 响应'}', async () => {
    ${apiStatus.value === 'idle' ? `    // 状态: ${statusMap[apiStatus.value]} — 尚未触发 API 调用` :
      apiStatus.value === 'loading' ? `    // 状态: ${statusMap[apiStatus.value]} — 等待 Promise resolve...\n    // 使用 await flushPromises() 等待完成` :
      apiStatus.value === 'success' ? `    // 状态: ${statusMap[apiStatus.value]}\n    await flushPromises()\n    expect(wrapper.text()).toContain('Alice')\n    expect(wrapper.text()).toContain('1')` :
      `    // 状态: ${statusMap[apiStatus.value]}\n    await flushPromises()\n    expect(wrapper.text()).toContain('加载失败')`}
  })
})`
})
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 4：异步与 Mock</h1>
      <p>掌握 vi.fn() 模拟函数、vi.mock() 模块模拟、异步组件测试与 flushPromises 模式。</p>
    </header>

    <!-- 4.1 vi.fn() -->
    <section class="card">
      <h2>4.1 vi.fn() — 模拟函数</h2>
      <p class="tip">
        <code>vi.fn()</code> 创建模拟函数，可验证调用次数、参数、返回值。
        支持 <code>mockReturnValue</code>、<code>mockResolvedValue</code>、<code>mockRejectedValue</code>。
      </p>
      <pre class="code-block"><code>{{ viFnCode }}</code></pre>
    </section>

    <!-- 4.2 vi.spyOn() -->
    <section class="card">
      <h2>4.2 vi.spyOn() — 监听方法</h2>
      <p class="tip">
        <code>vi.spyOn(object, method)</code> 监听对象上的方法调用，
        不改变原始行为（除非使用 <code>mockReturnValue</code> 等替换）。
      </p>
      <pre class="code-block"><code>{{ viSpyCode }}</code></pre>
    </section>

    <!-- 4.3 vi.mock() -->
    <section class="card">
      <h2>4.3 vi.mock() — 模块模拟</h2>
      <p class="tip">
        <code>vi.mock('module-path', factory)</code> 模拟整个模块，替换其导出。
        Vitest 会自动提升 <code>vi.mock()</code> 到文件顶部执行。
      </p>
      <pre class="code-block"><code>{{ viMockCode }}</code></pre>
    </section>

    <!-- 4.4 异步组件测试 -->
    <section class="card">
      <h2>4.4 异步组件测试</h2>
      <p class="tip">
        组件挂载后发起异步请求，需要等待 Promise 完成后再断言渲染结果。
        使用 <code>flushPromises()</code> 一次性刷新所有 pending Promise。
      </p>
      <pre class="code-block"><code>{{ asyncTestCode }}</code></pre>
    </section>

    <!-- 4.5 nextTick vs flushPromises -->
    <section class="card">
      <h2>4.5 nextTick vs flushPromises 对比</h2>
      <div class="info-grid">
        <div v-for="u in asyncUtils" :key="u.name" class="info-item">
          <strong>{{ u.name }}</strong>
          <span>{{ u.desc }}</span>
          <pre class="mini-code">{{ u.use }}</pre>
        </div>
      </div>
    </section>

    <!-- 4.6 交互演示 -->
    <section class="card">
      <h2>4.6 交互演示：模拟异步 API 调用</h2>
      <p class="tip">点击按钮模拟 API 调用，观察异步状态变化与测试代码。</p>
      <div class="demo-row">
        <div class="demo-area">
          <div v-if="apiStatus === 'idle'" class="status-idle">等待调用...</div>
          <div v-else-if="apiStatus === 'loading'" class="status-loading">加载中...</div>
          <div v-else-if="apiStatus === 'success'" class="status-success">
            <p style="margin: 0 0 4px;">加载成功!</p>
            <p style="margin: 0; font-size: 13px;">ID: {{ mockData?.id }}, Name: {{ mockData?.name }}</p>
          </div>
          <div v-else-if="apiStatus === 'error'" class="status-error">加载失败</div>
          <div class="btn-group" style="margin-top: 12px;">
            <button class="btn" @click="simulateApiCall" :disabled="apiStatus === 'loading'">模拟成功</button>
            <button class="btn btn-warn" @click="simulateApiError" :disabled="apiStatus === 'loading'">模拟失败</button>
            <button class="btn btn-reset" @click="resetApi">重置</button>
          </div>
        </div>
        <div class="demo-code">
          <pre class="code-block" style="margin: 0"><code>{{ demoTestCode }}</code></pre>
        </div>
      </div>
    </section>

    <!-- 4.7 Mock 最佳实践 -->
    <section class="card">
      <h2>4.7 Mock 最佳实践</h2>
      <div class="highlight-box">
        <p><strong>只 mock 外部依赖</strong>：API、数据库、文件系统等，不要 mock 被测试模块本身。</p>
        <p><strong>使用 vi.mocked() 获得类型安全</strong>：<code>vi.mocked(myFn).mockResolvedValue(data)</code></p>
        <p><strong>每个测试后清理</strong>：在 <code>afterEach</code> 中调用 <code>vi.clearAllMocks()</code> 或 <code>vi.restoreAllMocks()</code></p>
        <p><strong>避免过度 mock</strong>：过度 mock 会导致测试与实现强耦合，失去重构信心。</p>
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
.info-item strong {
  display: block;
  margin-bottom: 4px;
  color: #333;
}
.info-item span {
  font-size: 12px;
  color: #999;
}
.mini-code {
  background: #1e1e1e;
  color: #52c41a;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 11px;
  margin-top: 6px;
  overflow-x: auto;
  font-family: monospace;
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
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-warn {
  background: #fa8c16;
}
.btn-warn:hover {
  background: #d46b08;
}
.btn-reset {
  background: #999;
}
.btn-reset:hover {
  background: #666;
}

.status-idle {
  color: #999;
  padding: 16px;
}
.status-loading {
  color: #1890ff;
  padding: 16px;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.status-success {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 6px;
  padding: 12px;
  color: #389e0d;
}
.status-error {
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 6px;
  padding: 12px;
  color: #cf1322;
}

.highlight-box {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  padding: 14px;
}
.highlight-box p {
  margin: 6px 0;
  font-size: 13px;
  color: #ad6800;
  line-height: 1.6;
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
