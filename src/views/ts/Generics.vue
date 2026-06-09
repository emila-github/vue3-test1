<script setup lang="ts">
import { ref, computed } from 'vue'

// ====================================================================
// 1. 泛型函数
// ====================================================================
// 核心思想：不预先指定具体类型，而是在调用时由 TypeScript 自动推断
//
// 类比：就像一个"万能快递盒"📦
//   你放入什么类型的东西，拿出来还是什么类型
//   放入 string → 取出 string
//   放入 number → 取出 number
//   不需要为每种类型写一个函数

function identity<T>(arg: T): T {
  return arg
}

// 如果没有泛型，你得写无数个重载：
//   function identity(arg: string): string
//   function identity(arg: number): number
//   function identity(arg: boolean): boolean
//   ... 永远写不完！
// 泛型用一个 <T> 就解决了全部

const genericFnCode = `// <T> 是类型变量，调用时自动推断具体类型
function identity<T>(arg: T): T {
  return arg   // 参数和返回值类型始终一致
}

// 调用时可以显式指定类型...
identity<string>('hello')  // T = string
// 也可以让 TS 自动推断...
identity(42)               // T = number (自动推断)
identity(true)             // T = boolean (自动推断)`

// ====================================================================
// 2. 泛型约束 (extends)
// ====================================================================
// 核心思想：限制泛型参数必须满足某个"契约"
//
// 类比：T extends HasLength 意思是 ——
//   "T 可以是任意类型，但它必须有 .length 属性"
//   就像酒店要求 "住客必须有身份证"，
//   不管你是哪国人，只要你有身份证就行

interface HasLength {
  length: number
}

// T extends HasLength 的含义：
//   T 必须至少包含 HasLength 接口定义的所有属性和方法
//   string 有 length → ✅
//   Array 有 length  → ✅
//   number 没有 length → ❌ 编译错误！
function logLength<T extends HasLength>(arg: T): T {
  console.log('长度:', arg.length) // 安全的！因为 T 一定有 length
  return arg
}

const logResults = ref<string[]>([])

function testLogLength() {
  const s = logLength('Hello TypeScript')
  logResults.value.push(`字符串 "${s}" → length: ${s.length}`)

  const arr = logLength([1, 2, 3, 4, 5])
  logResults.value.push(`数组 [${arr}] → length: ${arr.length}`)

  const obj = logLength({ length: 10, name: 'test' })
  logResults.value.push(`对象 ${JSON.stringify(obj)} → length: ${obj.length}`)

  // 下面这行会编译报错（取消注释试试）：
  // logLength(123)  // ❌ number 没有 length 属性
}

const constraintCode = `// 第一步：定义约束条件
interface HasLength {
  length: number     // 必须包含 length 属性
}

// 第二步：用 extends 约束泛型
// 读作："T 继承 HasLength"，即 T 必须满足 HasLength 的要求
function logLength<T extends HasLength>(arg: T): T {
  console.log(arg.length)  // ✅ 安全：T 一定有 length
  return arg
}

logLength('hello')    // ✅ string.length 存在
logLength([1, 2, 3])  // ✅ Array.length 存在
logLength({ length: 5, name: 'test' })  // ✅ 满足约束即可
// logLength(123)     // ❌ 编译错误：number 没有 length`

// ====================================================================
// 3. 泛型接口
// ====================================================================
// 核心思想：接口本身不限定类型，由使用者决定装什么类型的数据
//
// 类比：Box<T> 就像一个"万能收纳盒"
//   Box<string>  → 只能放字符串的盒子
//   Box<number>  → 只能放数字的盒子
//   Box<boolean> → 只能放布尔值的盒子
//   盒子结构一样，只是里面装的东西类型不同

interface Box<T> {
  value: T
}

// 同一个接口，三种不同用法
const stringBox: Box<string> = { value: 'Hello' }
const numberBox: Box<number> = { value: 42 }

const genericInterfaceCode = `// 定义泛型接口：Box 可以装任意类型
interface Box<T> {
  value: T   // T 在定义时还是未知类型
}

// 使用时指定具体类型
const stringBox: Box<string> = { value: 'Hello' }  // T = string
const numberBox: Box<number> = { value: 42 }        // T = number

// 常见实际应用：API 响应包装
interface ApiResponse<T> {
  code: number
  message: string
  data: T           // 不同接口返回不同 data 类型
}

// 用户列表接口
const users: ApiResponse<User[]> = { ... }
// 单条文章接口
const article: ApiResponse<Article> = { ... }`

// ====================================================================
// 4. 泛型类
// ====================================================================
// 核心思想：类的逻辑是通用的，但操作的数据类型由使用者决定
//
// 类比：Stack<T> 就像一个"万能叠叠乐"
//   Stack<string>  → 专门堆叠字符串
//   Stack<number>  → 专门堆叠数字
//   Stack<User>    → 专门堆叠用户对象
//   入栈和出栈的逻辑完全一样，只是数据类型不同

class Stack<T> {
  // 私有数组，存储 T 类型的数据
  private items: T[] = []

  // 入栈：放入一个 T 类型的元素
  push(item: T): void {
    this.items.push(item)
  }

  // 出栈：取出最后放入的元素，栈空时返回 undefined
  pop(): T | undefined {
    return this.items.pop()
  }

  // 查看栈顶元素（不取出）
  peek(): T | undefined {
    return this.items[this.items.length - 1]
  }

  // 当前栈内元素个数
  get size(): number {
    return this.items.length
  }

  // 获取所有元素（返回副本，避免外部修改内部数据）
  getAll(): T[] {
    return [...this.items]
  }
}

// 创建一个专门放字符串的栈
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

const genericClassCode = `// <T> 让 Stack 成为通用数据结构
class Stack<T> {
  private items: T[] = []     // 内部数组的类型由 T 决定

  push(item: T): void {       // 入参类型 = T
    this.items.push(item)
  }

  pop(): T | undefined {      // 返回值类型 = T
    return this.items.pop()
  }

  peek(): T | undefined {     // 返回值类型 = T
    return this.items[this.items.length - 1]
  }

  get size(): number {
    return this.items.length
  }
}

// 用同一个类创建不同类型的栈
const strStack = new Stack<string>()   // T = string
strStack.push('hello')                 // ✅ 只能放 string
// strStack.push(123)                  // ❌ 编译错误

const numStack = new Stack<number>()   // T = number
numStack.push(42)                      // ✅ 只能放 number

// 实际应用场景：
//   Stack<User>     → 撤销操作的用户栈
//   Stack<string>   → 浏览器历史记录
//   Stack<TreeNode> → 树的深度遍历`

// ====================================================================
// 5. keyof 泛型约束
// ====================================================================
// 核心思想：确保访问的属性名是对象上实际存在的
//
// 类比：K extends keyof T 就像一个"合法的钥匙"
//   T 是一个保险柜（对象）
//   keyof T 是所有能打开它的钥匙列表
//   K extends keyof T 确保你拿的钥匙是真实存在的
//
// 拆解理解：
//   person = { name: '张三', age: 25, city: '北京' }
//   keyof typeof person → 'name' | 'age' | 'city'
//   K extends 'name' | 'age' | 'city'
//   所以 K 只能是这三个字符串之一

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

// 返回类型 T[K] 的含义：
//   如果 key 是 'name'，则 T[K] = T['name'] = string
//   如果 key 是 'age'， 则 T[K] = T['age']  = number
//   返回值类型精确匹配该属性的实际类型！

const person = { name: '张三', age: 25, city: '北京' }

const keyofCode = `// 逐行理解：
//   T        = typeof person = { name: string; age: number; city: string }
//   keyof T  = 'name' | 'age' | 'city'  （T 的所有属性名组成的联合类型）
//   K extends keyof T  →  K 必须是 'name' | 'age' | 'city' 之一
//   T[K]    →  索引访问类型：取 T 中属性 K 的类型
//              若 K='name' 则 T[K]=string
//              若 K='age'  则 T[K]=number

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const person = { name: '张三', age: 25, city: '北京' }

// 类型推导过程：
getProperty(person, 'name')
//  → T = typeof person, K = 'name'
//  → 返回值 T[K] = person['name'] 的类型 = string ✅

getProperty(person, 'age')
//  → T = typeof person, K = 'age'
//  → 返回值 T[K] = person['age'] 的类型 = number ✅

// getProperty(person, 'email')  ❌ 编译错误！
//   'email' 不在 keyof person 中`

// ====================================================================
// 6. 条件类型（新增）
// ====================================================================
// 核心思想：类型层面的 "if-else"
//
// 类比：IsString<T> 就像问 "T 是字符串吗？"
//   是 → 返回 'yes'
//   不是 → 返回 'no'
//   这种判断发生在编译时，不会产生任何运行时代码

type IsString<T> = T extends string ? 'yes' : 'no'

// 测试条件类型
type Test1 = IsString<string> // 'yes'
type Test2 = IsString<number> // 'no'
type Test3 = IsString<'hello'> // 'yes' — 字面量类型也属于 string

const conditionalCode = `// 条件类型语法：T extends U ? X : Y
// 读作："如果 T 是 U 的子类型，则返回 X，否则返回 Y"

type IsString<T> = T extends string ? 'yes' : 'no'

// 编译时计算：
IsString<string>  → 'yes'   (string 是 string 的子类型)
IsString<number>  → 'no'    (number 不是 string 的子类型)
IsString<'hello'> → 'yes'   (字面量 'hello' 也是 string 的子类型)

// 实用场景：提取函数返回值类型
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never

// infer R 表示"推断这个位置的类型，命名为 R"
// 如果 T 是函数，R 就是它的返回值类型
// 如果 T 不是函数，返回 never（表示不可能）`

// ====================================================================
// 7. 实际应用：通用 API 响应类型
// ====================================================================
// 展示泛型在日常开发中最常见的用法

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface User {
  id: number
  name: string
  email: string
}

interface Article {
  id: number
  title: string
  content: string
}

// 不同的接口，data 的类型不同，但外层结构一致
// 不需要为每个接口重复定义 code/message
type UserListResponse = ApiResponse<User[]>
type ArticleDetailResponse = ApiResponse<Article>

const practicalCode = `// ===== 泛型在实际项目中的核心用法 =====

// 1️⃣ 通用 API 响应包装
interface ApiResponse<T> {
  code: number
  message: string
  data: T        // 不同接口的 data 类型不同
}

// 2️⃣ 不同接口只需指定 data 的类型
interface User { id: number; name: string }
interface Article { id: number; title: string }

// 用户列表 API → data 是 User[]
async function getUsers(): Promise<ApiResponse<User[]>> { ... }

// 文章详情 API → data 是 Article
async function getArticle(id: number): Promise<ApiResponse<Article>> { ... }

// 3️⃣ 好处：
//    • 不用为每个 API 重复定义 { code, message, data }
//    • 类型安全：res.data 的类型自动推断
//    • 修改公共字段时只需改 ApiResponse 一处`
</script>

<template>
  <div>
    <!-- 前置说明：什么是泛型 -->
    <section class="demo-section intro-section">
      <h2>📖 什么是泛型？为什么需要它？</h2>
      <div class="explain-box">
        <p>
          <strong>一句话解释：</strong
          >泛型就是<em>类型的参数</em>。就像函数可以接受值作为参数，泛型让类型也能作为参数传入。
        </p>

        <h3>没有泛型的痛苦 😫</h3>
        <pre class="code-block">
// 为每种类型写一个函数，代码重复！
function identityString(arg: string): string { return arg }
function identityNumber(arg: number): number { return arg }
function identityBoolean(arg: boolean): boolean { return arg }
// 还要写 identityUser, identityArticle... 永远写不完！</pre
        >

        <h3>有了泛型之后 😎</h3>
        <pre class="code-block">
// 一个函数搞定所有类型！
function identity&lt;T&gt;(arg: T): T { return arg }

// T 在调用时自动变成具体类型
identity('hello')  // T = string
identity(42)       // T = number</pre
        >

        <div class="key-points">
          <p>🔑 <strong>核心要点：</strong></p>
          <ul>
            <li><code>&lt;T&gt;</code> 是类型变量，就像函数参数一样，调用时才确定具体值</li>
            <li><code>extends</code> 用来约束泛型，就像给参数加条件限制</li>
            <li><code>keyof</code> 获取对象所有属性名的联合类型</li>
            <li>泛型让你<strong>写一次代码，适用所有类型</strong></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 1. 泛型函数 -->
    <section class="demo-section">
      <h2>1. 泛型函数 — 万能返回</h2>
      <p class="section-desc">定义一个函数，传入什么类型就返回什么类型，类型安全不丢失。</p>
      <pre class="code-block">{{ genericFnCode }}</pre>
      <div class="result-box">
        <p>
          <span class="label">identity('hello')</span> → <code>"{{ identity('hello') }}"</code>
          <span class="type-hint">// T = string</span>
        </p>
        <p>
          <span class="label">identity(42)</span> → <code>{{ identity(42) }}</code>
          <span class="type-hint">// T = number</span>
        </p>
        <p>
          <span class="label">identity(true)</span> → <code>{{ identity(true) }}</code>
          <span class="type-hint">// T = boolean</span>
        </p>
      </div>
    </section>

    <!-- 2. 泛型约束 -->
    <section class="demo-section">
      <h2>2. 泛型约束 — extends 限制类型范围</h2>
      <p class="section-desc">
        <code>T extends HasLength</code> 表示"T 可以是任何类型，<strong
          >但它必须包含 length 属性</strong
        >"。<br />
        没有约束时 T 可以是任意类型；有了约束后，T 被限定为满足条件的类型。
      </p>
      <pre class="code-block">{{ constraintCode }}</pre>
      <button @click="testLogLength" class="demo-btn">执行 logLength</button>
      <div class="result-box" v-if="logResults.length">
        <p v-for="(r, i) in logResults" :key="i">{{ r }}</p>
        <p class="hint">✅ 字符串和数组都有 .length，所以编译通过</p>
      </div>
    </section>

    <!-- 3. 泛型接口 -->
    <section class="demo-section">
      <h2>3. 泛型接口 — 同一个结构，多种数据类型</h2>
      <p class="section-desc">
        接口定义时用 <code>&lt;T&gt;</code> 占位，使用时再指定具体类型。<br />
        就像同一个模具可以注入不同的材料——铁水铸铁件，铜水铸铜件。
      </p>
      <pre class="code-block">{{ genericInterfaceCode }}</pre>
      <div class="result-box">
        <p>
          <span class="label">Box&lt;string&gt;.value</span> = <code>"{{ stringBox.value }}"</code>
          <span class="type-hint">// T = string</span>
        </p>
        <p>
          <span class="label">Box&lt;number&gt;.value</span> = <code>{{ numberBox.value }}</code>
          <span class="type-hint">// T = number</span>
        </p>
      </div>
    </section>

    <!-- 4. 泛型类 -->
    <section class="demo-section">
      <h2>4. 泛型类 — 通用的数据结构</h2>
      <p class="section-desc">
        Stack（栈）是经典的后进先出数据结构。<br />
        用泛型实现一次，就能用于任何类型：<code>Stack&lt;string&gt;</code>、<code>Stack&lt;number&gt;</code>、<code>Stack&lt;User&gt;</code>...
      </p>
      <pre class="code-block">{{ genericClassCode }}</pre>
      <div class="stack-demo">
        <div class="stack-btns">
          <button @click="stackPush" class="demo-btn">Push（入栈）</button>
          <button @click="stackPop" class="demo-btn">Pop（出栈）</button>
        </div>
        <div class="result-box">
          <p>
            <strong>Stack&lt;string&gt; 内容:</strong> [<code>{{ stackItems.join(', ') }}</code
            >]
          </p>
          <p>
            <span class="label">当前栈大小</span> = <code>{{ stringStack.size }}</code>
          </p>
          <p>
            <span class="label">栈顶元素</span> = <code>{{ stringStack.peek() ?? '（空）' }}</code>
            <span class="type-hint">// peek 只查看不取出</span>
          </p>
        </div>
      </div>
    </section>

    <!-- 5. keyof 约束 -->
    <section class="demo-section">
      <h2>5. keyof 泛型约束 — 安全的属性访问</h2>
      <p class="section-desc">
        结合
        <code>keyof</code>
        确保传入的属性名一定存在于对象上，<strong>编译时就能发现拼写错误</strong>。<br />
        返回类型也会精确匹配该属性的类型（name → string，age → number）。
      </p>
      <pre class="code-block">{{ keyofCode }}</pre>
      <div class="result-box">
        <p>
          <span class="label">getProperty(person, 'name')</span> →
          <code>"{{ getProperty(person, 'name') }}"</code>
          <span class="type-hint">// 返回 string</span>
        </p>
        <p>
          <span class="label">getProperty(person, 'age')</span> →
          <code>{{ getProperty(person, 'age') }}</code>
          <span class="type-hint">// 返回 number</span>
        </p>
        <p>
          <span class="label">getProperty(person, 'city')</span> →
          <code>"{{ getProperty(person, 'city') }}"</code>
          <span class="type-hint">// 返回 string</span>
        </p>
        <p class="hint">🔒 TypeScript 会在编译时阻止访问不存在的属性（如 'email'）</p>
      </div>
    </section>

    <!-- 6. 条件类型 -->
    <section class="demo-section">
      <h2>6. 条件类型 — 类型层面的 if-else</h2>
      <p class="section-desc">
        类型也可以做条件判断！<code>T extends U ? X : Y</code>
        是纯编译时的类型计算，不产生任何运行时代码。
      </p>
      <pre class="code-block">{{ conditionalCode }}</pre>
      <div class="result-box">
        <p>
          <span class="label">IsString&lt;string&gt;</span> = <code>'yes'</code>
          <span class="type-hint">// string 是 string 的子类型 ✅</span>
        </p>
        <p>
          <span class="label">IsString&lt;number&gt;</span> = <code>'no'</code>
          <span class="type-hint">// number 不是 string 的子类型 ❌</span>
        </p>
        <p>
          <span class="label">IsString&lt;'hello'&gt;</span> = <code>'yes'</code>
          <span class="type-hint">// 字面量类型 'hello' 也是 string ✅</span>
        </p>
      </div>
    </section>

    <!-- 7. 实际应用 -->
    <section class="demo-section">
      <h2>7. 实际应用 — 通用 API 响应包装</h2>
      <p class="section-desc">
        这是泛型在<strong>真实项目中最常见的用法</strong>。后端接口的响应格式通常是统一的
        <code>{ code, message, data }</code>，但 <code>data</code> 的类型因接口而异。
      </p>
      <pre class="code-block">{{ practicalCode }}</pre>
      <div class="result-box">
        <p><strong>示例数据结构：</strong></p>
        <p>
          <span class="label">ApiResponse&lt;User[]&gt;</span> →
          <code>{ code: 200, message: 'ok', data: [{ id: 1, name: '张三' }] }</code>
        </p>
        <p>
          <span class="label">ApiResponse&lt;Article&gt;</span> →
          <code>{ code: 200, message: 'ok', data: { id: 1, title: '泛型入门' } }</code>
        </p>
        <p class="hint">✅ 同一个 ApiResponse 接口，data 的类型根据实际 API 自动变化</p>
      </div>
    </section>

    <!-- 总结对比表 -->
    <section class="demo-section summary-section">
      <h2>📋 泛型知识速查表</h2>
      <table class="summary-table">
        <thead>
          <tr>
            <th>语法</th>
            <th>含义</th>
            <th>通俗理解</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>&lt;T&gt;</code></td>
            <td>声明类型变量</td>
            <td>"这个位置放一个类型，调用时再定"</td>
          </tr>
          <tr>
            <td><code>T extends U</code></td>
            <td>泛型约束</td>
            <td>"T 可以是任意类型，但必须满足 U 的条件"</td>
          </tr>
          <tr>
            <td><code>keyof T</code></td>
            <td>获取 T 的所有属性名</td>
            <td>"把 T 的钥匙串拿出来（所有属性名的联合类型）"</td>
          </tr>
          <tr>
            <td><code>K extends keyof T</code></td>
            <td>K 必须是 T 的属性名之一</td>
            <td>"这把钥匙必须在钥匙串上"</td>
          </tr>
          <tr>
            <td><code>T[K]</code></td>
            <td>索引访问类型</td>
            <td>"取出 T 中属性 K 的类型"</td>
          </tr>
          <tr>
            <td><code>T extends U ? X : Y</code></td>
            <td>条件类型</td>
            <td>"类型层面的三元表达式"</td>
          </tr>
          <tr>
            <td><code>infer R</code></td>
            <td>推断类型变量</td>
            <td>"帮我把这个位置的类型提取出来"</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
/* ===== 通用 Section ===== */
.demo-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  border-left: 4px solid #3178c6;
}

.demo-section h2 {
  margin-top: 0;
  color: #1a1a1a;
  font-size: 18px;
}

.section-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.7;
  margin: 8px 0 14px;
}

.section-desc code {
  background: #e8e8e8;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 13px;
  color: #cf1322;
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

/* ===== 代码块 ===== */
.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 14px 16px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
  margin: 0 0 12px;
  white-space: pre;
}

/* ===== 结果展示 ===== */
.result-box {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px 16px;
  margin-top: 8px;
}

.result-box p {
  margin: 5px 0;
  font-size: 14px;
  color: #333;
}

.label {
  font-weight: 500;
  color: #555;
  min-width: 180px;
  display: inline-block;
}

.type-hint {
  color: #bbb;
  font-size: 12px;
  margin-left: 8px;
}

.hint {
  color: #999;
  font-size: 13px;
  margin-top: 8px;
}

/* ===== 按钮 ===== */
.demo-btn {
  padding: 6px 18px;
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
  background: #f0f5ff;
}

/* ===== Stack 演示 ===== */
.stack-demo {
  margin-top: 8px;
}

.stack-btns {
  display: flex;
  gap: 8px;
}

/* ===== 总结表格 ===== */
.summary-section {
  border-left-color: #52c41a;
  background: #f6ffed;
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
