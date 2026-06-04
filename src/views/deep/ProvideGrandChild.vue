<script setup lang="ts">
import { inject, type Ref } from 'vue'

// 深层后代也能注入祖先 provide 的数据
const theme = inject<Ref<string>>('theme', { value: 'light' } as Ref<string>)
const appName = inject<string>('appName', 'Unknown')
const setTheme = inject<(name: string) => void>('setTheme', () => {})

const themeColors: Record<string, { bg: string; color: string }> = {
  light: { bg: '#fafafa', color: '#555' },
  dark: { bg: '#16213e', color: '#aaa' },
  blue: { bg: '#bae7ff', color: '#003a8c' },
}

const style = themeColors[theme?.value || 'light'] || themeColors.light
</script>

<template>
  <div class="grand-child" :style="{ background: style.bg, color: style.color }">
    <p><strong>孙组件（深层 Injector）</strong></p>
    <p>appName：{{ appName }}</p>
    <p>theme：{{ theme }}</p>
    <button @click="setTheme('dark')" class="gc-btn">设为 dark</button>
    <button @click="setTheme('blue')" class="gc-btn">设为 blue</button>
    <button @click="setTheme('light')" class="gc-btn">设为 light</button>
  </div>
</template>

<style scoped>
.grand-child {
  padding: 12px 16px;
  border-radius: 6px;
  margin-top: 12px;
}

p { margin: 4px 0; font-size: 13px; }

.gc-btn {
  padding: 4px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  font-size: 12px;
  margin-right: 4px;
  margin-top: 6px;
}

.gc-btn:hover { border-color: #2f54eb; color: #2f54eb; }
</style>
