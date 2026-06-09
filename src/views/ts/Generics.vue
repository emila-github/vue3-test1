<script setup lang="ts">
import { ref, computed } from 'vue'

// ====== 1. 泛型函数 ======
function identity<T>(arg: T): T {
  return arg
}

const genericFnCode = `function identity<T>(arg: T): T {
  return arg
}`

// ====== 2. 泛型约束 ======
interface HasLength {
  length: number
}

function logLength<T extends HasLength>(arg: T): T {
  console.log('长度:', arg.length)
  return arg
}

const logResults = ref<string[]>([])

function testLogLength() {
  const s = logLength('Hello TypeScript')
  logResults.value.push(`字符串 "${s}" → length: ${s.length}`)

  const arr = logLength([1, 2, 3, 4, 5])
  logResults.value.push(`数组 [${arr}] → length: ${arr.length}`)
}

const constraintCode = `interface HasLength { length: number }

function logLength<T extends HasLength>(arg: T): T {
  console.log(arg.length)
  return arg
}

logLength('hello')   // ✅
logLength([1, 2, 3]) // ✅
// logLength(123)    // ❌ number 没有 length`

// ====== 3. 泛型接口 ======
interface Box<T> {
  value: T
}

const stringBox: Box<string> = { value: 'Hello' }
const numberBox: Box<number> = { value: 42 }

const genericInterfaceCode = `interface Box<T> {
  value: T
}

const stringBox: Box<string> = { value: 'Hello' }
const numberBox: Box<number> = { value: 42 }`

// ====== 4. 泛型类 ======
class Stack<T> {
  private items: T[] = []

  push(item: T) {
    this.items.push(item)
  }

  pop(): T | undefined {
    return this.items.pop()
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1]
  }

  get size() {
    return this.items.length
  }

  getAll(): T[] {
    return [...this.items]
  }
}

const stringStack = new Stack<string>()
stringStack.push('A')
stringStack.push('B')
stringStack.push('C')

const stackItems = computed(() => stringStack.getAll())

function stackPush() {
  const chars = 'DEFGHIJK'
  const c = chars[stringStack.size % chars.length]
  stringStack.push(c)
}

function stackPop() {
  return stringStack.pop()
}

const genericClassCode = `class Stack<T> {
  private items: T[] = []

  push(item: T): void { this.items.push(item) }
  pop(): T | undefined { return this.items.pop() }
  peek(): T | undefined { return this.items[this.items.length - 1] }
  get size(): number { return this.items.length }
}`

// ====== 5. keyof 约束 ======
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const person = { name: '张三', age: 25, city: '北京' }

const keyofCode = `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const person = { name: '张三', age: 25, city: '北京' }
getProperty(person, 'name')  // ✅
// getProperty(person, 'email')  // ❌ 'email' 不在 keyof person 中`
</script>

<template>
  <div>
    <!-- 泛型函数 -->
    <section class="demo-section">
      <h2>1. 泛型函数</h2>
      <pre class="code-block">{{ genericFnCode }}</pre>
      <div class="result-box">
        <p>identity&lt;string&gt;('hello') → "{{ identity<string>('hello') }}" (类型: string)</p>
        <p>identity(42) → {{ identity(42) }} (类型: number)</p>
        <p>identity(true) → {{ identity(true) }} (类型: boolean)</p>
      </div>
    </section>

    <!-- 泛型约束 -->
    <section class="demo-section">
      <h2>2. 泛型约束 (extends)</h2>
      <pre class="code-block">{{ constraintCode }}</pre>
      <button @click="testLogLength" class="demo-btn">执行 logLength</button>
      <div class="result-box" v-if="logResults.length">
        <p v-for="(r, i) in logResults" :key="i">{{ r }}</p>
      </div>
    </section>

    <!-- 泛型接口 -->
    <section class="demo-section">
      <h2>3. 泛型接口</h2>
      <pre class="code-block">{{ genericInterfaceCode }}</pre>
      <div class="result-box">
        <p>Box&lt;string&gt;.value = "{{ stringBox.value }}"</p>
        <p>Box&lt;number&gt;.value = {{ numberBox.value }}</p>
      </div>
    </section>

    <!-- 泛型类 -->
    <section class="demo-section">
      <h2>4. 泛型类 — Stack&lt;T&gt;</h2>
      <pre class="code-block">{{ genericClassCode }}</pre>
      <div class="stack-demo">
        <div class="stack-btns">
          <button @click="stackPush" class="demo-btn">Push</button>
          <button @click="stackPop" class="demo-btn">Pop</button>
        </div>
        <div class="result-box">
          <p><strong>Stack 内容:</strong> [{{ stackItems.join(', ') }}]</p>
          <p>size: {{ stringStack.size }}</p>
          <p>peek: {{ stringStack.peek() ?? '空' }}</p>
        </div>
      </div>
    </section>

    <!-- keyof 约束 -->
    <section class="demo-section">
      <h2>5. keyof 泛型约束</h2>
      <pre class="code-block">{{ keyofCode }}</pre>
      <div class="result-box">
        <p>getProperty(person, 'name') → "{{ getProperty(person, 'name') }}"</p>
        <p>getProperty(person, 'age') → {{ getProperty(person, 'age') }}</p>
        <p>getProperty(person, 'city') → "{{ getProperty(person, 'city') }}"</p>
        <p class="hint">TS 会在编译时检查 key 是否有效</p>
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

.stack-demo {
  margin-top: 8px;
}

.stack-btns {
  display: flex;
  gap: 8px;
}
</style>
