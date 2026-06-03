<script setup lang="ts">
const emit = defineEmits<{
  update: [value: number]
  reset: []
}>()

let count = 0

function increment() {
  count++
  emit('update', count)
}

function reset() {
  count = 0
  emit('reset')
}
</script>

<template>
  <div class="counter-button">
    <button class="btn-inc" @click="increment">+1</button>
    <button class="btn-reset" @click="reset">重置</button>
  </div>
</template>

<style scoped>
.counter-button {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

button {
  padding: 6px 18px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background: #fff;
}

.btn-inc:hover {
  border-color: #52c41a;
  color: #52c41a;
}

.btn-reset:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}
</style>
