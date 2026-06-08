<script setup lang="ts">
import { ref, nextTick } from 'vue'

let nextId = 4
const items = ref([
  { id: 1, text: '项目 A', color: '#e6f7ff' },
  { id: 2, text: '项目 B', color: '#f6ffed' },
  { id: 3, text: '项目 C', color: '#fff7e6' },
])

const colors = ['#e6f7ff', '#f6ffed', '#fff7e6', '#f9f0ff', '#fff2f0', '#e6fffb']

function addItem() {
  const index = Math.floor(Math.random() * (items.value.length + 1))
  const newItem = {
    id: nextId++,
    text: `项目 ${String.fromCharCode(64 + nextId)}`,
    color: colors[(nextId - 1) % colors.length],
  }
  items.value.splice(index, 0, newItem)
}

function removeItem(id: number) {
  items.value = items.value.filter((i) => i.id !== id)
}

function shuffle() {
  const shuffled = [...items.value]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  items.value = shuffled
}
</script>

<template>
  <div>
    <!-- 基本 TransitionGroup -->
    <section class="demo-section">
      <h2>1. 列表添加/移除动画</h2>
      <div class="controls">
        <button @click="addItem" class="demo-btn">随机添加</button>
        <button @click="shuffle" class="demo-btn">随机排序</button>
      </div>
      <TransitionGroup name="list" tag="ul" class="tg-list">
        <li
          v-for="item in items"
          :key="item.id"
          :style="{ background: item.color }"
          class="tg-item"
        >
          <span>{{ item.text }}</span>
          <button @click="removeItem(item.id)" class="remove-btn">×</button>
        </li>
      </TransitionGroup>
      <p class="hint">添加时从右侧滑入，移除时向左滑出，排序时有 FLIP 移动动画</p>
    </section>

    <!-- 对比表格 -->
    <section class="demo-section">
      <h2>2. Transition vs TransitionGroup</h2>
      <table class="compare-table">
        <thead>
          <tr>
            <th>特性</th>
            <th>Transition</th>
            <th>TransitionGroup</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>适用场景</td>
            <td>单个元素/组件</td>
            <td>列表多个元素</td>
          </tr>
          <tr>
            <td>渲染方式</td>
            <td>不渲染额外 DOM</td>
            <td>默认 &lt;span&gt;，可用 tag 指定</td>
          </tr>
          <tr>
            <td>key 必需</td>
            <td>否</td>
            <td>是，每个子元素必须唯一</td>
          </tr>
          <tr>
            <td>CSS 类</td>
            <td>v-enter/leave</td>
            <td>相同，额外支持 v-move</td>
          </tr>
          <tr>
            <td>过渡模式</td>
            <td>支持 mode</td>
            <td>不支持 mode</td>
          </tr>
          <tr>
            <td>FLIP 动画</td>
            <td>不支持</td>
            <td>支持 .v-move</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.demo-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #722ed1;
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

.controls {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.demo-btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
  transition: all 0.2s;
}

.demo-btn:hover {
  border-color: #722ed1;
  color: #722ed1;
}

/* TransitionGroup 列表 */
.tg-list {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
}

.tg-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  margin-bottom: 6px;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  font-size: 15px;
  transition: all 0.3s;
}

.remove-btn {
  border: none;
  background: transparent;
  color: #999;
  font-size: 18px;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

.remove-btn:hover {
  color: #f5222d;
}

/* 对比表格 */
.compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.compare-table th,
.compare-table td {
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  text-align: left;
}

.compare-table th {
  background: #f0f0f0;
  font-weight: 600;
}

.compare-table tr:hover td {
  background: #fafafa;
}
</style>

<!-- 非 scoped：TransitionGroup 类名 -->
<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 关键：离开时脱离文档流，实现平滑过渡 */
.list-leave-active {
  position: absolute;
}

/* FLIP 移动动画 */
.list-move {
  transition: transform 0.5s ease;
}
</style>
