<script setup lang="ts">
// ====== 1. 函数声明 ======
function add(a: number, b: number): number {
  return a + b
}

function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name
}

function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0)
}

const funcDeclCode = `function add(a: number, b: number): number {
  return a + b
}

function greet(name: string, title?: string): string {
  return title ? \`\${title} \${name}\` : name
}

function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0)
}`

// ====== 2. 函数重载 ======
function format(value: string): string
function format(value: number): string
function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}

const overloadCode = `// 多个重载签名 + 一个实现签名
function format(value: string): string
function format(value: number): string
function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}`

// ====== 3. 函数类型表达式 ======
type MathFn = (a: number, b: number) => number

const addFn: MathFn = (a, b) => a + b
const subFn: MathFn = (a, b) => a - b
const mulFn: MathFn = (a, b) => a * b

const typeExprCode = `type MathFn = (a: number, b: number) => number

const addFn: MathFn = (a, b) => a + b
const subFn: MathFn = (a, b) => a - b
const mulFn: MathFn = (a, b) => a * b`

// ====== 4. 调用签名 ======
type Calculator = {
  (a: number, b: number): number
  description: string
}

const calc: Calculator = Object.assign(
  (a: number, b: number) => a + b,
  { description: '加法计算器' },
)

const callSigCode = `type Calculator = {
  (a: number, b: number): number
  description: string
}

const calc: Calculator = Object.assign(
  (a, b) => a + b,
  { description: '加法计算器' }
)`

// ====== 5. 泛型函数 ======
function identity<T>(arg: T): T {
  return arg
}

const genericFnCode = `function identity<T>(arg: T): T {
  return arg
}

identity<string>('hello')  // 显式指定
identity(42)               // 自动推断为 number`
</script>

<template>
  <div>
    <!-- 函数声明 -->
    <section class="demo-section">
      <h2>1. 函数类型声明</h2>
      <pre class="code-block">{{ funcDeclCode }}</pre>
      <div class="result-box">
        <p>add(1, 2) = {{ add(1, 2) }}</p>
        <p>greet('张三', '先生') = "{{ greet('张三', '先生') }}"</p>
        <p>greet('张三') = "{{ greet('张三') }}" (title 可选)</p>
        <p>sum(1, 2, 3, 4) = {{ sum(1, 2, 3, 4) }}</p>
      </div>
    </section>

    <!-- 函数重载 -->
    <section class="demo-section">
      <h2>2. 函数重载</h2>
      <pre class="code-block">{{ overloadCode }}</pre>
      <div class="result-box">
        <p>format('hello') → "{{ format('hello') }}"</p>
        <p>format(3.14159) → "{{ format(3.14159) }}"</p>
        <p class="hint">同一函数名，根据参数类型执行不同逻辑</p>
      </div>
    </section>

    <!-- 函数类型表达式 -->
    <section class="demo-section">
      <h2>3. 函数类型表达式</h2>
      <pre class="code-block">{{ typeExprCode }}</pre>
      <div class="result-box">
        <p>addFn(10, 5) = {{ addFn(10, 5) }}</p>
        <p>subFn(10, 5) = {{ subFn(10, 5) }}</p>
        <p>mulFn(10, 5) = {{ mulFn(10, 5) }}</p>
        <p class="hint">MathFn 类型确保所有函数签名一致</p>
      </div>
    </section>

    <!-- 调用签名 -->
    <section class="demo-section">
      <h2>4. 调用签名（函数也有属性）</h2>
      <pre class="code-block">{{ callSigCode }}</pre>
      <div class="result-box">
        <p>calc(1, 2) = {{ calc(1, 2) }}</p>
        <p>calc.description = "{{ calc.description }}"</p>
      </div>
    </section>

    <!-- 泛型函数 -->
    <section class="demo-section">
      <h2>5. 泛型函数</h2>
      <pre class="code-block">{{ genericFnCode }}</pre>
      <div class="result-box">
        <p>identity&lt;string&gt;('hello') = "{{ identity<string>('hello') }}"</p>
        <p>identity(42) = {{ identity(42) }}</p>
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
</style>
