<script setup lang="ts">
import { ref } from 'vue'

const exposedData = ref('子组件暴露的数据')

function publicMethod() {
  console.log('子组件方法被调用')
  exposedData.value = '方法已被调用：' + new Date().toLocaleTimeString()
}

defineExpose({
  exposedData,
  publicMethod,
})
</script>

<template>
  <div class="child-component">
    <p>👋 我是子组件</p>
    <p class="hint">exposedData: {{ exposedData }}</p>
  </div>
</template>

<style scoped>
.child-component {
  padding: 12px 16px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 6px;
  margin: 8px 0;
}

.hint {
  color: #999;
  font-size: 13px;
}
</style>
