<script setup lang="ts">
import { ref, onActivated, onDeactivated } from 'vue'

const count = ref(0)

onActivated(() => {
  console.log('Tab A 被激活 (onActivated)')
})

onDeactivated(() => {
  console.log('Tab A 被失活 (onDeactivated)')
})
</script>

<template>
  <div class="tab-content-inner" style="background: #e6f7ff; border: 1px solid #91d5ff">
    <p style="color: #1890ff; margin: 0 0 8px; font-weight: bold">Tab A — 蓝色区域</p>
    <p>
      计数器: <strong>{{ count }}</strong>
    </p>
    <input v-model="count" type="number" class="mini-input" placeholder="输入数值" />
    <p style="font-size: 12px; color: #999; margin: 8px 0 0">切换 Tab 后计数器和输入值都会保留</p>
  </div>
</template>

<style scoped>
.tab-content-inner {
  padding: 16px;
  border-radius: 6px;
}
.mini-input {
  width: 100px;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}
</style>
