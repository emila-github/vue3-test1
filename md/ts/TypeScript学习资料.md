# TypeScript 学习资料

## 目录
- [基础类型](#基础类型)
- [接口与类型别名](#接口与类型别名)
- [函数类型](#函数类型)
- [泛型](#泛型)
- [类与继承](#类与继承)
- [枚举](#枚举)
- [类型操控](#类型操控)
- [模块与命名空间](#模块与命名空间)
- [工具类型](#工具类型)
- [类型守卫与断言](#类型守卫与断言)
- [声明文件](#声明文件)
- [tsconfig 配置](#tsconfig-配置)

---

## 基础类型

### 1. 原始类型

```ts
// 字符串
let str: string = 'Hello TypeScript'

// 数字
let num: number = 42
let float: number = 3.14
let hex: number = 0xff

// 布尔
let isDone: boolean = false

// null 和 undefined
let u: undefined = undefined
let n: null = null

// symbol
let sym: symbol = Symbol('key')

// bigint
let big: bigint = 100n
```

### 2. 数组

```ts
// 两种声明方式
let arr1: number[] = [1, 2, 3]
let arr2: Array<string> = ['a', 'b', 'c']

// 元组：固定长度和类型的数组
let tuple: [string, number] = ['age', 18]

// 只读数组
let readonlyArr: readonly number[] = [1, 2, 3]
// readonlyArr.push(4)  // ❌ 报错
```

### 3. any、unknown、never、void

```ts
// any：关闭类型检查（尽量避免使用）
let anything: any = 'hello'
anything = 123    // ✅ 不会报错
anything.foo()    // ✅ 不会报错（但运行时可能出错）

// unknown：安全的 any（需要类型检查后才能使用）
let unknown: unknown = 'hello'
unknown = 123
// unknown.toFixed()  // ❌ 报错：需要先检查类型
if (typeof unknown === 'number') {
  unknown.toFixed(2)  // ✅ 类型收窄后安全使用
}

// never：表示永远不会发生的类型
function throwError(message: string): never {
  throw new Error(message)
}

function infiniteLoop(): never {
  while (true) {}
}

// void：没有返回值
function log(message: string): void {
  console.log(message)
}
```

### 4. 联合类型与交叉类型

```ts
// 联合类型：可以是多种类型之一
type Status = 'active' | 'inactive' | 'pending'
let status: Status = 'active'

type StringOrNumber = string | number
let id: StringOrNumber = 'abc-123'
id = 456

// 交叉类型：同时满足多种类型
interface HasName { name: string }
interface HasAge { age: number }
type Person = HasName & HasAge

const person: Person = { name: '张三', age: 25 }
```

### 5. 字面量类型

```ts
// 字符串字面量
type Direction = 'up' | 'down' | 'left' | 'right'

// 数字字面量
type DiceValue = 1 | 2 | 3 | 4 | 5 | 6

// 布尔字面量
type TrueType = true

// 模板字面量类型 (TS 4.1+)
type EventName = `on${Capitalize<string>}`
type Greeting = `Hello, ${string}!`
```

---

## 接口与类型别名

### 1. 接口 (interface)

```ts
interface User {
  name: string
  age: number
  readonly id: number        // 只读属性
  email?: string             // 可选属性
}

const user: User = {
  name: '张三',
  age: 25,
  id: 1,
}

// user.id = 2  // ❌ 报错：只读属性不能修改
```

### 2. 索引签名

```ts
// 动态键名
interface StringMap {
  [key: string]: string
}

const map: StringMap = {
  name: '张三',
  city: '北京',
}

// 数字索引
interface NumberArray {
  [index: number]: string
}
```

### 3. 接口继承

```ts
interface Animal {
  name: string
}

interface Dog extends Animal {
  breed: string
  bark(): void
}

const dog: Dog = {
  name: '旺财',
  breed: '金毛',
  bark() { console.log('汪汪!') },
}

// 多继承
interface A { a: string }
interface B { b: number }
interface C extends A, B { c: boolean }
```

### 4. 类型别名 (type)

```ts
// 基本用法
type Name = string
type Age = number

// 联合类型（type 比 interface 更灵活）
type Status = 'success' | 'error' | 'loading'

// 函数类型
type Callback = (data: string) => void

// 对象类型
type Point = {
  x: number
  y: number
}
```

### 5. interface vs type

| 特性 | interface | type |
|------|-----------|------|
| 声明合并 | ✅ 支持 | ❌ 不支持 |
| extends 继承 | ✅ extends | ✅ 用 & 交叉 |
| 联合类型 | ❌ 不支持 | ✅ 支持 |
| 元组 | ❌ 不支持 | ✅ 支持 |
| 映射类型 | ❌ 不支持 | ✅ 支持 |

```ts
// interface 声明合并（同名接口自动合并）
interface Config {
  host: string
}
interface Config {
  port: number
}
// Config = { host: string; port: number }

// type 不支持合并
// type Config = { host: string }
// type Config = { port: number }  // ❌ 重复标识符错误
```

---

## 函数类型

### 1. 函数声明

```ts
// 参数和返回值类型
function add(a: number, b: number): number {
  return a + b
}

// 箭头函数
const multiply = (a: number, b: number): number => a * b

// 可选参数（必须在必选参数后面）
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name
}

// 默认参数
function createUser(name: string, age: number = 18): string {
  return `${name}, ${age}岁`
}

// 剩余参数
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0)
}
```

### 2. 函数重载

```ts
// 多个重载签名 + 一个实现签名
function format(value: string): string
function format(value: number): string
function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}

format('hello')   // "HELLO"
format(3.14159)   // "3.14"
// format(true)   // ❌ 报错：没有对应的重载
```

### 3. this 类型

```ts
// 声明 this 类型（作为第一个参数，编译后被移除）
interface Card {
  suit: string
  value: number
}

function getDescription(this: Card): string {
  return `${this.value} of ${this.suit}`
}

const card: Card = { suit: 'hearts', value: 10 }
// getDescription.call(card)  // "10 of hearts"
```

### 4. 函数类型表达式

```ts
// 类型别名定义函数签名
type MathFn = (a: number, b: number) => number

const addFn: MathFn = (a, b) => a + b
const subFn: MathFn = (a, b) => a - b

// 调用签名（函数也可以有属性）
type DescribableFunction = {
  description: string
  (arg: number): boolean
}

// 构造签名
type SomeConstructor = {
  new (name: string): { name: string }
}
```

---

## 泛型

### 1. 基本泛型

```ts
// 泛型函数
function identity<T>(arg: T): T {
  return arg
}

identity<string>('hello')  // 显式指定
identity(42)               // 自动推断

// 泛型接口
interface Box<T> {
  value: T
}

const stringBox: Box<string> = { value: 'hello' }
const numberBox: Box<number> = { value: 42 }
```

### 2. 泛型约束

```ts
// extends 约束泛型必须有某个属性
interface HasLength {
  length: number
}

function logLength<T extends HasLength>(arg: T): T {
  console.log(arg.length)
  return arg
}

logLength('hello')   // 5
logLength([1, 2, 3]) // 3
// logLength(123)    // ❌ 报错：number 没有 length

// 使用 keyof 约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: '张三', age: 25 }
getProperty(user, 'name')  // ✅
// getProperty(user, 'email')  // ❌ 报错
```

### 3. 多个泛型参数

```ts
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second]
}

const p = pair('hello', 42)  // [string, number]

// 泛型默认值
interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

const res1: ApiResponse<string> = { code: 0, data: 'ok', message: '' }
const res2: ApiResponse = { code: 0, data: {}, message: '' }  // 使用默认 any
```

### 4. 泛型类

```ts
class Stack<T> {
  private items: T[] = []

  push(item: T): void {
    this.items.push(item)
  }

  pop(): T | undefined {
    return this.items.pop()
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1]
  }

  get size(): number {
    return this.items.length
  }
}

const numberStack = new Stack<number>()
numberStack.push(1)
numberStack.push(2)
console.log(numberStack.pop())  // 2
```

### 5. 条件类型

```ts
// 三元表达式形式
type IsString<T> = T extends string ? true : false

type A = IsString<string>  // true
type B = IsString<number>  // false

// infer 推断
type ReturnType1<T> = T extends (...args: any[]) => infer R ? R : never

type FnReturn = ReturnType1<() => string>  // string

// 分布式条件类型
type ToArray<T> = T extends any ? T[] : never

type StrOrNum = ToArray<string | number>  // string[] | number[]
```

---

## 类与继承

### 1. 基本类

```ts
class Animal {
  // 属性声明
  name: string
  private _age: number
  protected species: string

  constructor(name: string, age: number) {
    this.name = name
    this._age = age
    this.species = '未知'
  }

  // getter / setter
  get age(): number {
    return this._age
  }

  set age(value: number) {
    if (value < 0) throw new Error('年龄不能为负')
    this._age = value
  }

  // 方法
  move(distance: number): void {
    console.log(`${this.name} 移动了 ${distance} 米`)
  }
}
```

### 2. 访问修饰符

```ts
class Example {
  public pub: string = '公开'       // 默认，任何地方可访问
  private priv: string = '私有'     // 仅类内部可访问
  protected prot: string = '受保护'  // 类内部和子类可访问
  readonly ready: boolean = true    // 只读，只能在声明或构造函数中赋值
}

class SubExample extends Example {
  show() {
    console.log(this.prot)  // ✅ 子类可访问 protected
    // console.log(this.priv)  // ❌ 子类也不能访问 private
  }
}
```

### 3. 抽象类

```ts
abstract class Shape {
  abstract getArea(): number  // 抽象方法，子类必须实现

  describe(): string {
    return `面积: ${this.getArea()}`
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
```

### 4. implements 实现接口

```ts
interface Printable {
  print(): void
}

interface Loggable {
  log(message: string): void
}

class ConsolePrinter implements Printable, Loggable {
  print(): void {
    console.log('打印中...')
  }

  log(message: string): void {
    console.log(`[LOG] ${message}`)
  }
}
```

---

## 枚举

### 1. 数字枚举

```ts
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right,   // 3
}

// 自定义起始值
enum Status {
  Success = 200,
  NotFound = 404,
  ServerError = 500,
}
```

### 2. 字符串枚举

```ts
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}

const myColor: Color = Color.Red
console.log(myColor)  // "RED"
```

### 3. 异构枚举（不推荐）

```ts
enum Mixed {
  No = 0,
  Yes = 'YES',
}
```

### 4. const 枚举（编译时内联，减少代码量）

```ts
const enum LogLevel {
  Debug,
  Info,
  Warn,
  Error,
}

// 编译后直接替换为字面量
const level = LogLevel.Info  // 编译为: const level = 1
```

---

## 类型操控

### 1. keyof

```ts
interface Person {
  name: string
  age: number
}

type PersonKeys = keyof Person  // 'name' | 'age'

function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
```

### 2. typeof

```ts
const config = {
  host: 'localhost',
  port: 3000,
  debug: true,
}

type Config = typeof config
// { host: string; port: number; debug: boolean }

// 获取函数返回值类型
function createUser() {
  return { name: '张三', age: 25 }
}
type User = ReturnType<typeof createUser>
```

### 3. 索引访问类型

```ts
interface User {
  name: string
  age: number
  address: {
    city: string
    street: string
  }
}

type NameType = User['name']           // string
type AddressType = User['address']     // { city: string; street: string }
type CityType = User['address']['city'] // string

// 联合类型的索引
type Keys = 'name' | 'age'
type UserValues = User[Keys]  // string | number
```

### 4. 映射类型

```ts
// 将所有属性变为可选
type Partial1<T> = {
  [K in keyof T]?: T[K]
}

// 将所有属性变为只读
type Readonly1<T> = {
  readonly [K in keyof T]: T[K]
}

// 挑选部分属性
type Pick1<T, K extends keyof T> = {
  [P in K]: T[P]
}

interface User {
  name: string
  age: number
  email: string
}

type UserPreview = Pick1<User, 'name' | 'age'>
// { name: string; age: number }

// 映射类型修饰符：用 - 或 + 移除/添加修饰符
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]  // 移除 readonly
}

type Required1<T> = {
  [K in keyof T]-?: T[K]  // 移除可选
}
```

### 5. 模板字面量类型

```ts
type World = 'world'
type Greeting = `hello ${World}`  // "hello world"

// 联合类型分发
type EmailLocaleIDs = 'welcome_email' | 'email_heading'
type FooterLocaleIDs = 'footer_title' | 'footer_sendoff'
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`
// "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"

// 内置字符串操作类型
type Greeting2 = 'Hello, world'
type ShoutyGreeting = Uppercase<Greeting2>    // "HELLO, WORLD"
type QuietGreeting = Lowercase<Greeting2>     // "hello, world"
type GreetingCapitalize = Capitalize<'hello'>  // "Hello"
type GreetingUncapitalize = Uncapitalize<'Hello'> // "hello"
```

---

## 模块与命名空间

### 1. ES 模块

```ts
// types.ts
export interface User {
  name: string
  age: number
}

export type Status = 'active' | 'inactive'

export function createUser(name: string, age: number): User {
  return { name, age }
}

// main.ts
import { User, createUser } from './types'
import type { Status } from './types'  // 仅导入类型（编译后不产生代码）

import * as Types from './types'       // 命名空间导入

// 默认导出
// export default class App {}
// import App from './App'

// 动态导入
// const module = await import('./heavy-module')
```

### 2. 命名空间（namespace，较少使用）

```ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean
  }

  const lettersRegexp = /^[A-Za-z]+$/

  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string): boolean {
      return lettersRegexp.test(s)
    }
  }
}

// 使用
const validator = new Validation.LettersOnlyValidator()
validator.isAcceptable('Hello')  // true
```

---

## 工具类型

### 1. 内置工具类型一览

```ts
// Partial<T> — 所有属性变为可选
interface User {
  name: string
  age: number
}
type PartialUser = Partial<User>  // { name?: string; age?: number }

// Required<T> — 所有属性变为必选
type RequiredUser = Required<PartialUser>  // 恢复为必选

// Readonly<T> — 所有属性变为只读
type ReadonlyUser = Readonly<User>

// Pick<T, K> — 选取部分属性
type UserName = Pick<User, 'name'>  // { name: string }

// Omit<T, K> — 排除部分属性
type UserWithoutAge = Omit<User, 'age'>  // { name: string }

// Record<K, T> — 构造对象类型
type PageInfo = Record<'home' | 'about' | 'contact', { title: string }>
// { home: { title: string }; about: { title: string }; contact: { title: string } }

// Exclude<T, U> — 从联合类型中排除
type T0 = Exclude<'a' | 'b' | 'c', 'a'>  // 'b' | 'c'

// Extract<T, U> — 从联合类型中提取
type T1 = Extract<'a' | 'b' | 'c', 'a' | 'f'>  // 'a'

// NonNullable<T> — 排除 null 和 undefined
type T2 = NonNullable<string | number | undefined | null>  // string | number

// Parameters<T> — 获取函数参数类型
type FnParams = Parameters<(a: string, b: number) => void>  // [string, number]

// ReturnType<T> — 获取函数返回值类型
type FnReturn = ReturnType<() => string>  // string

// ConstructorParameters<T> — 构造函数参数类型
// InstanceType<T> — 实例类型

// Awaited<T> — 递归解包 Promise
type A = Awaited<Promise<string>>       // string
type B = Awaited<Promise<Promise<number>>> // number
```

### 2. 自定义工具类型示例

```ts
// DeepPartial — 深层可选
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

// NonEmptyArray — 非空数组
type NonEmptyArray<T> = [T, ...T[]]

// Merge — 合并两个类型
type Merge<F, S> = Omit<F, keyof S> & S

// ValueOf — 获取对象值的联合类型
type ValueOf<T> = T[keyof T]
```

---

## 类型守卫与断言

### 1. typeof 类型守卫

```ts
function processValue(value: string | number) {
  if (typeof value === 'string') {
    // 此块中 value 被收窄为 string
    console.log(value.toUpperCase())
  } else {
    // 此块中 value 被收窄为 number
    console.log(value.toFixed(2))
  }
}
```

### 2. instanceof 类型守卫

```ts
class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
  }
}

function handleError(error: Error) {
  if (error instanceof ApiError) {
    console.log(`API错误 ${error.statusCode}: ${error.message}`)
  } else {
    console.log(`未知错误: ${error.message}`)
  }
}
```

### 3. 自定义类型守卫 (is)

```ts
interface Cat { meow(): void }
interface Dog { bark(): void }

function isCat(animal: Cat | Dog): animal is Cat {
  return (animal as Cat).meow !== undefined
}

function handleAnimal(animal: Cat | Dog) {
  if (isCat(animal)) {
    animal.meow()  // 此处 animal 被收窄为 Cat
  } else {
    animal.bark()  // 此处 animal 被收窄为 Dog
  }
}
```

### 4. in 操作符收窄

```ts
interface Fish { swim(): void }
interface Bird { fly(): void }

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    animal.swim()  // Fish
  } else {
    animal.fly()   // Bird
  }
}
```

### 5. 类型断言

```ts
// as 语法
const canvas = document.getElementById('canvas') as HTMLCanvasElement

// 尖括号语法（JSX 中不推荐）
const canvas2 = <HTMLCanvasElement>document.getElementById('canvas')

// 非空断言 (!) — 告诉 TS 值不为 null/undefined
function getElement(id: string): HTMLElement | null {
  return document.getElementById(id)
}

const el = getElement('app')!
el.style.color = 'red'  // 不需要 ?. 检查

// 双重断言（不推荐，仅在不得已时使用）
// const value = 'hello' as any as number

// const 断言
const config = {
  host: 'localhost',
  port: 3000,
} as const
// 类型变为: { readonly host: "localhost"; readonly port: 3000 }
```

### 6. 可辨识联合（Discriminated Unions）

```ts
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

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'square':
      return shape.size ** 2
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'triangle':
      return (shape.base * shape.height) / 2
    // 穷举检查：如果遗漏某个类型，TS 会报错
  }
}
```

---

## 声明文件

### 1. 声明全局变量/函数

```ts
// global.d.ts
declare const APP_VERSION: string
declare function getConfig(key: string): string

// 声明全局模块
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.css' {
  const content: Record<string, string>
  export default content
}

declare module '*.png' {
  const src: string
  export default src
}
```

### 2. 扩展全局类型

```ts
// 扩展 Window
declare global {
  interface Window {
    myCustomApi: {
      doSomething(): void
    }
  }
}

// 扩展 String 原型
declare global {
  interface String {
    reverse(): string
  }
}
```

### 3. 模块声明

```ts
// 为没有类型定义的第三方库声明类型
declare module 'my-library' {
  export function doSomething(value: string): void
  export const version: string
}
```

---

## tsconfig 配置

### 常用配置项说明

```json
{
  "compilerOptions": {
    // 目标 JS 版本
    "target": "ESNext",
    // 模块系统
    "module": "ESNext",
    // 模块解析策略
    "moduleResolution": "bundler",
    // 启用严格模式（包含 strictNullChecks 等）
    "strict": true,
    // JSX 处理
    "jsx": "preserve",
    // 允许导入 JSON 模块
    "resolveJsonModule": true,
    // 允许从没有默认导出的模块中默认导入
    "allowImportingTsExtensions": true,
    // 不输出编译文件（配合打包工具使用）
    "noEmit": true,
    // 允许 JS 文件编译
    "allowJs": true,
    // 检查 JS 文件
    "checkJs": false,
    // 生成 .d.ts 文件
    "declaration": true,
    // 移除注释
    "removeComments": true,
    // 路径别名
    "paths": {
      "@/*": ["./src/*"]
    },
    // 编译包含的库（DOM API、ES 特性等）
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    // 跳过库的类型检查（加快编译）
    "skipLibCheck": true,
    // 强制文件名大小写一致
    "forceConsistentCasingInFileNames": true,
    // 允许合成默认导入
    "allowSyntheticDefaultImports": true,
    // 启用装饰器
    "experimentalDecorators": true,
    // 输出目录
    "outDir": "./dist",
    // 源码根目录
    "rootDir": "./src",
    // 生成 source map
    "sourceMap": true
  },
  // 包含的文件
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  // 排除的文件
  "exclude": ["node_modules", "dist"]
}
```

### strict 模式详解

| 选项 | 作用 |
|------|------|
| `strictNullChecks` | `null` 和 `undefined` 不能赋值给其他类型 |
| `strictFunctionTypes` | 函数参数类型检查更严格（逆变） |
| `strictBindCallApply` | `bind`/`call`/`apply` 参数严格检查 |
| `strictPropertyInitialization` | 类属性必须在声明或构造函数中初始化 |
| `noImplicitAny` | 禁止隐式 `any` |
| `noImplicitThis` | 禁止隐式 `this` 类型为 `any` |
| `alwaysStrict` | 输出 `"use strict"` |

---

## 参考资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [TypeScript 中文手册](https://typescript.p6p.net/)
- [TypeScript 入门教程](https://ts.xcatliu.com/)
