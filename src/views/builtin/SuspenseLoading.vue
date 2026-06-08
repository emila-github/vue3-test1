<script setup lang="ts">
</script>

<template>
  <div class="loading">
    <div class="spinner"></div>
    <p>加载中...</p>
  </div>
</template>

<style scoped>
.loading {
  padding: 30px;
  text-align: center;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
}

.loading p {
  margin: 12px 0 0;
  color: #999;
  font-size: 14px;
}

.spinner {
  width: 32px;
  height: 32px;
  margin: 0 auto;
  border: 3px solid #eee;
  border-top-color: #eb2f96;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
