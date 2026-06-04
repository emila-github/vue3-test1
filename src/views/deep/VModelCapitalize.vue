<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  modelModifiers?: { capitalize?: boolean }
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(e: Event) {
  let value = (e.target as HTMLInputElement).value
  if (props.modelModifiers?.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  emit('update:modelValue', value)
}
</script>

<template>
  <input
    :value="modelValue"
    @input="onInput"
    placeholder="输入内容（首字母自动大写）..."
    class="capitalize-input"
  />
</template>

<style scoped>
.capitalize-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.capitalize-input:focus {
  outline: none;
  border-color: #faad14;
  box-shadow: 0 0 0 2px rgba(250, 173, 20, 0.1);
}
</style>
