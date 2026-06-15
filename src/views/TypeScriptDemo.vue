<script setup lang="ts">
import { ref, watch } from 'vue'
import BasicTypes from './ts/BasicTypes.vue'
import InterfaceType from './ts/InterfaceType.vue'
import FunctionType from './ts/FunctionType.vue'
import Generics from './ts/Generics.vue'
import ClassDemo from './ts/ClassDemo.vue'
import EnumDemo from './ts/EnumDemo.vue'
import TypeManipulation from './ts/TypeManipulation.vue'
import UtilityTypes from './ts/UtilityTypes.vue'
import TypeGuards from './ts/TypeGuards.vue'

const tabs = [
  { key: 'basic', label: '基础类型' },
  { key: 'interface', label: '接口/类型别名' },
  { key: 'function', label: '函数类型' },
  { key: 'generics', label: '泛型' },
  { key: 'class', label: '类与继承' },
  { key: 'enum', label: '枚举' },
  { key: 'type-manipulation', label: '类型操控' },
  { key: 'utility', label: '工具类型' },
  { key: 'guards', label: '类型守卫/断言' },
] as const

const currentTab = ref<(typeof tabs)[number]['key']>('basic')

watch(currentTab, () => window.scrollTo(0, 0))
</script>

<template>
  <div class="demo-page">
    <h1>TypeScript 学习示例</h1>

    <div class="layout">
      <div class="content-area">
        <BasicTypes v-if="currentTab === 'basic'" />
        <InterfaceType v-if="currentTab === 'interface'" />
        <FunctionType v-if="currentTab === 'function'" />
        <Generics v-if="currentTab === 'generics'" />
        <ClassDemo v-if="currentTab === 'class'" />
        <EnumDemo v-if="currentTab === 'enum'" />
        <TypeManipulation v-if="currentTab === 'type-manipulation'" />
        <UtilityTypes v-if="currentTab === 'utility'" />
        <TypeGuards v-if="currentTab === 'guards'" />
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
  width: 160px;
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
  color: #3178c6;
  background: #e8f0fe;
}

.tab-bar button.active {
  background: #3178c6;
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
    border-radius: 8px;
  }

  .tab-bar button {
    width: auto;
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
