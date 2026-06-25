<script setup lang="ts">
import { RouterLink } from 'vue-router'

const demos = [
  {
    path: '/vue-request/basic',
    title: '① 基础用法',
    desc: 'useRequest 核心：自动请求、手动触发、loading/error/data、生命周期回调、ready 条件请求、refreshDeps 依赖刷新',
    icon: '→',
    tags: ['入门'],
  },
  {
    path: '/vue-request/pagination',
    title: '② 分页',
    desc: 'usePagination 扩展：与 Ant Design Table 结合、搜索+分页、current/pageSize/total 自动管理',
    icon: '▦',
    tags: ['进阶'],
  },
  {
    path: '/vue-request/load-more',
    title: '③ 加载更多',
    desc: 'useLoadMore：无限滚动加载文章列表、dataList 自动合并、noMore 判断、滚动底部触发',
    icon: '↓',
    tags: ['进阶'],
  },
  {
    path: '/vue-request/advanced',
    title: '④ 高级特性',
    desc: '缓存/SWR、轮询、窗口聚焦刷新、错误重试、防抖搜索、节流、全局配置、取消请求',
    icon: '⚡',
    tags: ['高级'],
  },
]
</script>

<template>
  <div class="vr-index">
    <a-page-header title="VueRequest 示例" sub-title="v2.0.4 · 基于真实 Mock + Axios">
      <template #extra>
        <a-space>
          <a-button size="small" @click="$router.push('/')">← 返回首页</a-button>
        </a-space>
      </template>
    </a-page-header>

    <div class="demo-grid">
      <RouterLink
        v-for="demo in demos"
        :key="demo.path"
        :to="demo.path"
        class="demo-card"
      >
        <div class="card-icon">{{ demo.icon }}</div>
        <h3>{{ demo.title }}</h3>
        <p>{{ demo.desc }}</p>
        <span class="card-tag" v-for="t in demo.tags" :key="t">{{ t }}</span>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.vr-index {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px 40px;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.demo-card {
  display: block;
  padding: 24px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  text-decoration: none;
  color: #333;
  transition: all 0.2s;
  position: relative;
}

.demo-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  border-color: #1890ff;
  transform: translateY(-2px);
}

.card-icon {
  font-size: 24px;
  margin-bottom: 8px;
  color: #1890ff;
}

.demo-card h3 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.demo-card p {
  margin: 0 0 10px;
  font-size: 13px;
  color: #999;
  line-height: 1.6;
}

.card-tag {
  display: inline-block;
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 10px;
  background: #e6f7ff;
  color: #1890ff;
  margin-right: 6px;
}

@media (max-width: 640px) {
  .demo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
