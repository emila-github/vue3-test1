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
  <div>
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
  </div>
</template>

<style scoped>
.demo-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #3178c6;
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
</style>
