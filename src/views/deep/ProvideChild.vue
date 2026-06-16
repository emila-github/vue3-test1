<script setup lang="ts">
import { inject, type Ref, type ComputedRef } from 'vue'
import ProvideGrandChild from './ProvideGrandChild.vue'

const theme = inject<Ref<string>>('theme')
const appName = inject<string>('appName', 'Unknown App')
const config = inject<{ locale: string; version: string }>('config')
const toggleTheme = inject<() => void>('toggleTheme', () => {})

const themeColors: Record<string, { bg: string; color: string; border: string }> = {
  light: { bg: '#ffffff', color: '#333', border: '#e8e8e8' },
  dark: { bg: '#1a1a2e', color: '#e0e0e0', border: '#333' },
  blue: { bg: '#e6f7ff', color: '#003a8c', border: '#91d5ff' },
}

const currentStyle = themeColors[theme?.value || 'light'] ?? themeColors.light!
</script>

<template>
  <div class="provide-child" :style="{ background: currentStyle.bg, color: currentStyle.color, borderColor: currentStyle.border }">
    <h4>子组件（Injector）</h4>
    <p>appName：<strong>{{ appName }}</strong></p>
    <p>config：{{ JSON.stringify(config) }}</p>
    <p>当前主题：<strong>{{ theme }}</strong></p>
    <button @click="toggleTheme" class="child-btn">切换主题</button>

    <!-- 孙组件 -->
    <ProvideGrandChild />
  </div>
</template>

<style scoped>
.provide-child {
  padding: 16px;
  border-radius: 8px;
  border: 1px solid;
  margin-top: 12px;
}

h4 { margin: 0 0 8px 0; }
p { margin: 4px 0; font-size: 14px; }

.child-btn {
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  margin-top: 8px;
}

.child-btn:hover { border-color: #2f54eb; color: #2f54eb; }
</style>
