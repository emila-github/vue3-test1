<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { shallowRef, computed } from 'vue'

const demos = [
  {
    path: '/typescript-demo',
    title: 'TypeScript 学习',
    desc: '基础类型、接口、泛型、类、枚举、工具类型、类型守卫',
    color: '#3178c6',
    icon: 'TS',
    tags: ['基础', '进阶'],
  },
  {
    path: '/template-syntax',
    title: '模板语法',
    desc: '文本插值、v-html、v-bind、表达式',
    color: '#1890ff',
    icon: '{}',
    tags: ['基础'],
  },
  {
    path: '/reactivity',
    title: '响应式基础',
    desc: 'ref()、reactive()、toRefs、shallowRef',
    color: '#52c41a',
    icon: '⟳',
    tags: ['核心'],
  },
  {
    path: '/computed',
    title: '计算属性',
    desc: 'computed、可写计算属性、搜索过滤',
    color: '#fa8c16',
    icon: '∑',
    tags: ['核心'],
  },
  {
    path: '/class-style',
    title: '类与样式绑定',
    desc: ':class 对象/数组语法、:style 绑定',
    color: '#722ed1',
    icon: '#',
    tags: ['基础'],
  },
  {
    path: '/conditional',
    title: '条件渲染',
    desc: 'v-if / v-else-if / v-else、v-show',
    color: '#13c2c2',
    icon: '?',
    tags: ['基础'],
  },
  {
    path: '/list',
    title: '列表渲染',
    desc: 'v-for、key、数组变更、过滤排序',
    color: '#eb2f96',
    icon: '≡',
    tags: ['基础'],
  },
  {
    path: '/events',
    title: '事件处理',
    desc: 'v-on、事件修饰符、按键修饰符',
    color: '#2f54eb',
    icon: '⚡',
    tags: ['基础'],
  },
  {
    path: '/form',
    title: '表单输入绑定',
    desc: 'v-model、修饰符 .lazy .number .trim',
    color: '#faad14',
    icon: '✎',
    tags: ['基础'],
  },
  {
    path: '/watchers',
    title: '侦听器',
    desc: 'watch、watchEffect、监听多个数据源',
    color: '#a0d911',
    icon: '👁',
    tags: ['核心'],
  },
  {
    path: '/template-refs',
    title: '模板引用',
    desc: 'ref DOM 元素、组件实例、defineExpose',
    color: '#f5222d',
    icon: '↗',
    tags: ['核心'],
  },
  {
    path: '/components-demo',
    title: '组件基础',
    desc: 'Props、Emits、Slots、作用域插槽',
    color: '#1890ff',
    icon: '◈',
    tags: ['核心'],
  },
  {
    path: '/lifecycle',
    title: '生命周期',
    desc: 'onMounted、onUpdated、onBeforeUnmount...',
    color: '#597ef7',
    icon: '◉',
    tags: ['核心'],
  },
  {
    path: '/deep-components',
    title: '深入组件',
    desc: '注册、Props、事件、v-model、透传、插槽、依赖注入、异步组件',
    color: '#cf1322',
    icon: '◆',
    tags: ['进阶', '核心'],
  },
  {
    path: '/logic-reuse',
    title: '逻辑复用',
    desc: '组合式函数、自定义指令、插件',
    color: '#597ef7',
    icon: '⚙',
    tags: ['进阶'],
  },
  {
    path: '/builtin-components',
    title: '内置组件',
    desc: 'Transition、TransitionGroup、KeepAlive、Teleport、Suspense',
    color: '#13c2c2',
    icon: '⊞',
    tags: ['进阶', '核心'],
  },
  {
    path: '/user-crud',
    title: '用户管理 CRUD',
    desc: 'Pinia Store、Composable、表单校验、搜索排序、批量操作、导出',
    color: '#4096ff',
    icon: '▦',
    tags: ['实战'],
  },
]

const tagFilter = shallowRef<string | null>(null)
const allTags = computed(() => {
  const set = new Set<string>()
  demos.forEach((d) => d.tags.forEach((t) => set.add(t)))
  return Array.from(set)
})

const filteredDemos = computed(() => {
  if (!tagFilter.value) return demos
  return demos.filter((d) => d.tags.includes(tagFilter.value!))
})
</script>

<template>
  <div class="home-page">
    <!-- 顶部标题区 -->
    <section class="hero">
      <h1 class="hero-title">
        <span class="hero-icon">☰</span>
        Vue 3 学习示例
      </h1>
      <p class="hero-desc">
        涵盖 Vue 3 Composition API、TypeScript、组件深入、状态管理等核心知识点
      </p>
      <div class="hero-stats">
        <span class="stat-item">
          <strong>{{ demos.length }}</strong> 个示例
        </span>
        <span class="stat-divider">·</span>
        <span class="stat-item">
          <strong>3</strong> 个难度等级
        </span>
      </div>
    </section>

    <!-- 标签筛选 -->
    <div class="filter-bar">
      <button
        :class="['filter-btn', { active: tagFilter === null }]"
        @click="tagFilter = null"
      >
        全部
      </button>
      <button
        v-for="tag in allTags"
        :key="tag"
        :class="['filter-btn', { active: tagFilter === tag }]"
        @click="tagFilter = tag"
      >
        {{ tag }}
      </button>
    </div>

    <!-- 卡片网格 -->
    <div class="demo-grid">
      <RouterLink
        v-for="demo in filteredDemos"
        :key="demo.path"
        :to="demo.path"
        class="demo-card"
        :style="{ '--card-color': demo.color }"
      >
        <div class="card-top">
          <span class="card-icon" :style="{ background: demo.color }">
            {{ demo.icon }}
          </span>
          <div class="card-tags">
            <span
              v-for="tag in demo.tags"
              :key="tag"
              class="card-tag"
              :class="`tag-${tag}`"
            >{{ tag }}</span>
          </div>
        </div>
        <h2 class="card-title">{{ demo.title }}</h2>
        <p class="card-desc">{{ demo.desc }}</p>
        <span class="card-arrow">→</span>
      </RouterLink>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredDemos.length === 0" class="empty-state">
      <p>没有匹配的示例</p>
      <button class="reset-btn" @click="tagFilter = null">重置筛选</button>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}

/* ===== Hero 区域 ===== */
.hero {
  text-align: center;
  margin-bottom: 36px;
}

.hero-title {
  font-size: 32px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.hero-icon {
  font-size: 30px;
}

.hero-desc {
  font-size: 15px;
  color: #888;
  margin: 0 0 16px;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  color: #aaa;
}

.stat-item strong {
  color: #3178c6;
  font-weight: 700;
}

.stat-divider {
  color: #ddd;
}

/* ===== 筛选栏 ===== */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 5px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 20px;
  background: #fff;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #3178c6;
  color: #3178c6;
}

.filter-btn.active {
  background: #3178c6;
  color: #fff;
  border-color: #3178c6;
}

/* ===== 卡片网格 ===== */
.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
}

.demo-card {
  display: flex;
  flex-direction: column;
  padding: 22px 24px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  text-decoration: none;
  color: #333;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.demo-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--card-color);
  opacity: 0;
  transition: opacity 0.25s;
}

.demo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border-color: var(--card-color);
}

.demo-card:hover::before {
  opacity: 1;
}

.demo-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* 卡片顶部：图标 + 标签 */
.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.card-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.tag-基础 {
  background: #e6f7ff;
  color: #1890ff;
}

.tag-核心 {
  background: #f6ffed;
  color: #52c41a;
}

.tag-进阶 {
  background: #fff7e6;
  color: #fa8c16;
}

.tag-实战 {
  background: #f9f0ff;
  color: #722ed1;
}

.card-title {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.card-desc {
  font-size: 13px;
  color: #999;
  margin: 0;
  line-height: 1.5;
  flex: 1;
}

.card-arrow {
  position: absolute;
  right: 20px;
  bottom: 20px;
  font-size: 20px;
  color: var(--card-color);
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== 空状态 ===== */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state p {
  margin: 0 0 16px;
  font-size: 15px;
}

.reset-btn {
  padding: 8px 24px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  border-color: #3178c6;
  color: #3178c6;
}

/* ===== 响应式 ===== */
@media (max-width: 640px) {
  .home-page {
    padding: 24px 16px 40px;
  }

  .hero-title {
    font-size: 24px;
  }

  .demo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
