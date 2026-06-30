<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const adminData = [
  { id: 1, user: 'admin', role: '超级管理员', lastLogin: '2024-06-28 10:30' },
  { id: 2, user: 'editor', role: '内容编辑', lastLogin: '2024-06-27 15:22' },
]
</script>

<template>
  <div class="admin-page">
    <div class="admin-header">
      <h2>🛡️ 管理后台</h2>
      <p>此页面代表需要登录才能访问的受保护路由。</p>
    </div>

    <div class="admin-info">
      <h4>✅ 已通过导航守卫校验</h4>
      <p>
        当前路由：<code>{{ route.path }}</code>
      </p>
    </div>

    <a-table
      :columns="[
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: '用户名', dataIndex: 'user', key: 'user' },
        { title: '角色', dataIndex: 'role', key: 'role' },
        { title: '最后登录', dataIndex: 'lastLogin', key: 'lastLogin' },
      ]"
      :data-source="adminData"
      :pagination="false"
      size="small"
      style="margin-top: 16px"
    />

    <RouterLink to="/vue-router/stage4" class="back-link"> ← 返回导航守卫演示 </RouterLink>
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 660px;
  margin: 0 auto;
  padding: 24px;
}

.admin-header {
  margin-bottom: 20px;
}

.admin-header h2 {
  margin: 0 0 6px;
  font-size: 22px;
}

.admin-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.admin-info {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
}

.admin-info h4 {
  margin: 0 0 4px;
  font-size: 14px;
  color: #52c41a;
}

.admin-info p {
  margin: 0;
  font-size: 13px;
  color: #666;
}

.admin-info code {
  background: #d9f7be;
  padding: 1px 5px;
  border-radius: 3px;
}

.back-link {
  display: inline-block;
  margin-top: 16px;
  color: #1677ff;
  font-size: 13px;
  text-decoration: none;
}
</style>
