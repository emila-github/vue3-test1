<script setup lang="ts">
// ====== 1. Partial / Required / Readonly ======
interface User {
  name: string
  age: number
  email: string
}

const user: User = { name: '张三', age: 25, email: 'zhang@test.com' }

const partialCode = `interface User {
  name: string; age: number; email: string
}

// Partial — 所有属性变为可选
type PartialUser = Partial<User>
// { name?: string; age?: number; email?: string }

// Required — 所有属性变为必选
type RequiredUser = Required<PartialUser>

// Readonly — 所有属性变为只读
type ReadonlyUser = Readonly<User>`

// ====== 2. Pick / Omit ======
type UserPreview = Pick<User, 'name' | 'age'>
type UserWithoutEmail = Omit<User, 'email'>

const pickOmitCode = `// Pick — 选取部分属性
type UserPreview = Pick<User, 'name' | 'age'>
// { name: string; age: number }

// Omit — 排除部分属性
type UserWithoutEmail = Omit<User, 'email'>
// { name: string; age: number }`

// ====== 3. Record ======
type PageNames = 'home' | 'about' | 'contact'
type PageInfo = Record<PageNames, { title: string; path: string }>

const pages: PageInfo = {
  home: { title: '首页', path: '/' },
  about: { title: '关于', path: '/about' },
  contact: { title: '联系', path: '/contact' },
}

const recordCode = `type PageNames = 'home' | 'about' | 'contact'
type PageInfo = Record<PageNames, { title: string; path: string }>

const pages: PageInfo = {
  home: { title: '首页', path: '/' },
  about: { title: '关于', path: '/about' },
  contact: { title: '联系', path: '/contact' },
}`

// ====== 4. Exclude / Extract ======
type AllStatus = 'success' | 'error' | 'loading' | 'idle'
type ErrorStatus = Exclude<AllStatus, 'loading' | 'idle'>
type LoadStatus = Extract<AllStatus, 'loading' | 'idle'>

const excludeCode = `type AllStatus = 'success' | 'error' | 'loading' | 'idle'

// Exclude — 从联合类型中排除
type ErrorStatus = Exclude<AllStatus, 'loading' | 'idle'>
// 'success' | 'error'

// Extract — 从联合类型中提取
type LoadStatus = Extract<AllStatus, 'loading' | 'idle'>
// 'loading' | 'idle'`

// ====== 5. NonNullable / Parameters / ReturnType ======
type NullableString = string | null | undefined
type SafeString = NonNullable<NullableString> // string

function createUser(name: string, age: number): { name: string; age: number } {
  return { name, age }
}

type CreateUserParams = Parameters<typeof createUser> // [string, number]
type CreateUserReturn = ReturnType<typeof createUser> // { name: string; age: number }

const utilCode = `// NonNullable — 排除 null 和 undefined
type Nullable = string | null | undefined
type Safe = NonNullable<Nullable>  // string

// Parameters — 获取函数参数类型元组
type P = Parameters<(a: string, b: number) => void>
// [string, number]

// ReturnType — 获取函数返回值类型
type R = ReturnType<() => string>
// string`

// ====== 6. 自定义工具类型 ======
const customCode = `// DeepPartial — 深层可选
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? DeepPartial<T[K]>
    : T[K]
}

// NonEmptyArray — 非空数组
type NonEmptyArray<T> = [T, ...T[]]

// Merge — 合并两个类型
type Merge<F, S> = Omit<F, keyof S> & S

// ValueOf — 获取对象值的联合类型
type ValueOf<T> = T[keyof T]`
</script>

<template>
  <div class="utility-types-page">
    <header class="page-header">
      <h1>TypeScript 工具类型</h1>
      <p class="page-subtitle">
        TypeScript 内置了大量<strong>工具类型</strong>（Utility
        Types），让你从已有类型<strong>快速派生</strong>出新类型，无需手写。
      </p>
    </header>

    <!-- ==================== 引言 ==================== -->
    <section class="demo-section intro-section">
      <h2 class="section-title">📖 什么是工具类型？为什么需要它？</h2>
      <div class="explain-box">
        <p>
          <strong>一句话解释：</strong>工具类型是 TypeScript
          内置的<em>"类型转换函数"</em>——传入一个类型，返回一个变换后的新类型。
        </p>
        <h3>没有工具类型的痛苦 😫</h3>
        <pre class="code-block">
// 每次都要手动定义变体类型
interface User { name: string; age: number; email: string }

// 需要一个"所有属性可选"的 User 用于更新接口
interface UserUpdate {
  name?: string    // 手写，容易遗漏
  age?: number
  email?: string
}

// 需要一个"只保留 name 和 age"的 User 用于列表展示
interface UserPreview {
  name: string
  age: number
}</pre
        >
        <h3>有了工具类型之后 😎</h3>
        <pre class="code-block">
// 一行搞定，不会遗漏
type UserUpdate = Partial&lt;User&gt;         // 全部可选
type UserPreview = Pick&lt;User, 'name' | 'age'&gt;  // 只取 name + age

// 更多变体：
type ReadonlyUser = Readonly&lt;User&gt;      // 全部只读
type UserNameOnly = Omit&lt;User, 'age' | 'email'&gt;  // 去掉 age 和 email</pre
        >
        <div class="key-points">
          <p>🔑 <strong>核心要点：</strong></p>
          <ul>
            <li><code>Partial&lt;T&gt;</code> — 所有属性变可选（更新场景最常用）</li>
            <li><code>Pick&lt;T, K&gt;</code> — 从 T 中挑选 K 属性</li>
            <li><code>Omit&lt;T, K&gt;</code> — 从 T 中排除 K 属性</li>
            <li><code>Record&lt;K, V&gt;</code> — 构造 key 为 K、value 为 V 的对象类型</li>
            <li><code>Exclude&lt;T, U&gt;</code> / <code>Extract&lt;T, U&gt;</code> — 联合类型过滤</li>
          </ul>
        </div>
      </div>
    </section>
    <!-- Partial / Required / Readonly -->
    <section class="demo-section">
      <h2>1. Partial / Required / Readonly</h2>
      <pre class="code-block">{{ partialCode }}</pre>
      <div class="result-box">
        <p><strong>User 实例:</strong></p>
        <p>name: {{ user.name }}, age: {{ user.age }}, email: {{ user.email }}</p>
      </div>
    </section>

    <!-- Pick / Omit -->
    <section class="demo-section">
      <h2>2. Pick / Omit</h2>
      <pre class="code-block">{{ pickOmitCode }}</pre>
      <p class="hint">Pick 和 Omit 是互补操作：Pick 取子集，Omit 排除子集</p>
    </section>

    <!-- Record -->
    <section class="demo-section">
      <h2>3. Record&lt;K, T&gt;</h2>
      <pre class="code-block">{{ recordCode }}</pre>
      <div class="result-box">
        <p v-for="(info, key) in pages" :key="key">
          pages.{{ key }} = {{ '{' }} title: "{{ info.title }}", path: "{{ info.path }}" {{ '}' }}
        </p>
      </div>
    </section>

    <!-- Exclude / Extract -->
    <section class="demo-section">
      <h2>4. Exclude / Extract</h2>
      <pre class="code-block">{{ excludeCode }}</pre>
      <div class="result-box">
        <p>AllStatus = <code>'success' | 'error' | 'loading' | 'idle'</code></p>
        <p>Exclude&lt;AllStatus, 'loading' | 'idle'&gt; → <code>'success' | 'error'</code></p>
        <p>Extract&lt;AllStatus, 'loading' | 'idle'&gt; → <code>'loading' | 'idle'</code></p>
      </div>
    </section>

    <!-- 函数相关工具类型 -->
    <section class="demo-section">
      <h2>5. NonNullable / Parameters / ReturnType</h2>
      <pre class="code-block">{{ utilCode }}</pre>
    </section>

    <!-- 自定义工具类型 -->
    <section class="demo-section">
      <h2>6. 自定义工具类型</h2>
      <pre class="code-block">{{ customCode }}</pre>
    </section>

    <!-- ==================== 速查表 ==================== -->
    <section class="demo-section summary-section">
      <h2 class="section-title">📋 工具类型速查表</h2>
      <table class="summary-table">
        <thead>
          <tr>
            <th>工具类型</th>
            <th>作用</th>
            <th>示例</th>
            <th>通俗理解</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Partial&lt;T&gt;</code></td>
            <td>所有属性变可选</td>
            <td><code>Partial&lt;User&gt;</code></td>
            <td>"全部打 ?"</td>
          </tr>
          <tr>
            <td><code>Required&lt;T&gt;</code></td>
            <td>所有属性变必填</td>
            <td><code>Required&lt;PartialUser&gt;</code></td>
            <td>"去掉所有 ?"</td>
          </tr>
          <tr>
            <td><code>Readonly&lt;T&gt;</code></td>
            <td>所有属性变只读</td>
            <td><code>Readonly&lt;User&gt;</code></td>
            <td>"全锁上"</td>
          </tr>
          <tr>
            <td><code>Pick&lt;T, K&gt;</code></td>
            <td>挑选部分属性</td>
            <td><code>Pick&lt;User, 'name'&gt;</code></td>
            <td>"只要这几个"</td>
          </tr>
          <tr>
            <td><code>Omit&lt;T, K&gt;</code></td>
            <td>排除部分属性</td>
            <td><code>Omit&lt;User, 'email'&gt;</code></td>
            <td>"不要这几个"</td>
          </tr>
          <tr>
            <td><code>Record&lt;K, V&gt;</code></td>
            <td>构造对象类型</td>
            <td><code>Record&lt;'a'|'b', number&gt;</code></td>
            <td>"搭一个 { a: number; b: number }"</td>
          </tr>
          <tr>
            <td><code>Exclude&lt;T, U&gt;</code></td>
            <td>从联合类型排除</td>
            <td><code>Exclude&lt;'a'|'b', 'a'&gt;</code></td>
            <td>"从集合里删掉"</td>
          </tr>
          <tr>
            <td><code>Extract&lt;T, U&gt;</code></td>
            <td>从联合类型提取</td>
            <td><code>Extract&lt;'a'|'b', 'a'&gt;</code></td>
            <td>"从集合里挑出"</td>
          </tr>
          <tr>
            <td><code>NonNullable&lt;T&gt;</code></td>
            <td>排除 null/undefined</td>
            <td><code>NonNullable&lt;string|null&gt;</code></td>
            <td>"去掉空的"</td>
          </tr>
          <tr>
            <td><code>Parameters&lt;F&gt;</code></td>
            <td>获取函数参数类型</td>
            <td><code>Parameters&lt;typeof fn&gt;</code></td>
            <td>"看函数要什么参数"</td>
          </tr>
          <tr>
            <td><code>ReturnType&lt;F&gt;</code></td>
            <td>获取函数返回值类型</td>
            <td><code>ReturnType&lt;typeof fn&gt;</code></td>
            <td>"看函数返回什么"</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
/* ===== 页面布局 ===== */
.utility-types-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 20px 60px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  color: #1a1a2e;
  margin: 0 0 8px;
}

.page-subtitle {
  color: #666;
  font-size: 15px;
  line-height: 1.7;
  max-width: 640px;
  margin: 0 auto;
}

.demo-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #3178c6;
}

.section-title {
  margin: 0 0 8px;
  color: #1a1a2e;
  font-size: 19px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
}

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 14px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  margin: 0 0 12px;
  white-space: pre;
}

.result-box {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px 16px;
  margin-top: 8px;
}

.result-box p {
  margin: 4px 0;
  font-size: 14px;
  color: #333;
}

.hint {
  color: #999;
  font-size: 13px;
  margin-top: 6px;
}

code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
  color: #d63384;
}

/* ===== 介绍区域 ===== */
.intro-section {
  border-left-color: #fa8c16;
  background: #fffbe6;
}

.explain-box {
  line-height: 1.8;
}

.explain-box h3 {
  font-size: 15px;
  margin: 16px 0 8px;
  color: #333;
}

.explain-box p {
  margin: 6px 0;
  color: #444;
}

.key-points {
  background: #fff;
  border: 1px solid #ffd591;
  border-radius: 6px;
  padding: 12px 16px;
  margin-top: 12px;
}

.key-points p {
  margin: 0 0 6px;
  color: #d46b08;
}

.key-points ul {
  margin: 0;
  padding-left: 20px;
}

.key-points li {
  margin: 4px 0;
  font-size: 14px;
  color: #555;
}

.key-points code {
  background: #fff3e0;
  padding: 1px 5px;
  border-radius: 3px;
  color: #d46b08;
}

/* ===== 总结区 ===== */
.summary-section {
  border-left-color: #52c41a;
  background: #f6ffed;
}

.summary-section .section-title {
  color: #065f46;
}

.summary-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  font-size: 14px;
}

.summary-table th {
  background: #e8f5e9;
  padding: 10px 14px;
  text-align: left;
  font-weight: 600;
  color: #2e7d32;
  border-bottom: 2px solid #c8e6c9;
}

.summary-table td {
  padding: 10px 14px;
  border-bottom: 1px solid #e8e8e8;
  color: #444;
}

.summary-table code {
  background: #e8e8e8;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
  color: #cf1322;
  white-space: nowrap;
}

.summary-table tbody tr:hover {
  background: #f5f5f5;
}
</style>
