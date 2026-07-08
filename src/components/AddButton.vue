<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'

defineProps<{ label?: string }>()
</script>

<template>
  <a-button type="primary" v-bind="$attrs">
    <template #icon><PlusOutlined /></template>
    <slot>{{ label || '新建' }}</slot>
  </a-button>
</template>
