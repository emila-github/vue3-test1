<script setup lang="ts">
import { ref, computed } from 'vue'

// ====== 1. typeof 类型守卫 ======
function processValue(value: string | number): string {
  if (typeof value === 'string') {
    return `字符串: ${value.toUpperCase()}`
  }
  return `数字: ${value.toFixed(2)}`
}

const typeofResults = ref<string[]>([])

function testTypeofGuard() {
  typeofResults.value = [processValue('hello'), processValue(3.14159)]
}

const typeofCode = `function processValue(value: string | number): string {
  if (typeof value === 'string') {
    // value 被收窄为 string
    return \`字符串: \${value.toUpperCase()}\`
  }
  // value 被收窄为 number
  return \`数字: \${value.toFixed(2)}\`
}`

// ====== 2. instanceof 类型守卫 ======
class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function handleError(error: Error): string {
  if (error instanceof ApiError) {
    return `API错误 [${error.statusCode}]: ${error.message}`
  }
  return `未知错误: ${error.message}`
}

const instanceofResults = ref<string[]>([])

function testInstanceofGuard() {
  instanceofResults.value = [handleError(new ApiError(404, '资源未找到')), handleError(new Error('网络连接失败'))]
}

const instanceofCode = `class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
  }
}

function handleError(error: Error): string {
  if (error instanceof ApiError) {
    // error 被收窄为 ApiError，可访问 statusCode
    return \`API错误 [\${error.statusCode}]: \${error.message}\`
  }
  return \`未知错误: \${error.message}\`
}`

// ====== 3. 自定义类型守卫 (is) ======
interface Cat {
  type: 'cat'
  meow(): string
}
interface Dog {
  type: 'dog'
  bark(): string
}

function isCat(animal: Cat | Dog): animal is Cat {
  return animal.type === 'cat'
}

function handleAnimal(animal: Cat | Dog): string {
  if (isCat(animal)) {
    return animal.meow() // Cat
  }
  return animal.bark() // Dog
}

const cat: Cat = { type: 'cat', meow: () => '喵喵~' }
const dog: Dog = { type: 'dog', bark: () => '汪汪!' }

const isGuardResults = ref<string[]>([])

function testIsGuard() {
  isGuardResults.value = [handleAnimal(cat), handleAnimal(dog)]
}

const isGuardCode = `interface Cat { type: 'cat'; meow(): string }
interface Dog { type: 'dog'; bark(): string }

// 自定义类型守卫: animal is Cat
function isCat(animal: Cat | Dog): animal is Cat {
  return animal.type === 'cat'
}

function handleAnimal(animal: Cat | Dog): string {
  if (isCat(animal)) {
    return animal.meow()  // 收窄为 Cat
  }
  return animal.bark()   // 收窄为 Dog
}`

// ====== 4. 可辨识联合 ======
interface Square {
  kind: 'square'
  size: number
}
interface Circle {
  kind: 'circle'
  radius: number
}
interface Triangle {
  kind: 'triangle'
  base: number
  height: number
}

type Shape = Square | Circle | Triangle

function getArea(shape: Shape): string {
  switch (shape.kind) {
    case 'square':
      return `正方形 (边长=${shape.size}): 面积=${shape.size ** 2}`
    case 'circle':
      return `圆形 (半径=${shape.radius}): 面积=${(Math.PI * shape.radius ** 2).toFixed(2)}`
    case 'triangle':
      return `三角形 (底=${shape.base}, 高=${shape.height}): 面积=${((shape.base * shape.height) / 2).toFixed(2)}`
  }
}

const shapeResults = ref<string[]>([])

function testDiscriminated() {
  const shapes: Shape[] = [
    { kind: 'square', size: 4 },
    { kind: 'circle', radius: 3 },
    { kind: 'triangle', base: 5, height: 4 },
  ]
  shapeResults.value = shapes.map(getArea)
}

const discriminatedCode = `interface Square { kind: 'square'; size: number }
interface Circle { kind: 'circle'; radius: number }
interface Triangle { kind: 'triangle'; base: number; height: number }

type Shape = Square | Circle | Triangle

function getArea(shape: Shape): string {
  switch (shape.kind) {
    case 'square': return \`正方形 面积=\${shape.size ** 2}\`
    case 'circle': return \`圆形 面积=\${Math.PI * shape.radius ** 2}\`
    case 'triangle': return \`三角形 面积=\${shape.base * shape.height / 2}\`
  }
  // TS 会做穷举检查，遗漏类型会报错
}`

// ====== 5. in 操作符收窄 ======
interface Fish {
  swim(): string
}
interface Bird {
  fly(): string
}

function move(animal: Fish | Bird): string {
  if ('swim' in animal) {
    return animal.swim()
  }
  return animal.fly()
}

const fish: Fish = { swim: () => '鱼在水中游 🐟' }
const bird: Bird = { fly: () => '鸟在天上飞 🐦' }

const inResults = ref<string[]>([])

function testInGuard() {
  inResults.value = [move(fish), move(bird)]
}

const inCode = `interface Fish { swim(): string }
interface Bird { fly(): string }

function move(animal: Fish | Bird): string {
  if ('swim' in animal) {
    return animal.swim()  // 收窄为 Fish
  }
  return animal.fly()    // 收窄为 Bird
}`

// ====== 6. 类型断言 ======
function testAssertion() {
  // as 断言
  const value: unknown = 'hello typescript'
  const str = value as string
  const upper = str.toUpperCase()

  // 非空断言
  const el = document.getElementById('app')!

  return `断言结果: "${upper}"`
}

const assertionResult = ref('')

const assertionCode = `// as 语法
const canvas = document.getElementById('canvas') as HTMLCanvasElement

// 非空断言 (!) — 告诉 TS 值不为 null/undefined
const el = document.getElementById('app')!
el.style.color = 'red'

// const 断言 — 将值变为字面量类型
const config = {
  host: 'localhost',
  port: 3000,
} as const
// 类型: { readonly host: "localhost"; readonly port: 3000 }`
</script>

<template>
  <div class="type-guards-page">
    <header class="page-header">
      <h1>TypeScript 类型守卫</h1>
      <p class="page-subtitle">
        类型守卫让你在<strong>运行时检查类型</strong>，TypeScript
        会自动<strong>收窄（narrowing）</strong>联合类型，让你安全地使用特定类型的属性。
      </p>
    </header>

    <!-- ==================== 引言 ==================== -->
    <section class="demo-section intro-section">
      <h2 class="section-title">📖 什么是类型守卫？为什么需要它？</h2>
      <div class="explain-box">
        <p>
          <strong>一句话解释：</strong>当变量是<em>联合类型</em>（如
          <code>string | number</code
          >）时，类型守卫帮你<strong>在运行时判断它到底是哪个具体类型</strong>，从而安全地使用对应类型的方法。
        </p>
        <h3>没有类型守卫的痛苦 😫</h3>
        <pre class="code-block">
// 联合类型下，不能直接调用特定类型的方法
function process(value: string | number) {
  return value.toUpperCase()  // ❌ 编译错误：number 没有 toUpperCase
}
process('hello')  // 实际上我们传了 string，但 TS 不信任</pre
        >
        <h3>有了类型守卫之后 😎</h3>
        <pre class="code-block">
// typeof 守卫让 TS 收窄类型，安全访问
function process(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase()   // ✅ TS 知道这里 value 是 string
  }
  return value.toFixed(2)       // ✅ TS 知道这里 value 是 number
}
process('hello')  // → 'HELLO'
process(3.14)     // → '3.14'</pre
        >
        <div class="key-points">
          <p>🔑 <strong>核心要点：</strong></p>
          <ul>
            <li><code>typeof</code> 守卫：判断<strong>原始类型</strong>（string/number/boolean/symbol）</li>
            <li><code>instanceof</code> 守卫：判断<strong>类实例</strong></li>
            <li><code>in</code> 操作符：判断<strong>属性是否存在</strong></li>
            <li>自定义守卫 <code>value is Type</code>：自己写判断函数</li>
            <li>可辨识联合：用 <code>kind</code> 字段区分联合成员</li>
          </ul>
        </div>
      </div>
    </section>
    <!-- typeof 类型守卫 -->
    <section class="demo-section">
      <h2>1. typeof 类型守卫</h2>
      <pre class="code-block">{{ typeofCode }}</pre>
      <button @click="testTypeofGuard" class="demo-btn">执行</button>
      <div class="result-box" v-if="typeofResults.length">
        <p v-for="(r, i) in typeofResults" :key="i">{{ r }}</p>
      </div>
    </section>

    <!-- instanceof 类型守卫 -->
    <section class="demo-section">
      <h2>2. instanceof 类型守卫</h2>
      <pre class="code-block">{{ instanceofCode }}</pre>
      <button @click="testInstanceofGuard" class="demo-btn">执行</button>
      <div class="result-box" v-if="instanceofResults.length">
        <p v-for="(r, i) in instanceofResults" :key="i">{{ r }}</p>
      </div>
    </section>

    <!-- 自定义类型守卫 (is) -->
    <section class="demo-section">
      <h2>3. 自定义类型守卫 (animal is Cat)</h2>
      <pre class="code-block">{{ isGuardCode }}</pre>
      <button @click="testIsGuard" class="demo-btn">执行</button>
      <div class="result-box" v-if="isGuardResults.length">
        <p v-for="(r, i) in isGuardResults" :key="i">{{ r }}</p>
      </div>
    </section>

    <!-- 可辨识联合 -->
    <section class="demo-section">
      <h2>4. 可辨识联合 (Discriminated Union)</h2>
      <pre class="code-block">{{ discriminatedCode }}</pre>
      <button @click="testDiscriminated" class="demo-btn">计算面积</button>
      <div class="result-box" v-if="shapeResults.length">
        <p v-for="(r, i) in shapeResults" :key="i">{{ r }}</p>
      </div>
    </section>

    <!-- in 操作符 -->
    <section class="demo-section">
      <h2>5. in 操作符类型收窄</h2>
      <pre class="code-block">{{ inCode }}</pre>
      <button @click="testInGuard" class="demo-btn">执行</button>
      <div class="result-box" v-if="inResults.length">
        <p v-for="(r, i) in inResults" :key="i">{{ r }}</p>
      </div>
    </section>

    <!-- 类型断言 -->
    <section class="demo-section">
      <h2>6. 类型断言</h2>
      <pre class="code-block">{{ assertionCode }}</pre>
      <button @click="assertionResult = testAssertion()" class="demo-btn">执行</button>
      <div class="result-box" v-if="assertionResult">
        <p>{{ assertionResult }}</p>
      </div>
    </section>

    <!-- ==================== 速查表 ==================== -->
    <section class="demo-section summary-section">
      <h2 class="section-title">📋 类型守卫速查表</h2>
      <table class="summary-table">
        <thead>
          <tr>
            <th>守卫方式</th>
            <th>语法</th>
            <th>适用场景</th>
            <th>通俗理解</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>typeof</strong></td>
            <td><code>typeof x === 'string'</code></td>
            <td>原始类型（string/number/boolean）</td>
            <td>"看标签分辨类型"</td>
          </tr>
          <tr>
            <td><strong>instanceof</strong></td>
            <td><code>x instanceof Error</code></td>
            <td>判断类实例</td>
            <td>"查户口看是谁生的"</td>
          </tr>
          <tr>
            <td><strong>自定义守卫</strong></td>
            <td><code>x is Cat</code></td>
            <td>复杂类型的判断</td>
            <td>"自己写鉴定函数"</td>
          </tr>
          <tr>
            <td><strong>可辨识联合</strong></td>
            <td><code>shape.kind === 'circle'</code></td>
            <td>共用 kind 字段的联合类型</td>
            <td>"看身份证分类处理"</td>
          </tr>
          <tr>
            <td><strong>in 操作符</strong></td>
            <td><code>'swim' in animal</code></td>
            <td>判断对象是否有某属性</td>
            <td>"看有没有这个功能"</td>
          </tr>
          <tr>
            <td><strong>as 断言</strong></td>
            <td><code>value as string</code></td>
            <td>你比 TS 更清楚类型时</td>
            <td>"我确认是这个类型"</td>
          </tr>
          <tr>
            <td><strong>! 非空断言</strong></td>
            <td><code>el!</code></td>
            <td>确定值不为 null/undefined</td>
            <td>"肯定不为空"</td>
          </tr>
        </tbody>
      </table>
      <div class="hint-box" style="margin-top: 16px">
        <p>
          💡 <strong>记忆技巧：</strong>typeof 看原始类型，instanceof 看类实例，in 看属性，is 自定义。可辨识联合（kind
          字段）是生产环境最常用的模式。
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ===== 页面布局 ===== */
.type-guards-page {
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

.demo-btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  transition: all 0.2s;
  margin: 8px 8px 0 0;
}

.demo-btn:hover {
  border-color: #3178c6;
  color: #3178c6;
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

.hint-box {
  background: #fff;
  border: 1px solid #c8e6c9;
  border-radius: 6px;
  padding: 12px 16px;
  color: #2e7d32;
  font-size: 14px;
}
</style>
