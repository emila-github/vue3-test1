<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="async-card">
    <h3>{{ title }}</h3>
    <p>✅ 异步组件加载成功！</p>
    <p class="hint">这个组件通过 defineAsyncComponent 异步加载</p>
  </div>
</template>

<style scoped>
.async-card {
  padding: 20px;
  background: #fff7e6;
  border: 2px solid #ffd591;
  border-radius: 8px;
  text-align: center;
  margin-top: 8px;
}

h3 {
  margin: 0 0 8px 0;
  color: #fa8c16;
}

.hint {
  color: #999;
  font-size: 13px;
}
</style>
