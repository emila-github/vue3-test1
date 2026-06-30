<script setup lang="ts"></script>

<template>
  <div class="loading-spinner">
    <div class="spinner"></div>
    <p>加载中...</p>
  </div>
</template>

<style scoped>
.loading-spinner {
  text-align: center;
  padding: 20px;
  color: #999;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #f0f0f0;
  border-top-color: #fa8c16;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
