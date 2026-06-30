<script setup lang="ts">
import { provide, ref, readonly } from 'vue'
import ProvideChild from './ProvideChild.vue'

const theme = ref('light')
const themes = ['light', 'dark', 'blue']
const appName = 'My Vue 3 App'
const config = { locale: 'zh-CN', version: '3.5' }

// 提供响应式数据
provide('theme', readonly(theme))
provide('appName', appName)
provide('config', config)

function toggleTheme() {
  const idx = themes.indexOf(theme.value)
  theme.value = themes[(idx + 1) % themes.length]!
}

// 提供更新方法
function setTheme(name: string) {
  theme.value = name
}
provide('toggleTheme', toggleTheme)
provide('setTheme', setTheme)
</script>

<template>
  <div class="section">
    <h2>依赖注入（provide / inject）</h2>

    <div class="panel">
      <h4>祖先组件（Provider）</h4>
      <p>
        当前主题：<strong>{{ theme }}</strong>
      </p>
      <div class="theme-buttons">
        <button v-for="t in themes" :key="t" :class="['theme-btn', { active: theme === t }]" @click="setTheme(t)">
          {{ t }}
        </button>
      </div>
      <p class="hint">通过 provide 向下传递：theme（只读）、appName、config、toggleTheme、setTheme</p>
    </div>

    <!-- 子组件 -->
    <ProvideChild />

    <!-- 说明 -->
    <div class="info">
      <h4>依赖注入要点：</h4>
      <ul>
        <li><code>provide(key, value)</code> 提供数据</li>
        <li><code>inject(key, defaultValue)</code> 注入数据</li>
        <li>推荐提供 <code>readonly</code> 数据，防止子组件直接修改</li>
        <li>可以提供一个更新方法让子组件调用</li>
        <li>使用 <code>Symbol</code> 作为 key 避免命名冲突</li>
        <li><code>app.provide()</code> 在应用层全局提供</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #2f54eb;
}

h2 {
  margin: 0 0 16px 0;
  color: #333;
}
h4 {
  margin: 0 0 8px 0;
  color: #555;
}

.panel {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #f0f0f0;
}

.theme-buttons {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.theme-btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  text-transform: capitalize;
}

.theme-btn:hover {
  border-color: #2f54eb;
  color: #2f54eb;
}
.theme-btn.active {
  background: #2f54eb;
  color: #fff;
  border-color: #2f54eb;
}

.hint {
  color: #999;
  font-size: 13px;
  margin-top: 8px;
}

.info {
  background: #f0f5ff;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #555;
  margin-top: 12px;
}

.info ul {
  margin: 4px 0;
  padding-left: 20px;
}
.info li {
  margin: 4px 0;
}
.info code {
  background: #d6e4ff;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
  color: #2f54eb;
}
</style>
