<script setup lang="ts">
defineProps<{
  items: Array<{ id: number; text: string; completed: boolean }>
}>()
</script>

<template>
  <ul class="todo-list">
    <li v-for="(item, index) in items" :key="item.id" class="todo-item">
      <slot name="todo" :todo="item" :index="index">
        {{ item.text }}
      </slot>
    </li>
  </ul>
</template>

<style scoped>
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-item {
  padding: 10px 14px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
}

.todo-item:last-child {
  border-bottom: none;
}
</style>
