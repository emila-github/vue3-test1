<script setup lang="ts">
defineProps<{
  firstName: string
  lastName: string
}>()

defineEmits<{
  'update:firstName': [value: string]
  'update:lastName': [value: string]
}>()
</script>

<template>
  <div class="form-row">
    <input
      :value="firstName"
      @input="$emit('update:firstName', ($event.target as HTMLInputElement).value)"
      placeholder="姓"
    />
    <input
      :value="lastName"
      @input="$emit('update:lastName', ($event.target as HTMLInputElement).value)"
      placeholder="名"
    />
  </div>
</template>

<style scoped>
.form-row {
  display: flex;
  gap: 12px;
}

input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #52c41a;
  box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.1);
}
</style>
