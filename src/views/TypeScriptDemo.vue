<script setup lang="ts">
import { ref } from 'vue'
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
</script>

<template>
  <div class="demo-page">
    <h1>TypeScript 学习示例</h1>

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
</template>

<style scoped>
.demo-page {
  max-width: 960px;
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
  gap: 6px;
  margin-bottom: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.tab-bar button {
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  font-size: 13px;
  transition: all 0.2s;
}

.tab-bar button:hover {
  border-color: #3178c6;
  color: #3178c6;
}

.tab-bar button.active {
  background: #3178c6;
  color: #fff;
  border-color: #3178c6;
}
</style>
