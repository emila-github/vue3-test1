<script setup lang="ts">
defineProps<{
  name: string
  age?: number
  isAdmin?: boolean
}>()
</script>

<template>
  <div class="user-card">
    <h3 class="user-name">{{ name }}</h3>
    <p v-if="age" class="user-age">年龄：{{ age }}</p>
    <p v-if="isAdmin" class="user-admin">👑 管理员</p>
    <p v-else class="user-role">普通用户</p>
  </div>
</template>

<style scoped>
.user-card {
  padding: 14px 18px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  min-width: 140px;
}

.user-name {
  margin: 0 0 6px 0;
  font-size: 16px;
  color: #333;
}

.user-age {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}

.user-admin {
  color: #faad14;
  font-weight: bold;
  margin: 4px 0 0 0;
}

.user-role {
  color: #999;
  font-size: 13px;
  margin: 4px 0 0 0;
}
</style>
