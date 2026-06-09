<script setup lang="ts">
import { ref } from 'vue'

// ====== 1. 基本类 ======
class Animal {
  name: string
  private _age: number
  protected species: string

  constructor(name: string, age: number) {
    this.name = name
    this._age = age
    this.species = '未知'
  }

  get age(): number {
    return this._age
  }

  set age(value: number) {
    if (value < 0) throw new Error('年龄不能为负')
    this._age = value
  }

  move(distance: number): string {
    return `${this.name} 移动了 ${distance} 米`
  }
}

const cat = new Animal('小花', 3)

const basicClassCode = `class Animal {
  name: string
  private _age: number
  protected species: string

  constructor(name: string, age: number) {
    this.name = name
    this._age = age
    this.species = '未知'
  }

  get age(): number { return this._age }
  set age(value: number) {
    if (value < 0) throw new Error('年龄不能为负')
    this._age = value
  }

  move(distance: number): string {
    return \`\${this.name} 移动了 \${distance} 米\`
  }
}`

// ====== 2. 抽象类 ======
abstract class Shape {
  abstract getArea(): number

  describe(): string {
    return `面积: ${this.getArea().toFixed(2)}`
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super()
  }

  getArea(): number {
    return Math.PI * this.radius ** 2
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super()
  }

  getArea(): number {
    return this.width * this.height
  }
}

const circle = new Circle(5)
const rect = new Rectangle(10, 6)

const abstractCode = `abstract class Shape {
  abstract getArea(): number  // 子类必须实现
  describe(): string {
    return \`面积: \${this.getArea().toFixed(2)}\`
  }
}

class Circle extends Shape {
  constructor(private radius: number) { super() }
  getArea(): number { return Math.PI * this.radius ** 2 }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) { super() }
  getArea(): number { return this.width * this.height }
}`

// ====== 3. implements 实现接口 ======
interface Printable {
  print(): string
}

interface Loggable {
  log(message: string): string
}

class ConsolePrinter implements Printable, Loggable {
  print(): string {
    return '打印中...'
  }

  log(message: string): string {
    return `[LOG] ${message}`
  }
}

const printer = new ConsolePrinter()

const implementsCode = `interface Printable { print(): string }
interface Loggable { log(message: string): string }

class ConsolePrinter implements Printable, Loggable {
  print(): string { return '打印中...' }
  log(message: string): string { return \`[LOG] \${message}\` }
}`

// ====== 4. 访问修饰符 ======
class Example {
  public pub: string = '公开'
  private priv: string = '私有'
  protected prot: string = '受保护'
  readonly ready: boolean = true
}

const modifierCode = `class Example {
  public pub: string = '公开'       // 任何地方可访问
  private priv: string = '私有'     // 仅类内部
  protected prot: string = '受保护'  // 类内部 + 子类
  readonly ready: boolean = true    // 只读
}`
</script>

<template>
  <div>
    <!-- 基本类 -->
    <section class="demo-section">
      <h2>1. 基本类 (getter/setter)</h2>
      <pre class="code-block">{{ basicClassCode }}</pre>
      <div class="result-box">
        <p><strong>cat 实例：</strong></p>
        <p>name: {{ cat.name }} (public)</p>
        <p>age: {{ cat.age }} (getter)</p>
        <p>{{ cat.move(10) }}</p>
        <p class="hint">_age 是 private，外部无法直接访问</p>
      </div>
    </section>

    <!-- 抽象类 -->
    <section class="demo-section">
      <h2>2. 抽象类 (abstract)</h2>
      <pre class="code-block">{{ abstractCode }}</pre>
      <div class="result-box">
        <p><strong>Circle (radius=5):</strong> {{ circle.describe() }}</p>
        <p><strong>Rectangle (10×6):</strong> {{ rect.describe() }}</p>
        <p class="hint">抽象类不能直接实例化，子类必须实现 getArea()</p>
      </div>
    </section>

    <!-- implements -->
    <section class="demo-section">
      <h2>3. implements 实现接口</h2>
      <pre class="code-block">{{ implementsCode }}</pre>
      <div class="result-box">
        <p>printer.print() → "{{ printer.print() }}"</p>
        <p>printer.log('测试') → "{{ printer.log('测试') }}"</p>
        <p class="hint">ConsolePrinter 必须实现 Printable 和 Loggable 的所有方法</p>
      </div>
    </section>

    <!-- 访问修饰符 -->
    <section class="demo-section">
      <h2>4. 访问修饰符</h2>
      <pre class="code-block">{{ modifierCode }}</pre>
      <table class="modifier-table">
        <thead>
          <tr><th>修饰符</th><th>类内部</th><th>子类</th><th>外部</th></tr>
        </thead>
        <tbody>
          <tr><td>public (默认)</td><td>✅</td><td>✅</td><td>✅</td></tr>
          <tr><td>protected</td><td>✅</td><td>✅</td><td>❌</td></tr>
          <tr><td>private</td><td>✅</td><td>❌</td><td>❌</td></tr>
          <tr><td>readonly</td><td colspan="3">只读，只能在声明或构造函数中赋值</td></tr>
        </tbody>
      </table>
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

.modifier-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-top: 8px;
}

.modifier-table th,
.modifier-table td {
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  text-align: center;
}

.modifier-table th {
  background: #f0f0f0;
  font-weight: 600;
}

.modifier-table tr:hover td {
  background: #fafafa;
}
</style>
