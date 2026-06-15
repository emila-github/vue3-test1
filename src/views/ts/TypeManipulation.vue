<script setup lang="ts">
// ====== 1. keyof ======
interface Person {
  name: string
  age: number
  city: string
}

type PersonKeys = keyof Person // 'name' | 'age' | 'city'

const keyofCode = `interface Person {
  name: string
  age: number
  city: string
}

type PersonKeys = keyof Person
// 'name' | 'age' | 'city'`

// ====== 2. typeof ======
const config = {
  host: 'localhost',
  port: 3000,
  debug: true,
}

type Config = typeof config
// { host: string; port: number; debug: boolean }

const typeofCode = `const config = {
  host: 'localhost',
  port: 3000,
  debug: true,
}

type Config = typeof config
// { host: string; port: number; debug: boolean }`

// ====== 3. 索引访问类型 ======
interface User {
  name: string
  age: number
  address: {
    city: string
    street: string
  }
}

type UserName = User['name']            // string
type UserAddress = User['address']      // { city: string; street: string }
type UserCity = User['address']['city'] // string

const indexedCode = `interface User {
  name: string
  age: number
  address: { city: string; street: string }
}

type UserName = User['name']            // string
type UserAddress = User['address']      // { city: string; street: string }
type UserCity = User['address']['city'] // string

// 联合类型的索引
type Keys = 'name' | 'age'
type Values = User[Keys]  // string | number`

// ====== 4. 映射类型 ======
const mappedCode = `// 手动实现 Partial
type MyPartial<T> = {
  [K in keyof T]?: T[K]
}

// 手动实现 Readonly
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

// 手动实现 Pick
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// 移除修饰符
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

type Required2<T> = {
  [K in keyof T]-?: T[K]
}`

// ====== 5. 模板字面量类型 ======
type Event = 'click' | 'focus' | 'blur'
type EventHandler = `on${Capitalize<Event>}`
// 'onClick' | 'onFocus' | 'onBlur'

type Greeting = `Hello, ${string}!`

const templateCode = `type Event = 'click' | 'focus' | 'blur'
type EventHandler = \`on\${Capitalize<Event>}\`
// 'onClick' | 'onFocus' | 'onBlur'

type Greeting = \`Hello, \${string}!\`

// 内置字符串工具类型
Uppercase<'hello'>    // 'HELLO'
Lowercase<'HELLO'>    // 'hello'
Capitalize<'hello'>   // 'Hello'
Uncapitalize<'Hello'> // 'hello'`
</script>

<template>
  <div class="type-manipulation-page">
    <header class="page-header">
      <h1>TypeScript 类型操作</h1>
      <p class="page-subtitle">掌握<strong>keyof</strong>、<strong>typeof</strong>、<strong>索引访问</strong>、<strong>映射类型</strong>和<strong>模板字面量类型</strong>，让你在类型层面"编程"。</p>
    </header>

    <!-- ==================== 引言 ==================== -->
    <section class="demo-section intro-section">
      <h2 class="section-title">📖 什么是类型操作？为什么需要它？</h2>
      <div class="explain-box">
        <p>
          <strong>一句话解释：</strong>类型操作让你<em>在类型层面做计算</em>——从已有类型中提取、遍历、变换出新类型，避免手动重复定义。
        </p>
        <h3>没有类型操作的痛苦 😫</h3>
        <pre class="code-block">
// 手动为每个属性重复定义类型
interface Person { name: string; age: number; city: string }

// 想定义一个"Person 的所有属性都是可选的"新类型
interface PartialPerson {
  name?: string   // 手写，容易遗漏
  age?: number
  city?: string
}
// 如果 Person 有 20 个属性，你就得手写 20 个 ?</pre>
        <h3>有了类型操作之后 😎</h3>
        <pre class="code-block">
// 用映射类型自动生成
type PartialPerson = { [K in keyof Person]?: Person[K] }
// 一行代码，自动遍历 Person 的所有属性，全变成可选

// keyof Person    → 'name' | 'age' | 'city'（获取所有 key）
// [K in keyof Person]  → 逐个遍历每个 key
// Person[K]       → 获取每个 key 对应的 value 类型</pre>
        <div class="key-points">
          <p>🔑 <strong>核心要点：</strong></p>
          <ul>
            <li><code>keyof T</code> — 获取 T 的所有属性名，返回<strong>字符串字面量联合类型</strong></li>
            <li><code>typeof x</code> — 从<strong>实际值</strong>推导出类型</li>
            <li><code>T['key']</code> — <strong>索引访问</strong>，获取某属性的类型</li>
            <li><code>[K in keyof T]</code> — <strong>映射类型</strong>，遍历每个属性并变换</li>
            <li><code>`前缀${T}后缀`</code> — <strong>模板字面量类型</strong>，拼接字符串类型</li>
          </ul>
        </div>
      </div>
    </section>
    <!-- keyof -->
    <section class="demo-section">
      <h2>1. keyof — 获取对象键的联合类型</h2>
      <pre class="code-block">{{ keyofCode }}</pre>
      <div class="result-box">
        <p>PersonKeys = <code>'name' | 'age' | 'city'</code></p>
        <p class="hint">keyof T 返回 T 的所有键组成的字符串字面量联合类型</p>
      </div>
    </section>

    <!-- typeof -->
    <section class="demo-section">
      <h2>2. typeof — 从值推导类型</h2>
      <pre class="code-block">{{ typeofCode }}</pre>
      <div class="result-box">
        <p>config 对象: {{ '{' }} host: '{{ config.host }}', port: {{ config.port }}, debug: {{ config.debug }} {{ '}' }}</p>
        <p>Config 类型 = <code>{{ '{' }} host: string; port: number; debug: boolean {{ '}' }}</code></p>
        <p class="hint">typeof 从实际值自动推导类型，避免手动声明</p>
      </div>
    </section>

    <!-- 索引访问类型 -->
    <section class="demo-section">
      <h2>3. 索引访问类型 T[K]</h2>
      <pre class="code-block">{{ indexedCode }}</pre>
      <div class="result-box">
        <p>User['name'] → <code>string</code></p>
        <p>User['address'] → <code>{{ '{' }} city: string; street: string {{ '}' }}</code></p>
        <p>User['address']['city'] → <code>string</code></p>
      </div>
    </section>

    <!-- 映射类型 -->
    <section class="demo-section">
      <h2>4. 映射类型 [K in keyof T]</h2>
      <pre class="code-block">{{ mappedCode }}</pre>
      <p class="hint">映射类型可以批量修改对象类型的属性修饰符（readonly、? 等）</p>
    </section>

    <!-- 模板字面量类型 -->
    <section class="demo-section">
      <h2>5. 模板字面量类型 (TS 4.1+)</h2>
      <pre class="code-block">{{ templateCode }}</pre>
      <div class="result-box">
        <p>Event = <code>'click' | 'focus' | 'blur'</code></p>
        <p>EventHandler = <code>'onClick' | 'onFocus' | 'onBlur'</code></p>
        <p class="hint">模板字面量 + 联合类型 → 自动分发组合</p>
      </div>
    </section>

    <!-- ==================== 速查表 ==================== -->
    <section class="demo-section summary-section">
      <h2 class="section-title">📋 类型操作速查表</h2>
      <table class="summary-table">
        <thead>
          <tr>
            <th>操作符</th>
            <th>含义</th>
            <th>示例</th>
            <th>通俗理解</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>keyof T</code></td>
            <td>获取 T 的所有属性名</td>
            <td><code>keyof Person</code> → <code>'name'|'age'</code></td>
            <td>"列出对象的所有 key"</td>
          </tr>
          <tr>
            <td><code>typeof x</code></td>
            <td>从值推导出类型</td>
            <td><code>typeof config</code> → 对象类型</td>
            <td>"看这个变量长什么样"</td>
          </tr>
          <tr>
            <td><code>T['key']</code></td>
            <td>索引访问类型</td>
            <td><code>User['name']</code> → <code>string</code></td>
            <td>"取对象某属性的类型"</td>
          </tr>
          <tr>
            <td><code>[K in keyof T]</code></td>
            <td>映射类型（遍历属性）</td>
            <td><code>{ [K in keyof T]?: T[K] }</code></td>
            <td>"对每个属性做变换"</td>
          </tr>
          <tr>
            <td><code>+readonly</code> / <code>-readonly</code></td>
            <td>添加/移除只读</td>
            <td><code>-readonly [K in keyof T]</code></td>
            <td>"加锁/解锁"</td>
          </tr>
          <tr>
            <td><code>+?</code> / <code>-?</code></td>
            <td>添加/移除可选</td>
            <td><code>-? [K in keyof T]</code></td>
            <td>"必填/选填切换"</td>
          </tr>
          <tr>
            <td><code>`前缀${T}`</code></td>
            <td>模板字面量类型</td>
            <td><code>`on${Capitalize&lt;E&gt;}`</code></td>
            <td>"拼出新的字符串类型"</td>
          </tr>
          <tr>
            <td><code>Capitalize&lt;T&gt;</code></td>
            <td>首字母大写</td>
            <td><code>Capitalize&lt;'hello'&gt;</code></td>
            <td>"Hello"</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
/* ===== 页面布局 ===== */
.type-manipulation-page {
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
