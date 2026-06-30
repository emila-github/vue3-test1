<script setup lang="ts">
defineProps<{
  type?: 'default' | 'primary' | 'danger'
  disabled?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button :class="['my-btn', `my-btn-${type || 'default'}`]" :disabled="disabled" @click="$emit('click')">
    <slot />
  </button>
</template>

<style scoped>
.my-btn {
  padding: 8px 20px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  background: #fff;
  transition: all 0.2s;
}

.my-btn:hover {
  opacity: 0.85;
}

.my-btn-primary {
  background: #1890ff;
  color: #fff;
  border-color: #1890ff;
}

.my-btn-danger {
  background: #ff4d4f;
  color: #fff;
  border-color: #ff4d4f;
}

.my-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
