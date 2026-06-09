<script setup lang="ts">
// ====================================================================
// 预备知识：为什么需要接口？
// ====================================================================
// JavaScript 是动态类型语言：
//   const user = { name: '张三', age: 25 }
//   user.email = 123   // ❌ 不报错，但逻辑错误！
// TypeScript 接口让你定义"对象的形状契约"——必须有哪些属性、属性是什么类型

// ====== 1. 接口基本用法 ======
// 核心思想：定义一个"对象的蓝图"，规定这个对象必须有哪些属性
//
// 类比：身份证模板
//   每个人都有姓名、性别、年龄、身份证号
//   接口就像一张"身份证模板"，所有人必须按这个模板填写信息

interface User {
  name: string    // 必填：名字是字符串
  age: number      // 必填：年龄是数字
  readonly id: number  // 只读：创建后不能修改（像身份证号）
  email?: string   // 可选：? 表示这个属性可以有也可以没有
}

// readonly 的效果演示
const user: User = { name: '张三', age: 25, id: 1 }
// user.id = 999    // ❌ 编译错误：Cannot assign to 'id' because it is a read-only property
user.email = 'zhang@example.com'  // ✅ 可选属性可以后续添加
user.age = 26                     // ✅ 普通属性可以修改

const interfaceCode = `// interface 接口名 { 属性定义 }
// 这是最基础的接口写法：规定对象的"形状"
interface User {
  name: string           // 必填属性：必须有，且必须是 string
  age: number            // 必填属性：必须有，且必须是 number
  readonly id: number    // readonly：创建后不可修改的只读属性
  email?: string         // ?: 可选属性，可以完全不写这个属性
}

// 使用接口作为变量类型
const user: User = { name: '张三', age: 25, id: 1 }
// user.id = 2          // ❌ 编译错误：只读属性不能修改
user.email = 'zhang@example.com'  // ✅ 可选属性可以后添加

// 省略可选属性：email 完全不写也没问题
const user2: User = { name: '李四', age: 30, id: 2 }

// 错误示例：缺少必填属性
// const bad: User = { name: '王五', id: 3 }  // ❌ 缺少 age
// const bad2: User = { name: '赵六', age: 20, id: 4, age: 30 }  // ❌ 属性重复`

// ====== 2. 接口继承 ======
// 核心思想：接口也可以"继承"，子接口自动拥有父接口的所有属性
//
// 类比：生物分类
//   Animal（动物）：有名字、能呼吸
//   Dog（狗）：是 Animal + 会叫、能跑
//   用 extends 表达 "Dog extends Animal" 关系

interface Animal {
  name: string   // 所有动物都有名字
}

interface Dog extends Animal {
  breed: string  // 狗的品种（金毛、哈士奇...）
  bark(): void    // 狗的方法：叫
}

const dog: Dog = {
  name: '旺财',
  breed: '金毛',
  bark() {
    return '汪汪!'
  },
}

// 多继承：同时继承多个接口（interface 独有的能力）
interface A { a: string }
interface B { b: number }
interface C extends A, B {
  c: boolean
}
// C 同时拥有 a, b, c 三个属性

const extendsCode = `// 单继承：A 被 B 继承，B 自动拥有 A 的所有属性
interface Animal { name: string }

interface Dog extends Animal {
  breed: string
  bark(): void
}

const dog: Dog = {
  name: '旺财',    // ← 继承自 Animal
  breed: '金毛',   // ← Dog 自己定义的
  bark() { return '汪汪!' }  // ← Dog 自己定义的
}

// 多继承：一个接口同时继承多个父接口
interface A { a: string }
interface B { b: number }
interface C extends A, B {   // ← 同时继承 A 和 B
  c: boolean
}
// C = { a: string; b: number; c: boolean }

// type 用 & 交叉类型实现等价效果
type TypeC = A & B & { c: boolean }`

// ====== 3. 方法签名 ======
// 核心思想：接口不仅能定义属性，还能定义方法
//
// 类比：手机接口
//   智能手机 = 能打电话 + 能发短信 + 能上网
//   接口里写方法签名：方法名(参数): 返回值

interface Calculator {
  name: string
  // 普通方法：add(a: number, b: number): number
  add(a: number, b: number): number
  subtract(a: number, b: number): number
  // 箭头方法写法（ES6 简写）：
  multiply: (a: number, b: number) => number
}

const calc: Calculator = {
  name: '我的计算器',
  add(a, b) { return a + b },
  subtract(a, b) { return a - b },
  multiply: (a, b) => a * b,
}

const methodCode = `// 接口中的方法签名写法：
interface Calculator {
  // 写法一：标准方法签名
  add(a: number, b: number): number

  // 写法二：箭头函数类型（等价格式）
  multiply: (a: number, b: number) => number

  // 方法也可以有可选的
  divide?: (a: number, b: number) => number
}

const calc: Calculator = {
  add(a, b) { return a + b },
  multiply: (a, b) => a * b,
  // divide 是可选的，不写也没问题
}

// 调用时 TS 会检查方法签名
calc.add(10, 5)       // → 15
calc.multiply(10, 5) // → 50`

// ====== 4. 类型别名 ======
// 核心思想：type 是给复杂类型起别名的方式，比 interface 更灵活
//
// 类比：绰号系统
//   "北京市朝阳区建国路XX号"太长了，给它起个绰号"公司地址"
//   type 就是类型的绰号，简化书写

// 联合类型别名：Status 只能是这三个字符串之一
type Status = 'success' | 'error' | 'loading'

// 对象类型别名：Point 是一个有 x 和 y 属性的对象
type Point = { x: number; y: number }

// 函数类型别名：Callback 是接收 string 返回 void 的函数
type Callback = (data: string) => void

const point: Point = { x: 10, y: 20 }

// type 的更多用法：给基本类型起别名
type ID = string | number   // ID 可以是字符串或数字
type StringOrNumber = string | number  // 同上
type EmptyCallback = () => void  // 无参数无返回值的函数

const typeAliasCode = `// type 语法：type 别名 = 具体类型
// 1️⃣ 联合类型：只能是指定的几个值之一
type Status = 'success' | 'error' | 'loading'
// Status = 'success' ✅ | 'error' ✅ | 'loading' ✅ | 'pending' ❌

// 2️⃣ 对象类型：描述对象的形状
type Point = { x: number; y: number }

// 3️⃣ 函数类型：描述函数的签名
type Callback = (data: string) => void

// 4️⃣ 组合类型：type 可以组合 union 和 intersection
type PartialPoint = Partial<Point>  // 所有属性变可选
type ReadonlyPoint = Readonly<Point> // 所有属性变只读

// 5️⃣ 给基本类型起别名（不是 interface 能做的）
type ID = string | number`

// ====== 5. interface vs type 对比 ======
// 核心问题：什么时候用 interface？什么时候用 type？
//
// 经验法则：
//   定义"对象形状/类契约" → 用 interface（语义更清晰）
//   定义联合类型/元组/映射类型 → 用 type（interface 做不到）

// interface 支持声明合并（type 不支持）
interface Config { host: string }
interface Config { port: number }
// 两次声明合并成：Config = { host: string; port: number }

// type 做不到这个：重复声明会报错
// type Config = { host: string }
// type Config = { port: number }  // ❌ Duplicate identifier 'Config'

// type 可以定义联合类型（interface 不支持）
// type StringOrNumber = string | number   // ← type 的能力，interface 做不了
// type Result = SuccessResult | ErrorResult  // ← 联合类型

const compareCode = `// ============ interface 独有特性 ============
// 1. 声明合并：同名的多个 interface 自动合并
interface A { x: number }
interface A { y: string }
// 最终 A = { x: number; y: string }

// 2. 语义更清晰：描述"对象蓝图"或"类契约"
interface User { name: string; email: string }

// ============ type 独有特性 ============
// 1. 联合类型
type Status = 'a' | 'b' | 'c'

// 2. 元组类型
type Pair = [string, number]

// 3. 映射类型
type Readonly<T> = { readonly [P in keyof T]: T[P] }

// 4. 条件类型
type IsString<T> = T extends string ? 'yes' : 'no'

// ============ 经验法则 ============
// 定义对象/类契约  → interface（推荐）
// 联合/元组/映射    → type（必须用）
// 两者都能用时      → interface（语义更明确）`

// ====== 6. 索引签名 ======
// 核心思想：对象的属性名不确定，但属性值类型一致
//
// 类比：字典
//   字典的 key 是"汉字"，value 是"解释"
//   索引签名 [key: string]: string 表示"key 是字符串，value 也是字符串"

interface StringMap {
  [key: string]: string  // key 名字随便取，类型是 string，value 也是 string
}

const map: StringMap = { name: '张三', city: '北京', role: '管理员' }

// 带数值索引的接口：number 索引通常用于数组
interface NumberList {
  [index: number]: string  // 下标是 number，值是 string
}

const list: NumberList = ['苹果', '香蕉', '橙子']

const indexCode = `// 索引签名语法：[key: 索引类型]: 值类型
// key 名字随便取，类型决定 key 的允许范围

// 字符串索引：key 是 string，value 是 string
interface StringMap {
  [key: string]: string
}

const map: StringMap = { name: '张三', city: '北京' }
map['任意key'] = '任意值'   // ✅ 可以动态添加属性

// 数字索引：key 是 number（通常用于数组）
interface NumberList {
  [index: number]: string
}

const fruits: NumberList = ['苹果', '香蕉']
fruits[0]    // → '苹果'
fruits[1]    // → '香蕉'

// ⚠️ 注意：数字索引的值类型必须兼容字符串索引
// 因为 arr[0] 在 JS 中实际上是用字符串 '0' 去查的
// 所以 NumberList 的 value: string 也要兼容 [key: string]: ???`

// ====== 7. 函数接口 & 构造函数接口（新增） ======
// 函数也可以作为接口来描述

// 调用签名（函数作为可调用对象）
interface AddFn {
  (a: number, b: number): number
  description: string
}

// 构造函数签名
interface Animal {
  name: string
}

interface AnimalConstructor {
  new (name: string): Animal  // 用 new 调用，返回 Animal 实例
}

function createAnimal(ctor: AnimalConstructor, name: string): Animal {
  return new ctor(name)
}

class Cat implements Animal {
  constructor(public name: string) {}
}

const fnInterfaceCode = `// ===== 调用签名：描述一个可调用的对象 =====
// 类似于 FunctionType.vue 中的"调用签名"
interface AddFn {
  (a: number, b: number): number   // ← 可以像函数一样调用
  description: string               // ← 同时有属性
}

// ===== 构造函数签名：描述要用 new 创建的东西 =====
interface Animal { name: string }

interface AnimalConstructor {
  new (name: string): Animal
  //    ↑ 参数类型      ↑ 返回实例类型
}

function createAnimal(ctor: AnimalConstructor, name: string): Animal {
  return new ctor(name)   // 用传入的构造函数创建实例
}

class Cat implements Animal {
  constructor(public name: string) {}
}

const cat = createAnimal(Cat, '咪咪')
cat.name  // → '咪咪'`

// ====== 8. 接口实现类（新增） ======
// 核心思想：interface 可以作为"类的合同"，规定类必须实现哪些属性和方法
//
// 类比：招聘要求
//   "应聘者必须：会写代码、会说英语、会团队协作"
//   implements EmployeeContract 的类，必须实现这些要求

interface EmployeeContract {
  name: string
  department: string
  work(): void
  // 接口中的方法可以是可选的
  onVacation?: () => boolean
}

class Engineer implements EmployeeContract {
  // implements 后必须包含接口中所有必填属性
  name = '王工'
  department = '研发部'

  work() {
    console.log('写代码...')
  }
}

class Manager implements EmployeeContract {
  name = '张经理'
  department = '管理层'

  work() {
    console.log('开会...')
  }

  // 可选方法可以不写，也可以写
  onVacation() {
    return false
  }
}

const implCode = `// implements 关键字：让类"承诺"实现某个接口
interface EmployeeContract {
  name: string           // 必填属性
  department: string      // 必填属性
  work(): void           // 必填方法
  onVacation?(): boolean  // 可选方法，加 ?
}

class Engineer implements EmployeeContract {
  name = '王工'
  department = '研发部'

  work() {
    console.log('写代码...')
  }
  // onVacation 是可选的，不写完全OK
}

class Manager implements EmployeeContract {
  name = '张经理'
  department = '管理层'

  work() { console.log('开会...') }

  // 也可以实现可选方法
  onVacation() { return false }
}

// 一个类可以实现多个接口（用逗号分隔）
interface Serializable { serialize(): string }
interface Deserializable { static deserialize(data: string): T }

class DataService implements Serializable, Deserializable {
  // 必须同时实现两个接口的所有要求
}`

// ====== 9. 只读相关（Readonly / ReadonlyArray）（新增） ======
// 核心思想：TypeScript 内置了很多工具类型，专门用来改造接口
//
// Readonly<T>：把 T 的所有属性变成只读
// Partial<T>：把 T 的所有属性变成可选
// Required<T>：把 T 的所有可选属性变成必填
// Pick<T, K>：从 T 中挑选出 K 这些属性组成新类型
// Omit<T, K>：从 T 中去掉 K 这些属性，剩余的组成新类型

interface Todo {
  id: number
  title: string
  content: string
  status: 'pending' | 'done'
}

// Readonly：所有属性只读
type ReadonlyTodo = Readonly<Todo>

// Partial：所有属性可选（常用于更新场景）
type PartialTodo = Partial<Todo>

// Pick：只保留指定属性
type TodoPreview = Pick<Todo, 'id' | 'title'>

// Omit：去掉指定属性
type TodoWithoutId = Omit<Todo, 'id'>

const readonlyCode = `// TypeScript 内置的工具类型：

// Readonly<T>：所有属性变只读
type ReadonlyTodo = Readonly<Todo>
// = { readonly id: number; readonly title: string; ... }

// Partial<T>：所有属性变可选（常用于表单更新）
type PartialTodo = Partial<Todo>
// = { id?: number; title?: string; ... }
// 实际应用：updateTodo(id, { title: '新标题' }) ← 只更新 title

// Required<T>：所有可选属性变必填（反向操作）
type RequiredTodo = Required<Todo>

// Pick<T, K>：从 T 中挑选 K 属性
type TodoPreview = Pick<Todo, 'id' | 'title'>
// = { id: number; title: string }

// Omit<T, K>：从 T 中去掉 K 属性
type TodoWithoutId = Omit<Todo, 'id'>
// = { title: string; content: string; status: ... }

// 组合使用：Partial + Pick（更新场景常用）
function updateTodo(id: number, patch: Partial<Pick<Todo, 'title' | 'status'>>) {
  // 只允许更新 title 和 status
}`

// ====== 10. 同态与非同态映射类型（新增） ======
// 概念解释：映射类型分为两种
//   同态（homomorphic）：映射过程保留原始类型的结构（用于 object）
//   非同态：完全生成新类型（用于 tuple/function）

const homomorphicCode = `// 同态映射类型：输入 object，输出 object
// Readonly、Partial、Required、Pick、Omit 都是同态的
// 特点：保留 keyof、继承原始类型的属性修饰符（readonly/?）

// 非同态映射类型：输入任何类型，输出 object
type StringKeys<T> = { [K in keyof T]: string }
// 特点：不继承 readonly 和 ?

// 示例对比：
type ReadonlyPoint = Readonly<{ x: number; y: number }>
// = { readonly x: number; readonly y: number }  ← 保留了 readonly

type CustomReadonly<T> = { readonly [K in keyof T]: T[K] }
// = { readonly [K in keyof T]: T[K] }  ← 手动加了 readonly

// keyof 操作符：获取对象所有属性名的联合类型
interface Person { name: string; age: number }
keyof Person  // → 'name' | 'age'

// [K in keyof T]：遍历所有属性
type PartialPerson = { [K in keyof Person]?: Person[K] }
// 逐个属性遍历，每个属性变可选，值类型保持不变`

// ====== 11. 接口实战：API 类型定义（新增） ======
// 展示在实际项目中如何用接口组织类型

interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

interface UserProfile {
  id: number
  name: string
  avatar: string
  role: 'admin' | 'editor' | 'viewer'
  createdAt: string
}

interface PaginationInfo {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// 分页列表的响应类型
type UserListResponse = ApiResponse<{
  list: UserProfile[]
  pagination: PaginationInfo
}>

const practicalCode = `// ===== 实际项目中的接口组织 =====

// 1️⃣ 统一 API 响应格式（泛型）
interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

// 2️⃣ 业务实体定义
interface UserProfile {
  id: number
  name: string
  avatar: string
  role: 'admin' | 'editor' | 'viewer'
}

// 3️⃣ 分页信息
interface PaginationInfo {
  page: number
  pageSize: number
  total: number
}

// 4️⃣ 组合成具体接口的响应
type UserListResponse = ApiResponse<{
  list: UserProfile[]
  pagination: PaginationInfo
}>

// 5️⃣ 使用时类型自动推断
async function getUserList() {
  const res: UserListResponse = await fetch('/api/users')
  res.data.list[0].name     // ✅ 自动推断为 string
  res.data.pagination.total  // ✅ 自动推断为 number
  res.data.list[0].role      // ✅ 自动推断为 'admin' | 'editor' | 'viewer'
}`
</script>

<template>
  <div>
    <!-- 开篇：什么是接口 -->
    <section class="demo-section intro-section">
      <h2>📖 什么是接口？为什么需要它？</h2>
      <div class="explain-box">
        <p>
          <strong>一句话解释：</strong>接口（<code>interface</code>）就是<em>对象的形状契约</em>——
          规定一个对象"必须有哪些属性、属性是什么类型"。
        </p>
        <h3>没有接口的痛苦 😫</h3>
        <pre class="code-block">
// JavaScript：对象可以随意添加/缺少属性
const user = { name: '张三', age: 25 }
user.email = 123       // ❌ 不报错，但语义完全错误！
user.nickname           // → undefined（完全不知道少了属性）
// 以上问题在编译时完全不会报错，运行时才发现</pre
        >
        <h3>有了接口之后 😎</h3>
        <pre class="code-block">
// TypeScript：接口定义对象的"合同"
interface User { name: string; age: number; email?: string }

const user: User = { name: '张三', age: 25 }
// user.email = 123    // ❌ 编译错误：number 不能赋值给 string
// const bad: User = { name: '李四' }  // ❌ 缺少必填的 age</pre
        >
        <div class="key-points">
          <p>🔑 <strong>核心要点：</strong></p>
          <ul>
            <li><code>interface</code> 定义对象蓝图；<code>type</code> 定义任意类型别名</li>
            <li><code>readonly</code> 属性创建后不可修改；<code>?</code> 属性为可选</li>
            <li><code>extends</code> 继承父接口；<code>implements</code> 类实现接口</li>
            <li><code>Readonly</code>/<code>Partial</code>/<code>Pick</code>/<code>Omit</code> 是内置工具类型</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 1. 接口基本用法 -->
    <section class="demo-section">
      <h2>1. 接口 (interface) 基本用法</h2>
      <p class="section-desc">
        用 <code>interface</code> 定义对象必须满足的"形状"：
        <strong>必填属性</strong>、<strong>只读属性</strong>（<code>readonly</code>）、
        <strong>可选属性</strong>（<code>?</code>）。
      </p>
      <pre class="code-block">{{ interfaceCode }}</pre>
      <div class="result-box">
        <p><strong>user 实例：</strong></p>
        <p>
          <span class="label">name</span> →
          <code>"{{ user.name }}"</code>
          <span class="type-hint">// 必填属性</span>
        </p>
        <p>
          <span class="label">age</span> →
          <code>{{ user.age }}</code>
          <span class="type-hint">// 必填属性</span>
        </p>
        <p>
          <span class="label">id</span> →
          <code>{{ user.id }}</code>
          <span class="type-hint">// readonly，创建后不可修改</span>
        </p>
        <p>
          <span class="label">email</span> →
          <code>{{ user.email ?? '未设置' }}</code>
          <span class="type-hint">// 可选属性，可以不写</span>
        </p>
        <p class="hint">✅ 创建 user 后再改 email = '...' 是可以的，readonly 只阻止 id</p>
      </div>
    </section>

    <!-- 2. 接口继承 -->
    <section class="demo-section">
      <h2>2. 接口继承 (extends) — 代码复用</h2>
      <p class="section-desc">
        子接口用 <code>extends</code> 继承父接口，自动拥有父接口的所有属性，无需重复定义。
        接口还支持<strong>多继承</strong>（同时继承多个父接口）。
      </p>
      <pre class="code-block">{{ extendsCode }}</pre>
      <div class="result-box">
        <p><strong>dog 实例（继承自 Animal）：</strong></p>
        <p>
          <span class="label">name</span> →
          <code>"{{ dog.name }}"</code>
          <span class="type-hint">// 继承自 Animal</span>
        </p>
        <p>
          <span class="label">breed</span> →
          <code>"{{ dog.breed }}"</code>
          <span class="type-hint">// Dog 自己新增的属性</span>
        </p>
        <p>
          <span class="label">bark()</span> →
          <code>"{{ dog.bark() }}"</code>
          <span class="type-hint">// Dog 自己新增的方法</span>
        </p>
      </div>
    </section>

    <!-- 3. 方法签名 -->
    <section class="demo-section">
      <h2>3. 接口中的方法签名</h2>
      <p class="section-desc">
        接口不仅能定义属性，还能定义方法。<strong>标准写法</strong>
        <code>method(): T</code> 和<strong>箭头写法</strong>
        <code>method: () =&gt; T</code> 两种形式等价。
      </p>
      <pre class="code-block">{{ methodCode }}</pre>
      <div class="result-box">
        <p><strong>calc 实例：</strong></p>
        <p>
          <span class="label">calc.name</span> →
          <code>"{{ calc.name }}"</code>
          <span class="type-hint">// 普通属性</span>
        </p>
        <p>
          <span class="label">calc.add(10, 5)</span> →
          <code>{{ calc.add(10, 5) }}</code>
          <span class="type-hint">// 标准方法签名</span>
        </p>
        <p>
          <span class="label">calc.multiply(10, 5)</span> →
          <code>{{ calc.multiply(10, 5) }}</code>
          <span class="type-hint">// 箭头函数类型写法</span>
        </p>
      </div>
    </section>

    <!-- 4. 类型别名 -->
    <section class="demo-section">
      <h2>4. 类型别名 (type) — 更灵活的命名方式</h2>
      <p class="section-desc">
        <code>type</code> 可以给<strong>任意类型</strong>起别名，包括联合类型、元组、函数类型。
        最适合的场景：<strong>给复杂类型一个简短的名字</strong>。
      </p>
      <pre class="code-block">{{ typeAliasCode }}</pre>
      <div class="result-box">
        <p><strong>point 实例：</strong></p>
        <p>
          <span class="label">Point</span> →
          <code>{ x: {{ point.x }}, y: {{ point.y }} }</code>
          <span class="type-hint">// 对象类型别名</span>
        </p>
        <p>
          <span class="label">typeof point</span> →
          <code>{ x: number; y: number }</code>
          <span class="type-hint">// type Point 的实际类型</span>
        </p>
      </div>
    </section>

    <!-- 5. interface vs type -->
    <section class="demo-section">
      <h2>5. interface vs type — 何时选哪个？</h2>
      <p class="section-desc">
        两者都能定义对象类型，但各有优势。经验法则：
        <strong>对象/类契约 → interface</strong>；<strong>联合/元组/映射 → type</strong>。
      </p>
      <pre class="code-block">{{ compareCode }}</pre>
      <table class="compare-table">
        <thead>
          <tr>
            <th>特性</th>
            <th>interface</th>
            <th>type</th>
            <th>选谁</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>声明合并</td>
            <td>✅ 支持同名自动合并</td>
            <td>❌ 重复报错</td>
            <td><strong>interface</strong></td>
          </tr>
          <tr>
            <td>对象类型</td>
            <td>✅ 语义清晰</td>
            <td>✅ 功能相同</td>
            <td><strong>interface</strong></td>
          </tr>
          <tr>
            <td>联合类型</td>
            <td>❌ 不支持</td>
            <td>✅ <code>'a' | 'b' | 'c'</code></td>
            <td><strong>type</strong></td>
          </tr>
          <tr>
            <td>元组</td>
            <td>❌ 不支持</td>
            <td>✅ <code>[string, number]</code></td>
            <td><strong>type</strong></td>
          </tr>
          <tr>
            <td>映射类型</td>
            <td>❌ 不支持</td>
            <td>✅ <code>Partial&lt;T&gt;</code></td>
            <td><strong>type</strong></td>
          </tr>
          <tr>
            <td>extends 继承</td>
            <td>✅ 语义清晰</td>
            <td>✅ 用 <code>&amp;</code> 交叉</td>
            <td><strong>interface</strong></td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- 6. 索引签名 -->
    <section class="demo-section">
      <h2>6. 索引签名 — 动态属性名</h2>
      <p class="section-desc">
        当对象的属性名不确定，但属性值类型一致时，用<strong>索引签名</strong>
        <code>[key: string]: T</code> 表示"任意字符串 key，对应 T 类型 value"。
      </p>
      <pre class="code-block">{{ indexCode }}</pre>
      <div class="result-box">
        <p><strong>map 实例（StringMap）：</strong></p>
        <p v-for="(value, key) in map" :key="key">
          <span class="label">map['{{ key }}']</span> →
          <code>"{{ value }}"</code>
        </p>
        <p class="hint">✅ 动态添加任意属性都合法：map['新key'] = '新值'</p>
      </div>
    </section>

    <!-- 7. 函数接口 -->
    <section class="demo-section">
      <h2>7. 函数接口 &amp; 构造函数接口</h2>
      <p class="section-desc">
        <strong>调用签名</strong>：描述"可调用的对象"（像函数一样调用，也有属性）。<br />
        <strong>构造函数签名</strong>：描述"可以用 <code>new</code> 创建实例"的对象。
      </p>
      <pre class="code-block">{{ fnInterfaceCode }}</pre>
      <div class="result-box">
        <p>
          <span class="label">createAnimal(Cat, '咪咪').name</span> →
          <code>"{{ createAnimal(Cat, '咪咪').name }}"</code>
          <span class="type-hint">// 传入构造函数，返回实例</span>
        </p>
      </div>
    </section>

    <!-- 8. 类实现接口 -->
    <section class="demo-section">
      <h2>8. 类实现接口 (implements)</h2>
      <p class="section-desc">
        <code>implements</code> 让类"承诺"实现某个接口的所有必填成员。
        一个类可以同时实现多个接口（用逗号分隔）。
      </p>
      <pre class="code-block">{{ implCode }}</pre>
      <div class="result-box">
        <p><strong>Engineer 类 vs Manager 类：</strong></p>
        <p>
          <span class="label">Engineer.work()</span> →
          <code>写代码...</code>
          <span class="type-hint">// 不实现可选方法 onVacation</span>
        </p>
        <p>
          <span class="label">Manager.work()</span> →
          <code>开会...</code>
          <span class="type-hint">// 实现了可选方法 onVacation</span>
        </p>
        <p class="hint">✅ optional 方法可以不实现；必填方法/属性不实现则编译错误</p>
      </div>
    </section>

    <!-- 9. 工具类型 -->
    <section class="demo-section">
      <h2>9. 内置工具类型 — Readonly / Partial / Pick / Omit</h2>
      <p class="section-desc">
        TypeScript 内置的工具类型用于<strong>从已有类型派生新类型</strong>，
        是日常开发中最常用的类型操作。
      </p>
      <pre class="code-block">{{ readonlyCode }}</pre>
      <div class="result-box">
        <p><strong>基于 Todo 派生的各种类型：</strong></p>
        <p>
          <span class="label">Readonly&lt;Todo&gt;</span> →
          <code>所有属性 readonly</code>
          <span class="type-hint">// 创建后不可修改</span>
        </p>
        <p>
          <span class="label">Partial&lt;Todo&gt;</span> →
          <code>所有属性可选</code>
          <span class="type-hint">// 用于更新场景（只传想改的字段）</span>
        </p>
        <p>
          <span class="label">Pick&lt;Todo, 'id'|'title'&gt;</span> →
          <code>{ id, title }</code>
          <span class="type-hint">// 只保留指定属性</span>
        </p>
        <p>
          <span class="label">Omit&lt;Todo, 'id'&gt;</span> →
          <code>{ title, content, status }</code>
          <span class="type-hint">// 去掉指定属性</span>
        </p>
      </div>
    </section>

    <!-- 10. 同态映射类型 -->
    <section class="demo-section">
      <h2>10. 映射类型 &amp; keyof — 类型级别的循环</h2>
      <p class="section-desc">
        <code>keyof T</code> 获取对象所有属性名；<code>[K in keyof T]</code>
        遍历所有属性。这两个操作符组合起来就能实现类型级别的"循环"。
      </p>
      <pre class="code-block">{{ homomorphicCode }}</pre>
      <div class="result-box">
        <p>
          <span class="label">keyof Person</span> →
          <code>'name' | 'age'</code>
          <span class="type-hint">// 所有属性名的联合类型</span>
        </p>
        <p>
          <span class="label">[K in keyof Person]?</span> →
          <code>{ name?: string; age?: number }</code>
          <span class="type-hint">// 每个属性都变成可选</span>
        </p>
        <p class="hint">✅ keyof + in = "遍历所有属性名"，是实现 Partial/Readonly 的底层原理</p>
      </div>
    </section>

    <!-- 11. 实战 -->
    <section class="demo-section">
      <h2>11. 实战：API 类型定义模板</h2>
      <p class="section-desc">
        展示真实项目中如何用接口组织 API 类型：
        <strong>统一响应格式</strong>（泛型）+ <strong>业务实体</strong> + <strong>组合派生</strong>。
      </p>
      <pre class="code-block">{{ practicalCode }}</pre>
      <div class="result-box">
        <p><strong>ApiResponse&lt;T&gt; 的优势：</strong></p>
        <p>
          <span class="label">data.list[0].name</span> →
          <code>string ✅</code>
          <span class="type-hint">// 自动推断，不需要手动写类型</span>
        </p>
        <p>
          <span class="label">data.list[0].role</span> →
          <code>'admin' | 'editor' | 'viewer' ✅</code>
          <span class="type-hint">// 联合类型自动保留</span>
        </p>
        <p class="hint">✅ 定义一次 ApiResponse&lt;T&gt;，所有 API 响应都复用，code/message/data 结构一致</p>
      </div>
    </section>

    <!-- 总结 -->
    <section class="demo-section summary-section">
      <h2>📋 接口 &amp; 类型别名速查表</h2>
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
            <td><code>interface A { x: T }</code></td>
            <td>定义接口 A</td>
            <td>"A 的形状是 { x: T }"</td>
          </tr>
          <tr>
            <td><code>readonly x: T</code></td>
            <td>只读属性</td>
            <td>"创建后不可修改"</td>
          </tr>
          <tr>
            <td><code>x?: T</code></td>
            <td>可选属性</td>
            <td>"可以没有这个属性"</td>
          </tr>
          <tr>
            <td><code>interface B extends A</code></td>
            <td>接口继承</td>
            <td>"B 拥有 A 的所有属性"</td>
          </tr>
          <tr>
            <td><code>class C implements A</code></td>
            <td>类实现接口</td>
            <td>"C 必须实现 A 的所有成员"</td>
          </tr>
          <tr>
            <td><code>type X = A &amp; B</code></td>
            <td>交叉类型</td>
            <td>"X 同时是 A 和 B"</td>
          </tr>
          <tr>
            <td><code>[key: string]: T</code></td>
            <td>索引签名</td>
            <td>"任意字符串 key，值是 T"</td>
          </tr>
          <tr>
            <td><code>Readonly&lt;T&gt;</code></td>
            <td>工具类型</td>
            <td>"T 所有属性变只读"</td>
          </tr>
          <tr>
            <td><code>Partial&lt;T&gt;</code></td>
            <td>工具类型</td>
            <td>"T 所有属性变可选"</td>
          </tr>
          <tr>
            <td><code>Pick&lt;T, K&gt;</code></td>
            <td>工具类型</td>
            <td>"从 T 中挑出 K 属性"</td>
          </tr>
          <tr>
            <td><code>Omit&lt;T, K&gt;</code></td>
            <td>工具类型</td>
            <td>"从 T 中去掉 K 属性"</td>
          </tr>
          <tr>
            <td><code>keyof T</code></td>
            <td>操作符</td>
            <td>"T 的所有属性名"</td>
          </tr>
          <tr>
            <td><code>[K in keyof T]: T[K]</code></td>
            <td>映射类型</td>
            <td>"遍历 T 的每个属性"</td>
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
  min-width: 240px;
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

/* ===== 对比表格 ===== */
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
