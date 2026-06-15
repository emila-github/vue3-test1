<script setup lang="ts">
import { ref, computed } from 'vue'
import PropsDemo from './deep/PropsDemo.vue'
import EventsDemo from './deep/EventsDemo.vue'
import VModelDemo from './deep/VModelDemo.vue'
import AttrsDemo from './deep/AttrsDemo.vue'
import SlotsDeepDemo from './deep/SlotsDeepDemo.vue'
import ProvideInjectDemo from './deep/ProvideInjectDemo.vue'
import AsyncCompDemo from './deep/AsyncCompDemo.vue'

const activeTab = ref('props')

const tabs = [
  { key: 'props', label: 'Props' },
  { key: 'events', label: '事件' },
  { key: 'vmodel', label: 'v-model' },
  { key: 'attrs', label: '透传' },
  { key: 'slots', label: '插槽' },
  { key: 'provide', label: '依赖注入' },
  { key: 'async', label: '异步组件' },
]
</script>

<template>
  <div class="demo-page">
    <h1>深入组件</h1>

    <div class="layout">
      <div class="content-area">
        <PropsDemo v-if="activeTab === 'props'" />
        <EventsDemo v-if="activeTab === 'events'" />
        <VModelDemo v-if="activeTab === 'vmodel'" />
        <AttrsDemo v-if="activeTab === 'attrs'" />
        <SlotsDeepDemo v-if="activeTab === 'slots'" />
        <ProvideInjectDemo v-if="activeTab === 'provide'" />
        <AsyncCompDemo v-if="activeTab === 'async'" />
      </div>

      <aside class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
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
.tabs {
  position: sticky;
  top: 72px;
  z-index: 50;
  flex-shrink: 0;
  width: 130px;
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

.tab-btn {
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  text-align: left;
  color: #555;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #1890ff;
  background: #e6f7ff;
}

.tab-btn.active {
  background: #1890ff;
  color: #fff;
}

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }

  .tabs {
    position: sticky;
    top: 52px;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 6px;
    gap: 4px;
  }

  .tab-btn {
    width: auto;
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
