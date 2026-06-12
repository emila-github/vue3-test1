<script setup lang="ts">
import { reactive, shallowRef, computed } from 'vue'

// ====== 1. 原始类型 ======
const primitiveCode = `// TypeScript 为 JavaScript 加上了类型标注
let str: string = 'Hello TypeScript'   // 字符串
let num: number = 42                    // 数字（不区分 int / float）
let isDone: boolean = false             // 布尔值
let n: null = null                      // null 类型
let u: undefined = undefined            // undefined 类型
let sym: symbol = Symbol('key')         // Symbol，唯一标识
let big: bigint = 100n                  // 大整数（ES2020）`

// 交互示例：展示类型推断 vs 显式标注
const primitiveExample = shallowRef('Hello TypeScript')
const primitiveInferred = computed(() => {
  // TS 会自动推断类型
  const autoStr = 'hello' // 推断为 string
  const autoNum = 42 // 推断为 number
  return `推断: autoStr = "${autoStr}" (string), autoNum = ${autoNum} (number)`
})

// ====== 2. 数组和元组 ======
// 使用 reactive 适合需要展示属性的对象
const arrayDemo = reactive({
  arr1: [1, 2, 3] as number[],
  arr2: ['a', 'b', 'c'] as string[],
  tuple: ['age', 18] as [string, number],
})

const arrayCode = `// 数组：同类型元素的集合（两种写法等价）
let arr1: number[] = [1, 2, 3]
let arr2: Array<string> = ['a', 'b', 'c']

// 元组：固定长度 + 每项类型确定
let tuple: [string, number] = ['age', 18]

// ❌ 超出元组长度的赋值在 TS 2.7+ 会报错
// tuple[2] = 'extra'

// 只读数组
const readonlyArr: readonly number[] = [1, 2, 3]
// readonlyArr.push(4) // ❌ 不可变`

// 数组操作演示
const arrayOps = reactive({
  newItem: '',
  items: ['Vue', 'React', 'Angular'] as string[],
})

function addItem() {
  if (arrayOps.newItem.trim()) {
    arrayOps.items.push(arrayOps.newItem.trim())
    arrayOps.newItem = ''
  }
}

const arrayOpsResult = computed(() => {
  const joined = arrayOps.items.map(s => `"${s}"`).join(', ')
  return `items: [${joined}] (共 ${arrayOps.items.length} 个)`
})

// ====== 3. any vs unknown ======
const anyResult = shallowRef('')
const unknownResult = shallowRef('')

// 用于演示不同类型下的 unknown 行为
const unknownTestValue = shallowRef<string | number | boolean>('hello')
const unknownTestType = computed(() => typeof unknownTestValue.value)

function demoAny() {
  // any 关闭了类型检查，等于回到了 JavaScript
  const value: any = 'hello'
  try {
    const result = value.toUpperCase()
    anyResult.value = `✅ any 允许直接调用: "${result}"`
  } catch {
    anyResult.value = 'any 报错（理论上不会到这里）'
  }
}

function testUnknown() {
  const value: unknown = unknownTestValue.value
  // value.toUpperCase()  // ❌ 编译错误：Object is of type 'unknown'

  // ✅ 必须通过类型收窄才能安全使用
  if (typeof value === 'string') {
    unknownResult.value = `✅ 类型收窄(string) → "${value.toUpperCase()}"`
  } else if (typeof value === 'number') {
    unknownResult.value = `✅ 类型收窄(number) → ${value * 2}`
  } else {
    unknownResult.value = `⚠️ 类型收窄失败，当前类型: ${typeof value}`
  }
}

function setUnknownValue(type: string) {
  if (type === 'string') unknownTestValue.value = 'hello'
  else if (type === 'number') unknownTestValue.value = 42
  else if (type === 'boolean') unknownTestValue.value = true
}

const anyUnknownCode = `// any：完全关闭类型检查（失去 TS 保护）
let a: any = 'hello'
a.toUpperCase()       // ✅ 编译通过
a.thisMethodDoesNotExist() // ✅ 也通过！（运行时 crash）

// unknown：类型安全的"任意类型"，必须先收窄
let b: unknown = 'hello'
// b.toUpperCase()    // ❌ 编译错误
if (typeof b === 'string') {
  b.toUpperCase()     // ✅ 类型收窄后安全
}

// 💡 经验法则：优先用 unknown，仅在确实需要时用 any`

// ====== 4. 联合类型与交叉类型 ======
// 演示联合类型的交互
const statusOptions = ['active', 'inactive', 'pending'] as const
type Status = (typeof statusOptions)[number]
const currentStatus = shallowRef<Status>('active')

const statusMessage = computed(() => {
  switch (currentStatus.value) {
    case 'active':
      return '✅ 当前状态：活跃 — 用户可正常使用'
    case 'inactive':
      return '⏸️ 当前状态：非活跃 — 用户已被停用'
    case 'pending':
      return '⏳ 当前状态：待审核 — 等待管理员审批'
  }
})

const unionCode = `// 联合类型 (|)：值可以是多种类型之一
type Status = 'active' | 'inactive' | 'pending'
type StringOrNumber = string | number

function handleValue(val: StringOrNumber) {
  if (typeof val === 'string') {
    console.log(val.toUpperCase())  // val 收窄为 string
  } else {
    console.log(val.toFixed(2))     // val 收窄为 number
  }
}

// 交叉类型 (&)：合并多个类型的属性
interface HasName { name: string }
interface HasAge { age: number }
type Person = HasName & HasAge
// 等价于 { name: string; age: number }

// 实际应用：联合类型常用于函数参数
type CSSValue = string | number
function setWidth(value: CSSValue) {
  // typeof value === 'string' ? value : \`\${value}px\`
}`

// ====== 5. 字面量类型 ======
const literalCode = `// 字符串字面量类型：限制值只能是特定字符串
type Direction = 'up' | 'down' | 'left' | 'right'
function move(dir: Direction) { /* ... */ }
move('up')   // ✅
// move('top') // ❌ 不在联合类型中

// 数字字面量类型
type DiceValue = 1 | 2 | 3 | 4 | 5 | 6
type OneOrTwo = 1 | 2

// 模板字面量类型 (TS 4.1+) — 动态字符串模式
type EventName = \`on\${Capitalize<string>}\`
type Greeting = \`Hello, \${string}!\`
const g1: Greeting = 'Hello, World!'    // ✅
// const g2: Greeting = 'Hi, World!'    // ❌ 不符合模板

// 实际应用：CSS 单位约束
type CSSUnit = \`\${number}px\` | \`\${number}em\` | \`\${number}rem\`
const width: CSSUnit = '100px'  // ✅`

// ====== 6. void / never ======
const voidNeverCode = `// void：函数没有返回值（或返回 undefined）
function log(msg: string): void {
  console.log(msg)
  // 隐式 return undefined
}
const result: void = log('test') // result 类型为 void

// never：函数永远不会正常返回
function throwError(msg: string): never {
  throw new Error(msg)
}
function infiniteLoop(): never {
  while (true) {}
}

// never 的实际应用：穷举检查
type Shape = 'circle' | 'square'
function getArea(shape: Shape): number {
  switch (shape) {
    case 'circle':  return Math.PI * 10 ** 2
    case 'square':  return 10 * 10
    default: {
      // 如果 Shape 新增了类型，这里会编译报错
      const _exhaustive: never = shape
      return _exhaustive
    }
  }
}

// 💡 记忆：void = "返回空" ｜ never = "永远不会到终点"`

// ====== 7. 枚举 (Enum) ======
// 交互示例
const enumCode = `// 数字枚举（默认从 0 递增）
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right    // 3
}

// 字符串枚举（更推荐，便于调试）
enum Status {
  Active   = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending  = 'PENDING',
}

// const enum（编译后内联，无运行时开销）
const enum LogLevel {
  Debug = 0,
  Info  = 1,
  Error = 2,
}

// 💡 建议：优先用联合类型 (|) 代替枚举，更轻量`
</script>

<template>
  <div class="basic-types-page">
    <header class="page-header">
      <h1>TypeScript 基础类型</h1>
      <p class="page-subtitle">掌握 TypeScript 的类型系统是写出健壮代码的第一步。每个类型都配有代码示例和可交互演示。</p>
    </header>

    <!-- 1. 原始类型 -->
    <section class="demo-section">
      <h2 class="section-title">1. 原始类型 <span class="badge">Primitive Types</span></h2>
      <p class="section-desc">TypeScript 为 JavaScript 的 7 种原始类型提供了对应的类型标注。类型标注写在变量名后面，用冒号分隔。</p>
      <pre class="code-block">{{ primitiveCode }}</pre>
      <div class="result-box">
        <p class="result-title">💡 类型推断演示</p>
        <p class="result-text">{{ primitiveInferred }}</p>
        <p class="result-text">标注: <code class="inline-code">let str: string = '{{ primitiveExample }}'</code></p>
      </div>
    </section>

    <!-- 2. 数组和元组 -->
    <section class="demo-section">
      <h2 class="section-title">2. 数组与元组 <span class="badge">Array & Tuple</span></h2>
      <p class="section-desc">数组存储同类型元素；元组是固定长度、每项类型确定的"严格数组"。</p>
      <pre class="code-block">{{ arrayCode }}</pre>

      <div class="result-box">
        <p class="result-title">📋 静态数据展示</p>
        <p class="result-text">arr1: <code class="inline-code">{{ arrayDemo.arr1.join(', ') }}</code> (number[])</p>
        <p class="result-text">arr2: <code class="inline-code">{{ arrayDemo.arr2.join(', ') }}</code> (string[])</p>
        <p class="result-text">tuple: <code class="inline-code">{{ arrayDemo.tuple[0] }}</code>, <code class="inline-code">{{ arrayDemo.tuple[1] }}</code> ([string, number])</p>
      </div>

      <!-- 交互式数组操作 -->
      <div class="result-box interactive">
        <p class="result-title">🛠️ 交互式：添加元素到数组</p>
        <div class="input-group">
          <input
            v-model="arrayOps.newItem"
            class="text-input"
            placeholder="输入框架名称..."
            @keyup.enter="addItem"
          />
          <button class="demo-btn demo-btn-primary" @click="addItem">添加</button>
        </div>
        <p class="result-text">{{ arrayOpsResult }}</p>
      </div>
    </section>

    <!-- 3. any vs unknown -->
    <section class="demo-section">
      <h2 class="section-title">3. any vs unknown <span class="badge">类型安全</span></h2>
      <p class="section-desc">
        <code class="inline-code">any</code> 关闭类型检查，放弃 TS 保护；
        <code class="inline-code">unknown</code> 是"类型安全的 any"，使用前必须收窄类型。
        <strong>优先使用 unknown。</strong>
      </p>
      <pre class="code-block">{{ anyUnknownCode }}</pre>

      <!-- unknown 值选择 -->
      <div class="result-box">
        <p class="result-title">🔍 unknown 类型收窄演示</p>
        <p class="result-text">当前值类型: <strong>{{ unknownTestType }}</strong></p>
        <div class="btn-group">
          <button class="demo-btn" @click="setUnknownValue('string')">string: "hello"</button>
          <button class="demo-btn" @click="setUnknownValue('number')">number: 42</button>
          <button class="demo-btn" @click="setUnknownValue('boolean')">boolean: true</button>
        </div>
        <div class="btn-group" style="margin-top: 8px">
          <button class="demo-btn demo-btn-danger" @click="demoAny">测试 any 行为</button>
          <button class="demo-btn demo-btn-primary" @click="testUnknown">测试 unknown 收窄</button>
        </div>
      </div>

      <div class="result-box" v-if="anyResult || unknownResult">
        <p class="result-title">📊 测试结果</p>
        <p class="result-text" v-if="anyResult">{{ anyResult }}</p>
        <p class="result-text" v-if="unknownResult">{{ unknownResult }}</p>
      </div>
    </section>

    <!-- 4. 联合类型与交叉类型 -->
    <section class="demo-section">
      <h2 class="section-title">4. 联合类型 (|) 与交叉类型 (&amp;) <span class="badge">组合类型</span></h2>
      <p class="section-desc">
        <strong>联合 |</strong> = "或" → 值可以是多种类型之一；
        <strong>交叉 &amp;</strong> = "且" → 同时拥有多个类型的属性。
      </p>
      <pre class="code-block">{{ unionCode }}</pre>

      <div class="result-box interactive">
        <p class="result-title">🎮 交互式：联合类型状态切换</p>
        <div class="btn-group">
          <button
            v-for="s in statusOptions"
            :key="s"
            class="demo-btn"
            :class="{ 'demo-btn-active': currentStatus === s }"
            @click="currentStatus = s"
          >
            {{ s }}
          </button>
        </div>
        <p class="result-text status-message">{{ statusMessage }}</p>
      </div>
    </section>

    <!-- 5. 字面量类型 -->
    <section class="demo-section">
      <h2 class="section-title">5. 字面量类型 <span class="badge">Literal Types</span></h2>
      <p class="section-desc">将类型精确到具体的值，常与联合类型搭配使用，打造类似枚举的效果。</p>
      <pre class="code-block">{{ literalCode }}</pre>
    </section>

    <!-- 6. void / never -->
    <section class="demo-section">
      <h2 class="section-title">6. void 与 never <span class="badge">返回值类型</span></h2>
      <p class="section-desc">
        <code class="inline-code">void</code> 表示"没有有意义的返回值"；
        <code class="inline-code">never</code> 表示"永远到不了终点"（抛异常、死循环、穷举守卫）。
      </p>
      <pre class="code-block">{{ voidNeverCode }}</pre>
    </section>

    <!-- 7. 枚举 -->
    <section class="demo-section">
      <h2 class="section-title">7. 枚举 <span class="badge">Enum</span></h2>
      <p class="section-desc">为一组命名常量提供更友好的写法。字符串枚举更推荐（调试时能看到有意义的值）。</p>
      <pre class="code-block">{{ enumCode }}</pre>
    </section>
  </div>
</template>

<style scoped>
/* ===== 页面布局 ===== */
.basic-types-page {
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
  line-height: 1.6;
  max-width: 640px;
  margin: 0 auto;
}

/* ===== 演示区块 ===== */
.demo-section {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 24px;
  border-left: 4px solid #3178c6;
  transition: box-shadow 0.2s;
}

.demo-section:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.section-title {
  margin: 0 0 8px;
  color: #1a1a2e;
  font-size: 19px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-desc {
  color: #555;
  font-size: 14px;
  line-height: 1.7;
  margin: 0 0 14px;
}

/* ===== 徽章 ===== */
.badge {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 12px;
  background: #e8f0fe;
  color: #3178c6;
  white-space: nowrap;
}

/* ===== 代码块 ===== */
.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px 18px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
  margin: 0 0 14px;
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  tab-size: 2;
}

.inline-code {
  background: #e8e8e8;
  color: #c7254e;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
}

/* ===== 结果展示区 ===== */
.result-box {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px 18px;
  margin-top: 10px;
}

.result-box.interactive {
  border-color: #bee3f8;
  background: #f0f8ff;
}

.result-title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.result-text {
  margin: 4px 0;
  font-size: 14px;
  color: #444;
  font-family: monospace;
  line-height: 1.6;
}

.status-message {
  margin-top: 10px;
  padding: 8px 12px;
  background: #fefcbf;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  color: #744210;
}

/* ===== 按钮组 ===== */
.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.input-group {
  display: flex;
  gap: 8px;
  margin: 8px 0;
}

.text-input {
  flex: 1;
  padding: 7px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.text-input:focus {
  border-color: #3178c6;
  box-shadow: 0 0 0 2px rgba(49, 120, 198, 0.15);
}

/* ===== 按钮样式 ===== */
.demo-btn {
  padding: 7px 18px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  color: #374151;
  transition: all 0.2s;
  white-space: nowrap;
}

.demo-btn:hover {
  border-color: #3178c6;
  color: #3178c6;
  background: #f0f7ff;
}

.demo-btn-primary {
  background: #3178c6;
  color: #fff;
  border-color: #3178c6;
}

.demo-btn-primary:hover {
  background: #2563aa;
  border-color: #2563aa;
  color: #fff;
}

.demo-btn-danger {
  border-color: #e53e3e;
  color: #e53e3e;
}

.demo-btn-danger:hover {
  background: #fff5f5;
  border-color: #c53030;
  color: #c53030;
}

.demo-btn-active {
  background: #3178c6;
  color: #fff;
  border-color: #3178c6;
}

.demo-btn-active:hover {
  background: #2563aa;
}
</style>
