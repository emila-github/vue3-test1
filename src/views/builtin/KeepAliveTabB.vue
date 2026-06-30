<script setup lang="ts">
import { ref, onActivated, onDeactivated } from 'vue'

const count = ref(0)

onActivated(() => {
  console.log('Tab B 被激活 (onActivated)')
})

onDeactivated(() => {
  console.log('Tab B 被失活 (onDeactivated)')
})
</script>

<template>
  <div class="tab-content-inner" style="background: #f6ffed; border: 1px solid #b7eb8f">
    <p style="color: #52c41a; margin: 0 0 8px; font-weight: bold">Tab B — 绿色区域</p>
    <p>
      计数器: <strong>{{ count }}</strong>
    </p>
    <button @click="count++" style="margin-right: 8px">+1</button>
    <button @click="count--">-1</button>
    <p style="font-size: 12px; color: #999; margin: 8px 0 0">切换 Tab 后计数器会保留</p>
  </div>
</template>

<style scoped>
.tab-content-inner {
  padding: 16px;
  border-radius: 6px;
}
button {
  padding: 4px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
}
button:hover {
  border-color: #52c41a;
  color: #52c41a;
}
</style>
