<script setup lang="ts">
import { ref, computed } from 'vue'

// ====== 1. typeof 类型守卫 ======
function processValue(value: string | number): string {
  if (typeof value === 'string') {
    return `字符串: ${value.toUpperCase()}`
  }
  return `数字: ${value.toFixed(2)}`
}

const typeofResults = ref<string[]>([])

function testTypeofGuard() {
  typeofResults.value = [
    processValue('hello'),
    processValue(3.14159),
  ]
}

const typeofCode = `function processValue(value: string | number): string {
  if (typeof value === 'string') {
    // value 被收窄为 string
    return \`字符串: \${value.toUpperCase()}\`
  }
  // value 被收窄为 number
  return \`数字: \${value.toFixed(2)}\`
}`

// ====== 2. instanceof 类型守卫 ======
class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

function handleError(error: Error): string {
  if (error instanceof ApiError) {
    return `API错误 [${error.statusCode}]: ${error.message}`
  }
  return `未知错误: ${error.message}`
}

const instanceofResults = ref<string[]>([])

function testInstanceofGuard() {
  instanceofResults.value = [
    handleError(new ApiError(404, '资源未找到')),
    handleError(new Error('网络连接失败')),
  ]
}

const instanceofCode = `class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
  }
}

function handleError(error: Error): string {
  if (error instanceof ApiError) {
    // error 被收窄为 ApiError，可访问 statusCode
    return \`API错误 [\${error.statusCode}]: \${error.message}\`
  }
  return \`未知错误: \${error.message}\`
}`

// ====== 3. 自定义类型守卫 (is) ======
interface Cat { type: 'cat'; meow(): string }
interface Dog { type: 'dog'; bark(): string }

function isCat(animal: Cat | Dog): animal is Cat {
  return animal.type === 'cat'
}

function handleAnimal(animal: Cat | Dog): string {
  if (isCat(animal)) {
    return animal.meow()  // Cat
  }
  return animal.bark()   // Dog
}

const cat: Cat = { type: 'cat', meow: () => '喵喵~' }
const dog: Dog = { type: 'dog', bark: () => '汪汪!' }

const isGuardResults = ref<string[]>([])

function testIsGuard() {
  isGuardResults.value = [
    handleAnimal(cat),
    handleAnimal(dog),
  ]
}

const isGuardCode = `interface Cat { type: 'cat'; meow(): string }
interface Dog { type: 'dog'; bark(): string }

// 自定义类型守卫: animal is Cat
function isCat(animal: Cat | Dog): animal is Cat {
  return animal.type === 'cat'
}

function handleAnimal(animal: Cat | Dog): string {
  if (isCat(animal)) {
    return animal.meow()  // 收窄为 Cat
  }
  return animal.bark()   // 收窄为 Dog
}`

// ====== 4. 可辨识联合 ======
interface Square { kind: 'square'; size: number }
interface Circle { kind: 'circle'; radius: number }
interface Triangle { kind: 'triangle'; base: number; height: number }

type Shape = Square | Circle | Triangle

function getArea(shape: Shape): string {
  switch (shape.kind) {
    case 'square':
      return `正方形 (边长=${shape.size}): 面积=${shape.size ** 2}`
    case 'circle':
      return `圆形 (半径=${shape.radius}): 面积=${(Math.PI * shape.radius ** 2).toFixed(2)}`
    case 'triangle':
      return `三角形 (底=${shape.base}, 高=${shape.height}): 面积=${((shape.base * shape.height) / 2).toFixed(2)}`
  }
}

const shapeResults = ref<string[]>([])

function testDiscriminated() {
  const shapes: Shape[] = [
    { kind: 'square', size: 4 },
    { kind: 'circle', radius: 3 },
    { kind: 'triangle', base: 5, height: 4 },
  ]
  shapeResults.value = shapes.map(getArea)
}

const discriminatedCode = `interface Square { kind: 'square'; size: number }
interface Circle { kind: 'circle'; radius: number }
interface Triangle { kind: 'triangle'; base: number; height: number }

type Shape = Square | Circle | Triangle

function getArea(shape: Shape): string {
  switch (shape.kind) {
    case 'square': return \`正方形 面积=\${shape.size ** 2}\`
    case 'circle': return \`圆形 面积=\${Math.PI * shape.radius ** 2}\`
    case 'triangle': return \`三角形 面积=\${shape.base * shape.height / 2}\`
  }
  // TS 会做穷举检查，遗漏类型会报错
}`

// ====== 5. in 操作符收窄 ======
interface Fish { swim(): string }
interface Bird { fly(): string }

function move(animal: Fish | Bird): string {
  if ('swim' in animal) {
    return animal.swim()
  }
  return animal.fly()
}

const fish: Fish = { swim: () => '鱼在水中游 🐟' }
const bird: Bird = { fly: () => '鸟在天上飞 🐦' }

const inResults = ref<string[]>([])

function testInGuard() {
  inResults.value = [
    move(fish),
    move(bird),
  ]
}

const inCode = `interface Fish { swim(): string }
interface Bird { fly(): string }

function move(animal: Fish | Bird): string {
  if ('swim' in animal) {
    return animal.swim()  // 收窄为 Fish
  }
  return animal.fly()    // 收窄为 Bird
}`

// ====== 6. 类型断言 ======
function testAssertion() {
  // as 断言
  const value: unknown = 'hello typescript'
  const str = value as string
  const upper = str.toUpperCase()

  // 非空断言
  const el = document.getElementById('app')!

  return `断言结果: "${upper}"`
}

const assertionResult = ref('')

const assertionCode = `// as 语法
const canvas = document.getElementById('canvas') as HTMLCanvasElement

// 非空断言 (!) — 告诉 TS 值不为 null/undefined
const el = document.getElementById('app')!
el.style.color = 'red'

// const 断言 — 将值变为字面量类型
const config = {
  host: 'localhost',
  port: 3000,
} as const
// 类型: { readonly host: "localhost"; readonly port: 3000 }`
</script>

<template>
  <div>
    <!-- typeof 类型守卫 -->
    <section class="demo-section">
      <h2>1. typeof 类型守卫</h2>
      <pre class="code-block">{{ typeofCode }}</pre>
      <button @click="testTypeofGuard" class="demo-btn">执行</button>
      <div class="result-box" v-if="typeofResults.length">
        <p v-for="(r, i) in typeofResults" :key="i">{{ r }}</p>
      </div>
    </section>

    <!-- instanceof 类型守卫 -->
    <section class="demo-section">
      <h2>2. instanceof 类型守卫</h2>
      <pre class="code-block">{{ instanceofCode }}</pre>
      <button @click="testInstanceofGuard" class="demo-btn">执行</button>
      <div class="result-box" v-if="instanceofResults.length">
        <p v-for="(r, i) in instanceofResults" :key="i">{{ r }}</p>
      </div>
    </section>

    <!-- 自定义类型守卫 (is) -->
    <section class="demo-section">
      <h2>3. 自定义类型守卫 (animal is Cat)</h2>
      <pre class="code-block">{{ isGuardCode }}</pre>
      <button @click="testIsGuard" class="demo-btn">执行</button>
      <div class="result-box" v-if="isGuardResults.length">
        <p v-for="(r, i) in isGuardResults" :key="i">{{ r }}</p>
      </div>
    </section>

    <!-- 可辨识联合 -->
    <section class="demo-section">
      <h2>4. 可辨识联合 (Discriminated Union)</h2>
      <pre class="code-block">{{ discriminatedCode }}</pre>
      <button @click="testDiscriminated" class="demo-btn">计算面积</button>
      <div class="result-box" v-if="shapeResults.length">
        <p v-for="(r, i) in shapeResults" :key="i">{{ r }}</p>
      </div>
    </section>

    <!-- in 操作符 -->
    <section class="demo-section">
      <h2>5. in 操作符类型收窄</h2>
      <pre class="code-block">{{ inCode }}</pre>
      <button @click="testInGuard" class="demo-btn">执行</button>
      <div class="result-box" v-if="inResults.length">
        <p v-for="(r, i) in inResults" :key="i">{{ r }}</p>
      </div>
    </section>

    <!-- 类型断言 -->
    <section class="demo-section">
      <h2>6. 类型断言</h2>
      <pre class="code-block">{{ assertionCode }}</pre>
      <button @click="assertionResult = testAssertion()" class="demo-btn">执行</button>
      <div class="result-box" v-if="assertionResult">
        <p>{{ assertionResult }}</p>
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
</style>
