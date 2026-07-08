<script setup lang="ts">
defineProps<{ value: string; placeholder?: string }>()
const emit = defineEmits<{ 'update:value': [val: string] }>()
</script>

<template>
  <a-input-search
    :value="value"
    :placeholder="placeholder || '搜索'"
    @change="(e: any) => emit('update:value', e.target.value)"
    style="width: 300px"
  />
</template>
