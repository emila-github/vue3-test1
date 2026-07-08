<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { getAxiosDemoList, getAxiosDemoUser } from '@/api/modules/axios-demo'
import type { AxiosUser, AxiosPageResult } from '@/api/modules/axios-demo'

// ==================== Demo 1: GET 请求 ====================
const getListLoading = ref(false)
const getListResult = ref<string>('')
const getSingleLoading = ref(false)
const getSingleResult = ref<string>('')

async function doGetList() {
  getListLoading.value = true
  try {
    const data = await getAxiosDemoList({ keyword: '', page: 1, pageSize: 10 })
    getListResult.value = JSON.stringify(data, null, 2)
    message.success('GET 请求成功')
  } catch (err: any) {
    getListResult.value = `错误: ${err.message || err}`
    message.error('请求失败')
  } finally {
    getListLoading.value = false
  }
}

async function doGetSingle() {
  getSingleLoading.value = true
  try {
    const data = await getAxiosDemoUser(1)
    getSingleResult.value = JSON.stringify(data, null, 2)
    message.success('GET 单个用户成功')
  } catch (err: any) {
    getSingleResult.value = `错误: ${err.message || err}`
  } finally {
    getSingleLoading.value = false
  }
}

// ==================== Demo 2: POST/PUT/DELETE ====================
const postLoading = ref(false)
const postResult = ref<string>('')
const postForm = ref({ name: '', email: '', role: 'viewer' })

async function doPost() {
  postLoading.value = true
  try {
    const { post, put, del } = await import('@/api/request')
    const { createAxiosDemoUser, updateAxiosDemoUser, deleteAxiosDemoUser } = await import('@/api/modules/axios-demo')

    // 创建
    const created = await createAxiosDemoUser(postForm.value)
    // 更新
    const updated = await updateAxiosDemoUser({ ...created, name: created.name + '(已更新)' })
    // 删除
    await deleteAxiosDemoUser(updated.id)

    postResult.value = `创建: ${JSON.stringify(created)}\n更新: ${JSON.stringify(updated)}\n删除: 成功`
    message.success('CRUD 链路执行完成')
  } catch (err: any) {
    postResult.value = `错误: ${err.message || err}`
  } finally {
    postLoading.value = false
  }
}

// ==================== Demo 3: 错误处理 ====================
const errorLoading = ref(false)
const errorResult = ref<string>('')

async function doErrorTest(code: 401 | 403 | 500) {
  errorLoading.value = true
  errorResult.value = ''
  try {
    const { get } = await import('@/api/request')
    await get(`/axios-demo/error/${code}`)
  } catch (err: any) {
    errorResult.value = `拦截器捕获到业务异常: code=${err.code || 'N/A'}, message="${err.message}"`
  } finally {
    errorLoading.value = false
  }
}

// ==================== Demo 4: TypeScript 泛型演示 ====================
const tsDemoCode = ref(`// ✅ 有类型约束的 API 调用
import { getAxiosDemoList } from '@/api/modules/axios-demo'

async function fetchUsers() {
  // 返回值自动推断为 AxiosPageResult<AxiosUser>
  const result = await getAxiosDemoList({ page: 1 })

  result.list.forEach(user => {
    console.log(user.name)    // ✅ TypeScript 知道有 name 属性
    console.log(user.age)     // ❌ 编译错误: AxiosUser 没有 age
  })

  return result.total  // ✅ number
}`)
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 1: Axios 快速上手</h1>
      <p>安装、基础请求（GET/POST/PUT/DELETE）、TypeScript 泛型约束、统一错误处理</p>
    </header>

    <!-- 安装说明 -->
    <section class="card">
      <h2>📦 安装 Axios</h2>
      <div class="code-block">
        <code>pnpm add axios</code>
      </div>
      <p style="color: #999; font-size: 13px; margin-top: 8px">
        当前项目已安装 <code>axios@^1.7</code>，核心文件位于 <code>src/api/request.ts</code>
      </p>
    </section>

    <!-- GET 请求演示 -->
    <section class="card">
      <h2>1. GET 请求 — 获取列表 / 单个资源</h2>
      <p class="desc">
        列表接口返回 <code>{ code, data: { list, total }, message }</code>，项目拦截器自动提取
        <code>data</code> 字段，组件只需处理业务数据。
      </p>
      <div class="demo-row">
        <a-button type="primary" :loading="getListLoading" @click="doGetList">获取用户列表</a-button>
        <a-button :loading="getSingleLoading" @click="doGetSingle">获取 ID=1 用户</a-button>
      </div>
      <div v-if="getListResult" class="result-box">
        <h4>列表响应:</h4>
        <pre>{{ getListResult }}</pre>
      </div>
      <div v-if="getSingleResult" class="result-box">
        <h4>单用户响应:</h4>
        <pre>{{ getSingleResult }}</pre>
      </div>
    </section>

    <!-- POST/PUT/DELETE 演示 -->
    <section class="card">
      <h2>2. POST / PUT / DELETE — 创建 → 更新 → 删除链路</h2>
      <p class="desc">演示完整的 CRUD 操作链：填写表单 → POST 创建 → PUT 更新 → DELETE 删除</p>
      <div class="form-row">
        <a-input v-model:value="postForm.name" placeholder="用户名" style="width: 140px" />
        <a-input v-model:value="postForm.email" placeholder="邮箱" style="width: 200px" />
        <a-select v-model:value="postForm.role" style="width: 120px">
          <a-select-option value="admin">管理员</a-select-option>
          <a-select-option value="editor">编辑者</a-select-option>
          <a-select-option value="viewer">查看者</a-select-option>
        </a-select>
        <a-button type="primary" :loading="postLoading" @click="doPost">执行 CRUD 链路</a-button>
      </div>
      <div v-if="postResult" class="result-box">
        <pre>{{ postResult }}</pre>
      </div>
    </section>

    <!-- 错误处理演示 -->
    <section class="card">
      <h2>3. 统一错误处理 — 拦截器自动捕获业务异常</h2>
      <p class="desc">
        项目的 <code>request.ts</code> 响应拦截器会检查 <code>code</code>：非 200/0 时自动抛出
        <code>BizError</code>。组件层可通过 <code>try/catch</code> 统一捕获。
      </p>
      <div class="demo-row">
        <a-button danger :loading="errorLoading" @click="doErrorTest(401)">触发 401 错误</a-button>
        <a-button danger :loading="errorLoading" @click="doErrorTest(403)">触发 403 错误</a-button>
        <a-button danger :loading="errorLoading" @click="doErrorTest(500)">触发 500 错误</a-button>
      </div>
      <div v-if="errorResult" class="result-box error-box">
        <pre>{{ errorResult }}</pre>
      </div>
    </section>

    <!-- TypeScript 泛型 -->
    <section class="card">
      <h2>4. TypeScript 泛型 — 类型安全的请求</h2>
      <p class="desc">项目的 <code>get&lt;T&gt;()</code> 便捷函数结合业务接口类型，实现端到端的类型安全。</p>
      <div class="code-block">
        <pre>{{ tsDemoCode }}</pre>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 900px;
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
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
}

.code-block code {
  font-size: 13px;
}

.demo-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.form-row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.result-box {
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 12px 16px;
  margin-top: 10px;
}

.result-box h4 {
  margin: 0 0 6px;
  font-size: 13px;
  color: #666;
}

.result-box pre {
  margin: 0;
  font-size: 12px;
  color: #333;
  white-space: pre-wrap;
  word-break: break-all;
}

.error-box {
  background: #fff5f5;
  border-color: #fecaca;
}

.error-box pre {
  color: #c53030;
}
</style>
