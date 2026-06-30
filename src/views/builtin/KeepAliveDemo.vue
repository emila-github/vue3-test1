<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import KeepAliveTabA from './KeepAliveTabA.vue'
import KeepAliveTabB from './KeepAliveTabB.vue'
import KeepAliveTabC from './KeepAliveTabC.vue'

const tabs = [
  { key: 'a', label: 'Tab A', component: KeepAliveTabA, color: '#1890ff' },
  { key: 'b', label: 'Tab B', component: KeepAliveTabB, color: '#52c41a' },
  { key: 'c', label: 'Tab C', component: KeepAliveTabC, color: '#fa8c16' },
]

const currentTabKey = ref('a')
const currentTab = shallowRef(tabs[0]!.component)

function switchTab(key: string) {
  currentTabKey.value = key
  const tab = tabs.find((t) => t.key === key)
  if (tab) currentTab.value = tab.component
}

// 缓存策略
const includeStr = ref('KeepAliveTabA,KeepAliveTabB')
const includeMode = ref<'all' | 'ab' | 'none'>('all')

function setInclude(mode: 'all' | 'ab' | 'none') {
  includeMode.value = mode
  switch (mode) {
    case 'all':
      includeStr.value = 'KeepAliveTabA,KeepAliveTabB,KeepAliveTabC'
      break
    case 'ab':
      includeStr.value = 'KeepAliveTabA,KeepAliveTabB'
      break
    case 'none':
      includeStr.value = ''
      break
  }
}
</script>

<template>
  <div>
    <!-- 基本 KeepAlive -->
    <section class="demo-section">
      <h2>1. 基本用法 — Tab 切换保持状态</h2>
      <div class="tab-bar">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="switchTab(tab.key)"
          :class="{ active: currentTabKey === tab.key }"
          :style="currentTabKey === tab.key ? { background: tab.color, borderColor: tab.color } : {}"
          class="tab-btn"
        >
          {{ tab.label }}
        </button>
      </div>
      <div class="tab-content">
        <KeepAlive>
          <component :is="currentTab" />
        </KeepAlive>
      </div>
      <p class="hint">切换 Tab 时各组件状态被保留（计数器不会重置、输入内容不会丢失）</p>
    </section>

    <!-- include/exclude 策略 -->
    <section class="demo-section">
      <h2>2. include / exclude 控制缓存</h2>
      <div class="strategy-btns">
        <button @click="setInclude('all')" :class="{ 'strategy-active': includeMode === 'all' }" class="strategy-btn">
          缓存全部 (TabA,TabB,TabC)
        </button>
        <button @click="setInclude('ab')" :class="{ 'strategy-active': includeMode === 'ab' }" class="strategy-btn">
          只缓存 TabA,TabB
        </button>
        <button @click="setInclude('none')" :class="{ 'strategy-active': includeMode === 'none' }" class="strategy-btn">
          不缓存
        </button>
      </div>
      <p class="hint">
        当前: <code>&lt;KeepAlive :include="'{{ includeStr }}'"&gt;</code>
        — 切换 Tab C 到不缓存的模式，观察计数器是否重置
      </p>
    </section>

    <!-- max 最大缓存数 -->
    <section class="demo-section">
      <h2>3. max 最大缓存数</h2>
      <pre class="code-hint">
&lt;KeepAlive :max="5"&gt;
  &lt;component :is="currentComponent" /&gt;
&lt;/KeepAlive&gt;</pre
      >
      <p class="hint">当缓存数量超过 max 时，最早且未被访问的实例会被销毁</p>
    </section>

    <!-- 缓存生命周期 -->
    <section class="demo-section">
      <h2>4. 缓存生命周期钩子</h2>
      <pre class="code-hint">
// 组件被激活（从缓存中恢复显示）
onActivated(() => {
  console.log('组件被激活')
  // 可以在这里刷新数据
})

// 组件被失活（进入缓存）
onDeactivated(() => {
  console.log('组件被失活')
  // 清理定时器、取消订阅等
})</pre
      >
      <p class="hint">打开控制台，切换 Tab 查看 onActivated / onDeactivated 日志</p>
    </section>
  </div>
</template>

<style scoped>
.demo-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #597ef7;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
}

.hint {
  color: #999;
  font-size: 13px;
  margin-top: 8px;
}

code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
}

/* Tab */
.tab-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-btn {
  padding: 8px 20px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  transition: all 0.2s;
  color: #333;
}

.tab-btn:hover {
  border-color: #597ef7;
}

.tab-btn.active {
  color: #fff;
}

.tab-content {
  min-height: 100px;
  padding: 16px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
}

/* 策略按钮 */
.strategy-btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.strategy-btn {
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  font-size: 13px;
  transition: all 0.2s;
}

.strategy-btn:hover {
  border-color: #597ef7;
}

.strategy-btn.strategy-active {
  background: #597ef7;
  color: #fff;
  border-color: #597ef7;
}

/* 代码块 */
.code-hint {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 14px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  margin: 0;
}
</style>
