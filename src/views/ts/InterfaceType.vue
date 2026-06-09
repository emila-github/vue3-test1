<script setup lang="ts">
// ====== 1. 接口基本用法 ======
interface User {
  name: string
  age: number
  readonly id: number
  email?: string
}

const user: User = { name: '张三', age: 25, id: 1 }

const interfaceCode = `interface User {
  name: string
  age: number
  readonly id: number    // 只读属性
  email?: string         // 可选属性
}`

// ====== 2. 接口继承 ======
interface Animal {
  name: string
}

interface Dog extends Animal {
  breed: string
  bark(): void
}

const dog: Dog = {
  name: '旺财',
  breed: '金毛',
  bark() {
    return '汪汪!'
  },
}

const extendsCode = `interface Animal { name: string }

interface Dog extends Animal {
  breed: string
  bark(): void
}

// 多继承
interface A { a: string }
interface B { b: number }
interface C extends A, B { c: boolean }`

// ====== 3. 类型别名 ======
type Status = 'success' | 'error' | 'loading'
type Point = { x: number; y: number }
type Callback = (data: string) => void

const point: Point = { x: 10, y: 20 }

const typeAliasCode = `// 联合类型（type 比 interface 更灵活）
type Status = 'success' | 'error' | 'loading'

// 对象类型
type Point = { x: number; y: number }

// 函数类型
type Callback = (data: string) => void`

// ====== 4. interface vs type 对比 ======
const compareCode = `// interface 支持声明合并
interface Config { host: string }
interface Config { port: number }
// Config = { host: string; port: number }

// type 不支持合并
// type Config = { host: string }
// type Config = { port: number }  // ❌ 重复标识符`

// ====== 5. 索引签名 ======
interface StringMap {
  [key: string]: string
}

const map: StringMap = { name: '张三', city: '北京', role: '管理员' }

const indexCode = `interface StringMap {
  [key: string]: string
}

const map: StringMap = {
  name: '张三',
  city: '北京',
  role: '管理员',
}`
</script>

<template>
  <div>
    <!-- 接口基本用法 -->
    <section class="demo-section">
      <h2>1. 接口 (interface) 基本用法</h2>
      <pre class="code-block">{{ interfaceCode }}</pre>
      <div class="result-box">
        <p><strong>user 实例：</strong></p>
        <p>name: {{ user.name }}</p>
        <p>age: {{ user.age }}</p>
        <p>id: {{ user.id }} (readonly)</p>
        <p>email: {{ user.email ?? '未设置 (可选属性)' }}</p>
      </div>
    </section>

    <!-- 接口继承 -->
    <section class="demo-section">
      <h2>2. 接口继承 (extends)</h2>
      <pre class="code-block">{{ extendsCode }}</pre>
      <div class="result-box">
        <p><strong>dog 实例：</strong></p>
        <p>name: {{ dog.name }} (来自 Animal)</p>
        <p>breed: {{ dog.breed }} (Dog 新增)</p>
        <p>bark(): {{ dog.bark() }}</p>
      </div>
    </section>

    <!-- 类型别名 -->
    <section class="demo-section">
      <h2>3. 类型别名 (type)</h2>
      <pre class="code-block">{{ typeAliasCode }}</pre>
      <div class="result-box">
        <p><strong>point 实例：</strong></p>
        <p>Point = {{ '{' }} x: {{ point.x }}, y: {{ point.y }} {{ '}' }}</p>
      </div>
    </section>

    <!-- interface vs type -->
    <section class="demo-section">
      <h2>4. interface vs type 对比</h2>
      <pre class="code-block">{{ compareCode }}</pre>
      <table class="compare-table">
        <thead>
          <tr><th>特性</th><th>interface</th><th>type</th></tr>
        </thead>
        <tbody>
          <tr><td>声明合并</td><td>✅ 支持</td><td>❌ 不支持</td></tr>
          <tr><td>extends 继承</td><td>✅ extends</td><td>✅ 用 &amp; 交叉</td></tr>
          <tr><td>联合类型</td><td>❌ 不支持</td><td>✅ 支持</td></tr>
          <tr><td>元组</td><td>❌ 不支持</td><td>✅ 支持</td></tr>
          <tr><td>映射类型</td><td>❌ 不支持</td><td>✅ 支持</td></tr>
        </tbody>
      </table>
    </section>

    <!-- 索引签名 -->
    <section class="demo-section">
      <h2>5. 索引签名</h2>
      <pre class="code-block">{{ indexCode }}</pre>
      <div class="result-box">
        <p><strong>map 实例：</strong></p>
        <p v-for="(value, key) in map" :key="key">map['{{ key }}'] = "{{ value }}"</p>
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

.compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-top: 8px;
}

.compare-table th,
.compare-table td {
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  text-align: left;
}

.compare-table th {
  background: #f0f0f0;
  font-weight: 600;
}

.compare-table tr:hover td {
  background: #fafafa;
}
</style>
