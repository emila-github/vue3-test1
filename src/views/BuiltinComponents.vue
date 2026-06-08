<script setup lang="ts">
import { ref } from 'vue'
import TransitionDemo from './builtin/TransitionDemo.vue'
import TransitionGroupDemo from './builtin/TransitionGroupDemo.vue'
import KeepAliveDemo from './builtin/KeepAliveDemo.vue'
import TeleportDemo from './builtin/TeleportDemo.vue'
import SuspenseDemo from './builtin/SuspenseDemo.vue'

const tabs = [
  { key: 'transition', label: 'Transition' },
  { key: 'transition-group', label: 'TransitionGroup' },
  { key: 'keep-alive', label: 'KeepAlive' },
  { key: 'teleport', label: 'Teleport' },
  { key: 'suspense', label: 'Suspense' },
] as const

const currentTab = ref<(typeof tabs)[number]['key']>('transition')
</script>

<template>
  <div class="demo-page">
    <h1>内置组件</h1>

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

    <TransitionDemo v-if="currentTab === 'transition'" />
    <TransitionGroupDemo v-if="currentTab === 'transition-group'" />
    <KeepAliveDemo v-if="currentTab === 'keep-alive'" />
    <TeleportDemo v-if="currentTab === 'teleport'" />
    <SuspenseDemo v-if="currentTab === 'suspense'" />
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
  flex-wrap: wrap;
}

.tab-bar button {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  transition: all 0.2s;
}

.tab-bar button:hover {
  border-color: #13c2c2;
  color: #13c2c2;
}

.tab-bar button.active {
  background: #13c2c2;
  color: #fff;
  border-color: #13c2c2;
}
</style>
