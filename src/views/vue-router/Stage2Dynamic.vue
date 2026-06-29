<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()

// 演示数据
const products = ref([
  { id: 1, name: 'Vue 3 实战', price: 79, category: '前端' },
  { id: 2, name: 'TypeScript 精讲', price: 89, category: '语言' },
  { id: 3, name: 'Node.js 后端', price: 99, category: '后端' },
  { id: 4, name: '算法与数据结构', price: 69, category: '计算机' },
])

// ===== params 演示 =====
const customId = ref('1')

function goToProduct(id: number) {
  router.push({ name: 'vue-router-stage2-product', params: { id: String(id) } })
}

function goWithCustomId() {
  router.push({ name: 'vue-router-stage2-product', params: { id: customId.value } })
}

// ===== query 演示 =====
const searchKeyword = ref('')
const searchCategory = ref('')

function pushWithQuery() {
  const query: Record<string, string> = {}
  if (searchKeyword.value) query.keyword = searchKeyword.value
  if (searchCategory.value) query.category = searchCategory.value
  router.push({ path: '/vue-router/stage2', query })
}

// ===== 侦听路由变化 =====
const routeChangeLog = ref<string[]>([])

watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    routeChangeLog.value.unshift(
      `${new Date().toLocaleTimeString()}  ${oldPath} → ${newPath}`
    )
    if (routeChangeLog.value.length > 10) {
      routeChangeLog.value.pop()
    }
  }
)

// ===== 对比 params vs query =====
const compareColumns = [
  { title: '特性', dataIndex: 'feature', key: 'feature', width: 120 },
  { title: 'Params', dataIndex: 'params', key: 'params' },
  { title: 'Query', dataIndex: 'query', key: 'query' },
]
const compareData = [
  {
    feature: 'URL 形式',
    params: '/user/:id → /user/123',
    query: '/user?name=张三&age=20',
  },
  {
    feature: '必填性',
    params: '路由定义时占位，通常必填',
    query: '完全可选',
  },
  {
    feature: '访问方式',
    params: 'route.params.id',
    query: 'route.query.name',
  },
  {
    feature: '传参方式',
    params: '{ name: "xxx", params: { id } }',
    query: '{ path: "xxx", query: { name } }',
  },
  {
    feature: '命名路由',
    params: '命名路由必须给全 params',
    query: '可选择性添加',
  },
]
</script>

<template>
  <div class="stage-page">
    <header class="page-header">
      <h1>Stage 2：动态路由与参数</h1>
      <p>掌握路径参数 params、查询参数 query、props 传参和路由变化侦听。</p>
    </header>

    <!-- 2.1 路径参数 params -->
    <section class="card">
      <h2>2.1 路径参数：params</h2>
      <p>
        在路由路径中使用 <code>:paramName</code> 定义动态段，通过
        <code>route.params</code> 访问。
      </p>

      <div class="demo-box">
        <h4>产品列表（点击查看详情，带 params）：</h4>
        <a-list :data-source="products" size="small">
          <template #renderItem="{ item }">
            <a-list-item>
              <span>
                <strong>{{ item.name }}</strong>
                &nbsp; ¥{{ item.price }}
                <a-tag size="small">{{ item.category }}</a-tag>
              </span>
              <a-button size="small" type="link" @click="goToProduct(item.id)">
                查看详情 →
              </a-button>
            </a-list-item>
          </template>
        </a-list>

        <div style="margin-top: 12px; display: flex; gap: 8px; align-items: center">
          <span style="font-size: 13px; color: #999">自定义 ID 跳转：</span>
          <a-input-number
            v-model:value="customId"
            :min="1"
            :max="4"
            style="width: 100px"
          />
          <a-button size="small" @click="goWithCustomId">跳转</a-button>
        </div>
      </div>

      <pre class="code-block">
// 路由配置
{ path: '/product/:id', name: 'product', component: ProductDetail }

// 跳转
router.push({ name: 'product', params: { id: '123' } })

// 组件内获取
const route = useRoute()
console.log(route.params.id)  // '123'</pre>
    </section>

    <!-- 2.2 查询参数 query -->
    <section class="card">
      <h2>2.2 查询参数：query</h2>
      <p>
        <code>query</code> 是 URL <code>?</code> 后的键值对，完全可选，适合搜索筛选场景。
      </p>

      <div class="demo-box">
        <h4>搜索筛选（query 传参）：</h4>
        <a-space>
          <a-input
            v-model:value="searchKeyword"
            placeholder="关键词"
            style="width: 160px"
          />
          <a-select
            v-model:value="searchCategory"
            placeholder="分类"
            style="width: 120px"
            allow-clear
          >
            <a-select-option value="前端">前端</a-select-option>
            <a-select-option value="后端">后端</a-select-option>
            <a-select-option value="语言">语言</a-select-option>
            <a-select-option value="计算机">计算机</a-select-option>
          </a-select>
          <a-button type="primary" size="small" @click="pushWithQuery">
            搜索（query 跳转）
          </a-button>
        </a-space>
      </div>

      <pre class="code-block" style="margin-top: 12px">
// 跳转时带 query
router.push({
  path: '/search',
  query: { keyword: 'Vue', category: '前端' }
})
// 结果 URL：/search?keyword=Vue&category=前端

// 组件内获取
console.log(route.query.keyword)   // 'Vue'
console.log(route.query.category)  // '前端'</pre>
    </section>

    <!-- 2.3 对比表格 -->
    <section class="card">
      <h2>2.3 params vs query 对比</h2>
      <a-table
        :columns="compareColumns"
        :data-source="compareData"
        :pagination="false"
        size="small"
      />
      <div class="tip-box" style="margin-top: 12px">
        <strong>参数变化时组件不重新创建：</strong>
        从 <code>/product/1</code> 到 <code>/product/2</code>，同一个组件会复用。
        需要用 <code>watch(route.params)</code> 或
        <code>onBeforeRouteUpdate</code> 来响应变化。
      </div>
    </section>

    <!-- 2.4 侦听路由变化 -->
    <section class="card">
      <h2>2.4 侦听路由变化</h2>
      <pre class="code-block">
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 方式 1：watch 整个 route 对象
watch(() => route.params.id, (newId) => {
  fetchData(newId)
})

// 方式 2：组件内守卫（Stage 4 详解）
import { onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteUpdate((to) => {
  fetchData(to.params.id)
})</pre>

      <div class="log-panel">
        <h4>当前 query：<code>{{ JSON.stringify(route.query) || '(无)' }}</code></h4>
        <div class="log-list">
          <div
            v-for="(log, i) in routeChangeLog"
            :key="i"
            class="log-line"
          >
            {{ log }}
          </div>
          <div v-if="routeChangeLog.length === 0" style="color: #ccc">暂无路由变化记录</div>
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

.tip-box {
  background: #fffbe6;
  border-left: 3px solid #faad14;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 13px;
  color: #595959;
}

.log-panel {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 12px 16px;
}

.log-panel h4 {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 500;
}

.log-list {
  max-height: 180px;
  overflow-y: auto;
}

.log-line {
  font-size: 12px;
  color: #888;
  padding: 3px 0;
  border-bottom: 1px solid #e8e8e8;
  font-family: 'Courier New', monospace;
}
</style>
