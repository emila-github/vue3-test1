<script setup lang="ts">
import { ref, computed } from 'vue'

// ====== 基本计算属性 ======
const firstName = ref('张')
const lastName = ref('三')
const fullName = computed(() => firstName.value + ' ' + lastName.value)

// ====== 可写计算属性 ======
const first = ref('张')
const last = ref('三')
const writableFullName = computed({
  get() {
    return first.value + ' ' + last.value
  },
  set(newValue: string) {
    const parts = newValue.split(' ')
    first.value = parts[0] || ''
    last.value = parts[1] || ''
  },
})

// ====== 计算属性 vs 方法 ======
const counter = ref(0)
let computedCallCount = 0
let methodCallCount = 0

const computedMsg = computed(() => {
  computedCallCount++
  return `当前计数：${counter.value}`
})

function getMsg() {
  methodCallCount++
  return `当前计数：${counter.value}`
}

// ====== 搜索过滤 ======
const keyword = ref('')
const list = ref(['Apple', 'Banana', 'Orange', 'Grape', 'Watermelon'])
const filteredList = computed(() =>
  list.value.filter((item) => item.toLowerCase().includes(keyword.value.toLowerCase())),
)

// ====== 购物车 ======
const cart = ref([
  { name: '商品A', price: 100, count: 2 },
  { name: '商品B', price: 200, count: 1 },
])
const totalPrice = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.count, 0),
)

// ====== 表单验证 ======
const password = ref('')
const isPasswordValid = computed(
  () => password.value.length >= 6 && password.value.length <= 20,
)
</script>

<template>
  <div class="demo-page">
    <h1>计算属性</h1>

    <!-- 基本用法 -->
    <section class="demo-section">
      <h2>1. 基本计算属性</h2>
      <p>姓：<input v-model="firstName" /></p>
      <p>名：<input v-model="lastName" /></p>
      <p>全名：<strong>{{ fullName }}</strong></p>
    </section>

    <!-- 可写计算属性 -->
    <section class="demo-section">
      <h2>2. 可写计算属性</h2>
      <p>全名：<input v-model="writableFullName" /></p>
      <p>姓：{{ first }}</p>
      <p>名：{{ last }}</p>
      <p class="hint">修改全名输入框，姓和名会自动拆分更新</p>
    </section>

    <!-- 计算属性 vs 方法 -->
    <section class="demo-section">
      <h2>3. 计算属性 vs 方法</h2>
      <p>计数：{{ counter }}</p>
      <button @click="counter++">+1</button>
      <p>computed 调用次数：{{ computedCallCount }} — {{ computedMsg }}</p>
      <p>computed 再次访问：{{ computedMsg }}</p>
      <p>方法调用次数：{{ methodCallCount }} — {{ getMsg() }}</p>
      <p>方法再次调用：{{ getMsg() }}</p>
      <p class="hint">观察：computed 只计算一次（缓存），方法每次渲染都调用</p>
    </section>

    <!-- 搜索过滤 -->
    <section class="demo-section">
      <h2>4. 搜索过滤</h2>
      <input v-model="keyword" placeholder="输入搜索关键词..." />
      <ul v-if="filteredList.length">
        <li v-for="item in filteredList" :key="item">{{ item }}</li>
      </ul>
      <p v-else class="hint">无匹配结果</p>
    </section>

    <!-- 购物车 -->
    <section class="demo-section">
      <h2>5. 购物车总价</h2>
      <ul>
        <li v-for="item in cart" :key="item.name">
          {{ item.name }} - ¥{{ item.price }} × {{ item.count }}
        </li>
      </ul>
      <p>总价：<strong>¥{{ totalPrice }}</strong></p>
    </section>

    <!-- 表单验证 -->
    <section class="demo-section">
      <h2>6. 表单验证</h2>
      <input v-model="password" type="password" placeholder="输入密码（6-20位）" />
      <p :class="isPasswordValid ? 'valid' : 'invalid'">
        {{ isPasswordValid ? '✅ 密码格式正确' : '❌ 密码长度需 6-20 位' }}
      </p>
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
  border-left: 4px solid #fa8c16;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
}

.demo-section p {
  margin: 8px 0;
}

input {
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;
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
  border-color: #fa8c16;
  color: #fa8c16;
}

.hint {
  color: #999;
  font-size: 13px;
  margin-top: 8px;
}

.valid {
  color: #52c41a;
  font-weight: bold;
}

.invalid {
  color: #ff4d4f;
  font-weight: bold;
}

ul {
  margin: 8px 0;
  padding-left: 20px;
}
</style>
