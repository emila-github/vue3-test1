<script setup lang="ts">
</script>

<template>
  <div class="slots-card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>

    <div class="card-body">
      <slot>默认内容</slot>
    </div>

    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.slots-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  padding: 12px 16px;
  background: #e6fffb;
  border-bottom: 1px solid #b5f5ec;
}

.card-body {
  padding: 16px;
}

.card-footer {
  padding: 10px 16px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
  text-align: right;
}
</style>
