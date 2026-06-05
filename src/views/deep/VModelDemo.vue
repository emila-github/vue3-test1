<script setup lang="ts">
import { ref } from 'vue'
import VModelInput from './VModelInput.vue'
import VModelInput1 from './VModelInput1.vue'
import VModelUserForm from './VModelUserForm.vue'
import VModelCapitalize from './VModelCapitalize.vue'

// 基本 v-model
const text = ref('')
const text1 = ref('')

// 多个 v-model
const firstName = ref('张')
const lastName = ref('三')

// 带修饰符
const capitalizedText = ref('')
</script>

<template>
  <div class="section">
    <h2>组件 v-model 深入</h2>

    <!-- 1. 基本 v-model -->
    <div class="panel">
      <h4>1. 基本 v-model（modelValue）</h4>
      <VModelInput v-model="text" />
      <VModelInput1 v-model:modelValue="text1" />
      <p class="output">
        输出：<strong>{{ text }}</strong> 输出：<strong>{{ text1 }}</strong>
      </p>
    </div>

    <!-- 2. 多个 v-model -->
    <div class="panel">
      <h4>2. 多个 v-model（v-model:firstName / v-model:lastName）</h4>
      <VModelUserForm v-model:first-name="firstName" v-model:last-name="lastName" />
      <p class="output">
        全名：<strong>{{ firstName }} {{ lastName }}</strong>
      </p>
    </div>

    <!-- 3. 修饰符 -->
    <div class="panel">
      <h4>3. v-model 修饰符（v-model.capitalize）</h4>
      <VModelCapitalize v-model.capitalize="capitalizedText" />
      <p class="output">
        输出：<strong>"{{ capitalizedText }}"</strong>
      </p>
      <p class="hint">输入内容后，首字母自动大写</p>
    </div>

    <div class="info">
      <h4>v-model 原理：</h4>
      <pre><code>&lt;CustomInput v-model="text" /&gt;
<!-- 等价于 -->
&lt;CustomInput
  :modelValue="text"
  @update:modelValue="text = $event"
/&gt;

<!-- 带参数 -->
&lt;CustomInput v-model:title="text" /&gt;
<!-- 等价于 -->
&lt;CustomInput
  :title="text"
  @update:title="text = $event"
/&gt;</code></pre>
    </div>
  </div>
</template>

<style scoped>
.section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #52c41a;
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

.output {
  margin-top: 8px;
  color: #52c41a;
}

.hint {
  color: #999;
  font-size: 13px;
  margin-top: 4px;
}

.info {
  background: #f6ffed;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #555;
}

.info pre {
  background: #1e1e1e;
  color: #a0d911;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 12px;
  margin: 8px 0;
}

.info code {
  font-family: monospace;
}
</style>
