<script setup lang="ts">
</script>

<template>
  <div class="error-display">
    <p>❌ 组件加载失败</p>
    <p class="hint">请检查网络连接或重试</p>
  </div>
</template>

<style scoped>
.error-display {
  text-align: center;
  padding: 20px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  color: #ff4d4f;
}

.hint { color: #999; font-size: 13px; }
</style>
