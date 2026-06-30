<script setup lang="ts">
import { ref, onActivated, onDeactivated } from 'vue'

const count = ref(0)

onActivated(() => {
  console.log('Tab C 被激活 (onActivated)')
})

onDeactivated(() => {
  console.log('Tab C 被失活 (onDeactivated)')
})
</script>

<template>
  <div class="tab-content-inner" style="background: #fff7e6; border: 1px solid #ffd591">
    <p style="color: #fa8c16; margin: 0 0 8px; font-weight: bold">Tab C — 橙色区域</p>
    <p>
      计数器: <strong>{{ count }}</strong>
    </p>
    <button @click="count++" style="margin-right: 8px">+1</button>
    <button @click="count--">-1</button>
    <p style="font-size: 12px; color: #999; margin: 8px 0 0">如果 exclude 中包含此组件，切换回来计数器将重置</p>
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
  border-color: #fa8c16;
  color: #fa8c16;
}
</style>
