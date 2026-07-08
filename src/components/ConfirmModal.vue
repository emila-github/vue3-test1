<script setup lang="ts">
defineProps<{ open: boolean; title?: string; content?: string }>()
const emit = defineEmits<{ 'update:open': [val: boolean]; ok: [] }>()
</script>

<template>
  <a-modal
    :open="open"
    :title="title || '确认操作'"
    destroy-on-close
    @ok="emit('ok')"
    @cancel="emit('update:open', false)"
  >
    <p>{{ content || '确定要执行此操作吗？' }}</p>
  </a-modal>
</template>
