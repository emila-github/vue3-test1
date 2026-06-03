<script setup lang="ts">
import { ref, reactive, toRefs, toRef, shallowRef, triggerRef, readonly } from 'vue'

// ====== ref() ======
const count = ref(0)
const msg = ref('Hello')

// ====== reactive() ======
const state = reactive({
  name: '张三',
  age: 25,
  hobbies: ['读书', '运动'],
})

// ====== 响应式解构 ======
const { name: stateName, age: stateAge } = toRefs(state)
const nameRef = toRef(state, 'name')

// ====== shallowRef ======
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

// ====== readonly ======
const original = reactive({ count: 0 })
const copy = readonly(original)
function tryModifyReadonly() {
  alert('尝试修改只读对象... 查看控制台警告')
  // copy.count++ // 会触发警告
}
</script>

<template>
  <div class="demo-page">
    <h1>响应式基础</h1>

    <!-- 1. ref() -->
    <section class="demo-section">
      <h2>1. ref() - 基本类型</h2>
      <p>计数：{{ count }}</p>
      <button @click="count++">+1</button>
      <p>消息：{{ msg }}</p>
      <button @click="msg = msg === 'Hello' ? '你好 Vue 3' : 'Hello'">切换消息</button>
    </section>

    <!-- 2. reactive() -->
    <section class="demo-section">
      <h2>2. reactive() - 对象类型</h2>
      <p>姓名：{{ state.name }}</p>
      <p>年龄：{{ state.age }}</p>
      <p>爱好：{{ state.hobbies.join('、') }}</p>
      <button @click="state.age++">年龄 +1</button>
      <button @click="state.hobbies.push('编程')" style="margin-left: 8px">添加爱好</button>
    </section>

    <!-- 3. 响应式解构 -->
    <section class="demo-section">
      <h2>3. 响应式解构 (toRefs / toRef)</h2>
      <p>toRefs 解构 name: {{ stateName }}</p>
      <p>toRefs 解构 age: {{ stateAge }}</p>
      <p>toRef 单个属性: {{ nameRef }}</p>
      <button @click="state.name = state.name === '张三' ? '李四' : '张三'">修改原对象 name</button>
    </section>

    <!-- 4. shallowRef -->
    <section class="demo-section">
      <h2>4. shallowRef</h2>
      <p>shallowObj.count = {{ shallowObj.count }}</p>
      <button @click="updateShallowValue">修改 .value.count（不触发更新）</button>
      <button @click="updateShallowRef" style="margin-left: 8px">替换 .value（触发更新）</button>
      <button @click="forceUpdate" style="margin-left: 8px">triggerRef 强制更新</button>
    </section>

    <!-- 5. readonly -->
    <section class="demo-section">
      <h2>5. readonly</h2>
      <p>original.count = {{ original.count }}</p>
      <p>copy.count = {{ copy.count }}</p>
      <button @click="original.count++">修改 original（✅ 允许）</button>
      <button @click="tryModifyReadonly" style="margin-left: 8px">修改 copy（❌ 只读警告）</button>
    </section>
  </div>
</template>

<style scoped>
.demo-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.demo-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #52c41a;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
}

.demo-section p {
  margin: 8px 0;
}

button {
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
}

button:hover {
  border-color: #52c41a;
  color: #52c41a;
}
</style>
