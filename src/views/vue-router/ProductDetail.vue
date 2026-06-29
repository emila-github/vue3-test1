<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const productId = computed(() => route.params.id as string)

const products: Record<string, { name: string; price: number; category: string; desc: string }> = {
  '1': { name: 'Vue 3 实战', price: 79, category: '前端', desc: '基于 Vue 3 Composition API 的实战教程，涵盖组件设计、状态管理、路由和工程化实践。' },
  '2': { name: 'TypeScript 精讲', price: 89, category: '语言', desc: '从类型系统到高级模式的完整 TypeScript 学习路径。' },
  '3': { name: 'Node.js 后端', price: 99, category: '后端', desc: 'Express/Koa 框架、数据库操作、RESTful API 设计与部署。' },
  '4': { name: '算法与数据结构', price: 69, category: '计算机', desc: '常见算法与数据结构的 JavaScript/TypeScript 实现。' },
}

const product = computed(() => products[productId.value])
</script>

<template>
  <div class="product-detail">
    <div class="breadcrumb">
      <RouterLink to="/vue-router/stage2">← 返回产品列表</RouterLink>
    </div>

    <div v-if="product" class="product-card">
      <h2>{{ product.name }}</h2>
      <a-tag :color="product.category === '前端' ? '#1677ff' : product.category === '后端' ? '#52c41a' : '#fa8c16'">
        {{ product.category }}
      </a-tag>
      <p class="price">¥{{ product.price }}</p>
      <p class="desc">{{ product.desc }}</p>

      <a-divider />

      <h4>路由参数信息</h4>
      <a-descriptions bordered size="small" :column="2">
        <a-descriptions-item label="route.params.id">{{ route.params.id }}</a-descriptions-item>
        <a-descriptions-item label="route.name">{{ route.name }}</a-descriptions-item>
        <a-descriptions-item label="route.path">{{ route.path }}</a-descriptions-item>
        <a-descriptions-item label="route.fullPath">{{ route.fullPath }}</a-descriptions-item>
      </a-descriptions>
    </div>

    <div v-else class="not-found">
      <p>❌ 产品 ID <code>{{ productId }}</code> 不存在</p>
    </div>
  </div>
</template>

<style scoped>
.product-detail {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px;
}

.breadcrumb {
  margin-bottom: 20px;
}

.breadcrumb a {
  color: #1677ff;
  text-decoration: none;
  font-size: 13px;
}

.product-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.product-card h2 {
  margin: 0 0 8px;
  font-size: 22px;
  color: #1a1a1a;
}

.price {
  font-size: 24px;
  color: #fa541c;
  margin: 12px 0;
  font-weight: 600;
}

.desc {
  font-size: 14px;
  color: #666;
  line-height: 1.7;
}

.not-found {
  text-align: center;
  padding: 40px;
  background: #fff2f0;
  border-radius: 12px;
  font-size: 14px;
}

.not-found code {
  background: #ffccc7;
  padding: 2px 6px;
  border-radius: 3px;
}
</style>
