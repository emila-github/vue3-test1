<script setup lang="ts">
const orders = [
  { id: '2024001', product: 'Vue 3 实战', price: 79, status: '已完成' },
  { id: '2024002', product: 'TypeScript 精讲', price: 89, status: '配送中' },
  { id: '2024003', product: 'Node.js 后端', price: 99, status: '待付款' },
]
</script>

<template>
  <div class="child-page">
    <h4>📦 我的订单</h4>
    <p>这是嵌套子路由页面：订单列表。URL：<code>/vue-router/stage3/orders</code></p>
    <a-table
      :columns="[
        { title: '订单号', dataIndex: 'id', key: 'id' },
        { title: '商品', dataIndex: 'product', key: 'product' },
        { title: '金额', dataIndex: 'price', key: 'price' },
        { title: '状态', dataIndex: 'status', key: 'status' },
      ]"
      :data-source="orders"
      :pagination="false"
      size="small"
    />
  </div>
</template>

<style scoped>
.child-page {
  padding: 4px;
}

.child-page h4 {
  margin: 0 0 8px;
  font-size: 15px;
  color: #333;
}

.child-page p {
  font-size: 13px;
  color: #666;
  margin: 0 0 12px;
}

.child-page code {
  background: #f0f0f0;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
  color: #d63384;
}
</style>
