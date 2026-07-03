<script setup lang="ts">
import { ref } from 'vue'

// ==================== 完整的代码展示 ====================
const step1Code = ref(`// Step 1: 创建 axios 实例
import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})`)

const step2Code = ref(`// Step 2: 定义类型
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

export class BizError extends Error {
  code: number
  constructor(code: number, message: string) {
    super(message)
    this.name = 'BizError'
    this.code = code
  }
}`)

const step3Code = ref(`// Step 3: 请求拦截器
instance.interceptors.request.use((config) => {
  // 防缓存时间戳
  config.params = { ...config.params, t: Date.now() }

  // 自动注入 Token
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`
  }

  console.log(\`[→] \${config.method} \${config.url}\`)
  return config
})`)

const step4Code = ref(`// Step 4: 响应拦截器
instance.interceptors.response.use(
  (res: AxiosResponse<ApiResponse>) => {
    const { code, data, message } = res.data

    // 成功：只返回 data
    if (code === 0 || code === 200) return data

    // 业务异常：统一提示
    switch (code) {
      case 401: /* router.push('/login') */ break
      case 403: /* message.error('无权限') */ break
      default:  /* message.error(message) */
    }

    return Promise.reject(new BizError(code, message))
  },
  (err) => {
    // 网络异常
    if (err.code === 'ECONNABORTED')
      console.error('请求超时')

    return Promise.reject(err)
  }
)`)

const step5Code = ref(`// Step 5: 便捷方法封装
export function get<T>(url: string, params?: Record<string, any>) {
  return instance.get(url, { params }) as any as Promise<T>
}

export function post<T>(url: string, data?: Record<string, any>) {
  return instance.post(url, data) as any as Promise<T>
}

export function put<T>(url: string, data?: Record<string, any>) {
  return instance.put(url, data) as any as Promise<T>
}

export function del<T>(url: string) {
  return instance.delete(url) as any as Promise<T>
}

export default instance`)

const step6Code = ref(`// Step 6: 业务模块 API 封装
// src/api/modules/user.ts
import { get, post } from '../request'

export interface User {
  id: number
  name: string
  email: string
}

export function getUsers(params: any) {
  return get<{ list: User[]; total: number }>('/users', params)
}

// ===== 组件中调用 =====
import { getUsers } from '@/api/modules/user'

const result = await getUsers({ page: 1 })
// result 类型自动推断: { list: User[], total: number }
result.list.forEach(user => {
  console.log(user.name) // ✅ 有完整的类型提示
})`)

const projectStructure = ref(`project/
└── src/
    └── api/
        ├── request.ts        # axios 实例 + 拦截器（核心）
        ├── types.ts          # 公共类型定义
        ├── index.ts          # 统一导出
        └── modules/          # 按业务模块拆分
            ├── user.ts       # 用户 API
            ├── employee.ts   # 员工 API
            ├── permission.ts # 权限 API
            └── axios-demo.ts # 示例 API`)

// ==================== Best Practices ====================
const practices = ref([
  { title: '单一实例', desc: '通过 axios.create() 创建独立实例，不要直接修改 axios 默认实例' },
  { title: '类型安全', desc: '利用泛型约束请求/响应类型，在 API 层定义完整的 TypeScript 接口' },
  { title: '错误分层', desc: '拦截器处理通用异常（401/403/网络），组件 try/catch 处理业务特殊逻辑' },
  { title: '按模块拆分', desc: 'API 函数按业务模块分文件，避免单个文件过大' },
  { title: '环境隔离', desc: '使用环境变量管理 baseURL，开发连 Mock，生产连真实 API' },
  { title: 'Loading 计数器', desc: '维护 pendingCount，> 0 时显示 Loading，= 0 时隐藏，支持并发' },
  { title: '请求防抖', desc: '搜索类场景必须结合防抖 + AbortController，避免无效请求' },
  { title: '日志输出', desc: '开发环境输出请求日志，方便调试；生产环境可精简' },
])
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 5: 实战 — 从零封装生产级 request.ts</h1>
      <p>参照项目 <code>src/api/request.ts</code>，掌握生产级 axios 封装的最佳实践</p>
    </header>

    <!-- 项目文件结构 -->
    <section class="card">
      <h2>📁 推荐目录结构</h2>
      <div class="code-block">
        <pre>{{ projectStructure }}</pre>
      </div>
    </section>

    <!-- Step 1-2 -->
    <section class="card">
      <h2>Step 1-2: 创建实例 + 定义类型</h2>
      <p class="desc">
        使用 <code>axios.create()</code> 创建独立实例（避免污染全局 axios），定义通用响应格式和业务异常类。
      </p>
      <div class="code-grid">
        <div class="code-block">
          <pre>{{ step1Code }}</pre>
        </div>
        <div class="code-block">
          <pre>{{ step2Code }}</pre>
        </div>
      </div>
    </section>

    <!-- Step 3-4: 拦截器 -->
    <section class="card">
      <h2>Step 3-4: 请求拦截器 + 响应拦截器</h2>
      <p class="desc">
        请求拦截器：注入 Token、防缓存时间戳、日志输出。 响应拦截器：统一校验业务码（code），成功提取 data，失败抛出
        BizError。
      </p>
      <div class="code-grid">
        <div class="code-block">
          <pre>{{ step3Code }}</pre>
        </div>
        <div class="code-block">
          <pre>{{ step4Code }}</pre>
        </div>
      </div>
    </section>

    <!-- Step 5-6: 便捷方法 + 业务封装 -->
    <section class="card">
      <h2>Step 5-6: 便捷方法 + 业务模块拆分</h2>
      <p class="desc">
        封装 <code>get/post/put/del</code> 便捷函数，按业务模块拆分 API 调用，利用泛型实现端到端类型安全。
      </p>
      <div class="code-grid">
        <div class="code-block">
          <pre>{{ step5Code }}</pre>
        </div>
        <div class="code-block">
          <pre>{{ step6Code }}</pre>
        </div>
      </div>
    </section>

    <!-- 完整文件展示 -->
    <section class="card">
      <h2>📄 查看项目实际代码</h2>
      <p class="desc">
        以上代码直接取自项目 <code>src/api/request.ts</code>，你可以打开文件查看完整实现。 对比本页的 6
        个步骤，理解每一步的设计思路。
      </p>
      <div class="demo-row">
        <a-button
          type="primary"
          @click="
            () => {
              /* 这里可以放跳转链接 */
            }
          "
        >
          打开 src/api/request.ts (在 IDE 中查看)
        </a-button>
        <a-button
          @click="
            () => {
              /* 这里可以放跳转链接 */
            }
          "
        >
          打开 src/api/modules/axios-demo.ts
        </a-button>
      </div>
    </section>

    <!-- 最佳实践 -->
    <section class="card">
      <h2>✅ 生产级 axios 封装最佳实践</h2>
      <div class="practice-grid">
        <div v-for="(p, i) in practices" :key="i" class="practice-item">
          <strong>#{{ i + 1 }} {{ p.title }}</strong>
          <span>{{ p.desc }}</span>
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
  margin-bottom: 28px;
}

.page-header h1 {
  font-size: 26px;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.page-header p {
  color: #888;
  font-size: 14px;
  margin: 0;
}

.page-header code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card h2 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #333;
}

.desc {
  color: #888;
  font-size: 13px;
  line-height: 1.6;
  margin: 0 0 14px;
}

.desc code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.code-block {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 14px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.5;
}

.code-block pre {
  margin: 0;
}

.code-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.demo-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.practice-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.practice-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.practice-item strong {
  font-size: 12px;
  color: #333;
}

.practice-item span {
  font-size: 11px;
  color: #999;
}

@media (max-width: 768px) {
  .code-grid {
    grid-template-columns: 1fr;
  }
  .practice-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
