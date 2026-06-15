<script setup lang="ts">
import { ref, reactive } from 'vue'

// ====== 文本插值 ======
const message = ref('Hello Vue 3')
const number = ref(10)
const isActive = ref(true)

// ====== 原始 HTML ======
const rawHtml = ref('<strong style="color: #1890ff;">加粗文字</strong>')

// ====== 属性绑定 ======
const dynamicId = ref('my-id')
const isDisabled = ref(true)
const attrsObj = reactive({
  id: 'container',
  class: 'wrapper',
  'data-title': 'hello',
})

// ====== JavaScript 表达式 ======
const ok = ref(true)
</script>

<template>
  <div class="demo-page">
    <h1>模板语法</h1>

    <!-- 1. 文本插值 -->
    <section class="demo-section">
      <h2>1. 文本插值 (Mustache)</h2>
      <p>message: {{ message }}</p>
      <p>number + 1: {{ number + 1 }}</p>
      <p>三元表达式: {{ isActive ? '激活' : '未激活' }}</p>
      <p>方法调用: {{ message.split('').reverse().join('') }}</p>
    </section>

    <!-- 2. 原始 HTML -->
    <section class="demo-section">
      <h2>2. 原始 HTML (v-html)</h2>
      <p>文本插值：{{ rawHtml }}</p>
      <p>v-html 输出：<span v-html="rawHtml"></span></p>
    </section>

    <!-- 3. 属性绑定 -->
    <section class="demo-section">
      <h2>3. 属性绑定 (v-bind)</h2>
      <div v-bind:id="dynamicId">完整写法: v-bind:id</div>
      <div :id="dynamicId">简写: :id</div>
      <button :disabled="isDisabled">:disabled="isDisabled"</button>
      <div v-bind="attrsObj">多属性对象绑定 (v-bind="attrsObj")</div>
    </section>

    <!-- 4. JavaScript 表达式 -->
    <section class="demo-section">
      <h2>4. JavaScript 表达式</h2>
      <p>✅ number + 1 = {{ number + 1 }}</p>
      <p>✅ ok ? 'YES' : 'NO' = {{ ok ? 'YES' : 'NO' }}</p>
      <p>✅ message.split('').reverse().join('') = {{ message.split('').reverse().join('') }}</p>
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
  border-left: 4px solid #1890ff;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
}

.demo-section p {
  margin: 8px 0;
}

.demo-section div {
  margin: 8px 0;
  padding: 6px;
  background: #e6f7ff;
  border-radius: 4px;
}

.wrapper {
  border: 2px dashed #1890ff;
  padding: 12px;
}

button {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
