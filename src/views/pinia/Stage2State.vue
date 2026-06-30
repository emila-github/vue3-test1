<script setup lang="ts">
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'

// ─── 定义演示用 Store ───
const useCartStore = defineStore('cart-demo', () => {
  const items = ref([
    { id: 1, name: 'Vue 3 实战', price: 59, qty: 1 },
    { id: 2, name: 'TypeScript 进阶', price: 49, qty: 2 },
    { id: 3, name: 'Pinia 权威指南', price: 39, qty: 1 },
  ])

  // getters
  const totalItems = computed(() => items.value.reduce((sum, i) => sum + i.qty, 0))
  const totalPrice = computed(() => items.value.reduce((sum, i) => sum + i.price * i.qty, 0))
  const hasItems = computed(() => items.value.length > 0)

  // actions
  function addItem(name: string, price: number) {
    items.value.push({ id: Date.now(), name, price, qty: 1 })
  }

  function removeItem(id: number) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function clearCart() {
    items.value = []
  }

  function addQty(id: number) {
    const item = items.value.find((i) => i.id === id)
    if (item) item.qty++
  }

  return { items, totalItems, totalPrice, hasItems, addItem, removeItem, clearCart, addQty }
})

const cartStore = useCartStore()
const { items, totalItems, totalPrice, hasItems } = storeToRefs(cartStore)

// 新增商品表单
const newName = ref('')
const newPrice = ref(0)

function handleAdd() {
  if (!newName.value.trim()) {
    message.warning('请输入商品名称')
    return
  }
  cartStore.addItem(newName.value.trim(), newPrice.value || 29)
  message.success(`已添加：${newName.value}`)
  newName.value = ''
  newPrice.value = 0
}

// State 演示
const demoLog = ref<string[]>([])

function demoPatch() {
  cartStore.$patch({
    items: [
      { id: 1, name: 'Vue 3 实战', price: 59, qty: 3 },
      { id: 2, name: 'TypeScript 进阶', price: 49, qty: 1 },
    ],
  })
  addDemoLog('$patch 批量替换 items')
}

function demoPatchFn() {
  cartStore.$patch((state) => {
    state.items.forEach((item) => {
      item.price = Math.round(item.price * 0.9)
    })
  })
  addDemoLog('$patch 函数式：所有商品打 9 折')
}

function demoReset() {
  cartStore.$reset()
  addDemoLog('$reset() → 恢复到初始状态')
}

function addDemoLog(msg: string) {
  demoLog.value.push(msg)
  message.info(msg)
}

// 代码块内容（避免 </pre> 被 HTML 解析）
const stateDefCode = `// Setup Store — 使用 ref/reactive
export const useStore = defineStore('my', () => {
  const count = ref(0)                    // 基本类型
  const user = ref({ name: 'Alice' })     // 对象（用 ref）
  const list = reactive<string[]>([])     // 数组（reactive 也可）
  const config = reactive({ theme: 'dark', lang: 'zh' })

  return { count, user, list, config }
})`

const getterCode = `const items = ref([...])

// 基础 getter — 依赖当前 store
const totalItems = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
const totalPrice = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))

// 跨 Store getter — 引用其他 Store
import { useUserStore } from './user'
const user = useUserStore()
const isVip = computed(() => user.role === 'admin')

// 带参数的 getter — 返回函数
function findById(id: number) {
  return computed(() => items.value.find(i => i.id === id))
}`
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 2：State 与 Getters</h1>
      <p>深入理解 state 定义、getter 计算和 state 更新策略。</p>
    </header>

    <!-- 2.1 State 定义 -->
    <section class="card">
      <h2>2.1 State 定义方式</h2>
      <p>
        在 Setup Store 中，使用 <code>ref</code> 或 <code>reactive</code> 定义 state。
        <code>ref</code> 适合基本类型和数组，<code>reactive</code> 适合对象。
      </p>
      <pre class="code-block">{{ stateDefCode }}</pre>
      <div class="tip-box">
        <strong>最佳实践：</strong>
        <ul>
          <li>所有 state 都使用 <code>ref</code> — 解构后更安全，与 <code>storeToRefs</code> 配合更好</li>
          <li><code>reactive</code> 不能整体替换，灵活性不如 <code>ref</code></li>
          <li>state 初始值决定类型推导，不需要额外写类型注解</li>
        </ul>
      </div>
    </section>

    <!-- 2.2 Getters -->
    <section class="card">
      <h2>2.2 Getters：使用 computed</h2>
      <p>
        Setup Store 中直接用 <code>computed</code> 定义 getter，既支持依赖当前 store 的 state， 也可以引用其他 store
        的数据。
      </p>
      <pre class="code-block">{{ getterCode }}</pre>
    </section>

    <!-- 2.3 购物车演示 -->
    <section class="card">
      <h2>2.3 购物车 State + Getters 演示</h2>

      <div class="demo-box">
        <h4>购物车概览：</h4>
        <div class="cart-stats">
          <div class="stat-card">
            <span class="stat-l">商品数</span>
            <span class="stat-v">{{ totalItems }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-l">总金额</span>
            <span class="stat-v">¥{{ totalPrice }}</span>
          </div>
        </div>

        <a-table
          v-if="hasItems"
          :columns="[
            { title: '商品', dataIndex: 'name', key: 'name' },
            { title: '单价', dataIndex: 'price', key: 'price', width: 100 },
            { title: '数量', dataIndex: 'qty', key: 'qty', width: 100 },
            { title: '操作', key: 'action', width: 120 },
          ]"
          :data-source="items"
          :pagination="false"
          size="small"
          style="margin-top: 8px"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'price'"> ¥{{ record.price }} </template>
            <template v-if="column.key === 'action'">
              <a-button size="small" @click="cartStore.addQty(record.id)">+1</a-button>
              <a-button size="small" danger @click="cartStore.removeItem(record.id)" style="margin-left: 4px">
                删除
              </a-button>
            </template>
          </template>
        </a-table>
        <div v-else style="color: #999; text-align: center; padding: 16px">购物车为空</div>

        <!-- 添加商品 -->
        <div style="display: flex; gap: 8px; margin-top: 12px; align-items: center">
          <a-input v-model:value="newName" placeholder="商品名称" style="width: 180px" size="small" />
          <a-input-number v-model:value="newPrice" :min="0" placeholder="价格" size="small" style="width: 100px" />
          <a-button type="primary" size="small" @click="handleAdd">添加</a-button>
        </div>
      </div>
    </section>

    <!-- 2.4 更新策略对比 -->
    <section class="card">
      <h2>2.4 State 更新策略：直接修改 vs $patch vs $reset</h2>
      <a-table
        :columns="[
          { title: '方式', dataIndex: 'method', key: 'method' },
          { title: '示例', dataIndex: 'example', key: 'example' },
          { title: '特点', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="[
          { method: '直接修改', example: 'store.count++', desc: '最简单，一次改一个字段' },
          { method: '$patch 对象', example: 'store.$patch({ a:1, b:2 })', desc: '批量修改，一次触发 DevTools' },
          { method: '$patch 函数', example: 'store.$patch(state => { ... })', desc: '支持逻辑运算，适合复杂更新' },
          { method: '$reset()', example: 'store.$reset()', desc: '重置所有 state 到初始值' },
          { method: '替换 $state', example: 'store.$state = newObj', desc: '整体替换 state（Setup Store 适用）' },
        ]"
        :pagination="false"
        size="small"
      />

      <div class="demo-box" style="margin-top: 12px">
        <h4>快速演示：</h4>
        <a-space wrap>
          <a-button @click="demoPatch">$patch 对象</a-button>
          <a-button @click="demoPatchFn">$patch 函数（打 9 折）</a-button>
          <a-button danger @click="demoReset">$reset()</a-button>
        </a-space>
      </div>
    </section>

    <!-- 操作日志 -->
    <section class="card">
      <h2>操作日志</h2>
      <div v-if="demoLog.length === 0" style="color: #999; font-size: 13px">点击上方按钮...</div>
      <div v-else>
        <div v-for="(item, i) in demoLog" :key="i" class="log-item">
          <span class="log-num">{{ i + 1 }}</span>
          <span>{{ item }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  color: #1a1a1a;
  margin: 0 0 6px;
}

.page-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card h2 {
  margin: 0 0 12px;
  font-size: 18px;
  color: #333;
}

.card p {
  font-size: 14px;
  color: #555;
  line-height: 1.7;
  margin: 0 0 12px;
}

.card p code,
.card li code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
  color: #d63384;
}

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
  margin: 12px 0;
  white-space: pre;
  tab-size: 2;
}

.demo-box {
  background: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
}

.demo-box h4 {
  margin: 0 0 10px;
  font-size: 13px;
  color: #999;
  font-weight: 400;
}

.cart-stats {
  display: flex;
  gap: 16px;
}

.stat-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-l {
  font-size: 12px;
  color: #999;
}

.stat-v {
  font-size: 24px;
  font-weight: 700;
  color: #52c41a;
}

.tip-box {
  background: #fffbe6;
  border-left: 3px solid #faad14;
  padding: 12px 16px;
  border-radius: 4px;
  margin: 12px 0;
  font-size: 13px;
  color: #595959;
}

.tip-box ul {
  margin: 6px 0 0;
  padding-left: 20px;
}

.tip-box li {
  margin-bottom: 4px;
}

.log-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
  color: #555;
}

.log-num {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e6f4ff;
  color: #1677ff;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
}
</style>
