<script setup lang="ts">
import { ref, watch } from 'vue'
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

watch(currentTab, () => window.scrollTo(0, 0))
</script>

<template>
  <div class="demo-page">
    <h1>内置组件</h1>

    <div class="layout">
      <div class="content-area">
        <TransitionDemo v-if="currentTab === 'transition'" />
        <TransitionGroupDemo v-if="currentTab === 'transition-group'" />
        <KeepAliveDemo v-if="currentTab === 'keep-alive'" />
        <TeleportDemo v-if="currentTab === 'teleport'" />
        <SuspenseDemo v-if="currentTab === 'suspense'" />
      </div>

      <aside class="tab-bar">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="currentTab = tab.key"
          :class="{ active: currentTab === tab.key }"
        >
          {{ tab.label }}
        </button>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.demo-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px 24px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 24px;
}

/* ===== 左右布局 ===== */
.layout {
  display: flex;
  gap: 28px;
  align-items: flex-start;
}

.content-area {
  flex: 1;
  min-width: 0;
}

/* ===== 右侧 tab 导航 ===== */
.tab-bar {
  position: sticky;
  top: 72px;
  z-index: 50;
  flex-shrink: 0;
  width: 150px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.tab-bar button {
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: transparent;
  font-size: 13px;
  text-align: left;
  color: #555;
  transition: all 0.2s;
}

.tab-bar button:hover {
  color: #13c2c2;
  background: #e6fffb;
}

.tab-bar button.active {
  background: #13c2c2;
  color: #fff;
}

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }

  .tab-bar {
    position: sticky;
    top: 52px;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 6px;
    gap: 4px;
  }

  .tab-bar button {
    width: auto;
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
