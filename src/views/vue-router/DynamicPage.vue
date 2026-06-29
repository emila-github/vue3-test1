<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="dynamic-page">
    <h3>🔧 动态路由页面</h3>
    <p>此页面是通过 <code>router.addRoute()</code> 在运行时动态添加的，不在初始路由配置中。</p>

    <a-descriptions bordered size="small" :column="2">
      <a-descriptions-item label="路径 path">{{ route.path }}</a-descriptions-item>
      <a-descriptions-item label="名称 name">{{ route.name }}</a-descriptions-item>
      <a-descriptions-item label="完全路径 fullPath">{{ route.fullPath }}</a-descriptions-item>
      <a-descriptions-item label="添加方式">router.addRoute()</a-descriptions-item>
    </a-descriptions>

    <RouterLink to="/vue-router/stage5" class="back-link">← 返回进阶特性</RouterLink>
  </div>
</template>

<style scoped>
.dynamic-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 24px;
  text-align: center;
}

.dynamic-page h3 {
  font-size: 20px;
  margin: 0 0 8px;
}

.dynamic-page p {
  color: #666;
  font-size: 14px;
  margin: 0 0 20px;
}

.dynamic-page code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
}

.back-link {
  display: inline-block;
  margin-top: 16px;
  color: #1677ff;
  text-decoration: none;
  font-size: 14px;
}
</style>
