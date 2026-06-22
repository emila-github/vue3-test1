<script setup lang="ts">
import { ref, reactive, toRefs, toRef, shallowRef, triggerRef, readonly, computed, watch, watchEffect } from 'vue'

// ====================================================================
// 1. ref() - 基本类型响应式
// ====================================================================
// 核心思想：用 .value 包裹基本类型值，Vue 自动追踪读写
//
// 类比：ref 就像一个"带传感器的盒子"📦
//   把值放进盒子 → Vue 就能感知到它的变化
//   读取用 .value → 打开盒子看内容
//   修改用 .value = xxx → 换个新东西放进去，Vue 立刻通知所有使用者

const count = ref(0)
const msg = ref('Hello')

const refCode = `// ref() 创建基本类型的响应式引用
const count = ref(0)       // 本质：{ value: 0 }，但 value 是响应式的
const msg = ref('Hello')   // 本质：{ value: 'Hello' }

// 在 <script> 中访问/修改必须用 .value
count.value++              // 0 → 1
msg.value = '你好 Vue 3'    // 'Hello' → '你好 Vue 3'

// 在 <template> 中自动解包，不需要 .value
// <p>{{ count }}</p>   ← 直接写 count 即可

// ref 也可以接收对象类型
const obj = ref({ a: 1 })  // 内部自动调用 reactive() 处理对象
obj.value.a = 2            // 深层响应式，修改嵌套属性也能追踪`

// ====================================================================
// 2. reactive() - 对象类型响应式
// ====================================================================
// 核心思想：将整个对象变成响应式代理，所有属性自动追踪
//
// 类比：reactive 就像一个"智能监控房间"🏠
//   整个对象的所有属性都被监控了
//   你改动任何一个角落，Vue 都能立刻知道
//   不需要 .value，直接访问属性即可
//
// 限制：
//   ❌ 不能用于基本类型（string/number/boolean）
//   ❌ 不能整体替换（state = newObj 会丢失响应式）
//   ❌ 解构会丢失响应式（需要 toRefs 解决）

const state = reactive({
  name: '张三',
  age: 25,
  hobbies: ['读书', '运动'],
})

const reactiveCode = `// reactive() 让整个对象的所有属性都变成响应式
const state = reactive({
  name: '张三',
  age: 25,
  hobbies: ['读书', '运动'],
})

// 直接修改属性，Vue 自动追踪
state.age++                      // ✅ 视图自动更新
state.hobbies.push('编程')         // ✅ 数组操作也能检测

// ⚠️ 注意事项：
// 1. reactive 只接受对象/数组，不能用于基本类型
//    reactive(0)  ❌ 无效！
//    ref(0)       ✅ 基本类型用 ref

// 2. 不能整体替换 reactive 对象
//    state = { name: '李四' }  ❌ 丢失响应式！
//    Object.assign(state, { name: '李四' })  ✅ 用 Object.assign

// 3. 解构会丢失响应式（见下一节）`

// ====================================================================
// 3. 响应式解构 — toRefs / toRef
// ====================================================================
// 核心思想：从 reactive 对象中"安全地拆出"单个响应式属性
//
// 类比：toRefs 就像把"房间钥匙"分发给各人 🔑
//    state 是一整个房子（reactive 对象）
//    直接解构 → 拿到的是"快照"（失去响应式）
//    toRefs 解构 → 拿到的是"钥匙"（仍然连通原来的房子）

const { name: stateName, age: stateAge } = toRefs(state)
const nameRef = toRef(state, 'name')

const destructureCode = `// 问题：reactive 对象解构会丢失响应式
const state = reactive({ name: '张三', age: 25 })

// ❌ 错误：普通解构，name 和 age 是普通值，不再响应式
const { name, age } = state
// name 现在是普通字符串 '张三'，和 state.name 断开联系

// ✅ 正确：用 toRefs 解构，每个属性变成独立的 ref
const { name: n, age: a } = toRefs(state)
// n.value 始终 === state.name，保持同步
// a.value 始终 === state.age，保持同步

// ✅ toRef：单独取出一个属性
const nameRef = toRef(state, 'name')
// nameRef.value 和 state.name 始终保持同步

// 🔑 关键理解：
// toRefs/ toRef 创建的是"引用"，不是"副本"
// 修改 state.name → nameRef.value 自动更新
// 修改 nameRef.value → state.name 也自动更新`

// ====================================================================
// 4. computed() - 计算属性
// ====================================================================
// 核心思想：根据已有响应式数据自动计算派生值，自动缓存
//
// 类比：computed 就像 Excel 公式 📊
//   A1 = 10, B1 = 20
//   C1 = A1 + B1  → 自动得到 30
//   修改 A1 或 B1 → C1 自动重新计算
//   只有依赖变化才重新计算，否则直接返回缓存值

const price = ref(100)
const quantity = ref(3)
const discount = ref(0.8)

const total = computed(() => price.value * quantity.value * discount.value)
const totalLabel = computed(() => `¥${total.value.toFixed(2)}`)

const computedCode = `// computed：根据已有数据派生新数据，自动缓存
const price = ref(100)
const quantity = ref(3)
const discount = ref(0.8)

// 总价 = 单价 × 数量 × 折扣
const total = computed(() => price.value * quantity.value * discount.value)
// total.value = 240，依赖 price/quantity/discount 中任一变化时自动重新计算

// computed vs 普通函数：
//   普通函数：每次访问都重新计算
//   computed：只有依赖变化才重新计算，其余时候返回缓存

// computed 也支持 setter（可写计算属性）
const fullName = computed({
  get: () => firstName.value + ' ' + lastName.value,
  set: (val) => {
    const parts = val.split(' ')
    firstName.value = parts[0]
    lastName.value = parts[1]
  }
})`

// ====================================================================
// 5. watch / watchEffect - 侦听器
// ====================================================================
// 核心思想：当数据变化时自动执行副作用（日志、请求、DOM 操作等）
//
// 类比：
//   watch → 就像"盯梢"，明确指定要盯着谁，变化了就行动 👀
//   watchEffect → 就像"自动追踪"，在函数里用了谁就自动盯谁 🤖

const watchLog = ref<string[]>([])
const watchedCount = ref(0)

// watch: 明确指定侦听目标
watch(count, (newVal, oldVal) => {
  watchLog.value.push(`watch: count 从 ${oldVal} 变为 ${newVal}`)
})

// watch 多个源
watch([count, msg], ([newCount, newMsg], [oldCount, oldMsg]) => {
  watchLog.value.push(`watch 多源: count [${oldCount}→${newCount}], msg [${oldMsg}→${newMsg}]`)
})

// watch 侦听 reactive 对象属性（必须用 getter 函数）
watch(
  () => state.age,
  (newAge, oldAge) => {
    watchLog.value.push(`watch: state.age 从 ${oldAge} 变为 ${newAge}`)
  },
)

// watchEffect: 自动追踪依赖，立即执行一次
watchEffect(() => {
  watchedCount.value = count.value * 2
  // watchEffect 自动追踪 count.value 作为依赖
  // count 变化 → 自动重新执行
})

const watchCode = `// ===== watch：明确指定侦听谁 =====
// 侦听单个 ref
watch(count, (newVal, oldVal) => {
  console.log(\`count: \${oldVal} → \${newVal}\`)
})

// 侦听多个源
watch([count, msg], ([newCount, newMsg], [oldCount, oldMsg]) => {
  console.log('count 或 msg 变了')
})

// 侦听 reactive 对象的属性（必须用 getter 函数！）
watch(
  () => state.age,        // ✅ 用 getter 函数
  (newAge, oldAge) => { ... }
)
// watch(state.age, ...)   ❌ 错误！不能直接传值

// 侦听整个 reactive 对象（深度监听默认开启）
watch(state, (newState) => { ... })

// 配置选项
watch(source, callback, {
  immediate: true,  // 立即执行一次回调
  deep: true,       // 深度监听（对 ref 对象默认不深度）
  once: true,       // 只执行一次（Vue 3.4+）
})

// ===== watchEffect：自动追踪依赖 =====
// 不用指定侦听谁，函数里用了谁就自动侦听谁
watchEffect(() => {
  // 自动追踪 count.value 和 state.age
  console.log(count.value, state.age)
})
// 特点：① 立即执行一次  ② 自动收集依赖  ③ 依赖变化时重新执行

// ===== watch vs watchEffect =====
// watch：     明确指定源，可获旧值，惰性执行
// watchEffect：自动追踪依赖，立即执行，无法获取旧值`

// ====================================================================
// 6. shallowRef
// ====================================================================
// 核心思想：只有 .value 整体替换才触发更新，嵌套属性变化不触发
//
// 类比：shallowRef 就像一个"只看包裹不关心内容"的快递员 📦
//   你换了整个包裹 → 他通知你（触发更新）
//   你只动了包裹里的东西 → 他不管（不触发更新）
//   除非你主动喊他来看（triggerRef）

const shallowObj = shallowRef({ count: 0 })
function updateShallowValue() {
  shallowObj.value.count++ // 不会触发更新
}
function updateShallowRef() {
  shallowObj.value = { count: shallowObj.value.count + 1 } // 会触发更新
}
function forceUpdate() {
  shallowObj.value.count++
  triggerRef(shallowObj)
}

const shallowRefCode = `// shallowRef：浅层响应式，只有 .value 整体变化才触发更新
const obj = shallowRef({ count: 0 })

// ❌ 修改嵌套属性 → 不触发更新
obj.value.count++

// ✅ 整体替换 .value → 触发更新
obj.value = { count: 1 }

// ✅ 强制触发更新（适用于知道深层变了，手动通知 Vue）
obj.value.count++
triggerRef(obj)  // 手动触发 shallowRef 的更新

// ===== ref vs shallowRef =====
// ref(对象):       内部用 reactive 包装 → 深层响应式 → 开销大
// shallowRef(对象): 只有 .value 整体变化才追踪 → 开销小

// 使用场景：
//   • 大型数据列表只需要整体替换时
//   • 与第三方不可变数据结合（如 immer）
//   • 性能敏感场景`

// ====================================================================
// 7. readonly
// ====================================================================
// 核心思想：创建只读代理，防止意外修改
//
// 类比：readonly 就像"博物馆展品的玻璃罩"🪞
//   你可以看（读），但不能碰（写）
//   展品本身还能改（original 可变），但通过罩子不能改（copy 不可变）

const original = reactive({ count: 0 })
const copy = readonly(original)
function tryModifyReadonly() {
  alert('尝试修改只读对象... 查看控制台警告')
  // copy.count++ // 会触发警告
}

const readonlyCode = `// readonly：创建只读代理，防止修改
const original = reactive({ count: 0 })
const copy = readonly(original)

original.count++  // ✅ 可以修改原对象
// copy.count++   // ❌ 警告：只读对象不能修改
// copy.count = 5 // ❌ 同样会警告

// copy 是 original 的"只读视图"
// original 变化 → copy 同步变化
// copy 不能直接修改

// 使用场景：
//   • 向子组件传递 props 数据时防止子组件意外修改
//   • 提供只读版本的数据给外部消费者
//   • 团队协作中明确"这个数据只能由某处修改"`
</script>

<template>
  <div class="demo-page">
    <h1 class="page-title">⚡ 响应式基础</h1>
    <p class="page-subtitle">Vue 3 响应式系统是框架的核心——理解它，才能真正驾驭 Vue</p>

    <!-- ==================== 前置说明 ==================== -->
    <section class="demo-section intro-section">
      <h2>📖 什么是响应式？为什么它如此重要？</h2>
      <div class="explain-box">
        <p>
          <strong>一句话解释：</strong>响应式就是<em>数据变化时，视图自动更新</em>。你只管改数据，Vue 负责更新 DOM。
        </p>

        <h3>没有响应式的痛苦 😫</h3>
        <pre class="code-block">
// 原生 JS：每次数据变化都要手动更新 DOM
let count = 0
function increment() {
  count++
  document.getElementById('display').textContent = count  // 每次都要手动写这行！
}</pre
        >

        <h3>有了响应式之后 😎</h3>
        <pre class="code-block">
// Vue 3：改数据即可，视图自动更新
const count = ref(0)
function increment() {
  count.value++  // 就这一行！视图自动刷新
}</pre
        >

        <div class="key-points">
          <p>🔑 <strong>核心要点：</strong></p>
          <ul>
            <li><code>ref()</code> 用于基本类型和需要整体替换的对象，用 <code>.value</code> 读写</li>
            <li><code>reactive()</code> 用于对象/数组，直接访问属性，但不能解构</li>
            <li><code>computed()</code> 自动计算派生值，<strong>自动缓存</strong>，依赖不变就不重算</li>
            <li><code>watch()</code> 明确指定侦听目标，可获取新旧值</li>
            <li><code>watchEffect()</code> 自动追踪依赖，立即执行，无需指定源</li>
            <li><code>toRefs()</code> 从 reactive 对象中安全解构，保持响应式</li>
            <li><strong>核心原则：Vue 的响应式是"数据驱动视图"，不是"命令式操作 DOM"</strong></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ==================== 1. ref() ==================== -->
    <section class="demo-section">
      <h2>1. ref() — 基本类型的响应式引用</h2>
      <p class="section-desc">
        将基本类型值包装成响应式对象。在 <code>&lt;script&gt;</code> 中用 <code>.value</code> 读写， 在
        <code>&lt;template&gt;</code> 中自动解包，直接使用即可。
      </p>
      <pre class="code-block">{{ refCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p>
            <span class="label">计数 count</span> = <code>{{ count }}</code>
          </p>
          <p>
            <span class="label">消息 msg</span> = <code>"{{ msg }}"</code>
          </p>
        </div>
        <div class="action-box">
          <button @click="count++" class="demo-btn">count++</button>
          <button @click="msg = msg === 'Hello' ? '你好 Vue 3' : 'Hello'" class="demo-btn">切换消息</button>
        </div>
      </div>
      <p class="hint">
        💡 试试：多次点击 count++，你会发现 <code>&#123;&#123; count &#125;&#125;</code> 自动更新——这就是响应式的魔力！
      </p>
    </section>

    <!-- ==================== 2. reactive() ==================== -->
    <section class="demo-section">
      <h2>2. reactive() — 对象的深层响应式</h2>
      <p class="section-desc">
        <code>reactive()</code> 将整个对象变成响应式代理，<strong>所有嵌套属性</strong>都会自动追踪。 不需要
        <code>.value</code>，直接读写属性即可。
      </p>
      <pre class="code-block">{{ reactiveCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p>
            <span class="label">姓名</span> = <code>{{ state.name }}</code>
          </p>
          <p>
            <span class="label">年龄</span> = <code>{{ state.age }}</code>
          </p>
          <p>
            <span class="label">爱好</span> = <code>{{ state.hobbies.join('、') }}</code>
          </p>
        </div>
        <div class="action-box">
          <button @click="state.age++" class="demo-btn">年龄 +1</button>
          <button @click="state.hobbies.push('编程')" class="demo-btn">添加爱好</button>
          <button @click="state.hobbies.pop()" class="demo-btn" :disabled="state.hobbies.length <= 2">移除爱好</button>
        </div>
      </div>
      <p class="hint">
        💡 注意：<code>hobbies.push('编程')</code> 是数组操作，reactive 能检测到数组的 push/pop/splice 等变化。
      </p>
    </section>

    <!-- ==================== 3. 响应式解构 ==================== -->
    <section class="demo-section">
      <h2>3. toRefs / toRef — 安全地拆解 reactive 对象</h2>
      <p class="section-desc">
        直接从 <code>reactive</code> 对象解构会<strong>丢失响应式</strong>。 <code>toRefs</code> 把每个属性变成独立的
        <code>ref</code>，保持与原对象的连接。
      </p>
      <pre class="code-block">{{ destructureCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p>
            <span class="label">toRefs 解构 name</span> = <code>{{ stateName }}</code>
          </p>
          <p>
            <span class="label">toRefs 解构 age</span> = <code>{{ stateAge }}</code>
          </p>
          <p>
            <span class="label">toRef 单个属性</span> = <code>{{ nameRef }}</code>
          </p>
          <p>
            <span class="label">原始 state.name</span> = <code>{{ state.name }}</code>
          </p>
        </div>
        <div class="action-box">
          <button @click="state.name = state.name === '张三' ? '李四' : '张三'" class="demo-btn">
            修改 state.name
          </button>
        </div>
      </div>
      <p class="hint">
        💡 点击按钮后观察：<code>stateName</code>、<code>nameRef</code> 和 <code>state.name</code>
        三者始终同步——因为它们指向同一个响应式数据。
      </p>
    </section>

    <!-- ==================== 4. computed() ==================== -->
    <section class="demo-section">
      <h2>4. computed() — 自动计算 + 自动缓存</h2>
      <p class="section-desc">
        <code>computed</code> 根据已有数据<strong>自动派生</strong>新值，且会<strong>智能缓存</strong>。
        依赖不变时直接返回上次结果，不重复计算。
      </p>
      <pre class="code-block">{{ computedCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p>
            <span class="label">单价</span> = <code>{{ price }}</code>
          </p>
          <p>
            <span class="label">数量</span> = <code>{{ quantity }}</code>
          </p>
          <p>
            <span class="label">折扣</span> = <code>{{ discount }}</code>
          </p>
          <p class="highlight-result">
            <span class="label">总价</span> = <code>{{ totalLabel }}</code>
            <span class="type-hint">// = price × quantity × discount</span>
          </p>
        </div>
        <div class="action-box">
          <button @click="price += 10" class="demo-btn">单价 +10</button>
          <button @click="quantity++" class="demo-btn">数量 +1</button>
          <button @click="discount = Math.round((discount - 0.1) * 10) / 10 || 0.1" class="demo-btn">折扣 -0.1</button>
        </div>
      </div>
      <p class="hint">
        💡 <code>total</code> 只在 <code>price</code>、<code>quantity</code>、<code>discount</code>
        任一变化时才重新计算——这就是缓存的威力。
      </p>
    </section>

    <!-- ==================== 5. watch / watchEffect ==================== -->
    <section class="demo-section">
      <h2>5. watch / watchEffect — 数据变化时自动执行副作用</h2>
      <p class="section-desc">
        <code>watch</code> 明确指定侦听目标（可获新旧值），<code>watchEffect</code> 自动追踪依赖（立即执行）。
        两者适合处理日志记录、异步请求、DOM 操作等<strong>副作用</strong>。
      </p>
      <pre class="code-block">{{ watchCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p>
            <span class="label">count</span> = <code>{{ count }}</code>
          </p>
          <p>
            <span class="label">state.age</span> = <code>{{ state.age }}</code>
          </p>
          <p class="highlight-result">
            <span class="label">watchEffect: count × 2</span> = <code>{{ watchedCount }}</code>
          </p>
        </div>
        <div class="action-box">
          <button @click="count++" class="demo-btn">count++</button>
          <button @click="msg = msg === 'Hello' ? '你好' : 'Hello'" class="demo-btn">切换 msg</button>
          <button @click="state.age++" class="demo-btn">state.age++</button>
        </div>
      </div>
      <div class="result-box watch-log" v-if="watchLog.length">
        <p class="watch-log-title">📋 侦听日志（最新在前）：</p>
        <p v-for="(log, i) in [...watchLog].reverse().slice(0, 8)" :key="i" class="log-item">
          {{ log }}
        </p>
      </div>
      <p class="hint">
        💡 试试：点 count++ 会触发 watch count、watch 多源、watchEffect 三处响应。 点切换 msg 只触发 watch 多源（因为
        msg 也是多源侦听的目标）。
      </p>
    </section>

    <!-- ==================== 6. shallowRef ==================== -->
    <section class="demo-section">
      <h2>6. shallowRef — 浅层响应式（性能优化用）</h2>
      <p class="section-desc">
        只有 <code>.value</code> 整体替换才触发更新，嵌套属性变化不触发。 适合大型数据或与不可变数据结合的场景。
      </p>
      <pre class="code-block">{{ shallowRefCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p>
            <span class="label">shallowObj.count</span> = <code>{{ shallowObj.count }}</code>
          </p>
          <p class="hint">⚠️ 点击第一个按钮后数字不会变化（虽然值实际变了）</p>
        </div>
        <div class="action-box">
          <button @click="updateShallowValue" class="demo-btn">
            修改 .value.count<br /><small>（不触发更新）</small>
          </button>
          <button @click="updateShallowRef" class="demo-btn">替换 .value<br /><small>（触发更新）</small></button>
          <button @click="forceUpdate" class="demo-btn">triggerRef<br /><small>（强制更新）</small></button>
        </div>
      </div>
    </section>

    <!-- ==================== 7. readonly ==================== -->
    <section class="demo-section">
      <h2>7. readonly — 创建只读保护层</h2>
      <p class="section-desc">防止意外修改数据。常用于向子组件暴露数据时，确保数据只由特定位置修改。</p>
      <pre class="code-block">{{ readonlyCode }}</pre>
      <div class="demo-row">
        <div class="result-box">
          <p>
            <span class="label">original.count</span> = <code>{{ original.count }}</code>
          </p>
          <p>
            <span class="label">copy.count（只读）</span> = <code>{{ copy.count }}</code>
          </p>
          <p class="hint">✅ original 可修改 → copy 自动同步</p>
        </div>
        <div class="action-box">
          <button @click="original.count++" class="demo-btn">修改 original（✅）</button>
          <button @click="tryModifyReadonly" class="demo-btn">修改 copy（❌）</button>
        </div>
      </div>
    </section>

    <!-- ==================== 速查表 ==================== -->
    <section class="demo-section summary-section">
      <h2>📋 响应式 API 速查表</h2>
      <table class="summary-table">
        <thead>
          <tr>
            <th>API</th>
            <th>用途</th>
            <th>适用类型</th>
            <th>访问方式</th>
            <th>关键特征</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>ref()</code></td>
            <td>创建响应式引用</td>
            <td>基本类型 / 对象</td>
            <td><code>.value</code></td>
            <td>模板自动解包，对象内部用 reactive 包装</td>
          </tr>
          <tr>
            <td><code>reactive()</code></td>
            <td>创建响应式对象</td>
            <td>仅对象/数组</td>
            <td>直接访问属性</td>
            <td>深层响应式，不能解构，不能整体替换</td>
          </tr>
          <tr>
            <td><code>computed()</code></td>
            <td>派生计算值</td>
            <td>—</td>
            <td><code>.value</code></td>
            <td>自动缓存，依赖不变不重算</td>
          </tr>
          <tr>
            <td><code>watch()</code></td>
            <td>侦听数据变化</td>
            <td>—</td>
            <td>—</td>
            <td>明确指定源，可获新旧值，惰性执行</td>
          </tr>
          <tr>
            <td><code>watchEffect()</code></td>
            <td>自动追踪副作用</td>
            <td>—</td>
            <td>—</td>
            <td>自动收集依赖，立即执行一次</td>
          </tr>
          <tr>
            <td><code>toRefs()</code></td>
            <td>解构 reactive 对象</td>
            <td>对象</td>
            <td><code>.value</code></td>
            <td>保持与原对象的响应式连接</td>
          </tr>
          <tr>
            <td><code>toRef()</code></td>
            <td>取单个属性为 ref</td>
            <td>对象属性</td>
            <td><code>.value</code></td>
            <td>保持与原对象的响应式连接</td>
          </tr>
          <tr>
            <td><code>shallowRef()</code></td>
            <td>浅层响应式引用</td>
            <td>对象</td>
            <td><code>.value</code></td>
            <td>只有 .value 整体替换才触发更新</td>
          </tr>
          <tr>
            <td><code>triggerRef()</code></td>
            <td>手动触发 shallowRef</td>
            <td>—</td>
            <td>—</td>
            <td>配合 shallowRef 使用</td>
          </tr>
          <tr>
            <td><code>readonly()</code></td>
            <td>创建只读代理</td>
            <td>对象</td>
            <td>直接访问属性</td>
            <td>原对象变化同步，但不可修改代理</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- ==================== 对比总结 ==================== -->
    <section class="demo-section compare-section">
      <h2>🆚 关键对比：ref vs reactive</h2>
      <table class="summary-table">
        <thead>
          <tr>
            <th>对比维度</th>
            <th>ref</th>
            <th>reactive</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>支持类型</td>
            <td>✅ 基本类型 + 对象</td>
            <td>❌ 仅对象/数组</td>
          </tr>
          <tr>
            <td>访问方式</td>
            <td><code>.value</code>（script 中）</td>
            <td>直接访问属性</td>
          </tr>
          <tr>
            <td>模板解包</td>
            <td>✅ 自动解包（不用 .value）</td>
            <td>—</td>
          </tr>
          <tr>
            <td>整体替换</td>
            <td>✅ <code>ref.value = newObj</code></td>
            <td>❌ 不能整体替换</td>
          </tr>
          <tr>
            <td>解构</td>
            <td>—</td>
            <td>❌ 丢失响应式（需 toRefs）</td>
          </tr>
          <tr>
            <td>推荐场景</td>
            <td>基本类型、需整体替换的对象</td>
            <td>表单对象、配置对象等固定结构</td>
          </tr>
          <tr>
            <td>社区推荐</td>
            <td>👍 更通用，更灵活</td>
            <td>特定场景使用</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- ==================== 对比总结：watch vs watchEffect ==================== -->
    <section class="demo-section compare-section">
      <h2>🆚 关键对比：watch vs watchEffect vs computed</h2>
      <table class="summary-table">
        <thead>
          <tr>
            <th>对比维度</th>
            <th>computed</th>
            <th>watch</th>
            <th>watchEffect</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>本质</td>
            <td>派生值</td>
            <td>副作用侦听</td>
            <td>副作用侦听</td>
          </tr>
          <tr>
            <td>返回值</td>
            <td>✅ 返回计算值</td>
            <td>❌ 无返回值</td>
            <td>❌ 无返回值</td>
          </tr>
          <tr>
            <td>缓存</td>
            <td>✅ 自动缓存</td>
            <td>—</td>
            <td>—</td>
          </tr>
          <tr>
            <td>指定依赖</td>
            <td>自动追踪</td>
            <td>手动指定</td>
            <td>自动追踪</td>
          </tr>
          <tr>
            <td>首次执行</td>
            <td>惰性（访问时才算）</td>
            <td>惰性（默认不执行）</td>
            <td>立即执行</td>
          </tr>
          <tr>
            <td>获取旧值</td>
            <td>❌</td>
            <td>✅</td>
            <td>❌</td>
          </tr>
          <tr>
            <td>使用场景</td>
            <td>模板中显示的数据</td>
            <td>日志、请求、存储等</td>
            <td>自动追踪的副作用</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
/* ===== 页面头部 ===== */
.demo-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.page-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 28px;
}

.page-subtitle {
  text-align: center;
  color: #888;
  font-size: 14px;
  margin-bottom: 30px;
}

/* ===== 通用 Section ===== */
.demo-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  border-left: 4px solid #52c41a;
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

/* ===== 演示行（结果 + 操作） ===== */
.demo-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: flex-start;
}

/* ===== 结果展示 ===== */
.result-box {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 12px 16px;
  flex: 1;
  min-width: 260px;
}

.result-box p {
  margin: 5px 0;
  font-size: 14px;
  color: #333;
}

.highlight-result {
  background: #f6ffed;
  padding: 6px 8px;
  border-radius: 4px;
  margin-top: 8px !important;
  border: 1px dashed #b7eb8f;
}

.label {
  font-weight: 500;
  color: #555;
  min-width: 160px;
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
  margin-top: 10px;
}

.hint code {
  background: #f0f0f0;
  padding: 1px 5px;
  border-radius: 3px;
  color: #666;
}

/* ===== 操作按钮区 ===== */
.action-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 160px;
}

/* ===== 按钮 ===== */
.demo-btn {
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
}

.demo-btn:hover:not(:disabled) {
  border-color: #52c41a;
  color: #52c41a;
  background: #f6ffed;
}

.demo-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.demo-btn small {
  font-size: 11px;
  color: #999;
}

/* ===== watch 日志 ===== */
.watch-log {
  margin-top: 10px;
  max-height: 200px;
  overflow-y: auto;
}

.watch-log-title {
  font-weight: 600;
  color: #555;
  margin-bottom: 6px !important;
}

.log-item {
  font-size: 12px !important;
  color: #666 !important;
  padding: 2px 0;
  border-bottom: 1px solid #f0f0f0;
  font-family: 'Courier New', monospace;
}

/* ===== 总结/速查表区域 ===== */
.summary-section {
  border-left-color: #1890ff;
  background: #e6f7ff;
}

.compare-section {
  border-left-color: #722ed1;
  background: #f9f0ff;
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

.compare-section .summary-table th {
  background: #f3e8ff;
  color: #6b21a8;
  border-bottom-color: #d8b4fe;
}

.summary-section .summary-table th {
  background: #dbeafe;
  color: #1e40af;
  border-bottom-color: #93c5fd;
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
