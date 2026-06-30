<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stages = ref([
  {
    id: 1,
    title: '快速上手',
    desc: 'createRouter、路由配置、RouterLink、RouterView、useRouter/useRoute',
    path: '/vue-router/stage1',
    icon: '🚀',
    color: '#1890ff',
  },
  {
    id: 2,
    title: '动态路由与参数',
    desc: '路径参数 params、查询参数 query、props 传参、路由变化侦听',
    path: '/vue-router/stage2',
    icon: '🔗',
    color: '#52c41a',
  },
  {
    id: 3,
    title: '嵌套路由与命名视图',
    desc: 'children 子路由、嵌套 RouterView、命名视图、重定向与别名',
    path: '/vue-router/stage3',
    icon: '📂',
    color: '#722ed1',
  },
  {
    id: 4,
    title: '导航守卫',
    desc: '全局守卫、路由独享守卫、组件内守卫、登录鉴权模拟',
    path: '/vue-router/stage4',
    icon: '🛡️',
    color: '#fa541c',
  },
  {
    id: 5,
    title: '进阶特性',
    desc: '路由元信息、滚动行为、懒加载、过渡动画、动态路由',
    path: '/vue-router/stage5',
    icon: '📦',
    color: '#13c2c2',
  },
])

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="router-index">
    <header class="page-header">
      <h1>Vue Router 5.x 学习</h1>
      <p class="subtitle">基于 <code>vue-router@^5.0.4</code>，Composition API 风格，覆盖从入门到进阶的核心特性。</p>
    </header>

    <!-- 核心 API 速览 -->
    <section class="card quick-ref">
      <h2>核心 API 速览</h2>
      <div class="api-grid">
        <div class="api-item">
          <code>createRouter()</code>
          <span>创建路由实例</span>
        </div>
        <div class="api-item">
          <code>createWebHistory()</code>
          <span>HTML5 History 模式</span>
        </div>
        <div class="api-item">
          <code>createWebHashHistory()</code>
          <span>Hash 模式 (#)</span>
        </div>
        <div class="api-item">
          <code>useRouter()</code>
          <span>获取 router 实例（组合式）</span>
        </div>
        <div class="api-item">
          <code>useRoute()</code>
          <span>获取当前路由（响应式）</span>
        </div>
        <div class="api-item">
          <code>onBeforeRouteLeave()</code>
          <span>组件内离开守卫</span>
        </div>
        <div class="api-item">
          <code>onBeforeRouteUpdate()</code>
          <span>组件内更新守卫</span>
        </div>
        <div class="api-item">
          <code>router.addRoute()</code>
          <span>动态添加路由</span>
        </div>
      </div>
    </section>

    <!-- 学习阶段 -->
    <section class="stages">
      <h2>学习阶段（共 5 个）</h2>
      <div class="stage-grid">
        <div
          v-for="s in stages"
          :key="s.id"
          class="stage-card"
          :style="{ borderTopColor: s.color }"
          @click="navigateTo(s.path)"
        >
          <span class="stage-icon">{{ s.icon }}</span>
          <h3>{{ s.title }}</h3>
          <p class="stage-desc">{{ s.desc }}</p>
          <div class="stage-badge" :style="{ background: s.color }">Stage {{ s.id }}</div>
        </div>
      </div>
    </section>

    <!-- v5 关键变化 -->
    <section class="card">
      <h2>Vue Router 5.x 关键变化</h2>
      <a-table
        :columns="[
          { title: '特性', dataIndex: 'feature', key: 'feature' },
          { title: '说明', dataIndex: 'desc', key: 'desc' },
        ]"
        :data-source="[
          { feature: 'Composition API', desc: 'useRouter / useRoute 替代 this.$router / this.$route' },
          { feature: '导航守卫返回值', desc: '守卫可返回 false / 路径字符串 / 对象，替代 next() 调用' },
          { feature: 'RouterView 插槽', desc: '可通过插槽获取 Component 和 route 实现自定义过渡/KeepAlive' },
          { feature: '动态路由增强', desc: 'addRoute / removeRoute 方法更直观' },
          { feature: '类型推断', desc: '配合 unplugin-vue-router 实现类型安全路由' },
        ]"
        :pagination="false"
        size="small"
      />
    </section>
  </div>
</template>

<style scoped>
.router-index {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.subtitle {
  color: #666;
  font-size: 14px;
}

.subtitle code {
  background: #f0f0f0;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 13px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card h2 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #333;
}

/* 核心 API 速览 */
.api-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.api-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.api-item code {
  font-size: 13px;
  color: #1677ff;
  font-weight: 500;
}

.api-item span {
  font-size: 12px;
  color: #999;
}

/* 阶段卡片 */
.stages h2 {
  margin: 0 0 16px;
}

.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 16px;
}

.stage-card {
  position: relative;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-top: 3px solid;
  border-radius: 10px;
  padding: 20px 16px;
  cursor: pointer;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}

.stage-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.stage-icon {
  font-size: 28px;
}

.stage-card h3 {
  margin: 10px 0 6px;
  font-size: 15px;
  color: #333;
}

.stage-desc {
  font-size: 12px;
  color: #999;
  line-height: 1.5;
  margin: 0;
}

.stage-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

/* 响应式 */
@media (max-width: 768px) {
  .api-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stage-grid {
    grid-template-columns: 1fr;
  }
}
</style>
