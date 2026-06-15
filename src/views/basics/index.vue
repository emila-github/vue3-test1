<script setup lang="ts">
import { shallowRef } from 'vue'
import TemplateSyntax from './TemplateSyntax.vue'
import Reactivity from './Reactivity.vue'
import ComputedDemo from './ComputedDemo.vue'
import ClassStyleBinding from './ClassStyleBinding.vue'
import ConditionalRendering from './ConditionalRendering.vue'
import ListRendering from './ListRendering.vue'
import EventHandling from './EventHandling.vue'
import FormBinding from './FormBinding.vue'
import Watchers from './Watchers.vue'
import TemplateRefs from './TemplateRefs.vue'
import ComponentsDemo from './ComponentsDemo.vue'
import Lifecycle from './Lifecycle.vue'

const activeTab = shallowRef('template-syntax')

const tabs = [
  { key: 'template-syntax', label: '模板语法' },
  { key: 'reactivity', label: '响应式' },
  { key: 'computed', label: '计算属性' },
  { key: 'class-style', label: '类与样式' },
  { key: 'conditional', label: '条件渲染' },
  { key: 'list', label: '列表渲染' },
  { key: 'events', label: '事件处理' },
  { key: 'form', label: '表单绑定' },
  { key: 'watchers', label: '侦听器' },
  { key: 'template-refs', label: '模板引用' },
  { key: 'components-demo', label: '组件基础' },
  { key: 'lifecycle', label: '生命周期' },
]
</script>

<template>
  <div class="demo-page">
    <h1>Vue 3 基础</h1>

    <div class="layout">
      <div class="content-area">
        <TemplateSyntax v-if="activeTab === 'template-syntax'" />
        <Reactivity v-if="activeTab === 'reactivity'" />
        <ComputedDemo v-if="activeTab === 'computed'" />
        <ClassStyleBinding v-if="activeTab === 'class-style'" />
        <ConditionalRendering v-if="activeTab === 'conditional'" />
        <ListRendering v-if="activeTab === 'list'" />
        <EventHandling v-if="activeTab === 'events'" />
        <FormBinding v-if="activeTab === 'form'" />
        <Watchers v-if="activeTab === 'watchers'" />
        <TemplateRefs v-if="activeTab === 'template-refs'" />
        <ComponentsDemo v-if="activeTab === 'components-demo'" />
        <Lifecycle v-if="activeTab === 'lifecycle'" />
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
  white-space: nowrap;
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
