<script setup lang="ts">
// ====================================================================
// 预备知识：为什么要学函数类型？
// ====================================================================
// JavaScript 函数是一等公民：
//   - 可以赋值给变量
//   - 可以作为参数传递
//   - 可以作为返回值
// TypeScript 函数类型让你对这些函数进行精确的类型约束

// ====== 1. 函数声明 ======
// 最基本的函数定义方式
// 核心语法：(参数: 类型): 返回类型 => { 函数体 }
function add(a: number, b: number): number {
  return a + b
}

// 可选参数：title? 表示这个参数可以传也可以不传
// 实现方式：用三元判断 title ? 有值 : 没值
function greet(name: string, title?: string): string {
  // title? 当 title 存在时返回 true，否则返回 false
  return title ? `${title} ${name}` : name
}

// 剩余参数：...numbers 把所有剩余参数收集成一个数组
// 这让你可以传任意多个参数
function sum(...numbers: number[]): number {
  // reduce 遍历数组：[1,2,3,4].reduce((累加器, 当前值) => 累加, 初始值)
  // 第一次：acc=0, n=1 → 1
  // 第二次：acc=1, n=2 → 3
  // 第三次：acc=3, n=3 → 6
  // 第四次：acc=6, n=4 → 10
  return numbers.reduce((acc, n) => acc + n, 0)
}

const funcDeclCode = `// 基础声明：每个参数都要标注类型
function add(a: number, b: number): number {
  return a + b
}

// 可选参数：参数名后面加 ?，调用时不传则为 undefined
function greet(name: string, title?: string): string {
  // 三元表达式：条件 ? 真值 : 假值
  return title ? \`\${title} \${name}\` : name
}
greet('张三')        // → '张三'      （没传 title）
greet('张三', '先生') // → '先生 张三'  （传了 title）

// 剩余参数：...数组名 把所有参数收集成数组
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0)
}
sum(1, 2, 3, 4)  // → 10`

// ====== 2. 函数重载 ======
// 核心思想：同一个函数名，根据不同的参数类型/个数，执行不同的逻辑
// 就像一个"多功能遥控器"，按不同按钮触发不同功能
//
// TypeScript 重载分为两部分：
//   ① 重载签名（Overload Signatures）：列出所有可能的调用方式
//   ② 实现签名（Implementation Signature）：真正写逻辑的那个
// 重要：实现签名必须兼容所有重载签名（参数要更宽泛）

// 第一条重载：传入 string → 返回 string（大写）
function format(value: string): string
// 第二条重载：传入 number → 返回 string（保留两位小数）
function format(value: number): string
// 实现签名：string | number 覆盖上面两种情况
function format(value: string | number): string {
  // typeof 是运行时判断，TS 编译后依然有效
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}

const overloadCode = `// 重载签名：告诉 TS "这个函数可以这样调用"
// 第一条：参数是 string → 返回 string
function format(value: string): string
// 第二条：参数是 number → 返回 string
function format(value: number): string
// 实现签名：参数是联合类型，真正写逻辑的地方
function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase()   // string → 大写字符串
  }
  return value.toFixed(2)         // number → 保留2位小数
}

// 调用时 TS 会自动匹配到对应的重载签名
format('hello')    // → 'HELLO'    匹配第一条
format(3.14159)    // → '3.14'     匹配第二条
// format(true)    // ❌ 编译错误：没有 boolean 的重载签名

// ⚠️ 注意：重载签名只能有类型，实现签名才是真正写代码的地方`

// ====== 3. 函数类型表达式 ======
// 核心思想：把函数类型当作一种"类型"，像 string、number 一样使用
//
// 类比：MathFn 就像一张"数学函数资格证"
//   有这个资格证的人，必须会接收两个 number，返回一个 number
//   具体是加法、减法、乘法，随便，只要符合"输入两个数，输出一个数"就行

// 语法解读：type 别名 = (参数类型) => 返回类型
type MathFn = (a: number, b: number) => number

// 三个不同的实现，但都满足 MathFn 类型
const addFn: MathFn = (a, b) => a + b // 加法
const subFn: MathFn = (a, b) => a - b // 减法
const mulFn: MathFn = (a, b) => a * b // 乘法

// 实际应用场景：回调函数
// 高阶函数：接收一个函数作为参数
function operate(a: number, b: number, fn: MathFn): number {
  return fn(a, b)
}

const typeExprCode = `// 定义函数类型：type 类型名 = (参数) => 返回值
type MathFn = (a: number, b: number) => number
//              ↑                ↑           ↑
type 关键字      参数列表            箭头     返回值类型

// 用这个类型约束三个不同的函数
const addFn: MathFn = (a, b) => a + b   // T = number
const subFn: MathFn = (a, b) => a - b
const mulFn: MathFn = (a, b) => a * b

// 典型应用：作为高阶函数的参数（回调函数）
function operate(a: number, b: number, fn: MathFn): number {
  return fn(a, b)
}
operate(10, 5, addFn)  // → 15
operate(10, 5, subFn)  // → 5
operate(10, 5, mulFn)  // → 50`

// ====== 4. 调用签名 ======
// 核心思想：函数也是一种对象，可以有属性
//
// 类比：一个人（函数），除了能干活（调用），还可以有身份信息（属性）
//   Calculator 计算器：可以执行 (1, 2) → 3，同时还有 description 属性
//
// 普通函数类型表达式：(a: number, b: number) => number
// 调用签名语法：在对象类型中写 (参数): 返回值
//   { (参数): 返回值; 属性名: 属性类型 }

type Calculator = {
  // 调用签名：说明这个对象可以被当作函数调用
  (a: number, b: number): number
  // 普通属性：说明这个"函数对象"还有额外属性
  description: string
}

// Object.assign 合并：第一个参数是函数，后面的参数是属性
// 结果是一个"既是函数又有属性的对象"
const calc: Calculator = Object.assign(
  // 第一参数：函数本身 (a, b) => a + b
  (a: number, b: number) => a + b,
  // 第二参数：附加属性对象
  { description: '加法计算器' },
)

const callSigCode = `// 调用签名语法：在类型里写 (参数): 返回值
type Calculator = {
  (a: number, b: number): number   // ← 调用签名：可以像函数一样调用
  description: string              // ← 普通属性：函数也可以有属性
}

// 创建方式：用 Object.assign 把函数和属性合并
const calc: Calculator = Object.assign(
  (a: number, b: number) => a + b,  // 函数本身
  { description: '加法计算器' }      // 附加属性
)

// 使用时：既可以当函数调用，又可以读属性
calc(1, 2)             // → 3      （调用签名）
calc.description       // → '加法计算器'  （属性访问）

// 实际场景：jQuery 就是典型的调用签名
// const $: JQuery = (selector: string) => { ... }
// $.ajax('/api/user')   // 调用
// $.version             // 读属性`

// ====== 5. 泛型函数 ======
// 核心思想：函数也可以带类型参数 T，让参数和返回值的类型保持一致
//
// 类比：identity 就像一面"镜子"
//   放入什么拿出来还是什么：镜子里的你就是你自己
//   镜子本身不知道你是什么类型，但结果一定和你输入的一样

// identity 读作 "identity"，意思是"恒等"，数学中 f(x) = x
function identity<T>(arg: T): T {
  return arg
}

// 约束版本：要求 T 必须有 length 属性
interface HasLength {
  length: number
}

function logLength<T extends HasLength>(arg: T): T {
  console.log('长度:', arg.length)
  return arg
}

const genericFnCode = `// 泛型函数：<T> 是类型参数，调用时由 TS 自动推断
function identity<T>(arg: T): T {
  return arg   // 泛型的核心：输入什么类型，输出什么类型
}

// 调用方式一：显式指定类型
identity<string>('hello')   // T = string

// 调用方式二：让 TS 自动推断（更常用）
identity(42)                // T = number

// 泛型约束：用 extends 限制 T 的范围
function logLength<T extends HasLength>(arg: T): T {
  console.log(arg.length)   // T 一定有 length 属性
  return arg
}

logLength('hello')   // ✅ string 有 length
logLength([1, 2, 3]) // ✅ Array 有 length
logLength({ length: 5, name: 'test' }) // ✅ 自定义对象有 length
// logLength(123)    // ❌ 编译错误：number 没有 length`

// ====== 6. void 和 never 的区别（新增） ======
// 这是 TypeScript 新手最常混淆的两个返回类型

// void：函数正常执行完了，但没有显式返回值（或者说返回了 undefined）
// 典型场景：回调函数、执行副作用的操作
type Callback = () => void

const voidFn: Callback = () => {
  console.log('执行了，但没 return')
  // 隐式返回 undefined，等同于 return undefined
}

// never：函数永远不会正常执行完毕
// 典型场景：抛出错误、死循环、断言失败
function throwError(msg: string): never {
  throw new Error(msg) // 执行到这里就崩了，永远不会返回
}

function infiniteLoop(): never {
  while (true) {} // 永远跑不完
}

const voidNeverCode = `// void：表示"执行完了"，没有返回值（或者返回 undefined）
// 用于：回调函数、事件处理器、不关心返回值的操作
type Callback = () => void

const greet: Callback = () => {
  console.log('Hello!')  // 没有 return → 返回 void
  // voidFn 返回值是 void，但实际是 undefined
}

// never：表示"永远不会执行完毕"或"永远不会有返回值"
// 用于：抛出错误、死循环、类型守卫（后续会学到）
function throwError(msg: string): never {
  throw new Error(msg)  // 抛异常 → 程序崩了 → never
}

function assertNever(x: never): never {
  throw new Error('Unexpected value: ' + x)
}

// 关键区别：
//   void    → 函数执行完了，只是没有返回值
//   never   → 函数永远不会执行完（抛异常 / 死循环 / 断言失败）

// 实际场景：
function processResult(result: { ok: true; data: string } | { ok: false; error: string }) {
  if (result.ok) {
    console.log(result.data)       // ok=true 分支
  } else {
    console.error(result.error)    // ok=false 分支
    assertNever(result)            // 这里 result 的类型是 never
  }
}`

// ====== 7. 构造函数类型（新增） ======
// 核心思想：JavaScript 用 new 调用构造函数创建实例
// 构造函数类型用 new (...) => Type 表示

class Person {
  constructor(
    public name: string,
    public age: number,
  ) {}
}

// type Constructor = new (...args: any[]) => any
type Constructor<T> = new (...args: any[]) => T

function createInstance<T>(ctor: Constructor<T>, ...args: any[]): T {
  return new ctor(...args)
}

const constructorCode = `// 构造函数签名：用 new 关键字表示
type Constructor<T> = new (...args: any[]) => T
//                         ↑
//                   构造函数的参数列表

// Person 类本身可以作为 Constructor<Person> 使用
const person = createInstance(Person, '张三', 25)
person.name  // → '张三'
person.age   // → 25

// 实际场景：React 的类组件创建
type ReactClassComponent = new (props: any) => React.Component
function createReactInstance(ctor: ReactClassComponent, props: any) {
  return new ctor(props)
}`

// ====== 8. this 类型（新增） ======
// TypeScript 可以显式标注函数中 this 的类型
// 注意：this 类型要写在所有参数前面

function handleClick(this: Window, event: MouseEvent) {
  console.log('点击坐标:', event.clientX, event.clientY)
}

const thisTypeCode = `// TypeScript 中，this 作为第一个参数标注类型
// 这不是真正的参数，是 TypeScript 的语法糖，编译后会移除
function handleClick(this: Window, event: MouseEvent) {
  console.log(this.location)        // this 是 Window 类型
  console.log(event.clientX)       // event 是 MouseEvent 类型
}

// 如果不标注 this 类型，TS 会默认 this 是 any
// 标注后，this 的类型就是显式指定的类型

// 实际场景：DOM 事件处理
document.addEventListener('click', function(e) {
  // 在普通函数中，this 指向 document
  console.log(this.title)
})

document.addEventListener('click', (e) => {
  // 在箭头函数中，箭头函数不绑定 this
  // this 指向外层作用域（这里是 undefined / globalThis）
})`

// ====== 9. 异步函数类型（新增） ======
// async 函数总是返回 Promise，类型标注方式如下

// 方式一：显式指定 Promise<返回值>
async function fetchUser(id: number): Promise<string> {
  return `User-${id}`
}

// 方式二：用 await 时，TS 自动推断类型（推荐）
async function fetchUserWithAwait(id: number) {
  const name = await fetchUser(id) // TS 推断 name: string
  return name.toUpperCase()
}

const asyncFnCode = `// async 函数类型标注：
// 1. 显式标注返回 Promise<T>
async function fetchUser(id: number): Promise<string> {
  return \`User-\${id}\`
}

// 2. 用 await 时，TS 会自动推断出正确的类型
async function getUpperName(id: number) {
  const name = await fetchUser(id)  // name: string
  return name.toUpperCase()        // 返回 Promise<string>
}

// Promise 的类型参数：
//   Promise<number>   → resolve 时返回 number
//   Promise<string>  → resolve 时返回 string
//   Promise<User>    → resolve 时返回 User 对象
//   Promise<void>    → 不返回任何有用值

// 常见错误：忘记 async
// function getData(): string { return fetch('/api') }  // ❌ 返回的是 Promise
// async function getData(): Promise<string> { return fetch('/api') }  // ✅`

// ====== 10. 可选参数与默认参数（新增） ======
// 可选参数：参数名后加 ?，默认为 undefined
// 默认参数：参数名 = 默认值，不传时使用默认值

function createUser(
  name: string, // 必填参数
  age?: number, // 可选参数
  role: string = 'user', // 默认参数
  tags: string[] = [], // 默认空数组
): string {
  return JSON.stringify({ name, age, role, tags })
}

const optionalDefaultCode = `// 必填参数：必须传值
function createUser(name: string) { ... }

// 可选参数：参数名加 ?，可不传，值为 undefined
function greet(name: string, title?: string) {
  return title ? \`\${title} \${name}\` : name
}
greet('张三')           // title 为 undefined
greet('张三', '先生')    // title 为 '先生'

// 默认参数：参数名 = 默认值，不传时自动使用默认值
function setLevel(name: string, level: number = 1) {
  return \`\${name}: Level \${level}\`
}
setLevel('玩家A')      // → '玩家A: Level 1'
setLevel('玩家B', 5)  // → '玩家B: Level 5'

// 参数顺序规则：
//   必填参数 → 可选参数 → 默认参数
//   原因：必填参数必须传值，可选和默认参数可以不传

// 实际场景：axios 配置对象
function request(url: string, config: { timeout?: number = 3000, headers?: object = {} }) {
  // timeout 默认 3000ms，headers 默认空对象
}`

// ====== 11. 实用：函数作为参数和返回值（新增） ======
// 函数式编程的核心：函数可以输入函数，也可以输出函数

// 高阶函数一：接收函数作为参数（常见于数组方法）
const numbers = [1, 2, 3, 4, 5]

// map 接收一个函数：(number) => number
const doubled = numbers.map((n) => n * 2)

// filter 接收一个函数：(number) => boolean
const evens = numbers.filter((n) => n % 2 === 0)

// reduce 接收一个函数：(累加器, 当前值) => 累加器
const total = numbers.reduce((acc, n) => acc + n, 0)

// 高阶函数二：返回一个新函数（函数柯里化）
function multiply(a: number): (b: number) => number {
  return (b: number) => a * b
}

const double = multiply(2) // double: (b: number) => number
const triple = multiply(3) // triple: (b: number) => number

const higherOrderCode = `// ===== 函数作为参数 =====
// 数组的 map/filter/reduce 都是高阶函数

const nums = [1, 2, 3, 4, 5]

// map：每个元素经过函数变换，返回新数组
nums.map(n => n * 2)         // → [2, 4, 6, 8, 10]

// filter：每个元素经过函数判断，保留为 true 的
nums.filter(n => n % 2 === 0) // → [2, 4]

// reduce：每个元素和累加器经过函数，结果累积
nums.reduce((acc, n) => acc + n, 0) // → 15

// ===== 函数作为返回值 =====
// 柯里化：multiply 返回一个新函数
function multiply(a: number): (b: number) => number {
  return (b: number) => a * b
}

const double = multiply(2)   // double = (b) => 2 * b
const triple = multiply(3)  // triple = (b) => 3 * b

double(5)   // → 10
triple(5)  // → 15

// 实际应用：防抖（debounce）函数
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}`
</script>

<template>
  <div>
    <!-- 开篇：什么是函数类型 -->
    <section class="demo-section intro-section">
      <h2>📖 什么是函数类型？为什么需要它？</h2>
      <div class="explain-box">
        <p>
          <strong>一句话解释：</strong>函数类型让你在 TypeScript 中<em>精确描述一个函数的形状</em>——
          它需要什么参数，返回什么值。
        </p>
        <h3>没有函数类型的痛苦 😫</h3>
        <pre class="code-block">
// JavaScript：函数的参数和返回值都是 any
const add = (a, b) => a + b
add('hello', 123)  // → 'hello123'  （字符串拼接，语义错误！）
// 编译时完全不报错，运行时才发现问题</pre
        >
        <h3>有了函数类型之后 😎</h3>
        <pre class="code-block">
// TypeScript：明确约束类型，类型错误直接编译报错
type AddFn = (a: number, b: number) => number
const add: AddFn = (a, b) => a + b
add('hello', 123)  // ❌ 编译错误：'hello' 不能赋值给 number
add(1, 2)          // ✅ 编译通过，结果是 3</pre
        >
        <div class="key-points">
          <p>🔑 <strong>核心要点：</strong></p>
          <ul>
            <li><code>(a: number, b: number) => number</code> 是函数类型表达式</li>
            <li><code>void</code> 表示函数没有显式返回值（不等于不能 return）</li>
            <li><code>never</code> 表示函数永远不会正常返回</li>
            <li>函数可以作为<strong>变量值</strong>、<strong>参数</strong>、<strong>返回值</strong></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 1. 函数声明 -->
    <section class="demo-section">
      <h2>1. 函数类型声明 — 基础三件套</h2>
      <p class="section-desc">
        声明函数时同时标注<strong>参数类型</strong>和<strong>返回值类型</strong>。 可选参数 <code>?</code>、剩余参数
        <code>...</code> 是最常用的扩展语法。
      </p>
      <pre class="code-block">{{ funcDeclCode }}</pre>
      <div class="result-box">
        <p>
          <span class="label">add(1, 2)</span> →
          <code>{{ add(1, 2) }}</code>
          <span class="type-hint">// 必填参数</span>
        </p>
        <p>
          <span class="label">greet('张三', '先生')</span> →
          <code>"{{ greet('张三', '先生') }}"</code>
          <span class="type-hint">// 传了可选参数</span>
        </p>
        <p>
          <span class="label">greet('张三')</span> →
          <code>"{{ greet('张三') }}"</code>
          <span class="type-hint">// 省略可选参数，变为 undefined</span>
        </p>
        <p>
          <span class="label">sum(1, 2, 3, 4)</span> →
          <code>{{ sum(1, 2, 3, 4) }}</code>
          <span class="type-hint">// 剩余参数收集成数组</span>
        </p>
      </div>
    </section>

    <!-- 2. 函数重载 -->
    <section class="demo-section">
      <h2>2. 函数重载 — 一个名字，多种用法</h2>
      <p class="section-desc">
        <code>format</code> 根据传入参数类型不同，执行不同逻辑。<br />
        TypeScript 通过<strong>重载签名</strong>告诉编译器有哪些调用方式， 用<strong>实现签名</strong>统一写实际逻辑。
      </p>
      <pre class="code-block">{{ overloadCode }}</pre>
      <div class="result-box">
        <p>
          <span class="label">format('hello')</span> →
          <code>"{{ format('hello') }}"</code>
          <span class="type-hint">// string → .toUpperCase()</span>
        </p>
        <p>
          <span class="label">format(3.14159)</span> →
          <code>"{{ format(3.14159) }}"</code>
          <span class="type-hint">// number → .toFixed(2)</span>
        </p>
        <p class="hint">✅ TS 在编译时就根据参数类型决定调用哪个重载</p>
      </div>
    </section>

    <!-- 3. 函数类型表达式 -->
    <section class="demo-section">
      <h2>3. 函数类型表达式 — 把函数类型当作值来用</h2>
      <p class="section-desc">
        用 <code>type</code> 定义函数类型后，就可以像 <code>string</code>、<code>number</code> 一样作为变量类型。<br />
        最常见的场景：<strong>回调函数</strong>（作为参数传给其他函数）。
      </p>
      <pre class="code-block">{{ typeExprCode }}</pre>
      <div class="result-box">
        <p>
          <span class="label">addFn(10, 5)</span> →
          <code>{{ addFn(10, 5) }}</code>
          <span class="type-hint">// 箭头函数实现</span>
        </p>
        <p>
          <span class="label">subFn(10, 5)</span> →
          <code>{{ subFn(10, 5) }}</code>
          <span class="type-hint">// 同类型不同实现</span>
        </p>
        <p>
          <span class="label">mulFn(10, 5)</span> →
          <code>{{ mulFn(10, 5) }}</code>
          <span class="type-hint">// 同类型不同实现</span>
        </p>
        <p>
          <span class="label">operate(10, 5, addFn)</span> →
          <code>{{ operate(10, 5, addFn) }}</code>
          <span class="type-hint">// 函数作为参数（回调）</span>
        </p>
      </div>
    </section>

    <!-- 4. 调用签名 -->
    <section class="demo-section">
      <h2>4. 调用签名 — 函数也是对象</h2>
      <p class="section-desc">
        JavaScript 中函数也是对象，可以有属性。 用<strong>调用签名</strong>
        <code>{ (参数): 返回值 }</code> 表示"可调用的对象"。
      </p>
      <pre class="code-block">{{ callSigCode }}</pre>
      <div class="result-box">
        <p>
          <span class="label">calc(1, 2)</span> →
          <code>{{ calc(1, 2) }}</code>
          <span class="type-hint">// 作为函数调用</span>
        </p>
        <p>
          <span class="label">calc.description</span> →
          <code>"{{ calc.description }}"</code>
          <span class="type-hint">// 作为对象访问属性</span>
        </p>
        <p class="hint">✅ jQuery 的 $ 就是一个典型的调用签名对象</p>
      </div>
    </section>

    <!-- 5. 泛型函数 -->
    <section class="demo-section">
      <h2>5. 泛型函数 — 参数和返回值类型自动同步</h2>
      <p class="section-desc">
        <code>&lt;T&gt;</code> 是类型变量，调用时由 TypeScript 自动推断具体类型。 结合
        <code>extends</code> 约束可以让泛型更安全。
      </p>
      <pre class="code-block">{{ genericFnCode }}</pre>
      <div class="result-box">
        <p>
          <span class="label">identity&lt;string&gt;('hello')</span> →
          <code>"{{ identity('hello') }}"</code>
          <span class="type-hint">// 显式指定 T = string</span>
        </p>
        <p>
          <span class="label">identity(42)</span> →
          <code>{{ identity(42) }}</code>
          <span class="type-hint">// TS 自动推断 T = number</span>
        </p>
        <p>
          <span class="label">logLength('TypeScript')</span> →
          <code>{{
            (() => {
              logLength('TypeScript')
              return 'TypeScript'.length
            })()
          }}</code>
          <span class="type-hint">// T 有 length 约束，安全访问</span>
        </p>
      </div>
    </section>

    <!-- 6. void vs never -->
    <section class="demo-section">
      <h2>6. void 与 never — 最容易混淆的两个返回类型</h2>
      <p class="section-desc">
        <code>void</code> = 正常执行完了，没有显式返回值。<br />
        <code>never</code> = 永远不会正常执行完（抛异常 / 死循环 / 类型守卫）。
      </p>
      <pre class="code-block">{{ voidNeverCode }}</pre>
      <div class="result-box">
        <p>
          <span class="label">voidFn()</span> →
          <code>执行了，但没 return</code>
          <span class="type-hint">// void = 正常结束，无返回值</span>
        </p>
        <p>
          <span class="label">voidFn 返回值类型</span> →
          <code>void</code>
          <span class="type-hint">// 永远是 void（即使函数里 console.log）</span>
        </p>
        <p class="hint">⚠️ void 和 undefined 不是一回事！void 是一种类型，表示"无意义返回值"</p>
      </div>
    </section>

    <!-- 7. 构造函数类型 -->
    <section class="demo-section">
      <h2>7. 构造函数类型 — new 出来的才叫构造函数</h2>
      <p class="section-desc">
        用 <code>new (...args) => Type</code> 表示构造函数类型。 TypeScript 中类本身就可以当作构造函数类型使用。
      </p>
      <pre class="code-block">{{ constructorCode }}</pre>
      <div class="result-box">
        <p>
          <span class="label">createInstance(Person, '张三', 25)</span> →
          <code>{{ createInstance(Person, '张三', 25).name }}</code>
          <span class="type-hint">// 传入构造函数，创建实例</span>
        </p>
        <p class="hint">✅ 工厂模式的类型安全实现</p>
      </div>
    </section>

    <!-- 8. this 类型 -->
    <section class="demo-section">
      <h2>8. this 类型 — 显式标注 this 的类型</h2>
      <p class="section-desc">
        TypeScript 用<strong>第一个参数位置</strong>标注 <code>this</code> 的类型。 这不是真正的参数，编译后会完全移除。
      </p>
      <pre class="code-block">{{ thisTypeCode }}</pre>
      <div class="result-box">
        <p>
          <span class="label">普通函数 this</span> →
          <code>指向调用者（document / Window）</code>
          <span class="type-hint">// 需显式标注类型</span>
        </p>
        <p>
          <span class="label">箭头函数 this</span> →
          <code>指向定义时的外层作用域</code>
          <span class="type-hint">// 不绑定 this，编译后消失</span>
        </p>
        <p class="hint">✅ 箭头函数不能作为对象的 method（因为会丢失 this）</p>
      </div>
    </section>

    <!-- 9. 异步函数类型 -->
    <section class="demo-section">
      <h2>9. 异步函数类型 — async 函数返回 Promise</h2>
      <p class="section-desc">
        <code>async</code> 函数总是返回 <code>Promise&lt;T&gt;</code>。 标注方式：显式写
        <code>Promise&lt;类型&gt;</code> 或让 TS 自动推断。
      </p>
      <pre class="code-block">{{ asyncFnCode }}</pre>
      <div class="result-box">
        <p>
          <span class="label">fetchUser(1)</span> →
          <code>Promise "User-1"</code>
          <span class="type-hint">// 返回 Promise&lt;string&gt;</span>
        </p>
        <p>
          <span class="label">await fetchUser(1)</span> →
          <code>"User-1"</code>
          <span class="type-hint">// Promise resolve 后的值是 string</span>
        </p>
        <p class="hint">✅ 忘掉 async 关键字是最常见的 Promise 类型错误</p>
      </div>
    </section>

    <!-- 10. 可选参数与默认参数 -->
    <section class="demo-section">
      <h2>10. 可选参数与默认参数 — 灵活的参数设计</h2>
      <p class="section-desc">
        <code>?</code> 表示可选（值为 <code>undefined</code>），<code>= 值</code> 表示默认值。 顺序规则：<strong
          >必填 → 可选 → 默认</strong
        >。
      </p>
      <pre class="code-block">{{ optionalDefaultCode }}</pre>
      <div class="result-box">
        <p>
          <span class="label">createUser('张三')</span> →
          <code>{{ createUser('张三') }}</code>
          <span class="type-hint">// age=undefined, role='user', tags=[]</span>
        </p>
        <p>
          <span class="label">createUser('李四', 30, 'admin')</span> →
          <code>{{ createUser('李四', 30, 'admin') }}</code>
          <span class="type-hint">// 全部显式传参</span>
        </p>
      </div>
    </section>

    <!-- 11. 高阶函数 -->
    <section class="demo-section">
      <h2>11. 函数作为参数和返回值 — 函数式编程基础</h2>
      <p class="section-desc">
        这是现代 JavaScript 开发的基础：<strong>map/filter/reduce</strong>
        接收函数作为参数；<strong>柯里化</strong>返回新函数。
      </p>
      <pre class="code-block">{{ higherOrderCode }}</pre>
      <div class="result-box">
        <p>
          <span class="label">map: n * 2</span> →
          <code>{{ numbers.map((n) => n * 2).join(', ') }}</code>
          <span class="type-hint">// 每个元素变换，返回新数组</span>
        </p>
        <p>
          <span class="label">filter: n % 2 === 0</span> →
          <code>{{ numbers.filter((n) => n % 2 === 0).join(', ') }}</code>
          <span class="type-hint">// 保留满足条件的元素</span>
        </p>
        <p>
          <span class="label">reduce: acc + n</span> →
          <code>{{ numbers.reduce((acc, n) => acc + n, 0) }}</code>
          <span class="type-hint">// 累积计算，返回单一结果</span>
        </p>
        <p>
          <span class="label">double(5)</span> →
          <code>{{ double(5) }}</code>
          <span class="type-hint">// multiply(2) 返回的新函数</span>
        </p>
        <p>
          <span class="label">triple(5)</span> →
          <code>{{ triple(5) }}</code>
          <span class="type-hint">// multiply(3) 返回的新函数</span>
        </p>
      </div>
    </section>

    <!-- 总结 -->
    <section class="demo-section summary-section">
      <h2>📋 函数类型速查表</h2>
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
            <td><code>(a: T) =&gt; R</code></td>
            <td>函数类型表达式</td>
            <td>"接收 T 返回 R 的函数"</td>
          </tr>
          <tr>
            <td><code>T =&gt; R</code></td>
            <td>箭头函数（单参数可省略括号）</td>
            <td>ES6 简写，return 语句可省略</td>
          </tr>
          <tr>
            <td><code>fn(): void</code></td>
            <td>无显式返回值</td>
            <td>"执行完了，不用管返回值"</td>
          </tr>
          <tr>
            <td><code>fn(): never</code></td>
            <td>永不返回（抛异常/死循环）</td>
            <td>"这个函数永远不会正常结束"</td>
          </tr>
          <tr>
            <td><code>new (...args) =&gt; T</code></td>
            <td>构造函数类型</td>
            <td>"用 new 创建实例的函数"</td>
          </tr>
          <tr>
            <td><code>param?: T</code></td>
            <td>可选参数</td>
            <td>"可以不传，默认 undefined"</td>
          </tr>
          <tr>
            <td><code>param = default</code></td>
            <td>默认参数</td>
            <td>"不传则使用默认值"</td>
          </tr>
          <tr>
            <td><code>...args: T[]</code></td>
            <td>剩余参数</td>
            <td>"把所有参数收集成数组"</td>
          </tr>
          <tr>
            <td><code>{ (): R; prop: T }</code></td>
            <td>调用签名</td>
            <td>"可调用又有属性的对象"</td>
          </tr>
          <tr>
            <td><code>Promise&lt;T&gt;</code></td>
            <td>Promise 类型</td>
            <td>"异步操作，未来会 resolve 为 T"</td>
          </tr>
          <tr>
            <td><code>async fn(): Promise&lt;T&gt;</code></td>
            <td>异步函数</td>
            <td>"返回 Promise 的 async 函数"</td>
          </tr>
          <tr>
            <td><code>&lt;T&gt;=&gt; T</code></td>
            <td>泛型函数</td>
            <td>"类型参数由调用时自动推断"</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script lang="ts">
// ====== 演示用的运行时变量 ======
const numbers = [1, 2, 3, 4, 5]

function operate(a: number, b: number, fn: (a: number, b: number) => number): number {
  return fn(a, b)
}

class Person {
  constructor(
    public name: string,
    public age: number,
  ) {}
}

function createInstance<T>(ctor: new (...args: any[]) => T, ...args: any[]): T {
  return new ctor(...args)
}

function multiply(a: number): (b: number) => number {
  return (b: number) => a * b
}

const double = multiply(2)
const triple = multiply(3)

function createUser(name: string, age?: number, role: string = 'user', tags: string[] = []): string {
  return JSON.stringify({ name, age, role, tags })
}

export default {
  data() {
    return { numbers, double, triple, createUser }
  },
  methods: {
    operate,
  },
}
</script>

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
  min-width: 220px;
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
