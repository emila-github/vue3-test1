<script setup lang="ts">
import { ref } from 'vue'
import AttrsChild from './AttrsChild.vue'

const inputId = ref('my-input')
const inputClass = ref('large')
const isDisabled = ref(false)
</script>

<template>
  <div class="section">
    <h2>透传 Attributes</h2>

    <!-- 透传演示 -->
    <div class="panel">
      <h4>1. 自动透传到子组件根元素</h4>
      <p class="hint">以下 class、id、data-* 会透传到 AttrsChild 的根元素</p>
      <div class="demo-row">
        <AttrsChild
          :id="inputId"
          :class="inputClass"
          :disabled="isDisabled"
          data-type="primary"
          style="margin-right: 8px"
        />
        <button @click="isDisabled = !isDisabled">切换 disabled ({{ isDisabled }})</button>
      </div>
    </div>

    <!-- $attrs 访问 -->
    <div class="panel">
      <h4>2. useAttrs() 访问透传属性</h4>
      <p class="hint">子组件中使用 useAttrs() 获取所有透传属性，并展示在下方</p>
      <AttrsChild id="demo-id" class="custom-class" data-test="hello" />
    </div>

    <div class="info">
      <h4>透传要点：</h4>
      <ul>
        <li>单根节点组件自动透传 <code>class</code>、<code>style</code>、<code>id</code> 等</li>
        <li><code>defineOptions({ inheritAttrs: false })</code> 禁用自动透传</li>
        <li><code>useAttrs()</code> 在 JS 中获取所有透传属性</li>
        <li>透传也包含事件监听器（如 <code>@click</code>）</li>
        <li>多根节点组件需要手动 <code>v-bind="$attrs"</code></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #eb2f96;
}

h2 {
  margin: 0 0 16px 0;
  color: #333;
}
h4 {
  margin: 0 0 8px 0;
  color: #555;
}

.panel {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #f0f0f0;
}

.demo-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.hint {
  color: #999;
  font-size: 13px;
  margin-top: 4px;
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
  border-color: #eb2f96;
  color: #eb2f96;
}

.info {
  background: #fff0f6;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #555;
}

.info ul {
  margin: 4px 0;
  padding-left: 20px;
}
.info li {
  margin: 4px 0;
}
.info code {
  background: #ffd6e7;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
  color: #eb2f96;
}
</style>
