<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main>
    <TheWelcome />

    <div class="api-demo-entry">
      <RouterLink to="/api-demo" class="api-demo-link">📡 API Demo（接口示例）</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.api-demo-entry {
  text-align: center;
  padding: 2rem;
}
.api-demo-link {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: hsla(160, 100%, 37%, 1);
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}
.api-demo-link:hover {
  background: hsla(160, 100%, 30%, 1);
}
</style>
