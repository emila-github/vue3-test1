<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'

// ─── User Store ───
const useUserStore = defineStore('multi-user', () => {
  const name = ref('张三')
  const role = ref<'admin' | 'viewer'>('admin')
  const loggedIn = ref(true)

  function login(userName: string, userRole: 'admin' | 'viewer') {
    name.value = userName
    role.value = userRole
    loggedIn.value = true
  }

  function logout() {
    name.value = ''
    role.value = 'viewer'
    loggedIn.value = false
  }

  return { name, role, loggedIn, login, logout }
})

// ─── Order Store（引用 User Store） ───
const useOrderStore = defineStore('multi-order', () => {
  const orders = ref([
    { id: 101, product: 'Vue 3 课程', price: 299, status: 'paid' as const },
    { id: 102, product: 'TypeScript 指南', price: 199, status: 'pending' as const },
  ])
  let nextId = 103

  // ✅ 在 action 中使用其他 Store
  const userStore = useUserStore()

  const canView = computed(() => userStore.loggedIn)
  const canManage = computed(() => userStore.role === 'admin')
  const userName = computed(() => userStore.name)

  function addOrder(product: string, price: number) {
    orders.value.push({ id: nextId++, product, price, status: 'pending' })
  }

  function cancelOrder(id: number) {
    const order = orders.value.find(o => o.id === id)
    if (order) order.status = 'cancelled'
  }

  function clearOrders() {
    orders.value = []
  }

  return { orders, nextId, canView, canManage, userName, addOrder, cancelOrder, clearOrders }
})()

const userStore = useUserStore()
const orderStore = useOrderStore()
const { orders, canView, canManage, userName } = storeToRefs(orderStore)
const { name, role, loggedIn } = storeToRefs(userStore)

// 表单
const loginName = ref('管理员')
const loginRole = ref<'admin' | 'viewer'>('admin')
const productName = ref('')
const productPrice = ref(199)

function handleLogin() {
  userStore.login(loginName.value, loginRole.value)
  message.success(`已登录：${loginName.value}（${loginRole.value}）`)
}

function handleLogout() {
  userStore.logout()
  message.info('已退出登录')
}

function handleAddOrder() {
  if (!productName.value.trim()) {
    message.warning('请输入商品名称')
    return
  }
  orderStore.addOrder(productName.value.trim(), productPrice.value)
  message.success(`已添加订单：${productName.value}`)
  productName.value = ''
}

// ─── $subscribe 演示 ───
const subscribeLog = ref<string[]>([])
const subscribing = ref(true)
let unsub: (() => void) | null = null

function setupSubscribe() {
  unsub = orderStore.$subscribe((mutation, state) => {
    subscribeLog.value.push(
      `📡 store 变化 → ${mutation.events.length} 条变更，订单数：${state.orders.length}`,
    )
  })
}

setupSubscribe()

function toggleSubscribe() {
  if (unsub) {
    unsub()
    unsub = null
    subscribing.value = false
    message.info('$subscribe 已关闭')
  } else {
    setupSubscribe()
    subscribing.value = true
    message.info('$subscribe 已开启')
  }
}
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 4：多 Store 协作</h1>
      <p>Store 之间互相引用、跨 Store 共享状态、<code>$subscribe</code> 订阅变化。</p>
    </header>

    <!-- 4.1 Store 间互相引用 -->
    <section class="card">
      <h2>4.1 在 Store 中引用其他 Store</h2>
      <p>
        Pinia 的 Store 天然支持互相引用 — 直接在 action/getter 中调用 <code>useXxxStore()</code> 即可。
        注意：不要在顶层直接调用（会导致循环依赖），应在 action/getter 函数体内调用。
      </p>
      <pre class="code-block">// orderStore.ts
import { useUserStore } from './userStore'

export const useOrderStore = defineStore('order', () => {
  // ✅ 在 setup 内部调用（推荐）
  const userStore = useUserStore()

  const canEdit = computed(() => userStore.role === 'admin')

  function placeOrder() {
    if (!userStore.loggedIn) {
      throw new Error('请先登录')
    }
    // ...
  }

  return { canEdit, placeOrder }
})</pre>
      <div class="tip-box">
        <strong>注意事项：</strong>
        <ul>
          <li>setup 函数内调用 <code>useXxxStore()</code> 是安全的（Pinia 内部处理了实例共享）</li>
          <li>不要在文件顶层调用（可能引发循环依赖）</li>
          <li>如果两个 Store 互相引用，将其中一个放在 getter/action 内部惰性调用</li>
        </ul>
      </div>
    </section>

    <!-- 4.2 登录/订单演示 -->
    <section class="card">
      <h2>4.2 用户 Store + 订单 Store 演示</h2>

      <!-- 用户面板 -->
      <div class="demo-box">
        <h4>用户状态（User Store）：</h4>
        <div class="user-panel">
          <div class="user-info">
            <span v-if="loggedIn">👤 {{ name }} — {{ role === 'admin' ? '管理员' : '访客' }}</span>
            <span v-else style="color: #999">未登录</span>
          </div>
          <div v-if="loggedIn" style="margin-top: 8px">
            <a-button danger size="small" @click="handleLogout">退出登录</a-button>
          </div>
          <div v-else style="display: flex; gap: 8px; margin-top: 8px; align-items: center">
            <a-input v-model:value="loginName" placeholder="用户名" size="small" style="width: 120px" />
            <a-select v-model:value="loginRole" size="small" style="width: 90px">
              <a-select-option value="admin">管理员</a-select-option>
              <a-select-option value="viewer">访客</a-select-option>
            </a-select>
            <a-button type="primary" size="small" @click="handleLogin">登录</a-button>
          </div>
        </div>
      </div>

      <!-- 订单面板 -->
      <div class="demo-box" style="margin-top: 12px">
        <h4>订单列表（Order Store）— 权限：{{ canManage ? '🔓 可管理' : '🔒 只读' }}</h4>

        <a-table
          :columns="[
            { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
            { title: '商品', dataIndex: 'product', key: 'product' },
            { title: '价格', dataIndex: 'price', key: 'price', width: 80 },
            { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
            { title: '操作', key: 'action', width: 80 },
          ]"
          :data-source="orders"
          :pagination="false"
          size="small"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'price'"> ¥{{ record.price }} </template>
            <template v-if="column.key === 'status'">
              <a-tag :color="record.status === 'paid' ? 'green' : record.status === 'pending' ? 'orange' : 'red'">
                {{ record.status }}
              </a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <a-button
                v-if="canManage && record.status === 'pending'"
                size="small"
                danger
                @click="orderStore.cancelOrder(record.id)"
              >
                取消
              </a-button>
            </template>
          </template>
        </a-table>

        <div v-if="canManage" style="display: flex; gap: 8px; margin-top: 12px; align-items: center">
          <a-input v-model:value="productName" placeholder="商品名称" size="small" style="width: 160px" />
          <a-input-number v-model:value="productPrice" :min="1" size="small" style="width: 90px" />
          <a-button type="primary" size="small" @click="handleAddOrder">添加订单</a-button>
        </div>
      </div>
    </section>

    <!-- 4.3 $subscribe -->
    <section class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
        <h2 style="margin: 0">4.3 $subscribe 订阅 Store 变化</h2>
        <a-button size="small" :type="subscribing ? 'primary' : 'default'" @click="toggleSubscribe">
          {{ subscribing ? '订阅中' : '已关闭' }}
        </a-button>
      </div>
      <p>
        <code>$subscribe</code> 类似 Vue 的 <code>watch</code>，每当 store 的 state 发生变化时触发回调。
      </p>
      <pre class="code-block">store.$subscribe((mutation, state) => {
  // mutation.type     — 'direct' | 'patch object' | 'patch function'
  // mutation.storeId  — store ID
  // mutation.events   — 变更事件数组
  // state              — 变更后的 state
})</pre>
      <div class="subscribe-logs">
        <div v-if="subscribeLog.length === 0" style="color: #999; font-size: 13px">
          操作订单列表查看订阅日志...
        </div>
        <div v-for="(item, i) in subscribeLog" :key="i" class="log-item">
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

.user-panel {
  /* placeholder */
}

.user-info {
  font-size: 15px;
  font-weight: 500;
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

.subscribe-logs {
  margin-top: 12px;
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
