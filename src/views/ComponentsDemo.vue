<script setup lang="ts">
import { ref, reactive } from 'vue'
import MyButton from '../components/MyButton.vue'
import UserCard from '../components/UserCard.vue'
import CounterButton from '../components/CounterButton.vue'
import Card from '../components/Card.vue'
import ListComponent from '../components/ListComponent.vue'

// Props 演示
const userName = ref('李四')
const userInfo = reactive({
  name: '王五',
  age: 30,
  isAdmin: false,
})

// Emits 演示
const counterValue = ref(0)

// 插槽演示
const productList = ref([
  { id: 1, name: '苹果', price: 10 },
  { id: 2, name: '香蕉', price: 5 },
  { id: 3, name: '橙子', price: 8 },
])
</script>

<template>
  <div class="demo-page">
    <h1>组件基础</h1>

    <!-- 1. 组件定义与注册 -->
    <section class="demo-section">
      <h2>1. 组件定义 (MyButton)</h2>
      <MyButton type="default">默认按钮</MyButton>
      <MyButton type="primary" style="margin-left: 8px">主要按钮</MyButton>
      <MyButton type="danger" style="margin-left: 8px">危险按钮</MyButton>
      <p class="hint">通过 props 控制按钮类型，使用 slot 插入内容</p>
    </section>

    <!-- 2. Props -->
    <section class="demo-section">
      <h2>2. Props 传递</h2>
      <div class="card-row">
        <UserCard name="张三" />
        <UserCard :name="userName" :age="25" :is-admin="true" />
        <UserCard v-bind="userInfo" />
      </div>
      <p class="hint">三种方式：静态 prop、动态 prop、v-bind 批量传递</p>
    </section>

    <!-- 3. Emits -->
    <section class="demo-section">
      <h2>3. Emits（事件）</h2>
      <p>父组件计数：<strong>{{ counterValue }}</strong></p>
      <CounterButton
        @update="counterValue = $event"
        @reset="counterValue = 0"
      />
    </section>

    <!-- 4. 插槽 -->
    <section class="demo-section">
      <h2>4. 插槽（Slots）</h2>
      <Card>
        <template #header>
          <h3 style="margin: 0">自定义标题</h3>
        </template>
        <p>这是通过默认插槽插入的主体内容</p>
        <template #footer>
          <button style="margin-right: 8px">确认</button>
          <button>取消</button>
        </template>
      </Card>
    </section>

    <!-- 5. 作用域插槽 -->
    <section class="demo-section">
      <h2>5. 作用域插槽</h2>
      <ListComponent :items="productList">
        <template #item="{ item, index }">
          <span class="item-index">{{ index + 1 }}.</span>
          <strong>{{ item.name }}</strong>
          <span class="item-price">¥{{ item.price }}</span>
        </template>
      </ListComponent>
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
  border-left: 4px solid #1890ff;
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

.card-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
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
  border-color: #1890ff;
  color: #1890ff;
}

.item-index {
  color: #999;
  margin-right: 8px;
}

.item-price {
  color: #ff4d4f;
  margin-left: 12px;
  font-weight: bold;
}
</style>
