<script setup lang="ts">
import { ref, computed } from 'vue'

// ====== 1. 原始类型 ======
const primitiveCode = `let str: string = 'Hello TypeScript'
let num: number = 42
let isDone: boolean = false
let n: null = null
let u: undefined = undefined
let sym: symbol = Symbol('key')`

// ====== 2. 数组和元组 ======
const arrayDemo = {
  arr1: [1, 2, 3] as number[],
  arr2: ['a', 'b', 'c'] as string[],
  tuple: ['age', 18] as [string, number],
}

const arrayCode = `let arr1: number[] = [1, 2, 3]
let arr2: Array<string> = ['a', 'b', 'c']
let tuple: [string, number] = ['age', 18]`

// ====== 3. any vs unknown ======
const anyResult = ref('')
const unknownResult = ref('')

function demoAny() {
  // any 不检查类型，可以调用任何方法
  const value: any = 'hello'
  try {
    const result = value.toUpperCase()
    anyResult.value = `any 安全通过: ${result}`
  } catch {
    anyResult.value = 'any 报错（理论上不会到这里）'
  }
}

function demoUnknown() {
  const value: unknown = 'hello'
  // value.toUpperCase()  // ❌ 编译错误

  // ✅ 必须先检查类型
  if (typeof value === 'string') {
    unknownResult.value = `unknown 检查后安全: ${value.toUpperCase()}`
  } else {
    unknownResult.value = '不是字符串'
  }
}

const anyUnknownCode = `// any：关闭类型检查
let a: any = 'hello'
a.toUpperCase()  // ✅ 编译通过（但运行时可能出错）

// unknown：安全类型，必须先检查
let b: unknown = 'hello'
// b.toUpperCase()  // ❌ 编译错误
if (typeof b === 'string') {
  b.toUpperCase()  // ✅ 类型收窄后安全
}`

// ====== 4. 联合类型与交叉类型 ======
const unionCode = `// 联合类型
type Status = 'active' | 'inactive' | 'pending'
type StringOrNumber = string | number

// 交叉类型
interface HasName { name: string }
interface HasAge { age: number }
type Person = HasName & HasAge
// { name: string; age: number }`

// ====== 5. 字面量类型 ======
const literalCode = `// 字符串字面量
type Direction = 'up' | 'down' | 'left' | 'right'

// 数字字面量
type DiceValue = 1 | 2 | 3 | 4 | 5 | 6

// 模板字面量类型 (TS 4.1+)
type Greeting = \`Hello, \${string}!\``

// ====== 6. void / never ======
const voidNeverCode = `// void：没有返回值
function log(msg: string): void {
  console.log(msg)
}

// never：永远不会返回
function throwError(msg: string): never {
  throw new Error(msg)
}
function infiniteLoop(): never {
  while (true) {}
}`
</script>

<template>
  <div>
    <!-- 原始类型 -->
    <section class="demo-section">
      <h2>1. 原始类型</h2>
      <pre class="code-block">{{ primitiveCode }}</pre>
    </section>

    <!-- 数组和元组 -->
    <section class="demo-section">
      <h2>2. 数组与元组</h2>
      <pre class="code-block">{{ arrayCode }}</pre>
      <div class="result-box">
        <p>arr1: [{{ arrayDemo.arr1.join(', ') }}] (number[])</p>
        <p>arr2: [{{ arrayDemo.arr2.map(s => `"${s}"`).join(', ') }}] (string[])</p>
        <p>tuple: [{{ arrayDemo.tuple[0] }}, {{ arrayDemo.tuple[1] }}] ([string, number])</p>
      </div>
    </section>

    <!-- any vs unknown -->
    <section class="demo-section">
      <h2>3. any vs unknown</h2>
      <pre class="code-block">{{ anyUnknownCode }}</pre>
      <div class="btn-group">
        <button @click="demoAny" class="demo-btn">测试 any</button>
        <button @click="demoUnknown" class="demo-btn">测试 unknown</button>
      </div>
      <div class="result-box" v-if="anyResult || unknownResult">
        <p>{{ anyResult }}</p>
        <p>{{ unknownResult }}</p>
      </div>
    </section>

    <!-- 联合类型与交叉类型 -->
    <section class="demo-section">
      <h2>4. 联合类型 (|) 与交叉类型 (&amp;)</h2>
      <pre class="code-block">{{ unionCode }}</pre>
    </section>

    <!-- 字面量类型 -->
    <section class="demo-section">
      <h2>5. 字面量类型</h2>
      <pre class="code-block">{{ literalCode }}</pre>
    </section>

    <!-- void / never -->
    <section class="demo-section">
      <h2>6. void 与 never</h2>
      <pre class="code-block">{{ voidNeverCode }}</pre>
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
  font-family: monospace;
}

.btn-group {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.demo-btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  transition: all 0.2s;
}

.demo-btn:hover {
  border-color: #3178c6;
  color: #3178c6;
}
</style>
