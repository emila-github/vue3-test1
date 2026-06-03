<script setup lang="ts">
defineProps<{
  items: Array<{ id: number; name: string; price?: number }>
}>()
</script>

<template>
  <ul class="list-component">
    <li v-for="(item, index) in items" :key="item.id" class="list-item">
      <slot name="item" :item="item" :index="index">
        {{ item.name }}
      </slot>
    </li>
  </ul>
</template>

<style scoped>
.list-component {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  padding: 10px 14px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
}

.list-item:last-child {
  border-bottom: none;
}
</style>
