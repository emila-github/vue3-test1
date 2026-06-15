<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// ====== class 对象语法 ======
const isActive = ref(true)
const hasError = ref(false)
const classObject = reactive({
  active: true,
  'text-danger': false,
  'text-large': true,
})
const computedClassObj = computed(() => ({
  active: isActive.value,
  'text-danger': hasError.value,
}))

// ====== class 数组语法 ======
const activeClass = ref('highlight')
const errorClass = ref('error-text')

// ====== style 对象语法 ======
const activeColor = ref('#1890ff')
const fontSize = ref(16)
const styleObject = reactive({
  color: '#ff4d4f',
  fontSize: '18px',
  fontWeight: 'bold',
})

// ====== style 数组语法 ======
const baseStyle = reactive({
  color: '#333',
  fontSize: '14px',
})
const overrideStyle = reactive({
  fontWeight: 'bold',
  fontSize: '20px',
})
</script>

<template>
  <div class="demo-page">
    <h1>类与样式绑定</h1>

    <!-- 1. class 对象语法 -->
    <section class="demo-section">
      <h2>1. class 对象语法</h2>
      <div :class="{ active: isActive }">单个 class 切换 — :class="{ active: isActive }"</div>
      <div :class="{ active: isActive, 'text-danger': hasError }">多个 class — :class="{ active: isActive, 'text-danger': hasError }"</div>
      <div :class="classObject">对象绑定 — :class="classObject"</div>
      <div class="static" :class="{ active: isActive }">与静态 class 共存</div>
      <div :class="computedClassObj">computed 对象 — :class="computedClassObj"</div>
      <p class="controls">
        <button @click="isActive = !isActive">切换 active</button>
        <button @click="hasError = !hasError" style="margin-left: 8px">切换 error</button>
      </p>
    </section>

    <!-- 2. class 数组语法 -->
    <section class="demo-section">
      <h2>2. class 数组语法</h2>
      <div :class="[activeClass, errorClass]">基本数组 — :class="[activeClass, errorClass]"</div>
      <div :class="[isActive ? activeClass : '', errorClass]">条件数组 — :class="[isActive ? activeClass : '', errorClass]"</div>
      <div :class="[{ active: isActive }, errorClass]">混合语法 — :class="[{ active: isActive }, errorClass]"</div>
    </section>

    <!-- 3. style 对象语法 -->
    <section class="demo-section">
      <h2>3. style 对象语法</h2>
      <div :style="{ color: activeColor, fontSize: fontSize + 'px' }">直接绑定 — :style="{ color: ..., fontSize: ... }"</div>
      <div :style="styleObject">对象绑定 — :style="styleObject"</div>
      <p class="controls">
        <button @click="fontSize += 2">增大字体 ({{ fontSize }}px)</button>
        <button @click="activeColor = activeColor === '#1890ff' ? '#ff4d4f' : '#1890ff'" style="margin-left: 8px">切换颜色</button>
      </p>
    </section>

    <!-- 4. style 数组语法 -->
    <section class="demo-section">
      <h2>4. style 数组语法</h2>
      <div :style="[baseStyle, overrideStyle]">多个样式对象 — :style="[baseStyle, overrideStyle]"</div>
      <p class="hint">overrideStyle 中的 fontSize 会覆盖 baseStyle 中的 fontSize</p>
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
  border-left: 4px solid #722ed1;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
}

.demo-section > div {
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  background: #fff;
  border: 1px solid #e8e8e8;
}

.controls {
  margin-top: 12px;
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
  border-color: #722ed1;
  color: #722ed1;
}

.hint {
  color: #999;
  font-size: 13px;
}

/* 动态 class 样式 */
.active {
  background: #e6f7ff !important;
  border-color: #1890ff !important;
  color: #1890ff;
  font-weight: bold;
}

.text-danger {
  color: #ff4d4f !important;
  border-color: #ff4d4f !important;
}

.text-large {
  font-size: 18px;
}

.highlight {
  background: #fff7e6 !important;
  border-color: #fa8c16 !important;
  color: #fa8c16;
}

.error-text {
  text-decoration: line-through;
}

.static {
  font-style: italic;
}
</style>
