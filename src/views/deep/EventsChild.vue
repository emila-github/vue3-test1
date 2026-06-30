<script setup lang="ts">
const emit = defineEmits<{
  submit: [email: string, password: string]
  cancel: []
  update: [value: number]
}>()

let count = 0

function handleSubmit() {
  emit('submit', 'user@example.com', '123456')
}

function handleCancel() {
  emit('cancel')
}

function increment() {
  count++
  emit('update', count)
}

function decrement() {
  count--
  emit('update', count)
}
</script>

<template>
  <div class="events-child">
    <div class="btn-group">
      <button class="btn-submit" @click="handleSubmit">提交（带参数）</button>
      <button class="btn-cancel" @click="handleCancel">取消</button>
    </div>
    <div class="btn-group" style="margin-top: 8px">
      <button @click="decrement">-1</button>
      <span class="count">{{ count }}</span>
      <button @click="increment">+1</button>
    </div>
  </div>
</template>

<style scoped>
.events-child {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e8e8e8;
}

.btn-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

button {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
}

button:hover {
  border-color: #722ed1;
  color: #722ed1;
}

.btn-submit {
  background: #f9f0ff;
  border-color: #d3adf7;
  color: #722ed1;
}
.btn-cancel {
  background: #fff1f0;
  border-color: #ffa39e;
  color: #ff4d4f;
}

.count {
  font-weight: bold;
  font-size: 18px;
  min-width: 40px;
  text-align: center;
}
</style>
