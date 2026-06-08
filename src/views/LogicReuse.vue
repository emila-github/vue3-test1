<script setup lang="ts">
import { ref } from 'vue'
import ComposablesDemo from './logic/ComposablesDemo.vue'
import DirectivesDemo from './logic/DirectivesDemo.vue'
import PluginsDemo from './logic/PluginsDemo.vue'

const tabs = [
  { key: 'composables', label: '组合式函数' },
  { key: 'directives', label: '自定义指令' },
  { key: 'plugins', label: '插件' },
] as const

const currentTab = ref<(typeof tabs)[number]['key']>('composables')
</script>

<template>
  <div class="demo-page">
    <h1>逻辑复用</h1>

    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="currentTab = tab.key"
        :class="{ active: currentTab === tab.key }"
      >
        {{ tab.label }}
      </button>
    </div>

    <ComposablesDemo v-if="currentTab === 'composables'" />
    <DirectivesDemo v-if="currentTab === 'directives'" />
    <PluginsDemo v-if="currentTab === 'plugins'" />
  </div>
</template>

<style scoped>
.demo-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 24px;
}

.tab-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  justify-content: center;
}

.tab-bar button {
  padding: 8px 20px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  transition: all 0.2s;
}

.tab-bar button:hover {
  border-color: #597ef7;
  color: #597ef7;
}

.tab-bar button.active {
  background: #597ef7;
  color: #fff;
  border-color: #597ef7;
}
</style>
