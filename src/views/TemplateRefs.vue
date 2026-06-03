<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChildComponent from '../components/ChildComponent.vue'

// ====== 获取 DOM 元素 ======
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})

function focusInput() {
  inputRef.value?.focus()
}

// ====== v-for 中的模板引用 ======
const list = ref([
  { id: 1, name: '项目一' },
  { id: 2, name: '项目二' },
  { id: 3, name: '项目三' },
])

const itemRefs = ref<HTMLElement[]>([])

function setItemRef(el: Element | null) {
  if (el) {
    itemRefs.value.push(el as HTMLElement)
  }
}

function highlightItems() {
  itemRefs.value.forEach((el) => {
    el.style.background = '#e6f7ff'
    setTimeout(() => {
      el.style.background = ''
    }, 1000)
  })
}

// ====== 获取组件实例 ======
const childRef = ref<InstanceType<typeof ChildComponent> | null>(null)

function callChildMethod() {
  childRef.value?.publicMethod()
  alert('子组件暴露的数据: ' + childRef.value?.exposedData)
}
</script>

<template>
  <div class="demo-page">
    <h1>模板引用</h1>

    <!-- 1. 获取 DOM 元素 -->
    <section class="demo-section">
      <h2>1. 获取 DOM 元素</h2>
      <input ref="inputRef" type="text" placeholder="自动聚焦的输入框" />
      <button @click="focusInput" style="margin-left: 8px">手动聚焦</button>
      <p class="hint">页面加载时自动聚焦，也可点击按钮手动聚焦</p>
    </section>

    <!-- 2. v-for 中的模板引用 -->
    <section class="demo-section">
      <h2>2. v-for 中的模板引用</h2>
      <ul>
        <li v-for="item in list" :key="item.id" :ref="setItemRef">
          {{ item.name }}
        </li>
      </ul>
      <button @click="highlightItems">高亮所有列表项</button>
      <p class="hint">使用函数形式的 ref 获取 v-for 中的元素</p>
    </section>

    <!-- 3. 获取组件实例 -->
    <section class="demo-section">
      <h2>3. 获取组件实例 (defineExpose)</h2>
      <ChildComponent ref="childRef" />
      <button @click="callChildMethod">调用子组件方法</button>
      <p class="hint">子组件通过 defineExpose 暴露 publicMethod 和 exposedData</p>
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
  border-left: 4px solid #f5222d;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
}

input {
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  width: 240px;
}

button {
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  margin-top: 8px;
}

button:hover {
  border-color: #f5222d;
  color: #f5222d;
}

ul {
  margin: 4px 0;
  padding-left: 20px;
}

li {
  padding: 6px 10px;
  margin: 4px 0;
  border-radius: 4px;
  transition: background 0.3s;
}

.hint {
  color: #999;
  font-size: 13px;
  margin-top: 8px;
}
</style>
