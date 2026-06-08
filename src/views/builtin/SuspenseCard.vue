<script setup lang="ts">
</script>

<template>
  <div class="card">
    <h3>📦 异步加载的卡片</h3>
    <p>这个组件是通过 defineAsyncComponent 异步加载的</p>
    <div class="stats">
      <div class="stat">
        <span class="stat-num">42</span>
        <span class="stat-label">项目数</span>
      </div>
      <div class="stat">
        <span class="stat-num">128</span>
        <span class="stat-label">用户</span>
      </div>
      <div class="stat">
        <span class="stat-num">99.9%</span>
        <span class="stat-label">可用率</span>
      </div>
    </div>
    <p class="success-msg">✅ 异步组件加载成功！</p>
  </div>
</template>

<style scoped>
.card {
  padding: 20px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  text-align: center;
}

.card h3 {
  margin: 0 0 8px;
  color: #333;
}

.card p {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}

.stats {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin: 16px 0;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 24px;
  font-weight: bold;
  color: #eb2f96;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.success-msg {
  color: #52c41a !important;
  font-size: 14px !important;
  margin-top: 12px !important;
}
</style>
