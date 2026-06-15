<script setup lang="ts">
import { reactive, shallowRef, computed } from 'vue'

// ================================================================
// 1. 基本类 — 类比：类 = 蓝图，实例 = 按蓝图造出的东西
// ================================================================
class Animal {
  // 成员属性声明（TS 必须先声明，再在 constructor 中赋值）
  name: string
  private _age: number
  protected species: string

  // constructor：创建实例时自动调用，相当于"出生时初始化"
  constructor(name: string, age: number) {
    this.name = name
    this._age = age
    this.species = '未知'
  }

  // getter：像属性一样访问，但背后有计算逻辑
  get age(): number {
    return this._age
  }

  // setter：赋值时触发校验，防止非法数据进入
  set age(value: number) {
    if (value < 0) throw new Error('年龄不能为负')
    this._age = value
  }

  // 普通方法：类的能力/行为
  move(distance: number): string {
    return `${this.name} 移动了 ${distance} 米`
  }
}

const cat = new Animal('小花', 3)
const dog = new Animal('旺财', 2)

// 交互：修改动物年龄
const animalState = reactive({
  selectedAnimal: 'cat',
  newAge: 3,
  feedback: '',
})

const selectedAnimal = computed(() => (animalState.selectedAnimal === 'cat' ? cat : dog))

function updateAge() {
  try {
    selectedAnimal.value.age = animalState.newAge
    animalState.feedback = `✅ 已将 ${selectedAnimal.value.name} 的年龄设置为 ${animalState.newAge}`
  } catch (e: unknown) {
    animalState.feedback = `❌ ${e instanceof Error ? e.message : '未知错误'}`
  }
}

const basicClassCode = `// 类 = 创建对象的蓝图
class Animal {
  name: string              // 公开属性
  private _age: number      // 私有属性（约定用 _ 前缀）
  protected species: string // 受保护属性（子类可见）

  constructor(name: string, age: number) {
    this.name = name        // ← 外部可读写
    this._age = age         // ← 只有类内部能访问
    this.species = '未知'
  }

  get age(): number {       // getter：访问 age 时自动调用
    return this._age
  }
  set age(value: number) {  // setter：给 age 赋值时自动调用
    if (value < 0) throw new Error('年龄不能为负')
    this._age = value
  }

  move(distance: number): string {
    return \`\${this.name} 移动了 \${distance} 米\`
  }
}

// 创建实例（实例化）
const cat = new Animal('小花', 3)
cat.move(10)  // "小花 移动了 10 米"
cat.age       // 3（通过 getter 读取）`

// ================================================================
// 2. 继承 — extends：子类自动获得父类的一切
// ================================================================
class Dog extends Animal {
  breed: string

  constructor(name: string, age: number, breed: string) {
    super(name, age) // super() 必须先调用父类 constructor
    this.breed = breed
  }

  // 重写（override）父类方法
  move(distance: number): string {
    return `🐕 ${this.name}(品种:${this.breed}) 奔跑 ${distance} 米`
  }

  bark(): string {
    return `${this.name}: 汪汪！`
  }
}

const husky = new Dog('二哈', 2, '哈士奇')

const extendsCode = `// extends = 继承父类所有属性和方法
class Dog extends Animal {
  breed: string  // 子类可以有自己的属性

  constructor(name: string, age: number, breed: string) {
    super(name, age)           // ⚠️ 必须先调用 super()
    this.breed = breed
  }

  // 重写（override）父类方法 — 多态
  move(distance: number): string {
    return \`🐕 \${this.name} 奔跑 \${distance} 米\`
  }

  // 子类可以新增方法
  bark(): string { return '汪汪！' }
}

const dog = new Dog('二哈', 2, '哈士奇')
dog.move(10)    // "🐕 二哈 奔跑 10 米"（调用了重写版本）
dog.bark()      // "二哈: 汪汪！"
dog.age         // 2（继承自父类的 getter）`

// ================================================================
// 3. 抽象类 — abstract：只定义"该做什么"，不实现"怎么做"
// ================================================================
abstract class Shape {
  // abstract 方法：没有函数体，子类必须实现
  abstract getArea(): number

  // 普通方法：有默认实现，子类可直接用
  describe(): string {
    return `面积: ${this.getArea().toFixed(2)}`
  }
}

class Circle extends Shape {
  // 参数前加访问修饰符 = 自动声明属性 + 赋值（简写）
  constructor(private radius: number) {
    super()
  }

  getArea(): number {
    return Math.PI * this.radius ** 2
  }
}

class Rectangle extends Shape {
  constructor(
    private width: number,
    private height: number,
  ) {
    super()
  }

  getArea(): number {
    return this.width * this.height
  }
}

class Triangle extends Shape {
  constructor(
    private base: number,
    private height: number,
  ) {
    super()
  }

  getArea(): number {
    return (this.base * this.height) / 2
  }
}

const circle = new Circle(5)
const rect = new Rectangle(10, 6)
const triangle = new Triangle(8, 4)

const abstractCode = `// abstract class = 模板类，不能直接 new
abstract class Shape {
  abstract getArea(): number   // ← 强制子类实现

  describe(): string {         // ← 共享方法（所有形状都有）
    return \`面积: \${this.getArea().toFixed(2)}\`
  }
}

// 子类各自实现自己的面积公式
class Circle extends Shape {
  constructor(private radius: number) { super() }
  getArea(): number { return Math.PI * this.radius ** 2 }
}

class Rectangle extends Shape {
  constructor(private w: number, private h: number) { super() }
  getArea(): number { return this.w * this.h }
}

// 真实场景：遍历不同形状，统一调用 getArea()
const shapes: Shape[] = [new Circle(5), new Rectangle(10, 6)]
shapes.forEach(s => console.log(s.describe()))
// "面积: 78.54"
// "面积: 60.00"

// ❌ const s = new Shape()  // 抽象类不能实例化`

// ================================================================
// 4. implements — 接口约束类"必须有什么能力"
// ================================================================
interface Flyable {
  fly(): string
}

interface Swimmable {
  swim(): string
}

// 类可以实现多个接口（TS 支持多接口）
class Duck implements Flyable, Swimmable {
  fly(): string {
    return '🦆 鸭子飞起来了！'
  }

  swim(): string {
    return '🦆 鸭子在游泳～'
  }

  // 还可以有自己的方法
  quack(): string {
    return '嘎嘎嘎！'
  }
}

class Fish implements Swimmable {
  swim(): string {
    return '🐟 鱼儿游来游去～'
  }
}

class Eagle implements Flyable {
  fly(): string {
    return '🦅 老鹰翱翔天空！'
  }
}

const duck = new Duck()
const fish = new Fish()
const eagle = new Eagle()

const implementsCode = `// interface = 能力契约："实现我的类必须有这些方法"
interface Flyable {
  fly(): string
}
interface Swimmable {
  swim(): string
}

// 一个类可以实现多个接口（弥补单继承的限制）
class Duck implements Flyable, Swimmable {
  fly(): string  { return '飞起来了！' }
  swim(): string { return '在游泳～' }
  quack(): string { return '嘎嘎！' }  // 还可以有自己的方法
}

// extends vs implements 的区别：
// extends: "是一个..."（Dog 是一个 Animal）
// implements: "能做什么..."（Duck 能飞 + 能游）

// 使用示例：函数接受"能飞的东西"
function startFly(target: Flyable) {
  console.log(target.fly())
}
startFly(new Duck())   // ✅
startFly(new Eagle())  // ✅
// startFly(new Fish()) // ❌ Fish 没有实现 Flyable`

// ================================================================
// 5. 访问修饰符 — 控制谁能看到/修改属性
// ================================================================
class BankAccount {
  public accountName: string // 任何人都能看
  private _balance: number // 只有本类能改
  protected _accountType: string // 本类 + 子类能看
  readonly accountId: string // 一旦赋值就不能改

  constructor(name: string, id: string, balance: number) {
    this.accountName = name
    this.accountId = id
    this._balance = balance
    this._accountType = '储蓄账户'
  }

  // 对外暴露安全的操作接口
  deposit(amount: number): string {
    if (amount <= 0) return '❌ 存款金额必须大于 0'
    this._balance += amount
    return `✅ 存入 ¥${amount}，余额 ¥${this._balance}`
  }

  withdraw(amount: number): string {
    if (amount <= 0) return '❌ 取款金额必须大于 0'
    if (amount > this._balance) return '❌ 余额不足'
    this._balance -= amount
    return `✅ 取出 ¥${amount}，余额 ¥${this._balance}`
  }

  get balance(): number {
    return this._balance
  }
}

class VipAccount extends BankAccount {
  private discountRate = 0.9

  constructor(name: string, id: string, balance: number) {
    super(name, id, balance)
    // this._accountType = 'VIP账户'  // ✅ protected 在子类中可访问
  }

  override deposit(amount: number): string {
    // VIP 存款有额外优惠
    return super.deposit(amount) + ` (VIP 权益已生效)`
  }
}

const myAccount = reactive(new BankAccount('张三', '6222-0001', 1000))
const vipAccount = new VipAccount('李四', '6222-8888', 5000)

const accountFeedback = shallowRef('')
const accountFeedbackVip = shallowRef('')

function depositAction(account: BankAccount, amount: number) {
  accountFeedback.value = account.deposit(amount)
}
function withdrawAction(account: BankAccount, amount: number) {
  accountFeedback.value = account.withdraw(amount)
}

function depositActionVip(account: VipAccount, amount: number) {
  accountFeedbackVip.value = account.deposit(amount)
}
function withdrawActionVip(account: VipAccount, amount: number) {
  accountFeedbackVip.value = account.withdraw(amount)
}
const modifierCode = `// 访问修饰符：控制属性的可见范围
class BankAccount {
  public accountName: string    // 🌍 任何地方都能访问（默认）
  private _balance: number      // 🔒 只有本类内部能访问
  protected _accountType: string // 🔑 本类 + 子类能访问
  readonly accountId: string    // 📌 只读，初始化后不能改

  constructor(name: string, id: string, balance: number) {
    this.accountName = name
    this.accountId = id
    this._balance = balance
  }

  // 通过方法暴露操作，保护数据安全
  deposit(amount: number): string {
    if (amount <= 0) return '金额无效'
    this._balance += amount
    return \`存入成功，余额: \${this._balance}\`
  }

  get balance(): number { return this._balance }
}

const acc = new BankAccount('张三', '6222', 1000)
acc.accountName    // ✅ public 外部可访问
// acc._balance    // ❌ private 外部不可访问
// acc.accountId = 'xxx' // ❌ readonly 不可重新赋值
acc.deposit(500)   // ✅ 通过方法安全操作`

// ================================================================
// 6. 静态成员 — 属于类本身，不属于实例
// ================================================================
class MathUtils {
  // 静态属性：所有实例共享
  static PI = Math.PI

  // 静态方法：不需要创建实例就能调用
  static add(a: number, b: number): number {
    return a + b
  }

  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value))
  }
}

class Counter {
  private static _count = 0 // 静态私有属性

  static get count(): number {
    return Counter._count
  }

  static increment(): number {
    return ++Counter._count
  }
}

const staticCode = `// static = 属于类本身，不属实例
class MathUtils {
  static PI = Math.PI           // 静态属性

  static add(a: number, b: number): number {
    return a + b                // 静态方法
  }

  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value))
  }
}

// 直接用类名调用，不需要 new
MathUtils.PI          // 3.14159...
MathUtils.add(1, 2)   // 3

// 实际应用：计数器
class Counter {
  private static _count = 0
  static get count() { return Counter._count }
  static increment() { return ++Counter._count }
}
Counter.increment() // 1
Counter.increment() // 2

// 对比：实例属性 vs 静态属性
class Demo {
  instanceValue = 0          // 每个实例各自拥有
  static sharedValue = 0     // 所有实例共享一份
}
const a = new Demo(), b = new Demo()
a.instanceValue = 5          // 只改 a 的
Demo.sharedValue = 10        // 所有实例都看到 10`
</script>

<template>
  <div class="class-demo-page">
    <header class="page-header">
      <h1>TypeScript 类 (Class)</h1>
      <p class="page-subtitle">
        类是面向对象编程的核心。把它想象成
        <strong>创建对象的蓝图</strong>——你定义一次，就能创建无数个相似的实例。
      </p>
    </header>

    <!-- ==================== 1. 基本类 ==================== -->
    <section class="demo-section">
      <h2 class="section-title">1. 基本类 <span class="badge">class</span></h2>
      <p class="section-desc">
        一个类包含 <strong>属性</strong>（数据）和 <strong>方法</strong>（行为）。
        <code class="inline-code">constructor</code> 在
        <code class="inline-code">new</code> 时自动执行，
        <code class="inline-code">get/set</code> 让你像访问属性一样触发逻辑。
      </p>
      <pre class="code-block">{{ basicClassCode }}</pre>

      <!-- 实例展示 -->
      <div class="result-box">
        <p class="result-title">🐱 当前实例</p>
        <p class="result-text">
          <code class="inline-code">const cat = new Animal('小花', 3)</code>
        </p>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">name (public)</span>
            <span class="info-value">{{ cat.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">age (getter)</span>
            <span class="info-value">{{ cat.age }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">move(10)</span>
            <span class="info-value">{{ cat.move(10) }}</span>
          </div>
        </div>
      </div>

      <!-- 交互：修改年龄 -->
      <div class="result-box interactive">
        <p class="result-title">🛠️ 交互：测试 getter/setter</p>
        <div class="input-group">
          <select v-model="animalState.selectedAnimal" class="text-input" style="flex: 0 0 120px">
            <option value="cat">小花 (cat)</option>
            <option value="dog">旺财 (dog)</option>
          </select>
          <span class="info-label" style="display: flex; align-items: center; padding: 0 4px"
            >当前年龄: {{ selectedAnimal.age }}</span
          >
          <input
            v-model.number="animalState.newAge"
            class="text-input"
            type="number"
            placeholder="输入新年龄..."
            @keyup.enter="updateAge"
          />
          <button class="demo-btn demo-btn-primary" @click="updateAge">更新年龄</button>
        </div>
        <p class="result-text feedback" v-if="animalState.feedback">{{ animalState.feedback }}</p>
      </div>
    </section>

    <!-- ==================== 2. 继承 ==================== -->
    <section class="demo-section">
      <h2 class="section-title">2. 继承 <span class="badge">extends</span></h2>
      <p class="section-desc">
        <code class="inline-code">extends</code> 让子类获得父类的所有属性和方法，
        还可以<strong>重写（override）</strong>父类方法实现多态。
        <code class="inline-code">super()</code> 必须先调用，才能使用
        <code class="inline-code">this</code>。
      </p>
      <pre class="code-block">{{ extendsCode }}</pre>

      <div class="result-box">
        <p class="result-title">🐕 继承演示：Dog extends Animal</p>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">name (继承自父类)</span>
            <span class="info-value">{{ husky.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">breed (子类新增)</span>
            <span class="info-value">{{ husky.breed }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">move(10) (重写版本)</span>
            <span class="info-value">{{ husky.move(10) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">bark() (子类新增)</span>
            <span class="info-value">{{ husky.bark() }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 3. 抽象类 ==================== -->
    <section class="demo-section">
      <h2 class="section-title">3. 抽象类 <span class="badge">abstract</span></h2>
      <p class="section-desc">
        抽象类不能直接 <code class="inline-code">new</code>，它的作用是
        <strong>定义子类必须遵守的模板</strong>。<code class="inline-code">abstract</code>
        方法没有函数体，子类<strong>必须实现</strong>。
      </p>
      <pre class="code-block">{{ abstractCode }}</pre>

      <div class="result-box">
        <p class="result-title">📐 三种形状 — 统一接口，各自实现</p>
        <div class="shape-cards">
          <div class="shape-card">
            <span class="shape-icon">⭕</span>
            <span class="shape-name">Circle (r=5)</span>
            <span class="shape-value">{{ circle.describe() }}</span>
          </div>
          <div class="shape-card">
            <span class="shape-icon">⬜</span>
            <span class="shape-name">Rectangle (10×6)</span>
            <span class="shape-value">{{ rect.describe() }}</span>
          </div>
          <div class="shape-card">
            <span class="shape-icon">🔺</span>
            <span class="shape-name">Triangle (8×4)</span>
            <span class="shape-value">{{ triangle.describe() }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 4. implements ==================== -->
    <section class="demo-section">
      <h2 class="section-title">4. implements 实现接口 <span class="badge">implements</span></h2>
      <p class="section-desc">
        <code class="inline-code">implements</code>
        让类承诺"我有这些能力"。一个类可以实现<strong>多个接口</strong>， 弥补了 TypeScript
        只能单继承的限制。把接口理解成<strong>"能做什么"的契约</strong>。
      </p>
      <pre class="code-block">{{ implementsCode }}</pre>

      <div class="result-box">
        <p class="result-title">🎯 接口 = 能力标签</p>
        <div class="capability-table">
          <div class="capability-row cap-header">
            <span class="cap-cell cap-name">类</span>
            <span class="cap-cell cap-tag">能飞 Flyable</span>
            <span class="cap-cell cap-tag">能游 Swimmable</span>
          </div>
          <div class="capability-row">
            <span class="cap-cell cap-name">🦆 Duck</span>
            <span class="cap-cell cap-tag">✅ {{ duck.fly() }}</span>
            <span class="cap-cell cap-tag">✅ {{ duck.swim() }}</span>
          </div>
          <div class="capability-row">
            <span class="cap-cell cap-name">🦅 Eagle</span>
            <span class="cap-cell cap-tag">✅ {{ eagle.fly() }}</span>
            <span class="cap-cell cap-tag">❌ 未实现</span>
          </div>
          <div class="capability-row">
            <span class="cap-cell cap-name">🐟 Fish</span>
            <span class="cap-cell cap-tag">❌ 未实现</span>
            <span class="cap-cell cap-tag">✅ {{ fish.swim() }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 5. 访问修饰符 ==================== -->
    <section class="demo-section">
      <h2 class="section-title">
        5. 访问修饰符 <span class="badge">public/private/protected</span>
      </h2>
      <p class="section-desc">
        用<strong>真实的银行账户</strong>例子理解修饰符：余额不能让外界直接改（private）， 必须通过
        deposit/withdraw 方法操作（封装）。这叫做<strong>"数据保护"</strong>。
      </p>
      <pre class="code-block">{{ modifierCode }}</pre>

      <!-- 权限表 -->
      <table class="modifier-table">
        <thead>
          <tr>
            <th>修饰符</th>
            <th>含义</th>
            <th>类内部</th>
            <th>子类</th>
            <th>外部</th>
            <th>类比</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="mod-name">public</td>
            <td>公开（默认）</td>
            <td>✅</td>
            <td>✅</td>
            <td>✅</td>
            <td>🌍 所有人都能看到</td>
          </tr>
          <tr>
            <td class="mod-name">protected</td>
            <td>受保护</td>
            <td>✅</td>
            <td>✅</td>
            <td>❌</td>
            <td>🔑 家庭成员可见</td>
          </tr>
          <tr>
            <td class="mod-name">private</td>
            <td>私有</td>
            <td>✅</td>
            <td>❌</td>
            <td>❌</td>
            <td>🔒 只有自己知道</td>
          </tr>
          <tr>
            <td class="mod-name">readonly</td>
            <td colspan="4">只读 — 只能在声明时或 constructor 中赋值</td>
            <td>📌 刻在石头上的字</td>
          </tr>
        </tbody>
      </table>

      <!-- 交互：银行操作 -->
      <div class="result-box interactive">
        <p class="result-title">🏦 交互：银行账户操作</p>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">账户名 (public)</span>
            <span class="info-value">{{ myAccount.accountName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">账号 (readonly)</span>
            <span class="info-value">{{ myAccount.accountId }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">余额 (private，通过 getter)</span>
            <span class="info-value">¥{{ myAccount.balance }}</span>
          </div>
        </div>
        <div class="btn-group" style="margin-top: 12px">
          <button class="demo-btn" @click="depositAction(myAccount, 500)">存入 ¥500</button>
          <button class="demo-btn" @click="withdrawAction(myAccount, 200)">取出 ¥200</button>
          <button class="demo-btn demo-btn-danger" @click="withdrawAction(myAccount, 9999)">
            尝试取出 ¥9999（余额不足）
          </button>
        </div>
        <p class="result-text feedback" v-if="accountFeedback">{{ accountFeedback }}</p>
      </div>
      <div class="result-box interactive">
        <p class="result-title">🏦 交互：银行账户操作-VIP</p>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">账户名 (public)</span>
            <span class="info-value">{{ vipAccount.accountName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">账号 (readonly)</span>
            <span class="info-value">{{ vipAccount.accountId }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">余额 (private，通过 getter)</span>
            <span class="info-value">¥{{ vipAccount.balance }}</span>
          </div>
        </div>
        <div class="btn-group" style="margin-top: 12px">
          <button class="demo-btn" @click="depositActionVip(vipAccount, 500)">存入 ¥500</button>
          <button class="demo-btn" @click="withdrawActionVip(vipAccount, 200)">取出 ¥200</button>
          <button class="demo-btn demo-btn-danger" @click="withdrawActionVip(vipAccount, 9999)">
            尝试取出 ¥9999（余额不足）
          </button>
        </div>
        <p class="result-text feedback" v-if="accountFeedbackVip">{{ accountFeedbackVip }}</p>
      </div>
    </section>

    <!-- ==================== 6. 静态成员 ==================== -->
    <section class="demo-section">
      <h2 class="section-title">6. 静态成员 <span class="badge">static</span></h2>
      <p class="section-desc">
        <code class="inline-code">static</code> 成员<strong>属于类本身</strong>，不属于实例。不需要
        <code class="inline-code">new</code> 就能调用。
        适合放工具函数、常量、全局计数器等"和具体对象无关"的东西。
      </p>
      <pre class="code-block">{{ staticCode }}</pre>

      <div class="result-box">
        <p class="result-title">🧮 静态方法演示</p>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">MathUtils.PI</span>
            <span class="info-value">{{ MathUtils.PI }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">MathUtils.add(1, 2)</span>
            <span class="info-value">{{ MathUtils.add(1, 2) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">MathUtils.clamp(15, 0, 10)</span>
            <span class="info-value">{{ MathUtils.clamp(15, 0, 10) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 总结对比 ==================== -->
    <section class="demo-section summary-section">
      <h2 class="section-title">📋 核心概念对比</h2>
      <table class="modifier-table">
        <thead>
          <tr>
            <th>关键字</th>
            <th>作用</th>
            <th>通俗理解</th>
            <th>使用场景</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="mod-name">class</td>
            <td>定义类</td>
            <td>创建对象的蓝图</td>
            <td>封装数据 + 行为</td>
          </tr>
          <tr>
            <td class="mod-name">extends</td>
            <td>继承</td>
            <td>子承父业，还能创新</td>
            <td>复用代码 + 多态</td>
          </tr>
          <tr>
            <td class="mod-name">abstract</td>
            <td>抽象类/方法</td>
            <td>定规矩，不干活</td>
            <td>强制子类实现</td>
          </tr>
          <tr>
            <td class="mod-name">implements</td>
            <td>实现接口</td>
            <td>签合同，保证会做</td>
            <td>多能力组合</td>
          </tr>
          <tr>
            <td class="mod-name">super()</td>
            <td>调用父类</td>
            <td>先有父亲，才有孩子</td>
            <td>子类 constructor 首行</td>
          </tr>
          <tr>
            <td class="mod-name">static</td>
            <td>静态成员</td>
            <td>属于类，不属对象</td>
            <td>工具函数、常量</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
/* ===== 页面布局 ===== */
.class-demo-page {
  max-width: 960px;
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
  max-width: 680px;
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
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.result-text {
  margin: 4px 0;
  font-size: 14px;
  color: #444;
  line-height: 1.6;
}

.result-text.feedback {
  margin-top: 10px;
  padding: 8px 12px;
  background: #fefcbf;
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
  color: #744210;
}

/* ===== 信息网格 ===== */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  background: #fafbfc;
  border-radius: 6px;
  border: 1px solid #edf2f7;
}

.info-label {
  font-size: 12px;
  color: #888;
  margin-bottom: 2px;
}

.info-value {
  font-size: 14px;
  color: #1a1a2e;
  font-family: monospace;
  font-weight: 500;
}

/* ===== 形状卡片 ===== */
.shape-cards {
  display: flex;
  gap: 12px;
}

.shape-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 10px;
  background: #fafbfc;
  border-radius: 8px;
  border: 1px solid #edf2f7;
  text-align: center;
}

.shape-icon {
  font-size: 28px;
  margin-bottom: 4px;
}

.shape-name {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.shape-value {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  font-family: monospace;
}

/* ===== 能力表格 ===== */
.capability-table {
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.capability-row {
  display: flex;
}

.capability-row.cap-header {
  background: #f0f4f8;
  font-weight: 600;
  font-size: 13px;
  color: #555;
}

.capability-row:not(:last-child) {
  border-bottom: 1px solid #e2e8f0;
}

.cap-cell {
  padding: 8px 14px;
  font-size: 14px;
}

.cap-name {
  flex: 0 0 120px;
  font-weight: 600;
}

.cap-tag {
  flex: 1;
  font-family: monospace;
  font-size: 13px;
  color: #444;
}

/* ===== 按钮组 ===== */
.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.input-group {
  display: flex;
  gap: 8px;
  align-items: center;
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

/* ===== 修饰符表格 ===== */
.modifier-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-top: 8px;
}

.modifier-table th,
.modifier-table td {
  padding: 10px 14px;
  border: 1px solid #e8e8e8;
  text-align: center;
}

.modifier-table th {
  background: #f0f0f0;
  font-weight: 600;
  color: #444;
}

.modifier-table tr:hover td {
  background: #fafbfc;
}

.mod-name {
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  font-weight: 600;
  color: #c7254e;
}

/* ===== 总结区 ===== */
.summary-section {
  border-left-color: #10b981;
  background: #f0fdf4;
}

.summary-section .section-title {
  color: #065f46;
}

.summary-section .badge {
  background: #d1fae5;
  color: #065f46;
}
</style>
