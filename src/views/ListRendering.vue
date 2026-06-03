<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// ====== 遍历数组 ======
const items = ref([
  { id: 1, name: '项目一' },
  { id: 2, name: '项目二' },
  { id: 3, name: '项目三' },
])

// ====== 遍历对象 ======
const userInfo = reactive({
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com',
})

// ====== 数组变更检测 ======
const numList = ref([1, 2, 3, 4, 5])

function addItem() {
  numList.value.push(numList.value.length + 1)
}
function removeItem() {
  numList.value.pop()
}
function replaceAll() {
  numList.value = [10, 20, 30]
}

// ====== v-for 与 v-if ======
const todoItems = ref([
  { id: 1, name: '学习 Vue 3', isActive: true },
  { id: 2, name: '写项目', isActive: false },
  { id: 3, name: '复习笔记', isActive: true },
  { id: 4, name: '代码审查', isActive: false },
])

const activeItems = computed(() => todoItems.value.filter((item) => item.isActive))

// ====== 过滤排序 ======
const keyword = ref('')
const products = ref([
  { id: 1, name: '苹果', price: 10 },
  { id: 2, name: '香蕉', price: 5 },
  { id: 3, name: '橙子', price: 8 },
  { id: 4, name: '葡萄', price: 15 },
])

const filteredProducts = computed(() =>
  products.value
    .filter((item) => item.name.includes(keyword.value))
    .sort((a, b) => a.price - b.price),
)
</script>

<template>
  <div class="demo-page">
    <h1>列表渲染</h1>

    <!-- 1. 遍历数组 -->
    <section class="demo-section">
      <h2>1. 遍历数组</h2>
      <ul>
        <li v-for="(item, index) in items" :key="item.id">
          {{ index }} - {{ item.name }}
        </li>
      </ul>
    </section>

    <!-- 2. 遍历对象 -->
    <section class="demo-section">
      <h2>2. 遍历对象</h2>
      <ul>
        <li v-for="(value, key, index) in userInfo" :key="key">
          {{ index }}. {{ key }}: {{ value }}
        </li>
      </ul>
    </section>

    <!-- 3. 遍历数字 -->
    <section class="demo-section">
      <h2>3. 遍历数字</h2>
      <span v-for="n in 5" :key="n" class="number-badge">{{ n }}</span>
    </section>

    <!-- 4. 数组变更检测 -->
    <section class="demo-section">
      <h2>4. 数组变更检测</h2>
      <p>列表：{{ numList.join(', ') }}</p>
      <button @click="addItem">push 末尾添加</button>
      <button @click="removeItem" style="margin-left: 8px">pop 末尾删除</button>
      <button @click="replaceAll" style="margin-left: 8px">替换整个数组</button>
    </section>

    <!-- 5. v-for 与 v-if -->
    <section class="demo-section">
      <h2>5. v-for 与 v-if（使用 computed 过滤）</h2>
      <h4>全部事项：</h4>
      <ul>
        <li v-for="item in todoItems" :key="item.id" :class="{ done: item.isActive }">
          {{ item.name }}
        </li>
      </ul>
      <h4>仅活跃事项（computed 过滤）：</h4>
      <ul>
        <li v-for="item in activeItems" :key="item.id" class="active-item">
          {{ item.name }}
        </li>
      </ul>
    </section>

    <!-- 6. 过滤排序 -->
    <section class="demo-section">
      <h2>6. 搜索过滤 + 排序</h2>
      <input v-model="keyword" placeholder="搜索商品名称..." />
      <ul>
        <li v-for="item in filteredProducts" :key="item.id">
          {{ item.name }} - <strong>¥{{ item.price }}</strong>
        </li>
      </ul>
      <p v-if="filteredProducts.length === 0" class="hint">无匹配结果</p>
    </section>
  </div>
</template>

<style scoped>
.demo-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.demo-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #eb2f96;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
}

.demo-section h4 {
  margin: 12px 0 4px 0;
  color: #666;
}

ul {
  margin: 4px 0;
  padding-left: 20px;
}

.number-badge {
  display: inline-block;
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background: #fff0f6;
  color: #eb2f96;
  border-radius: 50%;
  margin-right: 6px;
  font-weight: bold;
}

button {
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  font-size: 14px;
}

button:hover {
  border-color: #eb2f96;
  color: #eb2f96;
}

input {
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;
  margin-bottom: 8px;
}

.hint {
  color: #999;
  font-size: 13px;
}

.done {
  color: #52c41a;
  font-weight: bold;
}

.active-item {
  color: #1890ff;
}
</style>
