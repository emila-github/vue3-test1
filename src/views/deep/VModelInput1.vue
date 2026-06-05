<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input :value="modelValue" @input="onInput" placeholder="输入内容..." class="vmodel-input" />
</template>

<style scoped>
.vmodel-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.vmodel-input:focus {
  outline: none;
  border-color: #52c41a;
  box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.1);
}
</style>
