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

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-btn', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="tab-content">
      <PropsDemo v-if="activeTab === 'props'" />
      <EventsDemo v-if="activeTab === 'events'" />
      <VModelDemo v-if="activeTab === 'vmodel'" />
      <AttrsDemo v-if="activeTab === 'attrs'" />
      <SlotsDeepDemo v-if="activeTab === 'slots'" />
      <ProvideInjectDemo v-if="activeTab === 'provide'" />
      <AsyncCompDemo v-if="activeTab === 'async'" />
    </div>
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

.tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  background: #f5f5f5;
  padding: 6px;
  border-radius: 8px;
}

.tab-btn {
  padding: 8px 18px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
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

.tab-content {
  min-height: 400px;
}
</style>
