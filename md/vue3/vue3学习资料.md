# Vue 3 学习资料

## 目录
- [基础](#基础)
  - [创建一个应用](#创建一个应用)
  - [模板语法](#模板语法)
  - [响应式基础](#响应式基础)
  - [计算属性](#计算属性)
  - [类与样式绑定](#类与样式绑定)
  - [条件渲染](#条件渲染)
  - [列表渲染](#列表渲染)
  - [事件处理](#事件处理)
  - [表单输入绑定](#表单输入绑定)
  - [侦听器](#侦听器)
  - [模板引用](#模板引用)
  - [组件基础](#组件基础)
  - [生命周期](#生命周期)

---

## 基础

### 创建一个应用

每个 Vue 应用都是通过 `createApp` 函数创建的应用实例：

```js
import { createApp } from 'vue'

// 根组件
import App from './App.vue'

// 创建应用实例并挂载到 #app
const app = createApp(App)
app.mount('#app')
```

**应用实例的方法：**

| 方法 | 说明 |
|------|------|
| `app.mount('#app')` | 挂载到 DOM |
| `app.component('name', Component)` | 注册全局组件 |
| `app.directive('name', Directive)` | 注册全局指令 |
| `app.use(Plugin)` | 安装插件 |
| `app.provide(key, value)` | 全局依赖注入 |

**多个应用实例：** Vue 3 允许在同一页面创建多个独立的应用实例：

```js
const app1 = createApp(App1)
app1.mount('#container-1')

const app2 = createApp(App2)
app2.mount('#container-2')
```

---

### 模板语法

Vue 使用基于 HTML 的模板语法，能够将组件实例的数据绑定到渲染的 DOM 上。

#### 1. 文本插值

使用 `{{ }}`（Mustache 语法）：

```html
<template>
  <p>{{ message }}</p>
  <p>{{ number + 1 }}</p>
  <p>{{ isActive ? '激活' : '未激活' }}</p>
  <p>{{ message.split('').reverse().join('') }}</p>
</template>

<script setup>
import { ref } from 'vue'
const message = ref('Hello Vue 3')
const number = ref(10)
const isActive = ref(true)
</script>
```

#### 2. 原始 HTML

使用 `v-html` 指令输出真正的 HTML：

```html
<template>
  <p>文本插值：{{ rawHtml }}</p>
  <p>v-html 输出：<span v-html="rawHtml"></span></p>
</template>

<script setup>
import { ref } from 'vue'
const rawHtml = ref('<strong>加粗文字</strong>')
</script>
```

> **注意：** 在网站上动态渲染任意 HTML 是非常危险的，容易导致 XSS 攻击。请只对可信内容使用 `v-html`。

#### 3. 属性绑定

使用 `v-bind` 指令（简写 `:`）：

```html
<template>
  <!-- 完整写法 -->
  <div v-bind:id="dynamicId">动态 ID</div>
  <!-- 简写 -->
  <div :id="dynamicId">动态 ID</div>
  <!-- 布尔值属性 -->
  <button :disabled="isDisabled">按钮</button>
  <!-- 绑定多个属性 -->
  <div v-bind="attrsObj">多属性对象绑定</div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const dynamicId = ref('my-id')
const isDisabled = ref(true)
const attrsObj = reactive({
  id: 'container',
  class: 'wrapper',
  'data-title': 'hello'
})
</script>
```

#### 4. 使用 JavaScript 表达式

模板中仅支持单一表达式，不支持语句和流程控制：

```html
<template>
  <!-- ✅ 正确 -->
  <p>{{ number + 1 }}</p>
  <p>{{ ok ? 'YES' : 'NO' }}</p>
  <p>{{ message.split('').reverse().join('') }}</p>

  <!-- ❌ 错误：这是语句，不是表达式 -->
  <!-- {{ var a = 1 }} -->
  <!-- {{ if (ok) { return message } }} -->
</template>
```

#### 5. 指令

指令是带有 `v-` 前缀的特殊属性。Vue 内置指令：

| 指令 | 用途 |
|------|------|
| `v-bind` | 动态绑定属性 |
| `v-model` | 双向绑定 |
| `v-on` | 事件监听 |
| `v-if / v-else-if / v-else` | 条件渲染 |
| `v-show` | 显示/隐藏 |
| `v-for` | 列表渲染 |
| `v-html` | 输出原始 HTML |
| `v-text` | 更新文本内容 |
| `v-once` | 只渲染一次 |
| `v-pre` | 跳过编译 |
| `v-cloak` | 编译完成前隐藏 |
| `v-memo` | 缓存模板片段 |

---

### 响应式基础

Vue 3 使用 `ref` 和 `reactive` 创建响应式数据。

#### 1. ref()

用于定义任意类型的响应式数据（推荐）：

```html
<template>
  <div>
    <p>计数：{{ count }}</p>
    <button @click="count++">+1</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 基本类型
const count = ref(0)
const message = ref('Hello')
const isActive = ref(true)

// 在 script 中访问/修改需要 .value
console.log(count.value)  // 0
count.value++

// 在模板中会自动解包，不需要 .value
</script>
```

#### 2. reactive()

用于定义对象类型的响应式数据：

```html
<template>
  <div>
    <p>姓名：{{ state.name }}</p>
    <p>年龄：{{ state.age }}</p>
    <button @click="state.age++">年龄+1</button>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const state = reactive({
  name: '张三',
  age: 25,
  hobbies: ['读书', '运动']
})

// 直接修改属性，不需要 .value
state.age = 26
state.hobbies.push('编程')
</script>
```

#### 3. ref 与 reactive 对比

| 特性 | ref | reactive |
|------|-----|----------|
| 支持类型 | 任意类型 | 仅对象/数组 |
| 访问方式 | `.value` | 直接访问 |
| 替换整个对象 | ✅ 允许 | ❌ 会丢失响应性 |
| 解构 | 需使用 `toRefs` | 需使用 `toRefs` |
| 推荐场景 | 通用，优先使用 | 复杂表单/状态对象 |

#### 4. 响应式解构

```html
<script setup>
import { reactive, toRefs, toRef } from 'vue'

const state = reactive({
  name: '张三',
  age: 25
})

// toRefs：将每个属性转为 ref
const { name, age } = toRefs(state)
// name.value 和 age.value 保持响应式

// toRef：将单个属性转为 ref
const nameRef = toRef(state, 'name')
</script>
```

#### 5. 响应性原理核心 API

```js
import { ref, shallowRef, triggerRef, readonly } from 'vue'

// shallowRef：只有 .value 的引用变化才触发更新
const obj = shallowRef({ count: 0 })
obj.value.count = 1  // ❌ 不会触发更新
obj.value = { count: 1 }  // ✅ 会触发更新

// triggerRef：强制触发 shallowRef 的更新
triggerRef(obj)

// readonly：创建只读响应式对象
const original = reactive({ count: 0 })
const copy = readonly(original)
copy.count++  // ❌ 警告：只读
```

---

### 计算属性

`computed` 用于声明依赖于其他响应式数据的派生值，具有**缓存机制**。

#### 基本用法

```html
<template>
  <div>
    <p>姓：<input v-model="firstName" /></p>
    <p>名：<input v-model="lastName" /></p>
    <p>全名：{{ fullName }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const firstName = ref('张')
const lastName = ref('三')

// 计算属性：只读
const fullName = computed(() => {
  return firstName.value + ' ' + lastName.value
})
</script>
```

#### 可写计算属性

```html
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('张')
const lastName = ref('三')

const fullName = computed({
  get() {
    return firstName.value + ' ' + lastName.value
  },
  set(newValue) {
    const [first, last] = newValue.split(' ')
    firstName.value = first
    lastName.value = last
  }
})

// 修改 fullName 会同步修改 firstName 和 lastName
fullName.value = '李 四'
</script>
```

#### 计算属性 vs 方法

```html
<template>
  <!-- 计算属性：有缓存，依赖不变不会重新计算 -->
  <p>{{ computedMsg }}</p>
  <p>{{ computedMsg }}</p>
  <!-- 只计算一次 -->

  <!-- 方法：每次渲染都会调用 -->
  <p>{{ getMsg() }}</p>
  <p>{{ getMsg() }}</p>
  <!-- 调用两次 -->
</template>

<script setup>
import { ref, computed } from 'vue'

const count = ref(0)

// 计算属性：缓存
const computedMsg = computed(() => {
  console.log('computed 执行')
  return `当前计数：${count.value}`
})

// 方法：无缓存
function getMsg() {
  console.log('方法 执行')
  return `当前计数：${count.value}`
}
</script>
```

#### 常见应用场景

```html
<script setup>
import { ref, computed } from 'vue'

// 1. 搜索过滤
const keyword = ref('')
const list = ref(['Apple', 'Banana', 'Orange', 'Grape'])

const filteredList = computed(() =>
  list.value.filter(item => item.toLowerCase().includes(keyword.value.toLowerCase()))
)

// 2. 购物车总价
const cart = ref([
  { name: '商品A', price: 100, count: 2 },
  { name: '商品B', price: 200, count: 1 }
])

const totalPrice = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.count, 0)
)

// 3. 表单验证
const password = ref('')
const isPasswordValid = computed(() =>
  password.value.length >= 6 && password.value.length <= 20
)
</script>
```

---

### 类与样式绑定

#### 1. 绑定 class

##### 对象语法

```html
<template>
  <!-- 单个 class 切换 -->
  <div :class="{ active: isActive }">动态 class</div>

  <!-- 多个 class 切换 -->
  <div :class="{ active: isActive, 'text-danger': hasError }">多 class</div>

  <!-- 使用 reactive 对象 -->
  <div :class="classObject">对象绑定</div>

  <!-- 与静态 class 共存 -->
  <div class="static" :class="{ active: isActive }">组合使用</div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const isActive = ref(true)
const hasError = ref(false)

const classObject = reactive({
  active: true,
  'text-danger': false,
  'text-large': true
})

// 计算属性
const computedClass = computed(() => ({
  active: isActive.value,
  'text-danger': hasError.value
}))
</script>
```

##### 数组语法

```html
<template>
  <!-- 基本数组 -->
  <div :class="[activeClass, errorClass]">数组绑定</div>

  <!-- 条件切换 -->
  <div :class="[isActive ? activeClass : '', errorClass]">条件数组</div>

  <!-- 数组中使用对象 -->
  <div :class="[{ active: isActive }, errorClass]">混合语法</div>
</template>

<script setup>
import { ref } from 'vue'

const isActive = ref(true)
const activeClass = ref('active')
const errorClass = ref('text-danger')
</script>
```

#### 2. 绑定内联样式

##### 对象语法

```html
<template>
  <!-- 直接绑定 -->
  <div :style="{ color: activeColor, fontSize: fontSize + 'px' }">内联样式</div>

  <!-- 使用响应式对象（推荐） -->
  <div :style="styleObject">对象绑定</div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const activeColor = ref('red')
const fontSize = ref(16)

const styleObject = reactive({
  color: 'red',
  fontSize: '16px',
  fontWeight: 'bold'
})
</script>
```

##### 数组语法

```html
<template>
  <div :style="[baseStyle, overrideStyle]">多个样式对象</div>
</template>

<script setup>
import { reactive } from 'vue'

const baseStyle = reactive({
  color: 'blue',
  fontSize: '14px'
})

const overrideStyle = reactive({
  fontWeight: 'bold',
  fontSize: '18px'  // 会覆盖 baseStyle 中的 fontSize
})
</script>
```

---

### 条件渲染

#### 1. v-if / v-else-if / v-else

根据条件决定是否渲染元素：

```html
<template>
  <div>
    <p>当前类型：{{ type }}</p>

    <div v-if="type === 'A'">类型 A 的内容</div>
    <div v-else-if="type === 'B'">类型 B 的内容</div>
    <div v-else-if="type === 'C'">类型 C 的内容</div>
    <div v-else>其他类型的内容</div>

    <button @click="changeType">切换类型</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const type = ref('A')
const types = ['A', 'B', 'C', 'D']

function changeType() {
  const index = types.indexOf(type.value)
  type.value = types[(index + 1) % types.length]
}
</script>
```

#### 2. v-show

`v-show` 通过 CSS `display` 控制显示/隐藏，元素始终存在于 DOM 中：

```html
<template>
  <div>
    <h3 v-show="isVisible">这个元素通过 v-show 控制</h3>
    <button @click="isVisible = !isVisible">切换显示</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const isVisible = ref(true)
</script>
```

#### 3. v-if vs v-show

| 特性 | v-if | v-show |
|------|------|--------|
| 渲染方式 | 条件为 false 时不渲染 | 始终渲染，通过 CSS 隐藏 |
| 切换开销 | 高（销毁/重建） | 低（CSS 切换） |
| 初始开销 | 低（条件为 false 时不渲染） | 高（始终渲染） |
| 生命周期 | 切换时触发完整的生命周期 | 只切换 display |
| 适用场景 | 条件很少改变 | 频繁切换显示/隐藏 |

#### 4. 在 template 上使用 v-if

```html
<template>
  <!-- 使用 template 包裹多个元素，template 本身不会渲染 -->
  <template v-if="isLoggedIn">
    <h3>欢迎回来</h3>
    <p>用户姓名：{{ userName }}</p>
    <button @click="logout">退出登录</button>
  </template>

  <template v-else>
    <p>请先登录</p>
    <button @click="login">登录</button>
  </template>
</template>

<script setup>
import { ref } from 'vue'
const isLoggedIn = ref(false)
const userName = ref('张三')

function login() { isLoggedIn.value = true }
function logout() { isLoggedIn.value = false }
</script>
```

---

### 列表渲染

#### 1. v-for 基本用法

```html
<template>
  <div>
    <!-- 遍历数组 -->
    <ul>
      <li v-for="(item, index) in items" :key="item.id">
        {{ index }} - {{ item.name }}
      </li>
    </ul>

    <!-- 遍历对象 -->
    <ul>
      <li v-for="(value, key, index) in userInfo" :key="key">
        {{ index }}. {{ key }}: {{ value }}
      </li>
    </ul>

    <!-- 遍历数字 -->
    <span v-for="n in 5" :key="n">{{ n }}</span>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const items = ref([
  { id: 1, name: '项目一' },
  { id: 2, name: '项目二' },
  { id: 3, name: '项目三' }
])

const userInfo = reactive({
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com'
})
</script>
```

#### 2. key 的重要性

`key` 帮助 Vue 追踪每个节点，优化渲染性能：

```html
<template>
  <div>
    <!-- ✅ 使用唯一 ID 作为 key（推荐） -->
    <div v-for="item in list" :key="item.id">{{ item.name }}</div>

    <!-- ⚠️ 不推荐：使用 index 作为 key，数据顺序变化时可能出问题 -->
    <!-- <div v-for="(item, index) in list" :key="index">{{ item.name }}</div> -->
  </div>
</template>
```

#### 3. 数组变更检测

Vue 能够检测响应式数组的以下变更方法：

```html
<script setup>
import { ref } from 'vue'

const list = ref([1, 2, 3, 4, 5])

// ✅ 触发响应式更新的方法
function addItem() {
  list.value.push(6)        // 末尾添加
  list.value.unshift(0)     // 开头添加
  list.value.pop()          // 末尾删除
  list.value.shift()        // 开头删除
  list.value.splice(2, 1)   // 删除/插入
  list.value.sort()         // 排序
  list.value.reverse()      // 反转
}

// ✅ 替换整个数组也会触发更新
function replaceAll() {
  list.value = [10, 20, 30]
}

// ❌ 直接通过索引修改不会触发更新（Vue 3 已修复，但仍建议使用以下方式）
function updateByIndex() {
  // list.value[0] = 100  // Vue 3 可以，但不推荐
  list.value.splice(0, 1, 100)  // 推荐
}
</script>
```

#### 4. v-for 与 v-if

> **注意：** 不建议在同一元素上同时使用 `v-if` 和 `v-for`（Vue 3 中 `v-if` 优先级更高）。

```html
<template>
  <!-- ❌ 不推荐 -->
  <!-- <li v-for="item in items" v-if="item.isActive" :key="item.id">{{ item.name }}</li> -->

  <!-- ✅ 方案一：使用 computed 过滤 -->
  <li v-for="item in activeItems" :key="item.id">{{ item.name }}</li>

  <!-- ✅ 方案二：在 template 上使用 v-for，子元素用 v-if -->
  <template v-for="item in items" :key="item.id">
    <li v-if="item.isActive">{{ item.name }}</li>
  </template>
</template>

<script setup>
import { ref, computed } from 'vue'

const items = ref([
  { id: 1, name: '项目一', isActive: true },
  { id: 2, name: '项目二', isActive: false },
  { id: 3, name: '项目三', isActive: true }
])

const activeItems = computed(() =>
  items.value.filter(item => item.isActive)
)
</script>
```

#### 5. 展示过滤/排序结果

```html
<template>
  <div>
    <input v-model="keyword" placeholder="搜索..." />
    <ul>
      <li v-for="item in filteredList" :key="item.id">
        {{ item.name }} - ¥{{ item.price }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const keyword = ref('')
const list = ref([
  { id: 1, name: '苹果', price: 10 },
  { id: 2, name: '香蕉', price: 5 },
  { id: 3, name: '橙子', price: 8 },
  { id: 4, name: '葡萄', price: 15 }
])

const filteredList = computed(() =>
  list.value
    .filter(item => item.name.includes(keyword.value))
    .sort((a, b) => a.price - b.price)
)
</script>
```

---

### 事件处理

#### 1. 基本用法

使用 `v-on` 指令（简写 `@`）监听 DOM 事件：

```html
<template>
  <div>
    <!-- 内联语句 -->
    <button @click="count++">计数 +1：{{ count }}</button>

    <!-- 调用方法 -->
    <button @click="handleClick">点击</button>

    <!-- 传入参数 -->
    <button @click="say('Hello')">打招呼</button>

    <!-- 访问原生事件对象 -->
    <button @click="handleEvent($event)">获取事件</button>

    <!-- 内联使用 $event -->
    <button @click="warn('警告信息', $event)">警告</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

function handleClick() {
  alert('按钮被点击')
}

function say(message) {
  alert(message)
}

function handleEvent(event) {
  console.log('事件目标：', event.target)
  console.log('鼠标坐标：', event.clientX, event.clientY)
}

function warn(message, event) {
  // 可以访问原生事件
  if (event) {
    event.preventDefault()
  }
  alert(message)
}
</script>
```

#### 2. 事件修饰符

Vue 提供了常用的事件修饰符：

```html
<template>
  <div>
    <!-- 阻止默认行为 -->
    <a @click.prevent="handleClick" href="https://example.com">阻止跳转</a>

    <!-- 阻止事件冒泡 -->
    <div @click="handleParent">
      <button @click.stop="handleChild">阻止冒泡</button>
    </div>

    <!-- 事件只触发一次 -->
    <button @click.once="handleOnce">只触发一次</button>

    <!-- 使用捕获模式 -->
    <div @click.capture="handleCapture">捕获模式</div>

    <!-- 只有 event.target 是自身时才触发 -->
    <div @click.self="handleSelf">
      只有点击自身才触发
      <button>点击按钮不会触发</button>
    </div>

    <!-- 修饰符可以串联 -->
    <a @click.stop.prevent="handleClick">阻止冒泡 + 阻止默认</a>
  </div>
</template>

<script setup>
function handleClick() { console.log('click') }
function handleParent() { console.log('parent') }
function handleChild() { console.log('child') }
function handleOnce() { console.log('只触发一次') }
function handleCapture() { console.log('capture') }
function handleSelf() { console.log('self') }
</script>
```

#### 3. 按键修饰符

```html
<template>
  <div>
    <!-- 按键别名 -->
    <input @keyup.enter="submit" placeholder="按回车提交" />
    <input @keyup.esc="clear" placeholder="按 Esc 清除" />

    <!-- 系统修饰键 -->
    <input @keyup.ctrl.enter="ctrlEnter" placeholder="Ctrl + Enter" />

    <!-- 精确修饰符：只有按下该键才触发 -->
    <button @click.ctrl.exact="ctrlOnly">仅 Ctrl+点击触发</button>

    <!-- 鼠标修饰符 -->
    <button @click.left="handleLeftClick">左键点击</button>
    <button @click.right.prevent="handleRightClick">右键点击</button>
    <button @click.middle="handleMiddleClick">中键点击</button>
  </div>
</template>

<script setup>
function submit() { console.log('提交') }
function clear() { console.log('清除') }
function ctrlEnter() { console.log('Ctrl+Enter') }
function ctrlOnly() { console.log('仅 Ctrl') }
function handleLeftClick() { console.log('左键') }
function handleRightClick() { console.log('右键') }
function handleMiddleClick() { console.log('中键') }
</script>
```

**常用按键别名：**

| 别名 | 按键 |
|------|------|
| `.enter` | Enter |
| `.tab` | Tab |
| `.delete` | Delete / Backspace |
| `.esc` | Esc |
| `.space` | Space |
| `.up` | ↑ |
| `.down` | ↓ |
| `.left` | ← |
| `.right` | → |

---

### 表单输入绑定

`v-model` 指令用于在表单元素上创建双向数据绑定。

#### 1. 基本用法

```html
<template>
  <div>
    <!-- 文本输入 -->
    <p>消息：{{ message }}</p>
    <input v-model="message" placeholder="输入内容" />

    <!-- 多行文本 -->
    <p>多行文本：{{ textarea }}</p>
    <textarea v-model="textarea" placeholder="多行输入"></textarea>

    <!-- 复选框 -->
    <p>已同意：{{ checked }}</p>
    <input type="checkbox" v-model="checked" /> 同意协议

    <!-- 多个复选框绑定数组 -->
    <p>选择：{{ selected }}</p>
    <label><input type="checkbox" v-model="selected" value="A" /> A</label>
    <label><input type="checkbox" v-model="selected" value="B" /> B</label>
    <label><input type="checkbox" v-model="selected" value="C" /> C</label>

    <!-- 单选按钮 -->
    <p>选择：{{ picked }}</p>
    <label><input type="radio" v-model="picked" value="one" /> One</label>
    <label><input type="radio" v-model="picked" value="two" /> Two</label>

    <!-- 下拉选择 -->
    <p>选择：{{ selected }}</p>
    <select v-model="selected">
      <option disabled value="">请选择</option>
      <option value="A">选项 A</option>
      <option value="B">选项 B</option>
      <option value="C">选项 C</option>
    </select>

    <!-- 多选下拉 -->
    <p>多选：{{ multiSelected }}</p>
    <select v-model="multiSelected" multiple>
      <option value="A">A</option>
      <option value="B">B</option>
      <option value="C">C</option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('')
const textarea = ref('')
const checked = ref(false)
const selected = ref([])
const picked = ref('')
const multiSelected = ref([])
</script>
```

#### 2. 修饰符

```html
<template>
  <div>
    <!-- .lazy：在 change 事件时更新，而不是 input -->
    <input v-model.lazy="lazyMsg" placeholder="失去焦点时更新" />
    <p>lazy: {{ lazyMsg }}</p>

    <!-- .number：自动将输入转为数字 -->
    <input v-model.number="age" type="number" placeholder="自动转数字" />
    <p>年龄 + 10 = {{ age + 10 }}</p>

    <!-- .trim：自动去除首尾空格 -->
    <input v-model.trim="trimMsg" placeholder="自动去除空格" />
    <p>trim: "{{ trimMsg }}"</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const lazyMsg = ref('')
const age = ref(0)
const trimMsg = ref('')
</script>
```

#### 3. 自定义组件上的 v-model

```html
<!-- Parent.vue -->
<template>
  <div>
    <p>父组件值：{{ modelValue }}</p>
    <CustomInput v-model="modelValue" />
    <!-- 等价于 -->
    <!-- <CustomInput :modelValue="modelValue" @update:modelValue="modelValue = $event" /> -->

    <!-- 多个 v-model 绑定 -->
    <CustomForm v-model:title="title" v-model:content="content" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CustomInput from './CustomInput.vue'
import CustomForm from './CustomForm.vue'

const modelValue = ref('')
const title = ref('')
const content = ref('')
</script>

<!-- CustomInput.vue -->
<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>
```

---

### 侦听器

`watch` 和 `watchEffect` 用于监听响应式数据的变化并执行副作用。

#### 1. watch()

监听一个或多个响应式数据源，当数据变化时执行回调：

```html
<template>
  <div>
    <input v-model="keyword" placeholder="搜索..." />
    <p>结果数量：{{ results.length }}</p>
    <ul>
      <li v-for="item in results" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const keyword = ref('')
const results = ref([])

// 监听 ref
watch(keyword, (newVal, oldVal) => {
  console.log(`keyword 从 "${oldVal}" 变为 "${newVal}"`)
  // 模拟搜索
  results.value = allData.filter(item => item.includes(newVal))
})

const allData = ['Apple', 'Banana', 'Orange', 'Grape', 'Watermelon']
</script>
```

#### 2. 监听多个数据源

```html
<script setup>
import { ref, reactive, watch } from 'vue'

const firstName = ref('张')
const lastName = ref('三')

// 监听多个 ref
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`姓名从 "${oldFirst} ${oldLast}" 变为 "${newFirst} ${newLast}"`)
})

// 监听 reactive 对象的属性（需要用 getter 函数）
const state = reactive({ count: 0, name: 'test' })

watch(
  () => state.count,
  (newVal, oldVal) => {
    console.log(`count 从 ${oldVal} 变为 ${newVal}`)
  }
)

// 监听整个 reactive 对象（默认深度监听）
watch(state, (newVal, oldVal) => {
  // 注意：newVal 和 oldVal 是同一个引用
  console.log('state 变化了', newVal)
})
</script>
```

#### 3. watch 配置选项

```html
<script setup>
import { ref, watch } from 'vue'

const user = ref({ name: '张三', profile: { age: 25 } })
const keyword = ref('')

// immediate：立即执行一次回调
watch(keyword, (newVal) => {
  console.log('初始值也会触发')
}, { immediate: true })

// deep：深度监听（ref 对象需要显式开启）
watch(user, (newVal) => {
  console.log('深层属性变化了')
}, { deep: true })

// once：只监听一次
watch(keyword, (newVal) => {
  console.log('只触发一次')
}, { once: true })

// flush：控制回调执行时机
// 'pre'（默认）：渲染前
// 'post'：渲染后（可以访问更新后的 DOM）
// 'sync'：同步执行
watch(keyword, (newVal) => {
  console.log('DOM 已更新')
}, { flush: 'post' })
</script>
```

#### 4. watchEffect()

自动追踪依赖，依赖变化时重新执行：

```html
<template>
  <div>
    <p>计数：{{ count }}</p>
    <button @click="count++">+1</button>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'

const count = ref(0)

// 自动追踪回调中用到的响应式依赖
// 初始化时会立即执行一次
const stop = watchEffect(() => {
  // 当 count.value 变化时，自动重新执行
  console.log(`count 当前值为：${count.value}`)
  document.title = `计数：${count.value}`
})

// 手动停止侦听
// stop()
</script>
```

#### 5. watch vs watchEffect

| 特性 | watch | watchEffect |
|------|-------|-------------|
| 依赖追踪 | 手动指定 | 自动追踪 |
| 初始执行 | 默认不执行（需 `immediate`） | 默认立即执行 |
| 新旧值 | ✅ 可获取 | ❌ 不提供 |
| 使用场景 | 需要精确控制监听源 | 简单副作用 |

---

### 模板引用

`ref` 属性用于获取 DOM 元素或组件实例的引用。

#### 1. 获取 DOM 元素

```html
<template>
  <div>
    <input ref="inputRef" type="text" placeholder="自动聚焦" />
    <button @click="focusInput">聚焦输入框</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// ref 名称必须与模板中 ref 属性一致
const inputRef = ref(null)

onMounted(() => {
  // 组件挂载后，inputRef.value 指向 DOM 元素
  inputRef.value?.focus()
})

function focusInput() {
  inputRef.value?.focus()
}
</script>
```

#### 2. v-for 中的模板引用

```html
<template>
  <ul>
    <li v-for="(item, index) in list" :key="item.id" :ref="setItemRef">
      {{ item.name }}
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'

const list = ref([
  { id: 1, name: '项目一' },
  { id: 2, name: '项目二' },
  { id: 3, name: '项目三' }
])

// v-for 中使用函数形式的 ref
const itemRefs = ref([])

function setItemRef(el) {
  if (el) {
    itemRefs.value.push(el)
  }
}
</script>
```

#### 3. 获取组件实例

```html
<!-- Parent.vue -->
<template>
  <div>
    <ChildComponent ref="childRef" />
    <button @click="callChildMethod">调用子组件方法</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const childRef = ref(null)

function callChildMethod() {
  // 调用子组件暴露的方法/属性
  childRef.value?.publicMethod()
  console.log(childRef.value?.exposedData)
}
</script>

<!-- ChildComponent.vue -->
<template>
  <div>子组件</div>
</template>

<script setup>
import { ref } from 'vue'

const exposedData = ref('子组件数据')

function publicMethod() {
  console.log('子组件方法被调用')
}

// 使用 defineExpose 暴露给父组件
defineExpose({
  exposedData,
  publicMethod
})
</script>
```

---

### 组件基础

#### 1. 组件定义与注册

```html
<!-- 单文件组件 (SFC)：MyButton.vue -->
<template>
  <button :class="['btn', `btn-${type}`]" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup>
// defineProps：声明 props
const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'danger'].includes(value)
  },
  disabled: Boolean
})

// defineEmits：声明事件
const emit = defineEmits(['click'])
</script>

<style scoped>
.btn { padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; }
.btn-primary { background: #1890ff; color: #fff; border-color: #1890ff; }
.btn-danger { background: #ff4d4f; color: #fff; border-color: #ff4d4f; }
</style>
```

#### 2. Props

```html
<!-- Parent.vue -->
<template>
  <div>
    <!-- 静态 prop -->
    <UserCard name="张三" />

    <!-- 动态 prop -->
    <UserCard :name="userName" :age="25" :is-admin="true" />

    <!-- 传递对象的所有属性 -->
    <UserCard v-bind="userInfo" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import UserCard from './UserCard.vue'

const userName = ref('李四')
const userInfo = reactive({
  name: '王五',
  age: 30,
  isAdmin: false
})
</script>

<!-- UserCard.vue -->
<template>
  <div class="card">
    <h3>{{ name }}</h3>
    <p>年龄：{{ age }}</p>
    <p v-if="isAdmin">管理员</p>
  </div>
</template>

<script setup>
// 类型声明方式
defineProps({
  name: { type: String, required: true },
  age: { type: Number, default: 18 },
  isAdmin: { type: Boolean, default: false }
})

// TypeScript 类型声明方式
// defineProps<{
//   name: string
//   age?: number
//   isAdmin?: boolean
// }>()
</script>
```

#### 3. Emits（事件）

```html
<!-- Parent.vue -->
<template>
  <div>
    <p>计数：{{ count }}</p>
    <CounterButton @update="count = $event" @reset="count = 0" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CounterButton from './CounterButton.vue'
const count = ref(0)
</script>

<!-- CounterButton.vue -->
<template>
  <div>
    <button @click="increment">+1</button>
    <button @click="reset">重置</button>
  </div>
</template>

<script setup>
const emit = defineEmits(['update', 'reset'])

// 声明方式一：数组
// defineEmits(['update', 'reset'])

// 声明方式二：对象（可添加校验）
// const emit = defineEmits({
//   update: (value) => typeof value === 'number',
//   reset: null
// })

let count = 0
function increment() {
  count++
  emit('update', count)
}
function reset() {
  count = 0
  emit('reset')
}
</script>
```

#### 4. 插槽（Slots）

```html
<!-- 默认插槽 -->
<template>
  <div class="container">
    <!-- Child: Card.vue -->
    <div class="card">
      <div class="card-header">
        <slot name="header">默认标题</slot>
      </div>
      <div class="card-body">
        <slot>默认内容</slot>
      </div>
      <div class="card-footer">
        <slot name="footer">
          <button>默认按钮</button>
        </slot>
      </div>
    </div>

    <!-- Parent 使用 -->
    <Card>
      <template #header>
        <h2>自定义标题</h2>
      </template>

      <p>这是主体内容</p>

      <template #footer>
        <button>确认</button>
        <button>取消</button>
      </template>
    </Card>
  </div>
</template>
```

##### 作用域插槽

```html
<!-- ListComponent.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <!-- 通过 slot 向父组件暴露数据 -->
      <slot name="item" :item="item" :index="index">
        {{ item.name }}
      </slot>
    </li>
  </ul>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true }
})
</script>

<!-- Parent.vue -->
<template>
  <ListComponent :items="list">
    <!-- 接收子组件暴露的数据 -->
    <template #item="{ item, index }">
      <span class="index">{{ index + 1 }}.</span>
      <strong>{{ item.name }}</strong>
      <span class="price">¥{{ item.price }}</span>
    </template>
  </ListComponent>
</template>
```

#### 5. 依赖注入（provide / inject）

```html
<!-- 祖先组件 -->
<script setup>
import { provide, ref, readonly } from 'vue'

const theme = ref('light')
const updateTheme = (val) => { theme.value = val }

// 提供数据
provide('theme', readonly(theme))  // 只读
provide('updateTheme', updateTheme)
</script>

<!-- 后代组件 -->
<script setup>
import { inject } from 'vue'

const theme = inject('theme', 'light')  // 第二个参数是默认值
const updateTheme = inject('updateTheme', () => {})
</script>
```

---

### 生命周期

每个 Vue 组件在创建时都会经历一系列初始化步骤，在此过程中会运行称为生命周期钩子的函数。

#### 1. 生命周期图示

```
创建阶段                  挂载阶段                 更新阶段               卸载阶段
   │                        │                       │                     │
   ├─ setup()               │                       │                     │
   ├─ beforeCreate          │                       │                     │
   ├─ created               │                       │                     │
   │                        ├─ beforeMount          │                     │
   │                        ├─ 编译模板              │                     │
   │                        ├─ mounted              │                     │
   │                        │                       ├─ beforeUpdate       │
   │                        │                       ├─ updated            │
   │                        │                       │                     ├─ beforeUnmount
   │                        │                       │                     ├─ unmounted
```

#### 2. 常用生命周期钩子

```html
<template>
  <div>
    <p>计数：{{ count }}</p>
    <button @click="count++">+1</button>
  </div>
</template>

<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue'

const count = ref(0)

// 组件挂载前：DOM 尚未创建
onBeforeMount(() => {
  console.log('onBeforeMount：组件即将挂载')
})

// 组件挂载后：DOM 已创建，可访问 DOM 元素
onMounted(() => {
  console.log('onMounted：组件已挂载')
  // 常用于：发起 API 请求、初始化第三方库、设置事件监听
})

// 数据更新前：DOM 尚未更新
onBeforeUpdate(() => {
  console.log('onBeforeUpdate：数据已变化，DOM 即将更新', count.value)
})

// 数据更新后：DOM 已更新
onUpdated(() => {
  console.log('onUpdated：DOM 已更新', count.value)
})

// 组件卸载前：组件实例仍然可用
onBeforeUnmount(() => {
  console.log('onBeforeUnmount：组件即将卸载')
  // 常用于：清除定时器、取消订阅、移除事件监听
})

// 组件卸载后：组件实例已被销毁
onUnmounted(() => {
  console.log('onUnmounted：组件已卸载')
})
</script>
```

#### 3. 更多生命周期钩子

```html
<script setup>
import {
  onActivated,    // keep-alive 缓存的组件激活时
  onDeactivated,  // keep-alive 缓存的组件失活时
  onErrorCaptured // 捕获后代组件错误时
} from 'vue'

// keep-alive 专用
onActivated(() => {
  console.log('组件被激活（从缓存中恢复）')
})

onDeactivated(() => {
  console.log('组件被缓存（离开但未销毁）')
})

// 错误捕获
onErrorCaptured((err, instance, info) => {
  console.error('捕获到错误：', err)
  // 返回 false 阻止错误继续向上传播
  return false
})
</script>
```

#### 4. 生命周期实战示例

```html
<template>
  <div>
    <p>当前时间：{{ currentTime }}</p>
    <p>窗口大小：{{ windowWidth }} x {{ windowHeight }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const currentTime = ref('')
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

let timer = null

// 处理窗口大小变化
function handleResize() {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

onMounted(() => {
  // 启动定时器
  timer = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString()
  }, 1000)

  // 添加事件监听
  window.addEventListener('resize', handleResize)

  console.log('组件已挂载，定时器和事件监听已启动')
})

onBeforeUnmount(() => {
  // 清理定时器
  if (timer) {
    clearInterval(timer)
    timer = null
  }

  // 移除事件监听
  window.removeEventListener('resize', handleResize)

  console.log('组件卸载前，定时器和事件监听已清理')
})
</script>
```

#### 5. 生命周期钩子一览

| 钩子函数 | 说明 | 常用场景 |
|----------|------|----------|
| `onBeforeMount` | 挂载前 | 很少使用 |
| `onMounted` | 挂载后 | API 请求、初始化、DOM 操作 |
| `onBeforeUpdate` | 更新前 | 更新前的状态记录 |
| `onUpdated` | 更新后 | DOM 更新后的操作 |
| `onBeforeUnmount` | 卸载前 | 清理定时器、取消订阅 |
| `onUnmounted` | 卸载后 | 组件销毁后的收尾 |
| `onActivated` | keep-alive 激活 | 缓存组件激活时刷新数据 |
| `onDeactivated` | keep-alive 失活 | 缓存组件失活时保存状态 |
| `onErrorCaptured` | 捕获后代错误 | 全局错误处理 |

---

## 参考资源

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Vue 3 快速上手](https://cn.vuejs.org/guide/quick-start.html)
