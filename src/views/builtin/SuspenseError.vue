<script setup lang="ts"></script>

<template>
  <div class="error">
    <p>⚠️ 组件加载失败</p>
    <span>请检查网络连接后重试</span>
  </div>
</template>

<style scoped>
.error {
  padding: 20px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  text-align: center;
}

.error p {
  margin: 0 0 4px;
  color: #f5222d;
  font-weight: bold;
}

.error span {
  font-size: 13px;
  color: #999;
}
</style>
