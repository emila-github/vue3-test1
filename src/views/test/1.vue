<template>
  <div class=""></div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'

defineProps<{
  id: number
}>()

defineEmits<{
  update: [value: number]
  reset: []
}>()
</script>
<style scoped></style>
