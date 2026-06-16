<script setup lang="ts">
import { ref } from 'vue'
import SlotsCard from './SlotsCard.vue'
import SlotsTodoList from './SlotsTodoList.vue'

const dynamicSlot = ref('header')

const todos = ref([
  { id: 1, text: '学习 Vue 3 插槽', completed: true },
  { id: 2, text: '学习作用域插槽', completed: true },
  { id: 3, text: '学习动态插槽', completed: false },
  { id: 4, text: '完成项目实战', completed: false },
])

const themes = ['header', 'default', 'footer']
function toggleDynamicSlot() {
  const idx = themes.indexOf(dynamicSlot.value)
  dynamicSlot.value = themes[(idx + 1) % themes.length]!
}
</script>

<template>
  <div class="section">
    <h2>插槽 深入</h2>

    <!-- 1. 具名插槽 -->
    <div class="panel">
      <h4>1. 具名插槽</h4>
      <SlotsCard>
        <template #header>
          <span style="font-size: 18px">📋 任务清单</span>
        </template>

        <p>这是默认插槽的主体内容区域</p>

        <template #footer>
          <span style="color: #999; font-size: 13px">
            共 {{ todos.length }} 项任务
          </span>
        </template>
      </SlotsCard>
    </div>

    <!-- 2. 作用域插槽 -->
    <div class="panel">
      <h4>2. 作用域插槽</h4>
      <SlotsTodoList :items="todos">
        <template #todo="{ todo, index }">
          <span class="todo-index">{{ index + 1 }}.</span>
          <span :class="{ done: todo.completed }">{{ todo.text }}</span>
          <span v-if="todo.completed" class="check">✅</span>
        </template>
      </SlotsTodoList>
    </div>

    <!-- 3. 动态插槽 -->
    <div class="panel">
      <h4>3. 动态插槽名（当前：{{ dynamicSlot }}）</h4>
      <button @click="toggleDynamicSlot" style="margin-bottom: 8px">切换插槽名</button>
      <SlotsCard>
        <template #[dynamicSlot]>
          <strong>动态 {{ dynamicSlot }} 插槽内容</strong>
        </template>
        默认内容
      </SlotsCard>
    </div>

    <div class="info">
      <h4>插槽要点：</h4>
      <ul>
        <li><code>&lt;slot&gt;</code> 默认插槽，<code>&lt;slot name="xxx"&gt;</code> 具名插槽</li>
        <li><code>$slots</code> 判断插槽是否存在，实现条件渲染</li>
        <li><code>v-slot:[dynamicName]</code> 动态插槽名</li>
        <li>作用域插槽让父组件访问子组件数据</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #13c2c2;
}

h2 { margin: 0 0 16px 0; color: #333; }
h4 { margin: 0 0 8px 0; color: #555; }

.panel {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #f0f0f0;
}

.todo-index { color: #999; margin-right: 8px; }
.done { text-decoration: line-through; color: #bbb; }
.check { margin-left: 8px; }

button {
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
}

button:hover { border-color: #13c2c2; color: #13c2c2; }

.info {
  background: #e6fffb;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #555;
}

.info ul { margin: 4px 0; padding-left: 20px; }
.info li { margin: 4px 0; }
.info code {
  background: #b5f5ec;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
  color: #08979c;
}
</style>
