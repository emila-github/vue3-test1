<script setup lang="ts">
import { ref, computed } from 'vue'
import PropsChild from './PropsChild.vue'

const title = ref('动态标题')
const likes = ref(100)
const tags = ref(['Vue', 'TypeScript', 'Vite'])
const status = ref('active')

function toggleStatus() {
  status.value = status.value === 'active' ? 'inactive' : 'active'
}
</script>

<template>
  <div class="section">
    <h2>Props 深入</h2>

    <!-- 控制面板 -->
    <div class="panel">
      <div class="control">
        <label>title：</label>
        <input v-model="title" />
      </div>
      <div class="control">
        <label>likes：</label>
        <button @click="likes++">+1</button>
        <span class="value">{{ likes }}</span>
        <button @click="likes--">-1</button>
      </div>
      <div class="control">
        <label>status：</label>
        <button @click="toggleStatus">切换 ({{ status }})</button>
      </div>
      <div class="control">
        <label>tags：</label>
        <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>

    <!-- Props 演示子组件 -->
    <div class="result">
      <h4>子组件渲染：</h4>
      <PropsChild
        :title="title"
        :likes="likes"
        :tags="tags"
        :status="status"
        :is-active="true"
        disabled
      />
    </div>

    <!-- 说明 -->
    <div class="info">
      <h4>Props 要点：</h4>
      <ul>
        <li><code>required</code>：必填 prop，缺失时控制台警告</li>
        <li><code>default</code>：默认值，对象/数组用工厂函数</li>
        <li><code>validator</code>：自定义校验函数</li>
        <li><code>Boolean</code>：仅写属性名等价于 <code>:disabled="true"</code></li>
        <li>单向数据流：子组件不应直接修改 prop</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #1890ff;
}

h2 { margin: 0 0 16px 0; color: #333; }
h4 { margin: 16px 0 8px 0; color: #555; }

.panel {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #f0f0f0;
}

.control {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}

.control label {
  min-width: 70px;
  font-weight: 500;
  color: #666;
}

input {
  padding: 5px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  width: 180px;
}

button {
  padding: 4px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
}

button:hover { border-color: #1890ff; color: #1890ff; }

.value {
  font-weight: bold;
  min-width: 30px;
  text-align: center;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 3px;
  font-size: 12px;
  margin-right: 4px;
}

.result {
  background: #fffbe6;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #ffe58f;
}

.info {
  background: #f0f5ff;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #555;
}

.info ul { margin: 4px 0; padding-left: 20px; }
.info li { margin: 4px 0; }
.info code {
  background: #e6f7ff;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
  color: #1890ff;
}
</style>
